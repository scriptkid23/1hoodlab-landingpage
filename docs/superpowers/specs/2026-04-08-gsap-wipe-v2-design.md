# GSAP wipe reveal for app/v2

## Goal & scope
- Recreate the reference “white wipe” transition between the dark hero and the next section in `app/v2`.
- Keep existing hero and placeholder copy (“Keep scrolling…”); focus only on the reveal motion of the first white section (Page 2).
- Use GSAP + ScrollTrigger (already in deps) with clip-path scrub; no overlay layers unless needed.
- Progressive enhancement: section content must remain readable if JS is disabled or motion is reduced.

## UX behavior
- Page starts on dark hero (unchanged).
- Scrolling down: the first white section slides in from left to right via `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` synced to scroll (`scrub: 1`).
- Rounded top edge (~20px) to soften transition, matching reference feel.
- Placeholder content centered: “Keep scrolling…” (text-neutral-500), min-height: 100vh.

## Implementation plan (high level)
- Add a dedicated Section2 component under `app/v2` (same file is fine) that:
  - Wraps the placeholder in a `section` with `bg-white` (or light neutral), `text-black`, `overflow-hidden`, `rounded-t-[20px]`, `min-h-screen`, flex center.
  - Holds a `ref` for GSAP.
- In a client-side `useEffect`, register `ScrollTrigger` and create a timeline:
  ```js
  gsap.from(sectionRef.current, {
    clipPath: "inset(0 100% 0 0)",
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top bottom-=10%",
      end: "top center",
      scrub: 1,
    },
  });
  ```
  - Clamp DPR-related styling to existing Tailwind; no canvas involved here.
  - Cleanup on unmount (`ctx.revert()` or `ScrollTrigger.kill()` via gsap.context).
- Reduced motion:
  - If `prefers-reduced-motion: reduce`, skip ScrollTrigger setup and set `clipPath` to full (`inset(0 0 0 0)`).
- Progressive enhancement:
  - Default CSS state: fully visible (no clip-path) to ensure content shows without JS; animation only opt-in via JS effect (start state set in GSAP `from`).

## Accessibility
- Keep semantic `section`; text contrast on white background is sufficient with neutral-500 placeholder.
- Motion respect: `prefers-reduced-motion` gate.
- No pointer-event blockers; header remains interactive.

## Testing notes
- Desktop: scroll down, verify white section wipes in smoothly; scroll up and see reverse scrub.
- Reduced-motion: toggle OS setting, confirm no wipe (section already visible).
- Mobile: ensure min-h-screen shows enough scroll distance for wipe; check rounded top visible.
- No new network requests; GSAP already bundled.
