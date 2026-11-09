# M03 Animation cinematography (Blender, 2D, 3D)

Auto-detect: "Blender", "3D", "animated", "render", ".blend", "motion graphics".
Adapter: `adapters/blender.md` (3D) or `adapters/motion_graphics_2d.md` (2D).

## Priorities
1. Virtual camera positioning with real values (mm, metres, f-stop) - a virtual camera can do anything, so the motivation gate matters more, not less.
2. Camera paths: designed start and end frames; eased keyframes; one move per shot.
3. Focal length as perspective (distance first) - avoid the "default 50 mm everywhere" look.
4. Depth of field from real focus distance and f-stop, budgeted.
5. Character blocking in world units; a top-down map; line of action checked numerically.
6. Perspective and parallax: real depth layers; 2D needs parallax layers for any "dolly".
7. Scene transitions designed in camera (match moves, wipes by objects, a push through a surface).
8. Spatial continuity across shots: same set positions, same light direction.

## Defaults
| Item | Default |
|---|---|
| Lens | 35-50 mm for staging, 85+ for CUs, 24 for sets with presence |
| Movement | motivated keyframe moves; no constant drift; static holds for reading |
| DOF | on for CUs (f/2-f/4 at real scale), off or deep for diagrams |
| Handheld | only as a stated style, via noise modifier |
| Checks | stills at key frames before the full render |

## Avoid
Camera flying through everything because it is free; orbits for no reason; unrealistic scale that breaks DOF; perfect static symmetry everywhere (lifeless).
