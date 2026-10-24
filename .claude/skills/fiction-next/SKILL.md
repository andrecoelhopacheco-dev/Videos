---
name: fiction-next
description: Offers several meaningfully different directions when the writer doesn't know what happens next, each with the cost of taking it. Use when the writer is stuck, asks what should happen next, or wants options past the obvious move.
aliases: [whats-next]
---

# fiction-next

The writer is stuck. Your job is to widen the field of options and price
each one, then hand the choice back. Picking for them is the one thing
this skill must not do.

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

## Find the edge they're standing on

Ask these one at a time before offering anything:

1. What just happened, and what does the viewpoint character want right
   now?
2. What would feel like a betrayal of everything built so far? This
   fences off the directions that aren't really available.
3. What's the obvious next move? Name it. Then you both know what to
   look past.

The third question matters most. A writer who is stuck usually has one
move in mind that they've already rejected without articulating why.

## Build the options

Offer three to five directions that differ in kind, not in detail. Two
variants of the same turn count as one option. For each:

- **The turn.** The concrete event, in a sentence. Not a theme or a mood.
- **What it buys.** What it does for character, for the thematic
  question, or for momentum.
- **What it costs.** What it forecloses, what it obliges the story to
  pay off later, which thread it strands.

At least one option should be uncomfortable, and at least one should be
quieter than the writer expects. A list where every direction escalates
is a list with one idea in it.

Check each against the Story Contract and say which ones bend it. A
direction that breaks a hard no is still worth naming, labelled, because
the writer may have outgrown the rule.

## How to respond

Don't rank them and don't signal a favourite. Ask which feel alive and
which feel dead, and ask why for both. The why is where the real answer
comes from, and it's often an option you didn't list.

If nothing feels alive, the problem is usually upstream of this scene.
Say so, and point at `/fiction-pressure` or `/fiction-gaps`.
