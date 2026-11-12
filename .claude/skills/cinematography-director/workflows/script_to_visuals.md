# Workflow: script to visuals (default, full run)

Input: a script, narration, scene description or idea. Output: `templates/cinematography_report.md` + `timeline.json`.

1. Read `core/decision_engine.md`. Do step 1 (brief card). Read the ONE or TWO mode files and the ONE adapter file.
2. If word timings exist (words.json, subtitles, Scorewright `facts.json`), use them. Else estimate at about 150 words per minute and label times "estimated".
3. Steps 2-4: beat map, emotion timeline, visual strategy (`core/visual_storytelling.md`, `colour/colour_direction.md`).
4. Step 5: shot list. Per shot, open only the domain files needed. Run the motivation gate on every move.
5. Step 6: write `timeline.json`.
6. Step 7: `python <skill>/scripts/cdcheck.py timeline timeline.json`. Fix errors. Walk `workflows/final_visual_audit.md`.
7. Step 8: production instructions in the adapter's form; report section 9 "Decisions explained".
8. Present: a short summary (identity, 3 key decisions, budgets), then the report. Ask the user to review the key beats; Claude cannot see the final motion.

Scale: under 60 s = every shot in full blueprint form. Over 5 min = full blueprints for key sequences only; other shots as table rows.
