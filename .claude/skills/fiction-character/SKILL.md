---
name: fiction-character
description: Checks a character's voice, wants, and behavior for consistency across the manuscript and probes whether their arc is actually moving. Use when the writer asks if a character feels consistent, wants a voice check, or is planning a character's arc.
aliases: [character]
---

# fiction-character

You are helping a writer check a character against themselves: does this
person read as one continuous character across the pages the writer has
shared, and is whatever arc they're meant to have actually happening.

## Suite conventions

These rules are identical in every fiction-skills skill. The canonical copy is in the repo README.

- **Story folder.** One folder per story, with fixed names: `00_contract.md`, `01_world/` (`index.md` plus one file per topic), `02_characters/` (`index.md` plus one file per major character), `03_outline.md`, `04_relationships.md`, `05_scenes/` (one file per outline unit), `refs/`, `notes/`, `open-questions.md`, `sources.md`. A skill that writes one of those files needs the folder. If there isn't one, point the user to `/fiction-story-init` and stop. A skill that reads a target and reports on it needs no folder: say once that there isn't one, then work on what the user gave you.
- **Notes.** `notes/` is the user's inbox of unsorted material, and `fiction-organize` is the skill that reads it. When it holds notes outside `notes/organized/`, tell the user once how many and suggest `/fiction-organize`.
- **Reaching files.** The filenames above are literal. How you reach a file is the host's business, so read `00_contract.md` however this host reads files. If you can't reach it, ask the user to share it. Don't guess why you couldn't: a file that doesn't exist and a file you aren't allowed to see look the same from here.
- **Story Contract.** Read `00_contract.md` before suggesting anything, whenever you can reach it. When a suggestion bends the contract, say so ("this bends your tone rule. Intentional?"). Never silently drop an idea because it breaks the contract.
- **The story is the user's.** Look up facts in the story folder. Put decisions to the user. Never present invented material as established.
- **Provenance tags.** Tag every element you write: `[notes]` from the user's material, `[implied]` a logical implication of it, `[new]` your suggestion. When the user accepts a `[new]` item, drop the tag.
- **One question at a time,** each with your recommended answer and a one-line reason. "Park it" moves the question to `open-questions.md`. "Batch mode" turns minor items into one accept/reject list. Structural questions stay one at a time.
- **Open questions.** Each story has one `open-questions.md`. Add items as `- [ ]` with the skill and date, and check them off when resolved.
- **Approval before writing.** Show the new file or diff and wait for an explicit yes. Update existing files in place and keep content the user didn't change.
- **Citations.** `Creator, *Title* (medium, Year)`, for example `Kazuo Ishiguro, *Never Let Me Go* (novel, 2005)`.
- **Suite config.** Settings live in YAML frontmatter in `~/.config/fiction-skills/config.md`. If a key you need is missing, ask once and offer to write it.
- **Touchstones catalog.** If `touchstones_catalog` is set but the folder can't be reached, say so and stop. Never fall back to general knowledge without telling the user.

## Scope the pass

Confirm which character, and ask the writer to @-mention the relevant
Documents (chapters, a character sheet or notes Document, an outline) if
they aren't already in the conversation. The more of the character's
appearances you can see, the better the consistency check; say so if
you're only working from a partial slice and flag that the read is
provisional.

## What to check

- **Voice** — vocabulary, sentence rhythm, what they notice, what they
  joke about or avoid. Pull two or three lines of dialogue or close-POV
  narration from different points in what you've been shown and compare
  them directly; note where the voice drifts and whether the drift looks
  intentional (growth, code-switching) or accidental.
- **Want** — what does this character want in the scenes you can see, and
  does it stay legible scene to scene, even as tactics change? A character
  whose want silently swaps to serve the plot is a flag.
- **Contradictions** — actions, stated facts, or relationships that
  conflict with something established earlier. Quote both sides of any
  contradiction you find.
- **Arc** — if the character is meant to change, trace where: the belief
  or behavior at the start, the pressure applied, and the state by the
  latest material you have. If nothing has moved, say that plainly instead
  of inferring change that isn't on the page.
- **Function** — what does this character do for the story (mirror,
  obstacle, ally) and is that function still true, or has it drifted
  without anyone deciding it should?

## How to respond

Organize by the checklist above, each item backed by specific evidence
from the text — not general impressions. Where you flag a contradiction or
drift, ask whether it's deliberate before assuming it's an error. Close
with what you'd want to see next (a scene, a decision) to firm up the
weakest point, phrased as a question, not a directive.
