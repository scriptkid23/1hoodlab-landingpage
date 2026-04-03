# TechStack overlay close + reverse animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dismissible full-screen black overlay after Play animation: Close control, Escape, and backdrop click, with GSAP reverse (scale to 0) toward the play button center per spec.

**Architecture:** Single state machine `idle | opening | open | closing` in `TechStackSection`. Portal renders a fixed stack: (1) GSAP-driven circular `div` (same as today), (2) fixed Close button sibling with higher `z-index`. Open/close share duration 1.5s and `ease: "circ.inOut"`. Close re-reads `playButtonRef.getBoundingClientRect()` before animating. `useEffect` registers `keydown` for Escape only when `phase === "open"`. No new dependencies.

**Tech stack:** React 19, Next.js 16, GSAP 3, Tailwind 4, existing `createPortal` pattern.

**Spec:** `docs/superpowers/specs/2026-04-03-techstack-overlay-close-design.md`

---

## Files

| File | Role |
|------|------|
| `app/components/TechStackSection.tsx` | All logic: phase state, portal markup, GSAP open/close, a11y, Escape listener, disabled Play during anim |

No new files unless you later extract a tiny hook (YAGNI — keep in one file).

---

### Task 1: State machine + refs

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Add types, state, and refs**

Add after imports / constants:

```ts
type OverlayPhase = "idle" | "opening" | "open" | "closing";
```

Inside the component:

- `const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>("idle");`
- `const closeButtonRef = useRef<HTMLButtonElement>(null);`
- Keep `overlayRef` on the **circle** element only (GSAP target).

Remove reliance on `aria-hidden="true"` hardcoded on the circle; the dialog wrapper will manage `aria-*` (next tasks).

- [ ] **Step 2: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "refactor(tech-stack): add overlay phase state and close ref"
```

---

### Task 2: Extract shared GSAP helpers (position + animate)

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Add helpers inside component (or above return)**

Use `useCallback` so handlers stay stable where needed.

```ts
const OPEN_DURATION = 1.5;
const OPEN_EASE = "circ.inOut";

const positionOverlayAtPlayButton = useCallback(() => {
  const button = playButtonRef.current;
  const overlay = overlayRef.current;
  if (!button || !overlay) return;
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  gsap.set(overlay, {
    left: centerX,
    top: centerY,
    xPercent: -50,
    yPercent: -50,
  });
}, []);
```

- [ ] **Step 2: Replace inline `handlePlayClick` body**

New behavior:

1. If `overlayPhase !== "idle"`, return early.
2. `setOverlayPhase("opening")`.
3. `positionOverlayAtPlayButton()`.
4. `gsap.set(overlay, { scale: 0 })` (ensure start).
5. `gsap.to(overlay, { scale: 1, duration: OPEN_DURATION, ease: OPEN_EASE, onComplete: () => { setOverlayPhase("open"); closeButtonRef.current?.focus(); } })`.

Dependency array: include `overlayPhase`, `positionOverlayAtPlayButton` — **or** use a ref for phase in the guard to avoid stale closure (recommended: `overlayPhaseRef` synced with `useEffect` for read in callbacks). Simplest: guard with ref `const phaseRef = useRef(overlayPhase); useEffect(() => { phaseRef.current = overlayPhase; }, [overlayPhase]);` and in `handlePlayClick` check `if (phaseRef.current !== "idle") return;`.

Implement `phaseRef` pattern for all GSAP callbacks.

- [ ] **Step 3: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): wire open animation to overlay phase"
```

---

### Task 3: Close animation + handlers

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Implement `handleCloseOverlay`**

```ts
const handleCloseOverlay = useCallback(() => {
  if (phaseRef.current !== "open") return;
  const overlay = overlayRef.current;
  const button = playButtonRef.current;
  if (!overlay || !button) return;

  setOverlayPhase("closing");

  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  gsap.set(overlay, {
    left: centerX,
    top: centerY,
    xPercent: -50,
    yPercent: -50,
  });

  gsap.to(overlay, {
    scale: 0,
    duration: OPEN_DURATION,
    ease: OPEN_EASE,
    onComplete: () => {
      setOverlayPhase("idle");
      playButtonRef.current?.focus();
    },
  });
}, []);
```

- [ ] **Step 2: Backdrop click on circle**

On the circular `div`, add `onClick` that calls `handleCloseOverlay` only when `overlayPhase === "open"` (use `phaseRef.current === "open"` inside handler to avoid stale state).

Add `className` including `pointer-events-none` when phase is not `open`, and `pointer-events-auto` when `open` (or control via parent — see Task 4). Prefer setting on the circle: `pointer-events-auto` when `open` / `closing` might still need to block — during `closing`, user should not click again; use `pointer-events-auto` only for `open` on the circle.

- [ ] **Step 3: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): close overlay with reverse GSAP animation"
```

---

### Task 4: Portal layout — dialog wrapper + Close button

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Replace single circle portal with stacked structure**

```tsx
{mounted &&
  createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-end p-6"
      style={{
        pointerEvents: overlayPhase === "idle" ? "none" : "auto",
      }}
      role="dialog"
      aria-modal={overlayPhase === "open"}
      aria-hidden={overlayPhase === "idle"}
      aria-label="Video overlay"
    >
      <div
        ref={overlayRef}
        aria-hidden="true"
        onClick={() => {
          if (phaseRef.current === "open") handleCloseOverlay();
        }}
        className={`fixed left-0 top-0 z-0 h-[300vmax] w-[300vmax] rounded-full bg-black ${
          overlayPhase === "open" ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          handleCloseOverlay();
        }}
        className={`relative z-10 rounded-full border border-white/80 bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          overlayPhase === "open" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>,
    document.body
  )}
```

Adjust `className` strings to match project style if needed; keep **z-index**: circle `z-0`, close `z-10` so Close stays above.

**Note:** The wrapper uses `pointerEvents: none` when `idle` so the rest of the page works; when not `idle`, wrapper is `auto` — during `opening`/`closing`, close button has `opacity-0` + `pointer-events-none` so only the circle receives clicks if visible — during opening, circle might still be growing; optional: disable backdrop until `open`. **Refinement:** set `pointerEvents` on wrapper to `auto` only when `overlayPhase === "open" || overlayPhase === "opening" || overlayPhase === "closing"` and during `opening` set circle to `pointer-events-none` until `open` so accidental clicks mid-grow do not close. Spec: "Close triggers" when overlay is ready — so backdrop only when `open`. Circle `pointer-events-auto` only when `phase === "open"`.

- [ ] **Step 2: Remove obsolete init `useEffect`** that only `gsap.set(overlay, { scale: 0, left: 50%... })` on mount, or align it: on mount `idle`, circle can stay `scale: 0` at last known position; first open sets position. If init effect fights GSAP, delete it and set initial styles via React `style` or first `gsap.set` in `handlePlayClick` only.

- [ ] **Step 3: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): portal dialog stack with close control"
```

---

### Task 5: Escape key + Play disabled during animation

**Files:**
- Modify: `app/components/TechStackSection.tsx`

- [ ] **Step 1: Escape listener**

```ts
useEffect(() => {
  if (overlayPhase !== "open") return;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") handleCloseOverlay();
  };
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [overlayPhase, handleCloseOverlay]);
```

- [ ] **Step 2: Disable Play when not idle**

On the play `<button>`:

```tsx
disabled={overlayPhase === "opening" || overlayPhase === "closing"}
```

Optionally also `disabled={overlayPhase !== "idle" && overlayPhase !== "open"}` — spec says disable during opening/closing; when `open`, play is under overlay so optional.

- [ ] **Step 3: Commit**

```bash
git add app/components/TechStackSection.tsx
git commit -m "feat(tech-stack): escape to close and disable play while animating"
```

---

### Task 6: Verification

**Files:** none (manual + build)

- [ ] **Step 1: Lint**

Run:

```bash
pnpm run lint
```

Expected: exit code 0, no new errors in `TechStackSection.tsx`.

- [ ] **Step 2: Production build**

Run:

```bash
pnpm run build
```

Expected: successful Next.js build.

- [ ] **Step 3: Manual checklist**

1. Scroll to section 3, click Play — black expands from button.
2. After expansion, Close appears top-right; click — shrinks to button center.
3. Open again, press Escape — same close animation.
4. Open again, click black area (not Close) — same animation.
5. During open animation, rapid Play clicks do nothing harmful (disabled or ignored).
6. Tab: when overlay open, focus can reach Close; after close, focus returns to Play (verify in Chrome).

- [ ] **Step 4: Final commit** (only if any tweak from manual pass)

```bash
git add app/components/TechStackSection.tsx
git commit -m "fix(tech-stack): overlay a11y/edge cases from QA"
```

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| Phase machine | Task 1–2 |
| Close + fixed layer | Task 4 |
| Escape | Task 5 |
| Backdrop click | Task 3–4 |
| Reverse animation + re-query rect | Task 3 |
| duration/ease match | Task 2–3 |
| aria-modal, focus | Task 2–4 |
| Disable during anim | Task 5 |
| Portal to body | Task 4 |

No TBD/TODO left in plan steps.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-03-techstack-overlay-close.md`. Two execution options:

**1. Subagent-driven (recommended)** — Fresh subagent per task, review between tasks.

**2. Inline execution** — Run tasks in this session with checkpoints (`executing-plans` skill).

Which approach do you want?
