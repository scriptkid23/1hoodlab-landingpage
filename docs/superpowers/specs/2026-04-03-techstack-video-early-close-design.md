# TechStack overlay video: early close before natural end

## Goal

Avoid a long static last frame while the black overlay reverse-animates (~1.5s). Start the same close path as today when the video has **~1.5 seconds remaining**, aligned with `OPEN_DURATION` / close animation length.

## Behavior

- **Constant:** `EARLY_CLOSE_SECONDS = 1.5` (same value as `OPEN_DURATION`; implement as shared constant or duplicate literal only if unavoidable—prefer single source in code).
- **Trigger:** On `<video>` `timeupdate`, when overlay phase is `open` and `duration` is finite and `currentTime >= duration - EARLY_CLOSE_SECONDS`, call the existing close routine **once** (use a ref flag, e.g. `earlyCloseTriggered`, reset when overlay returns to `idle`).
- **`onEnded`:** Keep as fallback: if phase is still `open` when `ended` fires (seek, short file, missed `timeupdate`), call the same close routine. Guard so double-close does not run.
- **Short videos:** If `duration < EARLY_CLOSE_SECONDS`, do not trigger early threshold; rely on `onEnded` (or first `timeupdate` once `currentTime` reaches end) to close.
- **Manual close:** Unchanged (Close / Escape); reset the early-close flag when opening again.

## Non-goals

- Fade-only mitigation without time-based early close.
- User-facing setting for offset.

## Success criteria

- No noticeable freeze on the final frame during the shrink animation under normal-length videos.
- No duplicate animations or stuck phase when `timeupdate` and `ended` both fire.

## Approval

Approved 2026-04-03: offset **1.5s** (option A), design with `timeupdate` + ref + `onEnded` fallback + short-video rule.
