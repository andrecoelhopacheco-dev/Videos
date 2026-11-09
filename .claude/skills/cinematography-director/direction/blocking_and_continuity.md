# Blocking, staging and spatial continuity (D10)

Blocking (where people and objects are, and how they move) comes before camera placement. Good blocking removes cuts.

## Scene geography block (write one per scene)
```
Scene: kitchen, night
Line of action: Ana <-> Ben across the table (camera side: south)
Screen direction: Ana screen-left looking right; Ben screen-right looking left
Fixed objects: laptop on the table, Ana's side; door screen-right behind Ben
Movement paths: Ben exits through the door (left-to-right)
Light: practical lamp above the table (warm, hard), window cool from screen-left
```
`scripts/cdcheck.py` reads the `geography` field of each scene and flags shots that put the camera on the far side of the line without a declared cross.

## Techniques

### Actor / subject blocking
What: positions and movements of people over the scene. Effect: relationships become visible (near = close, apart = conflict, higher = dominant).
Use when: always plan blocking before shots. Avoid when: blocking only for convenience of the camera. Source: craft convention.

### Camera blocking
What: camera positions and moves planned against the blocking. Effect: coverage that tells the story.
Use when: decide which beats are one-shot (staged in depth) and which need cuts. Avoid when: coverage of everything from everywhere "to be safe" with no plan. Source: craft convention; S09 (sets built for the camera plan).

### 180-degree rule
What: keep the camera on one side of the line of action so screen direction stays consistent (S17). Effect: the viewer keeps orientation; eyelines match.
Use when: dialogue, chases, any two-subject scene. Avoid when: crossing deliberately for disorientation; or cross visibly (a camera move across the line, a neutral shot on the line, or a subject crossing). Source: S17.

### 30-degree rule
What: between two cuts of the same subject, move the camera at least 30° around the subject or change the size clearly; otherwise the cut reads as a jump cut (S31). Effect: smooth continuity.
Use when: continuity editing. Avoid when: a jump-cut style is chosen on purpose (vlogs, energy, time passing). Source: S31.

### Screen direction
What: the left-right direction of movement and gaze. Effect: consistent direction = continuous journey; reversal = return or conflict.
Use when: keep journeys moving one way (for example left-to-right = forward). Avoid when: reversing it by accident between shots. Source: S17; craft convention.

### Eyelines
What: where a person looks; eyeline match = the next shot shows what they look at, from a matching direction. Effect: connection between shots; POV logic.
Use when: reaction and POV sequences; presenter looking at a graphic. Avoid when: eyelines point at nothing. Source: craft convention.

### Entrances and exits
What: subjects enter and leave the frame. Effect: exits close a beat; entrances start one; the direction continues across the cut.
Use when: let a subject exit frame to make an invisible cut; enter on the same side they would come from. Avoid when: an exit direction contradicts the journey (exits left, enters from the left in the next place). Source: craft convention.

### Subject-camera interaction
What: the subject relates to the camera (looks into it, walks into it, blocks it). Effect: address, confrontation, a transition (walk into the lens = black frame wipe).
Use when: presenters; a transition motivated by the subject. Avoid when: accidental glances at the lens in fiction. Source: craft convention.

### Spatial relationships and scene geography
What: the viewer's mental map of the place. Effect: confidence; without it, confusion.
Use when: establish before you fragment; re-establish after a big move. Avoid when: disorientation is the story (start close, withhold the map on purpose). Source: craft convention.

### Object placement and continuity
What: objects keep their positions, states and props across shots (cup level, open laptop). Effect: invisible editing.
Use when: always - list key objects in the geography block. Avoid when: -. AI video: describe objects identically in every prompt (`adapters/ai_video.md`). Source: craft convention.

### Depth staging
What: people at different depths in one frame. Effect: relations without cuts.
Use when: power, watching, cause and effect. Avoid when: the hierarchy becomes unclear. Source: S17.

### Light and colour continuity
What: same light direction, quality and colour temperature within a scene. Effect: one believable space.
Use when: always; a light change inside a scene needs a visible cause. Avoid when: -. Source: craft convention.

## Animation and virtual sets
Geography is exact: store positions in world units, keep a top-down map, and check the camera side of the line numerically (sign of the cross product, as `cdcheck.py` does).
