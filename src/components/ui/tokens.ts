/**
 * Non-component design primitives: the class-merge helper and the shared
 * motion vocabulary. Kept separate from `index.tsx` so that file exports
 * only components and React Fast Refresh keeps working.
 */

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/** The single easing curve used across the app. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* These presets are for elements that mount and unmount in response to user
   action (results appearing, errors, menus) — never for static page content.
   Static content uses the CSS `.enter` classes in index.css, whose resting
   state is visible, so nothing can get stranded at opacity:0 if JS stalls. */

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18 },
};

export const riseIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: EASE },
};

/** Popover/menu entrance — shared by every dropdown. */
export const popIn = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.14, ease: EASE },
};
