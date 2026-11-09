#!/usr/bin/env python3
"""cdcheck - checks for the cinematography-director skill (stdlib only).

  python cdcheck.py timeline <timeline.json>   validate a shot timeline (exit 1 on errors)
  python cdcheck.py lint [skill_dir]           lint SKILL.md + knowledge files (exit 1 on errors)
  python cdcheck.py selftest                   run the built-in checks of this script
"""
import json, os, re, sys

MOTIVATIONS = {"FOLLOW", "REVEAL", "APPROACH", "WITHDRAW", "RELATE", "ORIENT", "SUBJECTIVE", "RHYTHM", "EXPRESSIVE"}
MOVES = {"static", "pan", "tilt", "push_in", "pull_out", "dolly_in", "dolly_out", "track", "truck", "pedestal",
         "crane", "jib", "orbit", "arc", "handheld", "gimbal", "steadicam", "whip_pan", "roll", "parallax",
         "zoom_in", "zoom_out", "crash_zoom", "snap_zoom", "dolly_zoom", "punch_in", "zoom_reframe"}
VAGUE = re.compile(r"\b(cinematic|epic|dynamic|cool|stunning|beautiful shot)\b", re.I)
# instructions an adapter cannot execute natively (fallback must be named in the event)
UNSUPPORTED = {
    "motion_graphics_2d": {"orbit", "arc", "crane", "jib", "dolly_zoom"},
    "edit_resolve": {"dolly_in", "dolly_out", "push_in", "pull_out", "orbit", "arc", "crane", "jib", "track",
                     "truck", "pedestal", "dolly_zoom"},
}
UNRELIABLE_AI = {"dolly_zoom", "roll", "whip_pan"}  # listed by some tools only; see adapters/ai_video.md
BUDGET = {"M01": {"moving": 0.40, "shallow": 0.30}, "M05": {"moving": 0.40, "shallow": 0.50},
          "M06": {"moving": 0.50, "shallow": 0.20}, "M02": {"moving": 0.50}, "M07": {"moving": 0.70}}


def side(line, p):
    (x1, y1, x2, y2), (x, y) = line, p
    v = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)
    return 0 if abs(v) < 1e-9 else (1 if v > 0 else -1)


def check_timeline(tl):
    err, warn = [], []
    fps = tl.get("fps", 30)
    tol = 1.0 / fps + 1e-6
    dur = tl.get("duration")
    shots = tl.get("shots", [])
    adapter = tl.get("adapter", "")
    modes = tl.get("mode", [])
    if dur is None or not shots:
        return ["timeline needs 'duration' and 'shots'"], warn
    if abs(shots[0].get("t0", -1)) > tol:
        err.append(f"{shots[0].get('id')}: first shot must start at 0")
    for a, b in zip(shots, shots[1:]):
        if abs(a["t1"] - b["t0"]) > tol:
            err.append(f"{a['id']}->{b['id']}: gap/overlap {b['t0'] - a['t1']:+.3f}s (shots must be edge to edge)")
    if abs(shots[-1]["t1"] - dur) > tol:
        err.append(f"last shot ends {shots[-1]['t1']} != duration {dur}")
    geo = {g["scene"]: g for g in tl.get("geography", [])}
    moving = shallow = dz = 0
    prev = None
    for s in shots:
        sid = s.get("id", "?")
        for k in ("id", "t0", "t1", "type"):
            if k not in s:
                err.append(f"{sid}: missing '{k}'")
        if s.get("t1", 0) <= s.get("t0", 0):
            err.append(f"{sid}: t1 must be > t0")
        holds = [s["hold_for_text"]] if s.get("hold_for_text") and not isinstance(s["hold_for_text"][0], list) \
            else (s.get("hold_for_text") or [])
        cam = s.get("camera", [])
        if any(e.get("move", "static") != "static" for e in cam):
            moving += 1
        for e in cam:
            mv = e.get("move", "static")
            tag = f"{sid} camera {mv}"
            if mv not in MOVES:
                err.append(f"{tag}: unknown move (use one of the documented names)")
            if mv == "static":
                continue
            if e.get("motivation") not in MOTIVATIONS:
                err.append(f"{tag}: motivation must be one of {sorted(MOTIVATIONS)}")
            if not e.get("reason"):
                err.append(f"{tag}: missing 'reason'")
            if "t0" not in e or "t1" not in e:
                if "trigger" not in e:
                    err.append(f"{tag}: needs t0/t1 or a trigger")
            else:
                if e["t0"] < s["t0"] - tol or e["t1"] > s["t1"] + tol:
                    err.append(f"{tag}: event outside the shot")
                for h in holds:
                    if e["t0"] < h[1] - tol and e["t1"] > h[0] + tol:
                        err.append(f"{tag}: camera moves during hold_for_text {h} (camera must hold while text is read)")
            if not e.get("ease"):
                warn.append(f"{tag}: no ease given")
            if e.get("motivation") == "EXPRESSIVE":
                warn.append(f"{tag}: EXPRESSIVE = a deliberately visible camera; confirm the viewer should notice it")
                if "M06" in modes:
                    err.append(f"{tag}: EXPRESSIVE moves are not allowed in educational mode M06")
            if mv == "dolly_zoom":
                dz += 1
            if adapter in UNSUPPORTED and mv in UNSUPPORTED[adapter] and not e.get("fallback"):
                err.append(f"{tag}: not executable in adapter '{adapter}' - name a 'fallback'")
            if adapter == "motion_graphics_2d" and mv in ("push_in", "dolly_in", "pull_out", "dolly_out") and not e.get("parallax"):
                warn.append(f"{tag}: 2D scale without parallax layers is a ZOOM - call it zoom_in/zoom_out or set parallax:true")
            if adapter == "ai_video" and mv in UNRELIABLE_AI and not e.get("fallback"):
                warn.append(f"{tag}: unreliable in AI video - name a 'fallback'")
            if VAGUE.search(e.get("reason", "")):
                err.append(f"{tag}: vague word in reason ('{VAGUE.search(e['reason']).group(0)}') - write the purpose")
        for f in s.get("focus", []):
            tag = f"{sid} focus"
            for k in ("from", "to", "reason"):
                if not f.get(k):
                    err.append(f"{tag}: missing '{k}'")
            if "t0" not in f and "trigger" not in f:
                err.append(f"{tag}: needs t0/t1 or a trigger")
            if adapter == "ai_video" and not f.get("fallback"):
                warn.append(f"{tag}: rack focus is a hint in AI video - name a 'fallback' (two shots or comp blur)")
            if adapter == "edit_resolve" and not f.get("fallback"):
                err.append(f"{tag}: focus cannot be changed in the edit - name a 'fallback'")
        if s.get("dof") == "shallow":
            shallow += 1
        g = geo.get(s.get("scene"))
        if g and s.get("camera_xy") and not s.get("cross"):
            if side(g["line"], s["camera_xy"]) not in (0, g["camera_side"]):
                err.append(f"{sid}: camera crosses the line of action in scene '{s['scene']}' (set cross:true if intended and shown)")
        if prev and prev.get("subject") and prev.get("subject") == s.get("subject") \
                and prev.get("type") == s.get("type") and prev.get("angle") == s.get("angle"):
            warn.append(f"{prev['id']}->{sid}: same subject, size and angle - jump cut unless intended (30-degree rule)")
        prev = s
    if dz > 1:
        warn.append(f"{dz} dolly zooms - use at most one per video")
    n = len(shots)
    for m in modes:
        b = BUDGET.get(m, {})
        if "moving" in b and moving / n > b["moving"] + 1e-9:
            warn.append(f"{m}: {moving}/{n} moving shots exceeds budget {int(b['moving'] * 100)}%")
        if "shallow" in b and shallow / n > b["shallow"] + 1e-9:
            warn.append(f"{m}: {shallow}/{n} shallow-DOF shots exceeds budget {int(b['shallow'] * 100)}%")
    for b in tl.get("beats", []):
        if not (0 <= b.get("t", -1) <= dur):
            err.append(f"beat '{b.get('label')}' time outside the video")
    return err, warn


ENTRY_FIELDS = ("What:", "Effect:", "Use when:", "Avoid when:", "Source:")
TECH_DIRS = ("camera", "focus", "composition", "lighting", "colour", "direction")


def lint(root):
    err = []
    sk = os.path.join(root, "SKILL.md")
    text = open(sk, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        err.append("SKILL.md: missing frontmatter")
    else:
        fm = m.group(1)
        name = re.search(r"^name:\s*(.+)$", fm, re.M)
        desc = re.search(r"^description:\s*(.+)$", fm, re.M)
        if not name or name.group(1).strip() != os.path.basename(os.path.abspath(root)):
            err.append("SKILL.md: name must equal the folder name")
        if not desc or len(desc.group(1)) > 1536:
            err.append("SKILL.md: description missing or longer than 1536 chars")
    if text.count("\n") >= 500:
        err.append("SKILL.md: 500 lines or more")
    for md in [sk] + [os.path.join(dp, f) for dp, _, fs in os.walk(root) for f in fs if f.endswith(".md")]:
        body = open(md, encoding="utf-8").read()
        base = os.path.dirname(md)
        for ref in set(re.findall(r"`((?:core|camera|focus|composition|lighting|colour|direction|modes|adapters|workflows|templates|references|scripts)/[\w./-]+?\.(?:md|json|py))`", body)):
            if not os.path.exists(os.path.join(root, ref)):
                err.append(f"{os.path.relpath(md, root)}: link to missing file {ref}")
        rel = os.path.relpath(md, root).replace("\\", "/")
        if rel.split("/")[0] in TECH_DIRS:
            for entry in re.split(r"\n### ", body)[1:]:
                title = entry.splitlines()[0]
                missing = [f for f in ENTRY_FIELDS if f not in entry]
                if missing:
                    err.append(f"{rel}: '{title}' missing {missing}")
    return err


def selftest():
    good = {"duration": 6.0, "fps": 30, "mode": [], "adapter": "blender",
            "geography": [{"scene": "k", "line": [0, 0, 1, 0], "camera_side": -1}],
            "beats": [{"t": 3.0, "label": "reveal"}],
            "shots": [{"id": "S1", "t0": 0, "t1": 3, "type": "WS", "scene": "k", "camera_xy": [0.5, -2],
                       "camera": [{"move": "static"}]},
                      {"id": "S2", "t0": 3, "t1": 6, "type": "CU", "scene": "k", "camera_xy": [0.2, -1],
                       "hold_for_text": [5.0, 6.0],
                       "camera": [{"t0": 3, "t1": 5, "move": "push_in", "motivation": "APPROACH",
                                   "reason": "close in as she realises", "ease": "inOutSine"}],
                       "focus": [{"t0": 3, "t1": 4, "from": "eyes", "to": "screen", "reason": "proof on screen"}]}]}
    e, w = check_timeline(good)
    assert e == [] and w == [], (e, w)
    bad = json.loads(json.dumps(good))
    bad["shots"][1]["t0"] = 3.5                                   # gap
    bad["shots"][1]["camera"][0].update(motivation="COOL", reason="cinematic", t1=5.5)  # bad motivation, vague, into hold
    bad["shots"][1]["camera_xy"] = [0.2, 1]                        # crosses the line
    e, _ = check_timeline(bad)
    joined = " | ".join(e)
    for needle in ("gap/overlap", "motivation must be", "vague word", "hold_for_text", "crosses the line"):
        assert needle in joined, (needle, e)
    twod = json.loads(json.dumps(good)); twod["adapter"] = "motion_graphics_2d"
    _, w = check_timeline(twod)
    assert any("is a ZOOM" in x for x in w), w
    ed = json.loads(json.dumps(good)); ed["adapter"] = "edit_resolve"
    e, _ = check_timeline(ed)
    assert any("not executable" in x for x in e) and any("focus cannot" in x for x in e), e
    ex = json.loads(json.dumps(good)); ex["mode"] = ["M06"]; ex["shots"][1]["camera"][0]["motivation"] = "EXPRESSIVE"
    e, w = check_timeline(ex)
    assert any("not allowed in educational" in x for x in e) and any("deliberately visible" in x for x in w), (e, w)
    print("selftest ok")


def main(argv):
    if len(argv) < 2 or argv[1] not in ("timeline", "lint", "selftest"):
        print(__doc__); return 2
    if argv[1] == "selftest":
        selftest(); return 0
    if argv[1] == "lint":
        root = argv[2] if len(argv) > 2 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        e = lint(root)
        for x in e: print("ERROR", x)
        print(f"lint: {len(e)} errors"); return 1 if e else 0
    tl = json.load(open(argv[2], encoding="utf-8"))
    e, w = check_timeline(tl)
    for x in e: print("ERROR", x)
    for x in w: print("WARN ", x)
    print(f"timeline: {len(e)} errors, {len(w)} warnings"); return 1 if e else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
