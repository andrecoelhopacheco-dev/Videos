# Lighting and atmosphere (D08)

Light shows the subject, separates it from the background, creates depth and sets mood. Every source should be motivated (a window, lamp, screen, fire, the sun) unless the style is openly theatrical.

Decide four properties for every set-up (S19): **source** (natural or artificial, and its intensity), **quality** (hard or soft - read it in the shadow edge), **direction** (where it comes from) and **colour** (temperature). Light also **forms space**: a pool of light makes one place and the darkness around it another, and what is unimportant can simply fall into shadow (S35).

## Contrast ratio (stop arithmetic)
One stop = double the light. Key:fill 1 stop apart = 2:1, 2 stops = 4:1, 3 stops = 8:1; measure key and fill separately with an incident meter (S39, S32). Craft convention for the look: about 2:1 open/high-key; about 4:1 natural drama; 8:1 and above hard drama, noir, horror. Write the ratio when the look depends on it; treat the look labels as conventions.

## Techniques

### Three-point lighting
What: key (main, about 45° from the camera), fill (about 45° on the other side, dimmer), back/hair light (behind, separates from the background) (S39, S27). Effect: a clear, modelled subject.
Use when: interviews, presenters, products; a base to break from. Avoid when: it makes a natural or dramatic scene look like a studio. Source: S27.

### Key light
What: the brightest light; sets direction and shadow shape (S27). Effect: side key = drama and texture; frontal key = openness and flatness; top key = isolation, interrogation.
Use when: always decide its direction first. Avoid when: -. Source: S27.

### Fill light
What: lifts shadows. Effect: lower contrast, friendlier.
Use when: open looks, explainers. Avoid when: the scene needs darkness; use negative fill instead. Source: S27.

### Back light / rim light
What: light from behind the subject; rim = a thin edge. Effect: separation, depth, a halo/hero edge.
Use when: dark backgrounds, silhouettes, product edges. Avoid when: unmotivated in naturalistic scenes (a rim with no source). Source: S27.

### Practical lighting
What: lights visible in frame (lamps, screens, candles). Effect: realism, motivation, warmth or loneliness.
Use when: night interiors; tech scenes lit by screens. Show "just enough, not too much" (S09). Practicals are often props that only *motivate* a stronger off-screen light (S19). Avoid when: practicals overexpose and pull attention. Source: S09, S19.

### Natural and available light
What: sun, sky, windows, fire. Effect: truth and texture; timing by weather and hour.
Use when: personal, documentary, epic realism (S10: Revenant used only natural light and firelight; S09: overcast skies for 360° moves). Avoid when: the schedule cannot follow the sun. Source: S09, S10.

### Motivated lighting
What: light that seems to come from a source in the story world. Effect: belief in the space.
Use when: default for fiction and animation. Avoid when: a stylised world openly breaks it. Source: S09, S10.

### High-key lighting
What: bright, low contrast, few shadows. Effect: openness, safety, comedy, commercial clarity.
Use when: explainers, products, upbeat content. Avoid when: mystery and tension. Source: craft convention; S32.

### Low-key lighting
What: dark tones dominate, high contrast. Effect: mystery, danger, intimacy, drama.
Use when: suspense, night, secrets. Avoid when: the viewer must read details or text. Source: craft convention; S32.

### Chiaroscuro
What: strong light-dark modelling, often one hard side key. Effect: moral conflict, painterly drama.
Use when: a character torn; portraits with gravity. Avoid when: light, friendly tones. Source: craft convention.

### Silhouette
What: the subject dark against a bright background. Effect: anonymity, mystery, iconic shape, an ending.
Use when: hiding identity (see/hide list); a graphic moment. Avoid when: the face matters. Source: craft convention.

### Volumetric light / haze
What: light shafts visible in haze, smoke or dust. Effect: atmosphere, depth, the sacred or the dangerous.
Use when: the shafts mean something (a holy place, a dusty archive, a smoky server room under stress). Avoid when: added "for cinema" to every scene. Execution: physical - haze machine; Blender - volume scatter in the world or a cube; AI - "volumetric light, haze". Source: craft convention.

### Hard and soft light
What: hardness depends on the source's apparent size as seen from the subject: small or distant = hard, crisp shadow edge; large and close, bounced or diffused = soft, gradual edge (S19, S40; geometry). Hard light can be softened, never the reverse (S40). Effect: hard = drama, heat, truth; soft = gentleness, beauty, calm; soft is the documentary-interview norm (S40).
Use when: choose by mood and by the source the story shows. Avoid when: mixing both on one face without a reason. Source: craft convention.

### Light falloff
What: light gets weaker with distance from the source (inverse-square law for a point source). Effect: a near source gives fast falloff (pools of light, dark backgrounds); a far source lights evenly.
Use when: control the background brightness by source distance. Avoid when: -. Source: physics.

### Colour temperature
What: warm (tungsten about 3200 K, candle about 2000 K, low sun) vs cool (daylight about 5600 K, shade, sky, many screens) - lower kelvin = warmer (S19). Effect: warm = home, nostalgia, safety, danger of fire; cool = night, technology, distance, clinical. Meaning is set inside the video (`colour/colour_direction.md`).
Use when: a warm-cool contrast separates two worlds or two times. Avoid when: mixed temperatures on a face with no motivation. Source: craft convention.

### Negative fill and shadow control
What: black surfaces or flags that remove light to deepen shadows. Effect: shape and drama in soft light.
Use when: overcast or bright rooms that make faces flat. Avoid when: the look must be open. Source: craft convention.

### Light as a visual image system
What: a code of light kept for the whole film - each quality of light stands for one idea and returns every time that idea does (S35: in The Natural, golden backlit sun = purity, cold blue moonlight = temptation, newspaper flashbulbs = fame, a fading flashbulb in slow motion = his power dimming). Effect: meaning builds without dialogue; the climax can pay the code off (light everywhere, non-directional, at the triumph).
Use when: a story with clear opposing forces or a character arc. Write the code in the colour script (`colour/colour_direction.md`). Avoid when: the code is inconsistent - one exception breaks the system. Source: S35.

### Half-light, silhouette and other moral lighting
What: a face half in light and half in shadow at the moment of indecision; backlight with no fill = silhouette (a situation, not one person's thoughts; anonymity, ignorance); the obvious choice is not the only one - Deschanel hid a villain's eyes with glare on his glasses instead of shadow (S35). Effect: inner conflict made visible.
Use when: a decision, a lie, a split loyalty; a hidden identity (see/hide list). Avoid when: used as a generic "moody" look on every face. Source: S35, S19 (low-key = little or no key light, deep shadows, mystery).

## Lighting as an arc
Plan contrast like the emotion timeline: low contrast at calm, rising with tension, release at resolution. Keep light direction continuous within a scene (`direction/blocking_and_continuity.md`).

## Adapter notes
- Blender: Area lights (soft), Spot/Sun (hard), world HDRI for natural light, volume scatter for haze, light linking for rims.
- 2D: gradients, glows, vignettes, light wipes; keep one light direction per scene.
- AI: describe source, direction, quality and time of day ("soft window light from the left, late afternoon, warm"); one light idea per clip.
