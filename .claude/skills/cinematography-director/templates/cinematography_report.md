# Cinematography report - <title>

> Deliverable layout. Keep sections short; tables over prose. Label TECHNICAL vs CREATIVE.

## 0. Director's summary (one screen, always first)
- Visual identity in one line (lens/distance feel, camera behaviour, palette, light).
- The 3-5 key decisions, each: shot id - decision - reason (one line each).
- Budgets: moving x/n, shallow DOF x/n, effect transitions x; cdcheck result.
- Open checks for the user (facts to verify, assumptions to confirm).
A reader who stops here must know the plan.

## 1. Brief card
Intent (user's words) · audience · platform/ratio/duration · mode(s) · target adapter · constraints · house rules · timing source (measured / estimated).

## 2. Beat map
| Beat | t | Anchor word/event | Kind | Content |

## 3. Emotion timeline
| Beat | Dominant | Secondary | Intensity 0-5 | Visual lever |

## 4. Visual strategy
- Information ledger (knows / not yet)
- See / hide list (hidden, method, reveal at, reveal method)
- Primary / secondary subject per beat
- Motif register (motif, first, returns, change)
- Colour script (base, accent, motif, progression)
- Visual identity (lens family, camera behaviour, light, ratio)

## 5. Shot list
One `templates/shot_blueprint.md` block per shot (only relevant fields). Budget count at the end: moving x/n, shallow x/n, effect transitions x.

## 6. Timeline
`timeline.json` (schema `templates/timeline.schema.json`) - attached or inline.

## 7. Validation
`cdcheck.py timeline` output (0 errors) + checklist results + explained warnings.

## 8. Production instructions (per adapter)
Crew shot list / Blender keys / 2D camera calls / AI prompts + continuity sheet / edit list.

## 9. Decisions explained
The 3-6 most important choices: what, why, the rejected alternative.

## 10. Hints for other departments
Music (for a music skill): beats and `music_hints`. Sound, graphics: what the picture leaves room for.
