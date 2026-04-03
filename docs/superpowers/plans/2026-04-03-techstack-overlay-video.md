# TechStack overlay video + auto-close on end — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Play `/assets/video/video.mp4` centered on the black overlay after open; unmuted-first `play()` with muted fallback; on `ended`, run the same GSAP reverse close as today; pause/reset video on any close.

**Architecture:** Extend `TechStackSection` only. Add `videoRef`, `VIDEO_SRC` constant, `<video>` in the existing portal (between black circle and Close). `tryPlayVideo()` runs synchronously at the start of `handlePlayClick` after guards (same user gesture). `resetVideo()` runs at the start of `handleCloseOverlay`. `onEnded` calls `handleCloseOverlay` only when `phaseRef.current === "open"`. No new dependencies.

**Tech stack:** React 19, Next.js 16, GSAP 3, Tailwind 4.

**Spec:** `docs/superpowers/specs/2026-04-03-techstack-overlay-video-design.md`

---

## Files

| File | Action |
|------|--------|
| `app/components/TechStackSection.tsx` | Add video element, refs, play/reset/ended wiring |
| `public/assets/video/video.mp4` | User-supplied asset (plan notes verification) |

---

### Task 1: Constants, ref, and helpers

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Add after `OPEN_EASE`**

```ts
const VIDEO_SRC = "/assets/video/video.mp4";
```

- [ ] **Step 2: Add `videoRef` next to other refs**

```ts
const videoRef = useRef<HTMLVideoElement>(null);
```

- [ ] **Step 3: Add `resetVideo` and `tryPlayVideo` with `useCallback`**

Place after `positionOverlayAtPlayButton` (or after `phaseRef` sync), before `handleCloseOverlay`:

```ts
const resetVideo = useCallback(() => {
  const v = videoRef.current;
  if (!v) return;
  v.pause();
  v.currentTime = 0;
}, []);

const tryPlayVideo = useCallback(() => {
  const v = videoRef.current;
  if (!v) return;
  v.muted = false;
  void v.play().catch(() => {
    v.muted = true;
    void v.play().catch(() => {
      /* browser blocked — user can still use Close / Escape */
    });
  });
}, []);
```

- [ ] **Step 4: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): add video ref and play helpers"
```

---

### Task 2: Wire `resetVideo` into close path

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: At the top of `handleCloseOverlay`**, immediately after the `phaseRef.current !== "open"` guard (before `setOverlayPhase("closing")`), call `resetVideo()`.

- [ ] **Step 2: Add `resetVideo` to the dependency array** of `handleCloseOverlay`.

- [ ] **Step 3: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): reset video when closing overlay"
```

---

### Task 3: Start playback from Play click + open visibility

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: In `handlePlayClick`**, immediately after passing the idle guard and before `setOverlayPhase("opening")`, call `tryPlayVideo()`.

- [ ] **Step 2: Add `tryPlayVideo` to `handlePlayClick` dependency array.**

- [ ] **Step 3: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): start video play on user gesture"
```

---

### Task 4: Portal `<video>` markup

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Insert between the black circle `div` and the Close `button`**

```tsx
<video
  ref={videoRef}
  className={`fixed left-1/2 top-1/2 z-[5] max-h-[85vh] max-w-[min(90vw,1200px)] -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-300 ${
    overlayPhase === "open" ? "opacity-100" : "opacity-0"
  }`}
  playsInline
  preload="auto"
  src={VIDEO_SRC}
  aria-label="Video"
  onEnded={() => {
    if (phaseRef.current !== "open") return;
    handleCloseOverlay();
  }}
/>
```

**Notes:**
- `z-[5]` keeps video above the circle (`z-0`) and below Close (`z-10`).
- Hidden with `opacity-0` until `open` so the user sees video with the full black mask; audio may already be playing per spec (gesture + `tryPlayVideo` in click).
- `onEnded` guards on `open` to avoid double-close if `ended` races with `closing`.

- [ ] **Step 2: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): render portal video with ended auto-close"
```

---

### Task 5: Asset and verification

**Files:**
- `public/assets/video/video.mp4` (binary, user-provided)

- [ ] **Step 1: Ensure directory exists and place `video.mp4`**

Create `public/assets/video/` if missing. Copy or export the real MP4 as `video.mp4`. (Git can store LFS or normal binary per repo policy.)

- [ ] **Step 2: Lint**

```bash
pnpm run lint
```

Expected: exit code 0.

- [ ] **Step 3: Build**

```bash
pnpm run build
```

Expected: success.

- [ ] **Step 4: Manual QA**

1. Click Play: overlay opens, video visible when `open`, audio plays if browser allows.
2. Let video finish: overlay closes with reverse animation; Play refocuses.
3. Open again, press Escape or Close mid-play: overlay closes, video stops; open again from start.
4. If `video.mp4` missing: network error in devtools; still can close with Close/Escape.

- [ ] **Step 5: Commit asset** (when file is added)

```bash
git add public/assets/video/video.mp4
git commit -m "chore: add tech stack section overlay video asset"
```

---

## Spec coverage (self-review)

| Requirement | Task |
|-------------|------|
| Centered video, contain, playsInline, no loop | Task 4 |
| Unmuted play + muted fallback | Task 1, 3 |
| `onEnded` → same close | Task 4 + Task 2 |
| Early dismiss pause/reset | Task 2 |
| Path `/assets/video/video.mp4` | Task 1, 4, 5 |
| No backdrop close | unchanged |
| No duplicate close on `ended` | Task 4 guard |

---

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-04-03-techstack-overlay-video.md`.

**1. Subagent-driven** — one subagent per task, review between tasks.

**2. Inline execution** — run tasks in one session with checkpoints.

Which approach do you want?
