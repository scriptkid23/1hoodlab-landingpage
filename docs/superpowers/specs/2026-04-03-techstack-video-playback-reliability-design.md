# TechStack video: playback reliability (no in-overlay retry UI)

## Goal

After the user clicks Play, maximize the chance that `<video>` starts playback without adding extra controls inside the overlay.

## Behavior

- **First attempt:** Same as today — unmuted `play()`, on failure muted `play()`, in the same click handler (user gesture).
- **Second chance:** If both fail (e.g. media not ready), register a **one-time** `canplay` listener and repeat the unmuted-then-muted `play()` chain once data is available.
- **Cleanup:** Remove any pending `canplay` listener when the overlay closes or the video is reset so no stray callbacks run.
- **If playback still fails:** No “Tap to play” or secondary button (**option A**). The user dismisses the overlay with **Close** or **Escape** only.

## Non-goals

- Guaranteeing playback on every device or network (not possible on the web).
- In-overlay UI for manual play retry.

## Success criteria

- Fewer failures when the file loads slowly but eventually becomes playable.
- No duplicate `play()` storms; listener cleaned up on close.

## Approval

2026-04-03: option **A** (no extra in-overlay control); retry via `canplay` acceptable.
