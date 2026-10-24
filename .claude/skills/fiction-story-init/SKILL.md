---
name: fiction-story-init
description: "Create a story folder, the shared home every fiction-skills skill works in, either from a short concept or from a pile of existing notes and documents, which it hands to fiction-organize. Use when the user starts a new story or invokes /fiction-story-init."
aliases: [story-init]
---

# fiction-story-init

You build the story folder. Every other skill in the suite expects it, so this skill runs first.

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

## Start

1. Ask for the story name, unless the user already gave it. Derive a lowercase hyphenated slug ("The Long Dark" becomes `the-long-dark`).
2. Ask where the folder should go. Recommend wherever the user's story material already lives: the current directory in a terminal, the open project's root in a writing app.
3. If `<slug>/` already exists, read it. If it is a story folder, say so and stop. This skill never overwrites one.
4. Pick the input path from what the user gave you:
   - **A concept** (a few sentences or a paragraph): follow "From a concept".
   - **Documents** (paths, folders, Notion pages, Drive docs, pasted text): follow "From documents".

## From a concept

1. Draw a 1–3 sentence premise from the concept, in the user's words where possible.
2. Show the premise and the list of files you'll create. Write on approval.

Every file except the premise starts blank.

## From documents

Sorting documents is `fiction-organize`'s job. You only make the folder it sorts into.

1. Show the list of files you'll create and write them on approval. The premise starts blank, and organize fills it from the documents.
2. Save any pasted text as a file in `notes/`. Pasted text has no other home, so this keeps the user's own wording.
3. Point the user to `/fiction-organize` with the same documents. Files and links stay where they are. Organize lists them in `sources.md` once it has read them.

## Files

Create these. `03_outline.md`, `05_scenes/`, and `refs/` belong to the skills that fill them, and those skills create them.

**`<slug>/00_contract.md`**

```markdown
# <Story Title>

## Premise
<premise>

## Story Contract
- Genre / subgenre:
- Tone & register:
- Themes & central question:
- Speculative rules:
- Hard no's:
- Structure:

---
Next: run `/fiction-outline` to complete the contract and build the outline.
```

**`<slug>/notes/`**: an empty folder. The user drops unsorted notes here, and `/fiction-organize` works through them.

**`<slug>/01_world/index.md`**

```markdown
# World

## World premise
What defines this world? What rules govern it?

## Core rules
-

## Topics
One file per topic in this folder. Each fact lives in exactly one topic file. Other files link to it rather than restating it.
Topics to consider: environment, technology, social structures, economics, daily life, history.

-

---
Next: run `/fiction-world` to develop the setting, and `/fiction-plausibility` to check the premise.
```

**`<slug>/02_characters/index.md`**

```markdown
# Characters

| Name | Role | One line | File |
|---|---|---|---|

Minor characters live in this table until they need their own file.

---
Next: run `/fiction-character` to develop individuals, and `/fiction-arc` to map their journeys.
```

**`<slug>/04_relationships.md`**

```markdown
# Relationships

## <Character A> ↔ <Character B>
- What A wants from B:
- What B wants from A:
- Source of tension:
- Unspoken assumption:
- How it evolves:

---
Next: run `/fiction-relationships` to develop these dynamics.
```

**`<slug>/open-questions.md`**

```markdown
# Open questions

- [ ] <question> (fiction-story-init, YYYY-MM-DD)
```

**`<slug>/sources.md`**

```markdown
# Sources

- <path or link>: <one line on what it holds>
```

Once the files are written, list what you created. From a concept, point the user to `/fiction-outline`. From documents, point them to `/fiction-organize`.

## When the host can't create files

Some hosts route every write through the user instead of letting you make
files directly, and some can't create folders at all. Find out by trying,
not by asking. If a write won't go through, say so plainly and hand the
user the full contents of each file with its path, in the order above, so
they can create the folder themselves. Then tell them which skill to
run once it exists, as above. A story folder the user typed out by
hand is worth exactly as much as one you wrote.
