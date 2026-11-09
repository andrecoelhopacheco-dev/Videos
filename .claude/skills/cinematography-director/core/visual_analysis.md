# Visual analysis - critique existing footage, frames or films

Use when the user gives a video, frames, a contact sheet or a film scene and asks "what works / what to change".

## Get the frames
- Video file: extract a contact sheet (for example `ffmpeg -i in.mp4 -vf "fps=1,scale=320:-1,tile=6x5" contact.jpg`) and stills at the cuts (`-vf "select='gt(scene,0.3)'"`). Read them. State the sampling rate; Claude does not see motion between samples.
- A film scene the user names: discuss it only from sources in `references/` or what the user supplies. Never describe frames you have not seen.

## Read each shot (same fields as the blueprint)
Size, angle, height, lens impression (wide/normal/long - from perspective and background size, not a guessed mm), composition, focus plane, light direction and quality, palette, movement (infer from consecutive frames), duration (from cut times).

## Judge against the story
For each shot answer: what does the viewer learn or feel here? Is that the job of this beat? Then check:
1. Hierarchy: does the primary subject win attention?
2. Motivation: does each move have a reason from the gate list?
3. Continuity: screen direction, eyelines, 180°, 30°/size step, light, colour.
4. Rhythm: shot length vs information load; repeated patterns.
5. Readability: text and key details on screen long enough; nothing in UI zones (vertical).

## Report
| Shot | t | What works | Problem (TECHNICAL / CREATIVE) | Change (executable) |
Keep the user's intent. Rank fixes by impact on the story, not by number.
