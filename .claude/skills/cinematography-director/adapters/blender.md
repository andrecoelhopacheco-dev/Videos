# Adapter: Blender (virtual camera)

Blender's camera has real-world controls (S02): focal length (mm or field of view), sensor size and fit, shift (vanishing points), clip range, and depth of field with Focus Object / Focus Distance, F-Stop (lower = more blur), Blades, Rotation and Ratio (anamorphic bokeh). A virtual lens has no breathing, distortion, flare or vignette unless you add them in compositing.

## Capability matrix
| Instruction | Support | How |
|---|---|---|
| any focal length / dolly / truck / pedestal / crane / orbit | full | keyframe location/rotation, or parent to an empty / path |
| zoom | full | keyframe `lens` |
| dolly zoom | full | keyframe distance d and lens f with f/d constant |
| rack focus | full | keyframe `dof.focus_distance`, or animate the Focus Object empty |
| shallow / deep DOF | full | `dof.use_dof`, `aperture_fstop` |
| handheld | simulated | Noise modifier on rotation F-curves (small strength), never on every axis at once |
| motion blur | full | Render > Motion Blur; shutter 0.5 frames = 180° (S37 for the look) |
| lens distortion / breathing / flare | simulated | compositor (Lens Distortion node, Glare) |
| orthographic | full | `type = 'ORTHO'` (diagrams, isometric explainers) |

## Rules
- Use real values from the blueprint (focal mm, f-stop, focus distance in metres at a real scene scale). If the scene scale is not real, state the factor.
- Interpolation: Bezier with ease in/out for designed moves; set the end frame hold.
- Track To constraint (camera -> target empty) for orbits and follows; Follow Path for crane/track moves.
- One camera per shot (or markers bound to cameras) keeps the edit clear.
- Check stills at the key frames before rendering the shot (`look` or render single frames).

## Snippet (fill from timeline.json)
```python
import bpy
scn = bpy.context.scene; fps = scn.render.fps
cam = bpy.data.objects.get("CAM_S07") or bpy.data.objects.new("CAM_S07", bpy.data.cameras.new("CAM_S07"))
if cam.name not in scn.collection.objects: scn.collection.objects.link(cam)
c = cam.data
c.lens = 50.0                     # mm (blueprint lens_mm)
c.sensor_width = 36.0             # full-frame-like; match the real camera when needed
c.dof.use_dof = True
c.dof.aperture_fstop = 2.8
def f(t): return round(t * fps) + scn.frame_start
# push-in 12.4 s -> 15.2 s, motivation APPROACH
cam.location = (0.0, -3.0, 1.55); cam.keyframe_insert("location", frame=f(12.4))
cam.location = (0.0, -2.6, 1.55); cam.keyframe_insert("location", frame=f(15.2))
# rack focus face -> screen 15.2 s -> 16.4 s
c.dof.focus_distance = 2.6; c.dof.keyframe_insert("focus_distance", frame=f(15.2))
c.dof.focus_distance = 1.9; c.dof.keyframe_insert("focus_distance", frame=f(16.4))
def fcurves(idblock):                       # Blender 4.4+ / 5.x: layered actions (no Action.fcurves)
    ad = idblock.animation_data
    if not ad or not ad.action: return []
    a = ad.action
    if hasattr(a, "layers") and len(a.layers):
        return [fc for L in a.layers for s in L.strips for cb in s.channelbags for fc in cb.fcurves]
    return list(getattr(a, "fcurves", []))      # older Blender
for blk in (cam, c):
    for fc in fcurves(blk):
        for k in fc.keyframe_points: k.interpolation = 'SINE'; k.easing = 'EASE_IN_OUT'
```
Tested on Blender 5.2 (2026-11-05): `Action.fcurves` does not exist there; the `fcurves()` helper reads layered actions and falls back for older versions.
