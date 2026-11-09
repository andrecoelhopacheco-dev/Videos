# Lens and optical language (D07)

## The distance-first rule
Perspective (how big near things look relative to far things, how fast the background falls away) depends on **camera-to-subject distance**, not on focal length (S22, geometry). Focal length only decides how much of that view is in frame (S02: "Focal Length controls the amount of zoom").
Procedure: 1) choose the distance for the relationship (presence = near, observation = far); 2) choose the focal length that gives the shot size at that distance; 3) check the background you get.
"Telephoto compression" is a far camera seen through a narrow crop; "wide-angle distortion" is a near camera seen through a wide crop.

## Format and equivalence
Focal lengths below are **full-frame (36x24 mm) equivalents**. Other formats: f_equivalent = f x crop factor (S38, S34; Super 35 is about 1.4-1.5x, so 35 mm on Super 35 ≈ 50 mm full-frame view). A smaller sensor at the same framing means a farther camera or a wider lens, so depth of field INCREASES (S38). Convention: below about 35 mm (full-frame) = wide, above about 70 mm = telephoto (S19). Larger formats give less depth of field at the same framing and stop (S09: Alexa Mini LF "a little less depth").
Virtual cameras: Blender focal length is relative to its sensor width (default 36 mm = full-frame-like); set sensor size to match a real camera when matching plates (S02).

## Focal length effects (at the distance the size implies)

### 18 mm (ultra-wide)
What: very wide view; when close, near objects loom. Effect: presence, immersion, space expands; faces distort when very close.
Use when: cramped interiors, action, POV immersion, a character in a big world (S10: Revenant, "very wide and close to the actors"). Avoid when: flattering portraits; architecture that must look straight (keep the camera level). Source: S10; craft convention.

### 24 mm
What: wide. Effect: environmental portrait; person and place together.
Use when: establishing with a person; vlogs and travel; walk-and-talk in space. Avoid when: tight CUs (nose grows). Source: craft convention.

### 35 mm
What: moderately wide, close to "natural" for many viewers. Effect: documentary honesty, presence without obvious distortion.
Use when: default for handheld, documentary, street, personal video; tight spaces for claustrophobia (S09: 35 mm in the 1917 tunnels). Avoid when: you need strong background separation. Source: S09.

### 50 mm
What: normal. Effect: neutral, honest, unobtrusive.
Use when: interviews, dialogue, product on a table, "no style" style. Avoid when: you need strong presence (go wider and nearer) or isolation (go longer and farther). Source: craft convention.

### 85 mm
What: short telephoto. Effect: flattering portrait, separation, intimacy at a respectful distance.
Use when: CUs and MCUs of faces, interviews' tight angle, emotional beats. Avoid when: you need the room; in very tight spaces (no distance). Source: craft convention.

### 135 mm
What: telephoto. Effect: observation from afar, stacked layers, isolation, surveillance; shallow DOF at portrait sizes.
Use when: watching someone who does not know; crowds as a mass; heat and distance. Avoid when: the viewer should feel inside the space. Source: craft convention.

## Lens types and properties

### Prime vs zoom lens
What: fixed focal length vs variable. Effect: primes - consistent perspective, often faster aperture; zooms - flexibility, observation style.
Use when: primes for designed fiction and one-lens identity (S09: 40 mm almost throughout 1917); a prime forces a deliberate choice of angle of view (S19); zooms for documentary, events, zoom moves. Avoid when: a zoom used as a lazy dolly. Source: S09, S19.

### Anamorphic
What: lenses that squeeze a wide image onto the sensor; oval bokeh, horizontal flares, 2.39:1. Effect: epic, classic cinema, dreamlike falloff.
Use when: a whole-video identity choice (M05). Avoid when: per shot; vertical delivery (the strength is width). Virtual: Blender aperture Ratio simulates oval bokeh (S02). Source: S02; craft convention.

### Aperture (f-stop)
What: the opening; lower f-number = more light and shallower DOF (S02). Effect: see `focus/focus_and_dof.md`.
Use when: set it for the DOF the story needs, then light to that stop. Avoid when: wide open by habit. Source: S02.

### Distortion
What: barrel/pincushion (lens) and perspective distortion (distance). Effect: unease, comedy, energy, or error.
Use when: deliberate (a mind under pressure, a fish-eye POV - S03 lists fisheye). Avoid when: faces and straight architecture in calm scenes. Source: S03, S22.

### Focus breathing
What: field of view changes when focus changes (S23). Effect: a rack focus also "zooms" slightly.
Use when: accept it as texture, or hide it in a move. Avoid when: precise rack focus on close subjects with a breathing lens; choose a lens with low breathing or in-camera correction. Source: S23.

### Lens character
What: contrast, flare, sharpness falloff, vignetting, bokeh shape. Effect: era and texture (vintage soft vs modern clinical).
Use when: matching a story world (Dune's custom approach to world identity - S11). Avoid when: mixing characters within a scene. Source: S11; craft convention.

### Shutter angle and frame rate (motion rendering)
What: shutter angle = exposure time per frame as a share of 360°; at 24 fps, 180° ≈ 1/48 s, the long-standing cinema norm (S37). Higher frame rates (48-120 fps) remove most motion blur (S19).
Effect: 180° = the familiar cinematic motion blur; narrow (45-90°) = crisp, staccato, urgent or newsreel-like; wide (270-360°) = smeared, soft, dreamy (S37); high frame rate = hyper-real, "video" clarity (S19).
Use when: choose per sequence for the feeling of motion - narrow for chaos and combat, wide for dreams or low light. Avoid when: changing it shot to shot inside one scene without a reason. Execution: physical - shutter angle setting; Blender - Render > Motion Blur, shutter in frames (0.5 = 180°); 2D - directional blur amount; AI - describe "crisp, stuttering motion" or "smooth motion blur" (hint only). Source: S37, S19.

## Physical vs virtual vs AI lens
| | Physical | Virtual (Blender) | AI video |
|---|---|---|---|
| Focal length | real optics | exact value, any mm | a style hint ("wide-angle lens", "telephoto") (S03) |
| Breathing / distortion / flare | real | none unless simulated (lens distortion node, flares in comp) | random, not controllable |
| DOF | real | render-time DOF from f-stop and focus (S02) | hint ("shallow depth of field") |
State which column you are writing for. Never give a physical-lens reason (breathing) to a virtual camera.

## Rules
1. One perspective family per sequence; a lens change marks a story change.
2. Wider + nearer for presence; longer + farther for observation.
3. Never pick a focal length as a label ("cinematic 85 mm"). Write the distance and the reason.
