export interface Theme {
  uiBg: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  bg: string;
  pattern: string;
  text: string;
  textMuted: string;
  id: string;
  primaryHex: string;
  secondaryHex: string;
}

export const DEFAULT_THEME: Theme = {
  uiBg: 'bg-black/95',
  border: 'border-white/5',
  primary: 'indigo-500',
  secondary: 'pink-500',
  accent: 'emerald-500',
  glow: 'rgba(99, 102, 241, 0.5)',
  bg: 'bg-black',
  pattern: 'bg-grid-white/[0.01]',
  text: 'text-white',
  textMuted: 'text-zinc-400',
  id: 'default',
  primaryHex: '#6366f1',
  secondaryHex: '#ec4899',
};

export const NEON_THEME: Theme = {
  uiBg: 'bg-zinc-950/95',
  border: 'border-cyan-500/20',
  primary: 'cyan-400',
  secondary: 'fuchsia-500',
  accent: 'yellow-400',
  glow: 'rgba(34, 211, 238, 0.5)',
  bg: 'bg-zinc-950',
  pattern: 'bg-grid-cyan-500/[0.02]',
  text: 'text-white',
  textMuted: 'text-zinc-400',
  id: 'neon',
  primaryHex: '#22d3ee',
  secondaryHex: '#d946ef',
};

export const MONOCHROME_THEME: Theme = {
  uiBg: 'bg-black/95',
  border: 'border-white/10',
  primary: 'zinc-100',
  secondary: 'zinc-400',
  accent: 'white',
  glow: 'rgba(255, 255, 255, 0.2)',
  bg: 'bg-black',
  pattern: 'bg-grid-white/[0.02]',
  text: 'text-white',
  textMuted: 'text-zinc-400',
  id: 'monochrome',
  primaryHex: '#f4f4f5',
  secondaryHex: '#a1a1aa',
};

export const BLACK_THEME: Theme = {
  uiBg: 'bg-black/98',
  border: 'border-white/20',
  primary: 'white',
  secondary: 'zinc-500',
  accent: 'zinc-200',
  glow: 'rgba(255, 255, 255, 0.4)',
  bg: 'bg-black',
  pattern: 'bg-grid-white/[0.03]',
  text: 'text-white',
  textMuted: 'text-zinc-500',
  id: 'black',
  primaryHex: '#ffffff',
  secondaryHex: '#71717a',
};

export const WHITE_THEME: Theme = {
  uiBg: 'bg-white/98',
  border: 'border-zinc-200/60',
  primary: 'zinc-900',
  secondary: 'zinc-500',
  accent: 'indigo-500',
  glow: 'rgba(99, 102, 241, 0.08)',
  bg: 'bg-[#F9FAFB]',
  pattern: 'bg-grid-black/[0.015]',
  text: 'text-zinc-900',
  textMuted: 'text-zinc-500',
  id: 'white',
  primaryHex: '#09090b',
  secondaryHex: '#71717a',
};

export const IOS_LIGHT_THEME: Theme = {
  uiBg: 'bg-white/90',
  border: 'border-black/5',
  primary: 'blue-500',
  secondary: 'zinc-400',
  accent: 'blue-600',
  glow: 'rgba(59, 130, 246, 0.2)',
  bg: 'bg-[#F2F2F7]',
  pattern: 'bg-white',
  text: 'text-black',
  textMuted: 'text-zinc-500',
  id: 'ios-light',
  primaryHex: '#3b82f6',
  secondaryHex: '#a1a1aa',
};

export const IOS_DARK_THEME: Theme = {
  uiBg: 'bg-[#1C1C1E]/95',
  border: 'border-white/10',
  primary: 'blue-500',
  secondary: 'zinc-500',
  accent: 'blue-400',
  glow: 'rgba(10, 132, 255, 0.4)',
  bg: 'bg-black',
  pattern: 'bg-grid-white/[0.01]',
  text: 'text-white',
  textMuted: 'text-zinc-500',
  id: 'ios-dark',
  primaryHex: '#3b82f6',
  secondaryHex: '#71717a',
};

export const GRAPHITE_THEME: Theme = {
  uiBg: 'bg-[#1F1F21]/98',
  border: 'border-[#3A3A3C]',
  primary: 'zinc-100',
  secondary: 'zinc-500',
  accent: 'zinc-300',
  glow: 'rgba(255, 255, 255, 0.15)',
  bg: 'bg-[#121214]',
  pattern: 'bg-grid-white/[0.02]',
  text: 'text-zinc-100',
  textMuted: 'text-zinc-500',
  id: 'graphite',
  primaryHex: '#f4f4f5',
  secondaryHex: '#71717a',
};

export const LAVENDER_THEME: Theme = {
  uiBg: 'bg-[#1C1C1E]/95',
  border: 'border-violet-500/20',
  primary: 'violet-400',
  secondary: 'purple-500',
  accent: 'fuchsia-400',
  glow: 'rgba(167, 139, 250, 0.4)',
  bg: 'bg-black',
  pattern: 'bg-grid-violet-500/[0.02]',
  text: 'text-white',
  textMuted: 'text-zinc-500',
  id: 'lavender',
  primaryHex: '#a78bfa',
  secondaryHex: '#a855f7',
};

export const MIDNIGHT_THEME: Theme = {
  uiBg: 'bg-black/95',
  border: 'border-amber-500/20',
  primary: 'amber-400',
  secondary: 'zinc-600',
  accent: 'amber-500',
  glow: 'rgba(251, 191, 36, 0.3)',
  bg: 'bg-black',
  pattern: 'bg-grid-amber-500/[0.01]',
  text: 'text-white',
  textMuted: 'text-zinc-500',
  id: 'midnight',
  primaryHex: '#fbbf24',
  secondaryHex: '#52525b',
};

export const THEMES: Record<string, Theme> = {
  default: DEFAULT_THEME,
  neon: NEON_THEME,
  monochrome: MONOCHROME_THEME,
  black: BLACK_THEME,
  white: WHITE_THEME,
  'ios-light': IOS_LIGHT_THEME,
  'ios-dark': IOS_DARK_THEME,
  graphite: GRAPHITE_THEME,
  lavender: LAVENDER_THEME,
  midnight: MIDNIGHT_THEME,
};
