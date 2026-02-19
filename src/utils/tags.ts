export function normalizeTag(raw: string) {
  return raw.trim().replace(/^#/, '');
}

export function splitTags(input: string) {
  return input
    .split(/[,，\n]/g)
    .map(normalizeTag)
    .filter(Boolean);
}

export function isImeComposing(e: React.KeyboardEvent) {
  const native = e.nativeEvent as KeyboardEvent & { isComposing?: boolean };
  return !!native.isComposing;
}
