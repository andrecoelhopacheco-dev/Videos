---
name: fiction-organize
description: "Work through a story folder's unsorted notes, or a set of outside documents, and turn the ideas worth keeping into characters, world topics, relationships, contract fields, and loose threads for the outline. Use when the user has scattered notes to make sense of, drops new material into notes/, or invokes /fiction-organize."
aliases: [organize]
---

# fiction-organize

The user has a pile of notes. Gather the ideas in them, let the user cut what's dead, and work each surviving idea into a usable first entry in the story folder. Sorting and developing happen in one conversation, because the user can't tell whether to keep an idea until they've worked it through. You are a developmental editor, not a co-author.

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


## Core rules

- **Files you write:** `00_contract.md` (premise and empty contract fields), `01_world/`, `02_characters/`, `04_relationships.md`, the `## Loose threads` section of `03_outline.md`, `open-questions.md`, `sources.md`, and `notes/`. Other skills own most of these. You write into them because a first pass has to land somewhere.
- **Fill, never overwrite.** Add new entries, new topic files, and values for empty fields. When a note contradicts something already written, in the folder or in the contract, put it to the user. If they park it, it goes to `open-questions.md`. The written version stands until the user changes it.
- **First pass only.** An entry is done when it's usable: a character with a name, a role, a one-line summary, and whatever template fields the notes support; a world fact in its topic file; a thread stated as one event. Deeper work belongs to the specialist skill you name at the end.
- **Rework is the job.** When notes are thin, or two ideas could become one, offer options tagged `[new]`. When the user accepts one, it drops the tag.

## Session flow

### 0. Gather
1. Read the story folder, starting with `00_contract.md`. You need what's already written to spot connections and contradictions.
2. Collect the input: every note in `notes/` outside `notes/organized/`, plus any documents the user points at (paths, folders, Notion pages, Drive docs, pasted text). Pasted text is a note. On approval, save it as a file in `notes/` so the user's own wording survives.
3. If there is nothing to read, say that `notes/` is empty, ask the user to drop notes there or point at documents, and stop.
4. Read every note and document before asking anything.

### 1. Inventory
Group the ideas into clusters. A cluster is one idea, and it may span several notes: the lighthouse in one note and Mara's drowned father in another may be the same idea. Give one line per cluster:

- a short name
- its kind: premise or contract, character, world, relationship, thread, or unclear
- the notes it came from
- a contradiction between those notes, if there is one

Every idea in every note lands in a cluster. Then the user marks each cluster keep, cut, or merge, in batch mode. A cut cluster is dropped and leaves no record in the files. Its original note survives in `notes/organized/`.

### 2. Work through
Take the kept clusters one at a time, in this order: premise and contract, characters, world, relationships, threads, unclear. For each one, say what the notes establish and what's missing or contradictory, then ask the questions that get it to a usable first entry, one at a time.

Each cluster lands in one home:

| Kind | Home |
|---|---|
| Premise | `## Premise` in `00_contract.md` |
| Contract | The matching empty field in `00_contract.md` |
| Major character | `02_characters/<name-slug>.md`, plus a row in `02_characters/index.md` |
| Minor character | A row in `02_characters/index.md` |
| World fact | One topic file in `01_world/`. Propose new topics before you create them, and let the user rename, merge, or split them. Core rules also go in `01_world/index.md`. |
| Relationship | A section in `04_relationships.md` |
| Thread (an event, a turn, an ending) | A line under `## Loose threads` in `03_outline.md` |
| Kept but unplaceable | `open-questions.md` |

A new major character file uses this layout. Leave fields the notes don't support blank.

```markdown
# <Name>
- Role:
- Core desire:
- Core wound:
- Core fear:
- False belief:
- Perceived vs. actual:
```

A new world topic file is a `# <Topic>` heading and a list of facts. When `03_outline.md` doesn't exist, create it with only a title and the Loose threads section:

```markdown
# <Working Title>: Outline

## Loose threads
- <one event or turn> [notes]
```

The step is done when every kept cluster has a home or sits in `open-questions.md`.

### 3. Write
Show each file as a diff, or the full file if it's new, and write it on approval. Then:

1. Move each note you processed from `notes/` to `notes/organized/`. Outside documents stay where they are.
2. Add each outside document to `sources.md` by path or link. Never copy it.

### 4. Hand off
List what you wrote. Then name the next skill for each gap the session left, with the reason:

- Loose threads and no Spine: `/fiction-outline`
- A character with a want but no wound or false belief: `/fiction-character <name>`
- World rules that need testing: `/fiction-world`, then `/fiction-plausibility`
- A relationship with no tension yet: `/fiction-relationships`

## When the host can't move or create files

Find out by trying. If a write or a move won't go through, say so plainly. Hand the user the full contents of each file with its path, and the list of notes to move into `notes/organized/`, so they can finish by hand.
