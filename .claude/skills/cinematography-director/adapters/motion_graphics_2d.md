# Adapter: 2D motion graphics (HTML/GSAP/HyperFrames, After Effects-style)

A 2D "camera" is a transform of a world layer: translate (= truck/pedestal), scale (= **zoom**, not dolly), rotate (= roll). There is no perspective change unless layers have depth.

## Capability matrix
| Instruction | Support | How |
|---|---|---|
| zoom in/out, punch-in | full | scale the world layer about a focus point |
| pan / tilt (as a look-around) | approximate | translate; true rotation does not exist in 2D |
| truck / pedestal | full | translate |
| dolly / push-in with parallax | simulated | multi-layer parallax: layer offset proportional to 1/depth |
| rack focus | simulated | animate blur radius on layers |
| DOF | simulated | static blur per depth layer |
| handheld | simulated | low-amplitude smoothed noise on translate/rotate |
| orbit, crane, dolly zoom | not real | fake with layered parallax, or render the shot in Blender |

## Rules
- Call a scale move a **zoom** in the blueprint. Call it a push-in only if parallax layers exist.
- Camera holds when text is on screen. Move between reading windows.
- Keep important content inside the frame at the end scale (visible width = frame width / scale).
- Ease every move; one move per scene section.

## House engine (JpAbhiNews Hybrid, S29)
If the project uses the Hybrid rulebook, write `cam(t, d, fx, fy, s, ease)` calls: at time `t`, over `d` seconds, put world point (fx, fy) at the frame centre at scale `s`. Respect its rules: scale <= 1.0-1.05 when content touches the margins; return to identity (540, 960, 1.0) for split scenes; screen-fixed HUD and paper are outside the camera. Example for a reveal push on a lock graphic at 15.2 s:
```js
cam(12.4, 2.8, 540, 900, 1.10, "sine.inOut");  // APPROACH: close the distance as the viewer realises
cam(16.4, 0.8, 540, 960, 1.00, "power2.out");  // release before the text card
```

## Generic GSAP
```js
gsap.timeline()
  .to(world, {scale: 1.10, x: 0, y: -60, duration: 2.8, ease: "sine.inOut"}, 12.4)
  .to(bgLayer, {x: "-=12", duration: 2.8, ease: "sine.inOut"}, 12.4); // parallax 0.1 of the move
```
