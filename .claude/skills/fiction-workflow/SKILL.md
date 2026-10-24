---
name: fiction-workflow
description: Show the recommended skill sequence for developing a story with the fiction-skills suite, and where each skill reads and writes in the story folder.
aliases: [workflow]
---

# fiction-workflow

Show the user this sequence. Look for a story folder first, wherever this host can see one, and if there is one, read it and point out the next step for this story, such as "`03_outline.md` doesn't exist yet. Run `/fiction-outline`." If `notes/` holds notes outside `notes/organized/`, say how many and suggest `/fiction-organize` first. If you can't reach any files, print the sequence on its own and ask which step they're on.

Not every story needs every step, and any step can run again as the story changes.

## Planning

Planning skills build the story. Run them roughly in this order.

**0. Set up**
- `/fiction-story-init`: create the story folder from a concept or from existing documents. Everything else needs it.
- `/fiction-organize`: work scattered notes and documents into characters, world, relationships, contract fields, and loose threads for the outline. Run it after setup, and again whenever `notes/` fills up.

**1. Structure**
- `/fiction-outline`: complete the Story Contract, pick a structure (or none), and build `03_outline.md`.
- `/fiction-touchstone`: reference sheets from your catalog for any unit or need. Run it whenever you want references.

**2. Conflict**
- `/fiction-conflict`: conflicts that come out of the structure. Run it before expanding scenes.

**3. Scenes**
- `/fiction-beats`: break an outline unit into beats in `05_scenes/`.

**4. Characters**
- `/fiction-character`, `/fiction-arc`, `/fiction-relationships`

**5. World**
- `/fiction-world`

**6. When stuck**
- `/fiction-next`: possible directions when you don't know what happens next.

**7. After drafting**
- `/fiction-reconcile`: when a draft went somewhere the outline didn't plan, update `03_outline.md` to match or log the draft for revision, then repair the units after it.

## Diagnostic

Diagnostic skills test what already exists and find where it's weak. They have no fixed order. Run one whenever there's something to test.

- `/fiction-plausibility`: whether the premise holds up. Most useful once the premise and world rules exist.
- `/fiction-gaps`: logical holes in a draft or an outline.
- `/fiction-pressure`: predictability and low stakes.
- `/fiction-scene`: diagnose a scene that isn't working.

Each skill also declares a short alias in its frontmatter, so `/conflict` and `/scene` may work alongside `/fiction-conflict` and `/fiction-scene` depending on the host. Use whichever the user typed.

Check `open-questions.md` between steps. Parked items from any skill end up there.
