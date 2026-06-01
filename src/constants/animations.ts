export const SMOOTH_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 50,
  mass: 1,
  restDelta: 0.001
};

export const ULTRA_SMOOTH_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 50,
  mass: 1,
  restDelta: 0.0001
};

export const PANEL_TRANSITION = {
  initial: { opacity: 0, scale: 0.99, x: 10 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.99, x: 5, transition: { duration: 0.05 } },
  transition: { duration: 0.15, ease: "easeOut" as const }
};

export const MODAL_TRANSITION = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.05 } },
  transition: { duration: 0.15, ease: "easeOut" as const }
};
