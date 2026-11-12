# Focus and depth of field (D05)

## What sets depth of field
DOF gets shallower with: a lower f-number (wider aperture) (S02), a closer focus distance, a tighter framing of the subject (longer lens at the same distance), and a larger format at the same framing and stop (S09). Write all four when DOF matters; "shallow DOF" alone is not executable.

## The focus track (temporal focus direction)
Every focus change is written as an event:
```
focus: { t0: 00:03.0, t1: 00:05.0, from: "Ana's eyes", to: "laptop screen",
         ease: inOut, attention: "the proof is on the screen", reason: "REVEAL inside the shot" }
```
Example (from the brief):
| Time | Focus | Reason |
|---|---|---|
| 00:00-00:03 | subject's face (eyes) | we read her doubt |
| 00:03-00:05 | rack to the computer screen | she looks; the screen holds the answer |
| 00:05-00:07 | rack back to her eyes | her realisation is the beat |
Duration of a rack: 1-2 s narrative; 0.2-0.4 s shock; 3 s+ dreamy or reluctant. The focus change follows a motivation (an eyeline, a sound, a movement) - the viewer's attention moves for a reason.

## DOF budget
Each mode sets the maximum share of shallow-DOF shots (M06 explainers: low; M05/M07: higher). Count them in step 5.

## Techniques

### Deep focus
What: near and far are both sharp. Effect: the relation between subject and environment is the information; the viewer chooses where to look.
Use when: geography, ensembles, process shots, explainers, screens that must be read. Avoid when: the background is irrelevant or messy and steals attention. Source: craft convention.

### Shallow focus
What: a thin sharp plane; the rest blurs. Effect: isolation, intimacy, a subject separated from the world.
Use when: an emotional CU; a product detail; a busy background without meaning. Avoid when: every shot (no contrast left); explainer diagrams and screens; when the environment carries the story. Source: S02; craft convention.

### Selective focus
What: a deliberate choice of which plane is sharp in a layered frame. Effect: steers attention without a cut.
Use when: depth staging with two meaningful layers. Avoid when: the blurred layer contains information the viewer needs now. Source: craft convention.

### Rack focus / focus pull
What: the sharp plane moves from one subject to another inside a shot (S16: "a change in the focus of the camera"). Effect: moves attention; links cause and effect, speaker and listener, person and object.
Use when: two planes are both meaningful and attention must move inside one shot (RELATE without a cut). Avoid when: decorative; with a strongly breathing lens on a close subject (S23); in AI video when precision matters (fallback: two shots or comp blur). Execution: physical - focus puller marks; virtual - keyframe focus distance or swap Focus Object (S02); AI - "rack focus from X to Y" (S03, unreliable). Source: S16, S03, S02.

### Foreground focus / background focus
What: the sharp plane sits on a near object while the subject is soft, or the reverse. Effect: foreground focus - something stands between us and the subject (barrier, clue, threat); background focus - we look past a blur into the world.
Use when: a clue sits in the foreground; voyeurism through blur. Avoid when: the viewer does not know why the soft subject is soft. Source: craft convention.

### Subject isolation and bokeh
What: separation by a soft background; bokeh = the shape and quality of the blur (S02: blades, rotation, ratio). Effect: premium, intimate, dreamlike.
Use when: portraits, product, night lights as texture. Avoid when: "bokeh for beauty" in informational shots. Source: S02.

### Focus transitions between shots
What: a cut from soft to sharp, or a defocus-out / focus-in as a transition. Effect: memory, waking up, a change of state.
Use when: a time jump, a mental state change. Avoid when: as a routine transition. Source: craft convention.

### Depth staging
What: placing people/objects at different distances so a single frame holds a relation (with deep focus or a rack). Effect: fewer cuts, more meaning per frame.
Use when: a power relation, a watcher and a watched, cause and effect. Avoid when: the layers clutter the hierarchy. Source: S17 (layering); craft convention.

### Focus continuity
What: the same subject keeps the sharp plane across cuts. Effect: the viewer's attention stays stable.
Use when: always, unless the change is the point. Avoid when: -. Mistake: a cut lands on a different focus subject than the eyeline suggests. Source: craft convention.

## Adapter notes
- Physical: the stop is set for DOF; light to the stop. Mark focus distances; rehearse racks.
- Blender: Depth of Field on; Focus Object (empty you can animate) or Focus Distance; F-Stop for amount; Blades >= 3 for shaped bokeh; Ratio for anamorphic oval (S02).
- 2D: blur layers by depth; animate blur radius as the "rack".
- AI: write only one focus behaviour per clip; describe the start state precisely; expect variation.
