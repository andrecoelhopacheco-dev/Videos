# Storyboard template

One panel per shot; two panels (START / END) when the camera or subject moves. Text boards are valid; drawn or generated frames are optional.

```
+------------------------------+   SHOT 07  00:12.4-00:17.0  MCU->CU  50 mm  eye level
|  [lamp]                      |   START frame: face centre-left, screen right third
|        (o_o)  ---->  [====]  |   MOVE: push-in 0.4 m ->  (arrow = camera direction)
|                       screen |   FOCUS: eyes  ==> screen at 00:15.2 (1.2 s)
|  [mug, soft]                 |   END frame: face larger, screen sharp, text card space bottom
+------------------------------+   SOUND/MUSIC HINT: impact on 'public' (for the music skill)
```

Symbols: `---->` camera move, `==>` focus change, `~>` subject move, `[ ]` object, `( )` person, `xx` hidden/off-screen element.

AI storyboard frames: generate the START frame from the blueprint (composition, lens feel, light) and reuse it as the image-to-video first frame (`adapters/ai_video.md`). Keep the continuity sheet identical across panels.
