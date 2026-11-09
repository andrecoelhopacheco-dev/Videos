# Workflow: Blender / 3D animation camera

1. Run the decision engine to step 6 with mode M03 and adapter `adapters/blender.md`.
2. Scene scale check: real metres? If not, state the factor; DOF values depend on it.
3. Blocking map: character and object positions in world units; line of action as two points (fill `geography` in the timeline).
4. One camera object per shot (`CAM_<shot>`), bound to timeline markers.
5. Generate the keyframe script from `timeline.json` (adapter snippet): lens, sensor, DOF, location/rotation keys, focus keys, eases. Use Track To / Follow Path for orbits and paths.
6. Render stills at each shot's START, key moment and END frame; compare with the blueprint (composition, focus subject, line side). Fix, then render the shot.
7. Report actual values used (lens, f-stop, distances) back into the timeline.
