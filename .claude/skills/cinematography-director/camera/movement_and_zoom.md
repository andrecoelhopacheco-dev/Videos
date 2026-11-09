# Camera movement and zoom intelligence (D04)

**A zoom changes focal length. A dolly changes camera position. They are never interchangeable.** (S16, S02, S03)
- Zoom: the camera stays; the field of view narrows or widens; perspective (size relations, parallax) does NOT change - it is a crop of the same view. It reads as *looking harder* or *looking away*.
- Dolly / push-in: the camera travels; near objects grow faster than far ones; parallax appears. It reads as *entering* or *leaving* the space.
- Dolly zoom: the camera travels while the zoom compensates, so the subject keeps its size and the background stretches or squeezes (S18, S03).

## 1. The motivation gate (run on every move)
A move must name ONE motivation. No motivation -> static.
Why: an unmotivated move makes the camera visible and reminds the viewer they are watching a film (S19). EXPRESSIVE is the only motivation that wants exactly that; use it rarely, say what the viewer should feel, and never in explainers.
| Motivation | Meaning | Typical moves |
|---|---|---|
| FOLLOW | the subject moves; we keep it | track, truck, pan, tilt, gimbal/Steadicam follow |
| REVEAL | bring hidden information into view | pan, pull-out, crane up, arc, truck past a foreground object |
| APPROACH | intimacy, realisation, emphasis | push-in (dolly), slow zoom-in (scrutiny) |
| WITHDRAW | isolation, context, an ending | pull-out, crane up, slow zoom-out |
| RELATE | connect two subjects or places | pan, whip pan, arc, rack focus (not a move but an alternative) |
| ORIENT | establish geography | crane, jib, pan across, drone |
| SUBJECTIVE | we are the character | handheld POV, walk-in |
| RHYTHM | music or performance sync | moves cut or timed to the beat (M08) |
| EXPRESSIVE | the camera is MEANT to be noticed: a character's psychology, a dream, a comment on watching | lateral tracking past a still scene, double dolly (actor rides with the camera), roll |

## 2. When static is better
Hold the camera still when: text or a diagram is on screen (house rule S29); dense information is spoken; a strong performance carries the beat; the composition itself is the statement; the previous shot moved (contrast); the scene is about stillness, control or authority. A static frame with movement inside it (a subject walking through) is often stronger than a moving camera.

## 3. Zoom-or-dolly decision tree
```
Need closer/wider framing during the shot?
├─ Is the change about ENTERING/LEAVING the space (presence, intimacy, isolation)?  -> DOLLY (push-in / pull-out)
├─ Is it about the ACT OF LOOKING (noticing, surveillance, a documentary gaze)?      -> ZOOM (slow)
├─ Is it a SHOCK or COMIC beat?                                                       -> CRASH / SNAP ZOOM (fast zoom)
├─ Must the world bend around a fixed subject (perception shift, vertigo)?            -> DOLLY ZOOM - max once per video
├─ Physical camera cannot move (crowd, wildlife, safety, run-and-gun)?               -> ZOOM, and say it is a constraint
└─ Only possible in post (existing footage)?                                          -> DIGITAL PUNCH-IN, inside headroom only
```
Virtual cameras (Blender, 2D): a dolly costs nothing - choose by meaning only. AI video: both are prompt hints with variable reliability; see `adapters/ai_video.md`.

**Digital punch-in headroom** (geometry): max scale = source pixels / delivery pixels on the cropped axis. UHD 3840x2160 -> 1920x1080: 2.0x. UHD 16:9 -> 1080x1920 vertical: the crop is 1215x2160, so only 2160/1920 = 1.125x before upscaling. Above the headroom, quality drops; say so.

## 4. Speed, ease and amount
- Write every move as: start frame -> end frame, amount (% of framing change, degrees, metres), duration, ease.
- Slow (>= 4 s for a 10% framing change): contemplation, dread, realisation. Medium (1.5-4 s): narrative. Fast (< 1 s): shock, urgency, comedy.
- Calm scenes: ease in-out (no linear starts). Urgent handheld: no ease, organic.
- The END frame is designed (composed, held 0.5 s or more before a cut) - a move does not stop "wherever".
- One move per shot is the default. Two combined moves (push + pan) only when both have motivations.

## Movement techniques

### Pan
What: the camera rotates left/right on its axis (S16 ch.8.03). Effect: scanning, connecting two points, following across.
Use when: RELATE, FOLLOW across a static place, REVEAL beside the subject. Avoid when: fast pans on detailed scenes (judder at 24/25 fps); panning across text.
Execution: physical - fluid head, pan speed limited by judder; virtual - rotate Z; AI - "camera pans left". Spatial effect: no parallax change (rotation about the lens). Source: S16, S03.

### Tilt
What: the camera rotates up/down. Effect: scale (tilt up a tower), reveal top/bottom, a look of judgement (tilt down a person).
Use when: REVEAL height; FOLLOW vertical motion. Avoid when: no vertical information. Execution: as pan, vertical. Spatial effect: perspective of verticals changes (keystone). Source: S16, S03.

### Dolly in / push-in
What: the camera travels towards the subject. Effect: approach, focus of thought, realisation, threat if slow towards a danger.
Use when: APPROACH on a beat that matters (a decision, a reveal). Avoid when: on every talking line; as filler motion.
Execution: physical - dolly/slider/gimbal walk-in; virtual - translate camera along view axis (2D: scale the camera layer, which is a zoom unless layers have parallax - state which); AI - "slow push-in toward ...". Spatial effect: parallax; background grows slower than subject. Source: S16, S03, S29.

### Dolly out / pull-out
What: the camera travels away. Effect: withdraw, isolation, context reveal, an ending.
Use when: WITHDRAW or REVEAL context (the person is one of many). Avoid when: the beat needs closeness. Execution: as dolly in, reversed. Source: S03.

### Tracking / follow
What: the camera moves with a moving subject (behind, beside or in front). Effect: momentum, shared journey.
Use when: FOLLOW where the journey matters (1917 stays with the soldiers for urgency - S09). Avoid when: following hides what is ahead with no reason (S09: limit long rear views). Execution: physical - Steadicam, gimbal, vehicle, dolly track; virtual - camera parented to a path or empty; AI - "tracking shot following ...". Source: S09.

### Trucking
What: the camera moves sideways, parallel to the subject (S16 ch.8.03). Effect: a lateral reveal; strong parallax of foreground layers.
Use when: REVEAL across a line of objects/people; side-follow. Avoid when: no foreground layers (the effect is lost). Execution: slider, dolly on track; virtual X translate; AI "camera trucks left". Source: S16, S03.

### Pedestal
What: the camera moves straight up or down without tilting (S16). Effect: rise over an obstacle; a calm vertical reveal.
Use when: REVEAL over a foreground object; matching a character standing up. Avoid when: a tilt reads the same and is simpler. Source: S16, S03.

### Crane / jib
What: the camera rises, lowers or sweeps on an arm. Effect: grand orientation, an ending, a world-scale reveal.
Use when: ORIENT, WITHDRAW at an ending, REVEAL a crowd/place. Avoid when: in intimate scenes; as decoration. Execution: physical - jib, Technocrane (S09 used one); virtual - path or keyframes with eased height; AI - "crane shot rising over ...", drone for exteriors. Source: S03, S09.

### Orbit / arc
What: the camera circles the subject (S16 "Arc moves around a subject in a circle"). Effect: heightened moment, a character "becoming", product hero, two subjects' relation turning.
Use when: a turning point; product reveal (M07). Avoid when: dialogue (it breaks the 180° line, see `direction/blocking_and_continuity.md`). Execution: physical - circular track or gimbal walk; virtual - camera parented to a rotating empty with Track To constraint; AI - "camera arcs around". Source: S16, S03.

### Handheld
What: the camera is held by the operator, organic shake. Effect: urgency, truth, subjectivity, documentary presence.
Use when: SUBJECTIVE or observational (M04, M08); chaos. Avoid when: calm, controlled, authoritative content; text on screen. Execution: virtual - add a noise modifier with small amplitude (Blender F-curve noise), never a random jitter on every axis. Source: S03; craft convention.

### Steadicam / gimbal
What: a stabilised moving camera; floating. Effect: continuous presence, dreamlike glide, long takes.
Use when: FOLLOW through spaces; long takes (S09: Steadicam running in trenches). Avoid when: you want the roughness of handheld or the authority of a tripod. Source: S09.

### Whip pan
What: a very fast pan with motion blur. Effect: energy, a jump in time/place, comic or shocking connection.
Use when: RELATE two places/people with a real spatial or idea link; a transition that hides a cut. Avoid when: no link exists (pure decoration); in calm explainers. Execution: virtual - fast rotate + motion blur on; AI - "whip pan" (S03 lists it). Source: S03.

### Camera roll
What: rotation around the lens axis. Effect: disorientation, a world turning over, weightlessness.
Use when: dream, zero gravity, a mind losing balance. Avoid when: real-world calm scenes. Source: craft convention.

### Parallax movement (2.5D)
What: layers at different depths move at different speeds while the camera moves. Effect: depth in flat material (photos, 2D animation).
Use when: 2D/archive material needs life (Vox-style photos, S29 paper parallax 0.04). Avoid when: the layer cut-outs look fake or the move hides content. Execution: 2D - layer speed proportional to 1/depth; virtual - real Z placement. Source: S29; craft convention.

## Zoom techniques

### Optical zoom
What: the zoom lens changes focal length; no quality loss. Effect: looking harder/away; no parallax.
Use when: the act of looking; constrained positions; documentary. Avoid when: you want presence (dolly). Note: zoom lenses may breathe and change max aperture (S23). Source: S16, S23.

### Digital zoom / punch-in
What: a crop and scale in camera or in post. Effect: same as optical zoom, with quality cost beyond the headroom.
Use when: editing existing footage; creating a second size from one take (talking head CU from MS) inside the headroom. Avoid when: beyond headroom; on soft footage. Source: geometry (section 3).

### Slow zoom-in
What: gradual focal length increase (for example 10-20% over 5-10 s). Effect: scrutiny, dread, a mind focusing; documentary/70s observational feel.
Use when: the viewer must study something; an interview reaches a key line. Avoid when: used as default motion. Source: craft convention.

### Slow zoom-out
What: gradual widening. Effect: context arrives; isolation; "the bigger picture".
Use when: WITHDRAW or REVEAL context without moving the camera. Avoid when: a dolly-out would add needed parallax. Source: craft convention.

### Crash zoom / snap zoom
What: a very fast zoom in (sometimes with a snap stop). Effect: shock, comedy, emphasis, genre homage.
Use when: a comic beat; a sudden noticing. Avoid when: serious explainers (reads as a gag); more than rarely. Source: craft convention.

### Dolly zoom (Vertigo effect)
What: dolly and zoom in opposite directions, subject size constant (S18). Effect: the world shifts around a fixed person - realisation, vertigo, dread.
Use when: one perceptual or psychological shift in the whole video. Avoid when: twice; on a mild beat. Execution: physical - synchronised dolly + zoom (practice); virtual - keyframe distance d and focal f so f/d stays constant; AI - "dolly zoom / vertigo effect" (S03 lists it; results vary). Source: S18, S03.

### Zoom and reframe
What: a zoom combined with a pan/tilt to keep composition balanced. Effect: an observing operator; live, unscripted feel.
Use when: documentary, events, sports, music performance. Avoid when: a controlled, designed look is needed. Source: craft convention.

### Long take (oner)
What: a scene or sequence played in one continuous shot, with actors and camera choreographed so the story moves on without a cut. Effect: immersion, real time, tension that no cut releases; the viewer's attention is directed by blocking, movement and focus instead of editing.
Use when: real time matters (urgency, a journey - 1917, S09), or a world must be introduced in one breath (Touch of Evil's opening, Goodfellas' nightclub walk, S19). Avoid when: the coverage needed for performance or pacing cannot be planned; a long take for bravura alone.
Execution: physical - rehearsal, stabilised rigs, focus marks; virtual - one continuous camera path; AI - not possible beyond clip length, fake with hidden cuts. Source: S09, S19.

### Subtle reframe
What: a slight pan or a minute push inside a shot (a few percent). Effect: a shift of emphasis the viewer feels but rarely notices (S19: a tracking shot that slowly reframes onto one child changes whose story it is).
Use when: the emphasis moves from one subject to another inside a shot. Avoid when: the change is so small it reads as drift. Source: S19.

## Common mistakes
- Calling a zoom a "dolly" in instructions (or the reverse). Name the one you mean.
- A move during on-screen text.
- A push-in on every line: the push on the real realisation then means nothing.
- Two moves fighting (zoom in + pan opposite).
- A move with an undesigned end frame.
- 2D "camera" scale presented as a dolly: it is a zoom unless the layers have parallax.
