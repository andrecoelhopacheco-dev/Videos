# Decision engine - the 8 steps in detail

Each step writes one section of the report. Do the steps in order. A later step may send you back (a validation error in step 7 goes back to step 5).

## Step 1 - Understand the content -> Brief card
Collect: script / narration / dialogue, duration, audience, platform and aspect ratio, production environment (crew? budget? locations? Blender? AI tool? existing footage only?), target adapter, house rulebook, word timings if any (`words.json`, Scorewright `facts.json`, subtitles).

```
BRIEF CARD
Intent (user's words): "..."
Audience / platform / ratio / duration:
Mode(s): M01 + M06        Target: motion_graphics_2d (+ ai_video for 2 inserts)
Constraints: ... (TECHNICAL)
House rules: <file> or none
Timing source: words.json (measured) | script estimate at 150 wpm (estimated - say so)
```
If the timing source is an estimate, label every time as estimated.

## Step 2 - Narrative structure -> Beat map
Mark: hook/introduction, context, development, key information, reveals, turns (emotional change), climax, resolution, call to action. A beat = one idea or one change. Anchor each beat on a word or an event.

| Beat | t | Anchor | Kind | Content (one line) |
|---|---|---|---|---|

## Step 3 - Emotional timeline
Per beat: dominant emotion, secondary emotion, intensity 0-5. Vocabulary: curiosity, mystery, anticipation, tension, fear, discovery, surprise, realisation, confidence, relief, warmth, awe, sadness, resolution. The peak must sit on a reveal or turn. A flat line is allowed only for a calm, steady piece (say so).

Map emotion to visual levers (defaults, override with reason):
| Change | Lever |
|---|---|
| intensity rises | closer sizes, longer lenses or nearer camera, rising contrast, slower or tighter moves, shorter shots near the peak |
| curiosity / mystery | hide part of the subject, negative space, reveal moves, low key |
| realisation | push-in or a cut to the closest size so far; hold after |
| confidence / resolution | return to eye-level, wider, stable camera, warm or brighter palette, callback of the opening frame |
| isolation | wide with negative space, long lens from far, pull-out |

## Step 4 - Visual strategy
Read `core/visual_storytelling.md` and `colour/colour_direction.md`. Write:
1. **Information ledger:** for each beat, what the viewer knows and what they must NOT know yet.
2. **See / hide list:** the hidden thing, the hide method (framing, focus, darkness, blocking, angle), the reveal time.
3. **Primary and secondary subject per beat.**
4. **Motif register:** motif, first appearance, returns, how it changes.
5. **Colour script:** base, accent, motif colour; per act.
6. **Lens and format identity:** for example "35 mm-equivalent perspective, eye level, one push-in per act".
7. **Intended response:** one sentence per act.

## Step 5 - Shot decisions -> Shot list
For each beat decide the shots. Read only the domain files that the shot needs. For each shot:
- size, angle, height, position, distance (`camera/shots_and_angles.md`)
- lens (distance first, then focal length; `camera/lens_language.md`)
- composition, start frame -> end frame (`composition/frame_design.md`)
- movement: run the **motivation gate** and the **zoom-or-dolly tree** (`camera/movement_and_zoom.md`); static is a valid answer
- focus target, focus changes, DOF (`focus/focus_and_dof.md`)
- light and colour (`lighting/...`, `colour/...`)
- continuity with the previous and next shot (`direction/blocking_and_continuity.md`)
- duration (`direction/sequencing_and_rhythm.md`)

Budgets: the mode file sets maximum shares (moving shots, shallow-DOF shots, effect transitions). Count them at the end of step 5.

Alternatives: for the 3 most important beats, record one rejected alternative and why ("rejected: dolly zoom - too strong for a quiet realisation").

## Step 6 - Temporal execution -> timeline.json
Write `templates/timeline.schema.json` format. Rules:
- shots edge to edge (t1 of one = t0 of the next), sum = duration
- every camera / focus / subject / composition event has `t0`, `t1` (or `trigger`), `ease`, and for camera moves `motivation` + `reason`
- `hold_for_text` windows when on-screen text must be read (camera holds)
- forbidden words in instructions: "cinematic", "dynamic", "epic", "slowly zoom" without numbers. Write amounts, durations and eases.

## Step 7 - Validate
Run `python scripts/cdcheck.py timeline timeline.json` and fix all errors. Then walk `workflows/final_visual_audit.md`: subject, space, screen direction, movement, focus, light, colour, objects, transitions, relevance. Explain each remaining warning.

## Step 8 - Production instructions
Read the target adapter. Convert each shot into the target's language:
- physical: shot list + lens/rig/stop + lighting setup + coverage plan
- Blender: camera object values and keyframes (Python snippet)
- 2D: camera calls with times, scale and eases
- AI video: one prompt per shot, first/last frame plan, continuity sheet, positive phrasing
- edit: cut list, punch-ins inside headroom, J/L cuts, speed ramps
Then write the report (`templates/cinematography_report.md`) with "Decisions explained" for the key choices.
