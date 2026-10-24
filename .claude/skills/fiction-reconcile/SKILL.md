---
name: fiction-reconcile
description: "Update 03_outline.md after a draft has taken the story somewhere the outline didn't plan. Reads the draft against its outline units, puts each divergence to the user, then repairs the causal chain after it. Use when the writing went a different direction than the outline, or the user invokes /fiction-reconcile."
aliases: [reconcile]
---

# fiction-reconcile

The user wrote a draft and it went somewhere the outline didn't. Find each divergence, let the user decide whether the draft or the outline wins, and leave the outline a true plan for what comes next. You are a developmental editor keeping the map honest, not a judge of the draft.

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

- **A divergence is not a mistake.** Sometimes the draft found something better, sometimes it wandered. Only the user can tell which, so every divergence is their call.
- **Files you write:** `03_outline.md` and `open-questions.md`. Read every other file in the story folder, but leave it alone. When the draft changes a character, a world fact, a relationship, a `05_scenes/` beat plan, or the Story Contract, add an item to `open-questions.md` naming the skill that owns it.
- **Don't edit the draft.** Prose stays where the user writes it.

## Session flow

### 0. Gather
1. Read the story folder, starting with `00_contract.md` and `03_outline.md`. No outline: point the user to `/fiction-outline` and stop.
2. Get the draft text. Work only from prose actually in front of you. If the user describes a draft instead of sharing it, ask for the text.
3. The user may hand over several drafts. Work them in story order, one at a time through step 3, and hold every ripple fix until the last draft is in (step 4). A later draft may already answer a fix you would have proposed.

### 1. Match the draft to units
If the draft's name contains a unit slug, use that unit. Otherwise propose the unit or units it covers and confirm with the user. A draft that covers two units, splits one, or plays out a scene no unit plans is itself a divergence. Handle it in step 3 like any other.

### 2. Find divergences
Read the draft against each matched unit and against the Spine. A divergence changes one of:

- the unit's **external event**
- the unit's **internal change**
- the unit's **thematic beat**
- the **causal link** into or out of the unit
- the **Spine**: the protagonist's internal change, the ending, or the central question

Changes in wording, setting detail, or texture are not divergences. Leave them out.

Also check the outline's `## Loose threads` section, if there is one. A draft that dramatizes a loose thread is a new-unit divergence.

List the divergences you found before asking about any of them, so the user sees the whole picture first.

### 3. Decide each divergence
Order: Spine divergences first, then structural ones (a changed event, a merge, a split, a new unit), each asked alone. Minor ones, such as a different minor character carrying the same news, go in one batch.

For each, quote the draft line and the unit line side by side, then offer:

- **Draft wins.** Rewrite the unit in place to match the draft. The user decided it, so the new text carries no provenance tag. A new unit gets a slug. A loose thread the draft used moves into the new unit and leaves the `## Loose threads` section.
- **Keep the outline.** The unit stays. Add a revision note to `open-questions.md`, for example:

  ```markdown
  - [ ] Revise the draft of `the-confession`: Mara confesses here, but the outline holds it for chapter 9 (fiction-reconcile, YYYY-MM-DD)
  ```

Give your recommendation and a one-line reason with each. If the draft bends the Story Contract, say so before the user decides.

### 4. Repair the chain
Once every divergence in every draft is decided, walk the causal chain forward from the earliest changed unit. If a Spine divergence was accepted, walk every unit, earlier ones included.

For each unit whose "because" no longer holds, propose a fix tagged `[new]`, with one contrasting alternative and what each changes. Build fixes from established character wants, flaws, and beliefs in `02_characters/` before reaching for an outside event. One unit at a time. Accepted fixes drop the tag. "Park it" sends the unit to `open-questions.md`.

Step 4 is done when every unit after the earliest change has been checked and each broken link is fixed, parked, or left `[new]` by the user's choice.

## Saving

Summarize the session:

- Units changed, added, merged, or split
- Revision notes added for the draft
- Items logged for other skills
- Anything still tagged `[new]`

Show the `03_outline.md` diff and the `open-questions.md` additions. Write on approval. Keep the outline's existing layout and every unit the session didn't touch.

Then name the next step: `/fiction-beats` for any new or rewritten unit whose `05_scenes/` file is now stale, and the owning skill for each item logged in `open-questions.md`.
