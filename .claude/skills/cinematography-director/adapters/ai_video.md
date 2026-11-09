# Adapter: AI video generation

Checked: 2026-11-05. AI tools change quickly - before a production run, open the tool's current prompt guide and update this matrix.

## Capability matrix (what the official docs list)
Legend: **L** = listed as a term in the official prompt guide; **C** = a dedicated control (slider/preset/parameter); **K** = keyframe / start-end frame support; **?** = not documented - treat as unreliable; **-** = not supported or not found.

| Instruction | Veo (S03) | Runway Gen-4/4.5 (S04, S05) | Kling (S07, S08) | Luma Ray2 (S06) |
|---|---|---|---|---|
| static camera | L | positive phrasing ("camera holds completely still") | ? | ? |
| pan / tilt | L | camera terms guide (S05, not read) | C (pan, tilt axes) | concept moves |
| dolly / push-in / pull-out | L (dolly) | as above | C (push/pull, "zoom" axis) | concept moves |
| truck / pedestal | L | as above | C (horizontal / vertical) | ? |
| zoom | L | as above | C | ? |
| crane / aerial / drone | L | as above | presets (forward_up etc.) | concept moves |
| handheld | L | as above | ? | ? |
| whip pan | L | ? | ? | ? |
| arc / orbit | L | ? | presets (turn_forward) | concept moves |
| roll | ? | ? | C (roll) | ? |
| rack focus | L (hint) | ? | ? | ? |
| dolly zoom | L ("Vertigo effect") | ? | ? | ? |
| shallow / deep DOF | L | ? | ? | ? |
| lens words (wide, telephoto, fisheye) | L ("some advanced lenses not officially supported") | ? | ? | ? |
| start + end frame | ? | image-to-video | ? | K (start/end keyframes) |
| timed events inside a clip | ? | Gen-4.5: sequential / rough timestamps (third-party, unverified) | ? | ? |
| negative phrasing ("no X") | - use a negative-prompt field, not "no/don't" | - "not supported", may give the opposite | ? | ? |
Not every model or mode supports camera control (S08). One scene per generation (S04).

## Prompt rules
1. **One shot = one generation.** One camera move, one subject action, one focus behaviour.
2. **Order:** subject + action -> scene -> camera (shot size, angle, movement) -> lens/focus -> light -> style (Runway's recommended order, S04; Veo elements, S03).
3. **Positive phrasing only.** Write what is there ("empty desk", "camera holds completely still"). Use the tool's negative-prompt field for exclusions, as nouns ("text, watermark").
4. **Numbers become words** the tool knows: "slow push-in" not "push 10% over 3 s". Keep the exact numbers in the blueprint for the editor.
5. **Continuity sheet** (paste verbatim into every prompt of a sequence): character (age, face, hair, clothes), environment, light direction + time of day, palette, lens feel.
6. **First/last frame plan:** for image-to-video, generate or design the first frame (composition from the blueprint) and, where supported, the last frame; the move must connect them.
7. **Fallbacks:** rack focus unreliable -> two clips (focus A, focus B) cut together, or blur in comp. Dolly zoom unreliable -> do it in Blender or comp. Precise timing -> generate longer, cut in the edit. Text on screen -> never generate; add in motion graphics.
8. Clip length is limited (5-10 s typical, S04); an event longer than a clip becomes several shots.

## Prompt template
```
[SUBJECT + ACTION]. [SCENE: place, time of day]. [CAMERA: shot size, angle, movement with speed word].
[LENS/FOCUS: lens feel, depth of field]. [LIGHT: source, direction, quality, colour temperature]. [STYLE: palette, texture].
Negative prompt (field): <nouns>
Continuity: <sheet id>
```
Example: "A woman in a grey hoodie reads a laptop screen at a kitchen table at night. Dim kitchen, one warm lamp above the table. Medium close-up at eye level, slow push-in toward her face. Shallow depth of field, background soft. Warm practical light from above, cool blue screen light on her face. Muted teal and amber palette, fine film grain."
