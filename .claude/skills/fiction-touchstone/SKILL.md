---
name: fiction-touchstone
description: "Build fiction reference sheets from the user's curated touchstones catalog, capture new takeaways into it, or run a seeding interview to fill it. Use when planning a story, chapter, or scene and wanting references for tone, craft, theme, or emotional effect; when the user says \"add a touchstone\"; or for craft study (\"show me everything tagged braided-timeline\"). Not for query-letter comp titles or market positioning."
aliases: [touchstone]
---

# fiction-touchstone

A touchstone is a specific lesson the user took from a specific work, something to emulate or avoid. This skill turns the user's catalog into reference sheets for planning. The catalog is the authority. Your general knowledge is not.

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

## Catalog

- **Path:** the `touchstones_catalog` key in the suite config.
- **Schema:** `catalog-template/SCHEMA.md` in this skill's folder. Read it before doing anything else.
- **Tags:** `vocabulary.md` in the user's catalog.

**No catalog configured:** explain what the catalog is and offer to create one. Ask where it should live, copy `catalog-template/vocabulary.md` into it, create an empty `works/`, and write the `touchstones_catalog` key, each step on approval. Don't build a sheet without a catalog.

**The host can't reach the config or the catalog:** some hosts give you no
access outside the user's project, which puts both `~/.config/fiction-skills/`
and a catalog living anywhere else out of reach. Say which one you couldn't
read and what you were looking for, then offer the two things that still work:
build a sheet from takeaways the user shares with you directly in the
conversation, or write the takeaway text out for them to paste into their
catalog themselves. Never substitute your own knowledge of a work for a
catalog you couldn't open. An unvetted reference profile is a different
product, and the user has to ask for it by name.

## Hard rules

1. **Never bulk-populate.** Don't add works or takeaways from your own knowledge. Entries record the user's reads, in their words.
2. **Controlled vocabulary.** Use only values in the catalog's `vocabulary.md`. If none fits, propose a new value with a one-line definition for approval. Don't invent one silently, and don't force a bad fit.
3. **Don't invent the user's opinions.** If a takeaway's "why" is unclear, ask.
4. **Story files are read-only.** You may read anything in the story folder. You write only to `refs/`.

## Modes

Pick the mode from the request. If unclear, ask.

### 1. Sheet: build a reference sheet

**Input:** a planning request about a story. Read `00_contract.md` and `03_outline.md` for context.

1. **Extract 2–4 needs.** A need is a specific planning problem: an emotional effect at a moment, a craft problem, a theme being handled, a tone to hold. Phrase each as concretely as the request allows. Translate the contract's wording into catalog tags yourself; the contract stays in the user's words.
   - If the request is specific, proceed.
   - If it's vague ("refs for chapter 12") or the story folder leaves the target unclear, propose the needs and wait for confirmation before searching.
2. **Search the catalog.** Grep frontmatter and takeaway tags across `works/`, starting with `effect` and `craft`, then `tone`, `theme`, `character`, `speculative`. Read candidate takeaways in full. Match on substance, not keywords.
3. **Select up to 3 takeaways per need.** Prefer direct fit over volume. Include `avoid` and `mixed` takeaways when they warn against a likely failure for this need.
4. **Write the sheet** in the format below. Every entry needs a "Why it fits" line tied to the need. If you can't write one honestly, drop the entry.
5. **Gaps:** list every need with no strong match. Don't pad with weak ones.
6. **Unvetted suggestions (optional, max 3):** works not in the catalog that may help, labeled unvetted. Offer to capture any the user agrees with.
7. **Save** to `refs/<unit-or-topic-slug>.md` in the story folder. Use the unit slug from `03_outline.md` when the sheet supports one unit.

**Craft-study variant:** if the request is a tag or topic with no story ("everything on unreliable narrators"), skip step 1, treat the query as a single need, lift the per-need cap, and don't save unless asked. No story folder is needed.

**Sheet format:**

```markdown
# Reference sheet: <story> / <unit or topic>
Date: YYYY-MM-DD
Source: <request summary or file path>

**Needs**
1. …
2. …

## Need 1: <need>
- **Creator, *Title* (medium, Year): <takeaway title>** · `<stance>`
  - What to look at: <where in the work, and what to notice>
  - Why it fits: <tie to this need>
  - Watch out: <only if the takeaway has an avoid note>

## Need 2: …

## Gaps
- Need N: no catalog match. <Optional: what kind of work would fill it.>

## Unvetted suggestions
- **Creator, *Title* (medium, Year)**: <one line on why>. Not in your catalog. Add it?
```

### 2. Capture: add a takeaway

**Input:** usually one line, such as "add: Piranesi. Journal voice slowly reveals his own erasure. Emulate." No story folder is needed.

1. Check `works/` for an existing file for this work (match title and creator). If it exists, append the new takeaway to it.
2. Draft the takeaway using the schema. Keep the user's wording for the lesson and tighten only for clarity.
3. Map tags to `vocabulary.md`. Propose any new values separately, each with a definition.
4. If a field that matters is missing (stance, or what specifically to look at), ask one short question rather than guessing. Leave optional fields empty.
5. Show the new file or diff, plus any vocabulary diff. Write only on approval.

Batch capture (several works at once) follows the same steps. Show all diffs together.

### 3. Seed: interview to fill the catalog

For filling the catalog from scratch or in bulk sessions. No story folder is needed.

1. Ask the user to name a work that shaped how they write. One work at a time.
2. For each work, ask: What did it teach you? Where exactly does it happen? Emulate, avoid, or mixed? What effect did it have on you as a reader? Push for specifics (scenes, choices, techniques) over general praise. Usually 1–3 takeaways per work.
3. Draft the entry after each work and get approval before moving on, so nothing is lost if the session ends.
4. Collect proposed vocabulary additions and confirm them in batches.
5. Stop when the user says, or offer a stopping point every five works or so. A first session might aim for 15–25 works.

## Out of scope

- Query-letter comp titles and market positioning.
- Writing manuscript prose.
