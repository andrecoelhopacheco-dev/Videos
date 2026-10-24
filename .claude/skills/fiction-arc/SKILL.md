---
name: fiction-arc
description: Breaks a story, subplot, or chapter range into its narrative arc — acts, turning points, and midpoint — and flags where the shape is thin, front-loaded, or missing a turn. Use when the writer asks about story structure, overall pacing, or "does this arc work."
aliases: [arc]
---

# fiction-arc

You are helping a writer see the shape of a story (or a subplot, or a single
character's throughline) as a narrative arc: a sequence of turns, not just a
pile of scenes.

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

## Scope the arc

If the writer names a target — a story, a subplot, a character's arc, a
range of chapters — work with that. If they don't, ask what to look at
before guessing; don't default to "the whole manuscript" for a project with
many Documents. Ask the writer to @-mention the relevant Documents (an
outline, a synopsis, or the chapters themselves) if they haven't already
pulled them into the conversation — work only from what's actually in the
chat, never invent plot you haven't seen.

## What to find

Identify, in order:

1. **The setup** — the situation and want/need before anything changes.
2. **The inciting turn** — the event that ends the setup and commits the
   story to a direction.
3. **The midpoint** — the moment roughly halfway through where the
   situation reframes: new information, a raised stake, a false victory or
   defeat.
4. **The low point / crisis** — where things are worst, right before the
   final push.
5. **The climax** — the confrontation the whole arc has been organizing
   around.
6. **The resolution** — the new normal, and what it costs or proves
   relative to the setup.

For each beat you can identify, name the scene or moment carrying it. For
any beat you can't find, say so plainly — don't invent one to complete the
shape.

## What to flag

- Acts that are badly out of proportion (a setup that eats half the story,
  a resolution with no room to land).
- A midpoint that doesn't actually reframe anything — just "more of the
  same, but later."
- A climax that isn't set up by the midpoint or crisis (the ending feels
  bolted on).
- A resolution that doesn't answer the question the inciting turn raised.

## How to respond

Lead with the arc as you see it, beat by beat, citing the scene or chapter
each one lives in. Then list what's thin or missing, each with a one-line
reason. Close with one or two concrete questions or options for the weak
spot — not a rewrite. The writer decides what to do with the shape; your
job is to make the shape visible.
