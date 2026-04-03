# TechStack overlay: inline video with sound and auto-close on end

## Goal

When the user taps Play in `TechStackSection`, after the existing black circle opens, show a centered video from `/assets/video/video.mp4` (file at `public/assets/video/video.mp4`). Prefer **unmuted** playback using the user gesture. When the video fires **`ended`**, run the **same reverse GSAP close** animation as the Close button. Manual Close and Escape still dismiss early and stop the video.

## Scope

**In scope**

- `<video>` in the portal layer: centered on the black overlay, `object-fit: contain`, bounded by viewport (e.g. max width/height), `playsInline`, no `loop`.
- **Playback start:** In the Play button `onClick` handler (same user-activation turn as practical), set `muted = false`, call `video.play()`, handle the returned Promise:
  - If rejected: set `muted = true`, call `play()` once more.
  - If still rejected: leave video element mounted; user can still close with Close or Escape (no extra “tap to unmute” UI unless we add later).
- **Optional:** Keep video visually hidden (`opacity-0` or equivalent) until overlay phase is `open`, while attempting to satisfy autoplay policy via early `play()` in the click handler; align audio start with visible video as closely as possible without blocking the open animation.
- **`onEnded`:** Invoke the shared close routine (same reverse animation and focus restore to Play as today).
- **Early dismiss (Close / Escape):** `pause()`, reset `currentTime` to `0` (or `load()` if needed) so reopen is clean.
- **Asset path:** `NEXT_PUBLIC` not required; use `src="/assets/video/video.mp4"`.
- **Close button and Escape** behavior unchanged from current overlay (no backdrop click to close).

**Out of scope**

- Custom video chrome, progress bar, or separate “replay” control.
- Hosting video on external CDN (local public file only unless changed later).

## Non-goals

- Replacing GSAP open/close.
- Changing scroll-triggered headline/play reveal.

## Success criteria

- Video plays after overlay is ready; sound when browser allows; graceful fallback to muted.
- Video end triggers the same close animation as Close.
- No duplicate close animations or stuck `overlayPhase` if `ended` fires during `closing`.

## Approval

Design approved in conversation (2026-04-03): flow with centered video, unmuted-first + muted fallback, auto-close on `ended`, part 1 + part 2 policy as above.
