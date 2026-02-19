export const CALLOUT_TYPES = ['normal', 'info', 'warn', 'danger'] as const;
export type CalloutType = (typeof CALLOUT_TYPES)[number];
export function isCalloutType(v: any): v is CalloutType {
  return CALLOUT_TYPES.includes(v);
}

export const HIGHLIGHT_COLORS = ['PEACH', 'MINT', 'LAVENDER', 'SKY', 'LEMON'] as const;
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];
export function isHighlightColor(v: any): v is HighlightColor {
  return HIGHLIGHT_COLORS.includes(v);
}

export type ToolbarButtonProps = {
  content: string;
  setContent: (v: string) => void;
  textareaId: string;
};

export const HIGHLIGHT_PREVIEW_RGBA: Record<HighlightColor, string> = {
  PEACH: 'rgba(255, 112, 112, 0.55)',
  MINT: 'rgba(112, 255, 112, 0.55)',
  LAVENDER: 'rgba(190, 120, 255, 0.55)',
  SKY: 'rgba(102, 179, 255, 0.55)',
  LEMON: 'rgba(255, 255, 102, 0.55)',
};

export const CALLOUT_PREVIEW_CLASS: Record<CalloutType, string> = {
  normal: 'bg-secondary',
  info: 'bg-informative',
  warn: 'bg-warning',
  danger: 'bg-destructive',
};
