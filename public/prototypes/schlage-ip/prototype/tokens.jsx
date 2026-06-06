// Theme tokens — light + dark variants
// All inline styles read from window.GeneaTokens; swapping the object + a key-remount switches theme app-wide.

const LIGHT_TOKENS = {
  // Brand
  BRAND_BLUE: '#009CDE',
  BRAND_NAVY: '#003865',
  // Primary
  PRIMARY: '#2271EA',
  PRIMARY_HOVER: '#1A5DC7',
  PRIMARY_TEXT: '#1557B0',
  PRIMARY_BG: '#F0F6FE',
  CONTROL_ACTIVE: '#EDF4FE',
  // Surfaces
  BG_LAYOUT: '#F5F6FA',
  BG_CONTAINER: '#FFFFFF',
  BG_ELEVATED: '#FFFFFF',
  BG_DASHED: '#FAFBFC',
  // Borders
  BORDER: '#E0E0E0',
  BORDER_SPLIT: '#F0F0F0',
  // Foreground
  FG_HEADING: 'rgba(2,11,23,0.88)',
  FG_BODY: 'rgba(2,11,23,0.88)',
  FG_SECONDARY: 'rgba(2,11,23,0.65)',
  FG_DESCRIPTION: 'rgba(2,11,23,0.45)',
  FG_DISABLED: 'rgba(2,11,23,0.25)',
  // Status
  SUCCESS: '#57B867',
  WARNING: '#F3C33F',
  ERROR: '#D44C46',
  LINK: '#2271EA',
  ICON: 'rgba(0,0,0,0.45)',
  // Avatar
  AVATAR_BG: '#E0EDFD',
  // Effects
  CARD_SHADOW: '0 2px 4px rgba(0,0,0,0.02), 0 1px 6px -1px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.031)',
  MD_SHADOW: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
};

const DARK_TOKENS = {
  // Brand (unchanged, brand colors stay)
  BRAND_BLUE: '#009CDE',
  BRAND_NAVY: '#003865',
  // Primary — slightly brighter so it pops on dark
  PRIMARY: '#4A8EF0',
  PRIMARY_HOVER: '#6BA4F4',
  PRIMARY_TEXT: '#7BB0F5',
  PRIMARY_BG: 'rgba(74,142,240,0.12)',
  CONTROL_ACTIVE: 'rgba(74,142,240,0.16)',
  // Surfaces — Genea dark hierarchy: layout < container < elevated
  BG_LAYOUT: '#0F1419',
  BG_CONTAINER: '#171C23',
  BG_ELEVATED: '#1E242C',
  BG_DASHED: '#13181F',
  // Borders
  BORDER: '#2A3038',
  BORDER_SPLIT: '#23282F',
  // Foreground
  FG_HEADING: 'rgba(245,247,250,0.92)',
  FG_BODY: 'rgba(245,247,250,0.86)',
  FG_SECONDARY: 'rgba(245,247,250,0.62)',
  FG_DESCRIPTION: 'rgba(245,247,250,0.42)',
  FG_DISABLED: 'rgba(245,247,250,0.22)',
  // Status (slightly desaturated for dark)
  SUCCESS: '#67C277',
  WARNING: '#F4D060',
  ERROR: '#E26B66',
  LINK: '#4A8EF0',
  ICON: 'rgba(245,247,250,0.55)',
  // Avatar
  AVATAR_BG: 'rgba(74,142,240,0.18)',
  // Effects
  CARD_SHADOW: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)',
  MD_SHADOW: '0 6px 16px 0 rgba(0,0,0,0.6), 0 3px 6px -4px rgba(0,0,0,0.4), 0 9px 28px 8px rgba(0,0,0,0.3)',
};

// Earth-muted chart palette (product's signature) — same in both
const CHART = {
  blue:   '#5A90AD',
  green:  '#7FA85A',
  red:    '#B8705A',
  purple: '#7C7EC9',
  yellow: '#C49A3C',
  teal:   '#4E9E8E',
};

const FONT = "'Cerebri Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

window.applyTheme = function(theme) {
  // Resolve "system" to actual mode
  let resolved = theme;
  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  const tokens = resolved === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  window.GeneaTokens = { ...tokens, CHART, FONT };
  document.body.style.background = tokens.BG_LAYOUT;
  document.body.style.color = tokens.FG_HEADING;
  document.documentElement.dataset.theme = resolved;
};

// Initialize light by default
window.applyTheme('light');
