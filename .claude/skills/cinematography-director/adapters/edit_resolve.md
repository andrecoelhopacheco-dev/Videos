# Adapter: editing existing footage (DaVinci Resolve, Reelwright, any NLE)

The camera is already fixed. Cinematography in the edit = choosing, cropping, timing, reframing and grading.

## Capability matrix
| Instruction | Support | How |
|---|---|---|
| punch-in / zoom (static or animated) | within headroom | transform/zoom keyframes, or Resolve Dynamic Zoom (Inspector; behaviour to verify in the current manual) |
| pan / tilt / truck in frame | within headroom | animated position on a scaled clip (Ken Burns) |
| dolly / parallax | - | not possible from a flat clip; fake only with depth-map tools, say so |
| rack focus | - | cannot add true focus; a blur mask can imitate it on simple frames |
| stabilise / add handheld | full | stabiliser; camera-shake effect at low amplitude |
| reframe 16:9 -> 9:16 | within headroom | crop 1215x2160 from UHD (1.125x headroom for 1080x1920) |
| speed ramps, freeze frames | full | retime curves |
| J/L cuts, match cuts | full | audio/video offsets |
| grade, colour script | full | colour-managed node grade (S24): balance, match, look |

## Rules
- Headroom first: compute before promising a punch-in (`camera/movement_and_zoom.md` section 3).
- Every reframe obeys composition: looking room, headroom, edges.
- Cuts follow `direction/sequencing_and_rhythm.md`; jump cuts only as a chosen style.
- For the user's Shorts pipeline, the editor is Reelwright (house rule, S29): write the edit as a list the editor can execute (in, out, transform keyframes, transition), not as tool clicks.
