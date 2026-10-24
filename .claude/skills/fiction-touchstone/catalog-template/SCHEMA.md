# Touchstones catalog schema

A catalog is the user's record of specific lessons from specific works. The `fiction-touchstone` skill reads it to build reference sheets. The catalog lives outside the suite, at the path set as `touchstones_catalog` in `~/.config/fiction-skills/config.md`.

## Layout

```
touchstones/
├── vocabulary.md    # allowed tag values per facet (starts as a copy of catalog-template/vocabulary.md)
└── works/           # one file per work
```

This schema stays in the skill. The user's `vocabulary.md` is the authority for tags, because the user extends it.

## Work files

- **Filename:** kebab-case title, plus creator if needed to disambiguate: `never-let-me-go.md`, `solaris-tarkovsky.md`
- **One file per work.** Adaptations of the same story in different media get separate files.
- A work file holds 1 or more takeaways. Start with one; add more over time.

### Frontmatter (work-level)

```yaml
---
title: Never Let Me Go
creator: Kazuo Ishiguro
medium: novel          # novel | novella | short-story | film | series | game | play | comic | essay | poem | other
year: 2005
rating: 5              # 1–5, the user's overall regard (optional)
added: 2026-10-09
---
```

### Takeaways (body)

Each takeaway is an H2 section:

```markdown
## [Short takeaway title]
- stance: emulate            # emulate | avoid | mixed
- craft: [withheld-premise]
- tone: [restrained]
- theme: [memory-identity]
- character: []
- speculative: []
- effect: [dread, quiet-devastation]
- where: [Part/chapter/scene/timestamp — where to look]

[1–4 sentences in the user's words: what the work does, and what to take from it or avoid.]
```

**Rules**
- Tag values must come from `vocabulary.md`. Empty lists are fine.
- `stance` and the prose note are required. Everything else is optional.
- `where` should be as specific as the user can make it. It's what makes the reference usable.
- The prose is the user's read, not a summary of the work.
