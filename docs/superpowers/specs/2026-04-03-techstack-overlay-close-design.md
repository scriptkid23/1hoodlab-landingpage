# TechStack overlay: close control and reverse animation

## Goal

When the user taps the Play control in `TechStackSection`, the black circular overlay still expands from the button as today. After it finishes opening, the user must be able to dismiss the dark overlay. Dismissal uses a **reverse animation** (scale back toward the play button center), matching option **A** from brainstorming.

## Scope

**In scope**

- Track overlay state: idle → opening → open → closing → idle (or equivalent flags so open/close animations do not overlap).
- On open complete: enable interaction with the overlay layer (`pointer-events-auto` on the appropriate container); show a **Close** control in a **separate fixed layer** (same portal target as today) so the control does not scale with the circular mask.
- Close triggers:
  - **Close button** (required): fixed position, readable on black (e.g. top-right), icon + accessible name (`aria-label="Close"`).
  - **Escape** key while overlay is open.
  - **Click on the dark overlay** (backdrop) closes; **not** propagating accidental double-handling with the close button (clear hit targets).
- On close: animate circle `scale` from current full cover back to `0` with the same origin as open (button center). Re-query `getBoundingClientRect()` on the play button immediately before starting close so the origin stays correct if the page scrolled.
- Easing/duration: mirror open (`duration` 1.5s, `ease: "circ.inOut"` or visually matched pair).
- Accessibility: when open, treat as modal-like — `aria-modal="true"` on the dialog container, focus management (move focus to Close or a wrapper, restore focus to Play on complete), `aria-hidden` on the overlay wrapper when fully closed.
- Disable Play (and Close) during opening/closing to avoid re-entrant animations.

**Out of scope (future)**

- Embedded video player content inside the overlay (placeholder comment in code is enough if still absent).

## Non-goals

- Changing the scroll-triggered reveal of the Play button.
- Replacing GSAP with another library.

## Implementation notes

- Portal remains `document.body` so the overlay escapes `overflow` from the smooth wrapper.
- Structure: one fixed full-viewport **stack** (z-index e.g. 9999): (1) circular black `div` animated with GSAP, (2) sibling layer for close UI and optional future content, above the circle for hit-testing the button.
- Use `useEffect` for Escape listener when `overlayPhase === "open"`; cleanup on unmount or when closed.

## Success criteria

- User can always leave the dark state via Close, Escape, or backdrop click.
- No mid-word or broken focus; no stuck `pointer-events` or scroll lock unless explicitly added later.
- Close animation reads as the inverse of open from the same anchor point.

## Approval

Design approved by product owner conversation (2026-04-03): reverse animation (A), combined approach state machine + separate UI layer (1+2), including Close + Escape + backdrop dismiss.
