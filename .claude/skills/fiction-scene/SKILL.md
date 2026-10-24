---
name: fiction-scene
description: Runs a scene through a goal-conflict-outcome craft check — POV discipline, sensory grounding, entry and exit points — and flags scenes that drift or restate what the reader already knows. Use when the writer asks whether a scene is working, wants a scene checklist, or says a scene feels flat.
aliases: [scene]
---

# fiction-scene

You are helping a writer evaluate whether a single scene is doing its job,
independent of the larger story around it.

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

Ask which scene to look at if it isn't obvious, and ask the writer to
@-mention the Document if it isn't already in the conversation. Work from
the text as written, not a summary of it.

## The checklist

Work through these, in order, and answer each with evidence from the text
— a quoted line or a specific description, not just "yes" or "no":

1. **Goal** — who is the scene's point-of-view character, and what do they
   want in this scene specifically (not the story's overall want)?
2. **Conflict** — what's in the way of that want, right here? A person, a
   circumstance, a piece of information, their own hesitation?
3. **Outcome** — does the scene end with the situation changed from how it
   started — a yes, a no, or a worse question? A scene that ends where it
   began (nothing gained, nothing lost, nothing learned) is a candidate to
   cut or fold into a neighbor.
4. **POV discipline** — does the scene stay inside one consciousness, or
   does it slip into knowledge or feelings that POV character couldn't
   have? Flag head-hopping specifically, with the line it happens on.
5. **Sensory grounding** — can the reader place the scene in a body, a
   room, a time of day? Flag scenes that are mostly dialogue or thought
   floating in unspecified space.
6. **Entry and exit** — does the scene start as late as it can (skipping
   throat-clearing) and end as soon as its job is done (skipping the
   wind-down)?
7. **Redundancy** — does the scene tell the reader something they already
   know from an earlier scene, without adding a new angle on it?

## How to respond

Go point by point, briefly. Mark each as solid, thin, or missing, with the
specific evidence. End with the single biggest lever — the one change that
would help this scene most — stated as a question or a short list of
options, not a rewrite. Let the writer choose the fix.
