const TAG_RE = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][A-Za-z0-9:-]*\b[^>]*>/g;

function escapeTag(s: string) {
  return s.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function escapeHtmlExceptCustom(input: string, allowedTags: string[]) {
  const allowed = new Set(allowedTags.map((t) => t.toLowerCase()));

  return input.replace(TAG_RE, (m) => {
    if (m.startsWith('<!--') || m.startsWith('<!')) return escapeTag(m);

    const nameMatch = m.match(/^<\/?\s*([A-Za-z][A-Za-z0-9:-]*)/);
    const name = nameMatch?.[1]?.toLowerCase();
    if (!name) return escapeTag(m);

    if ((name === 'http' || name === 'https') && m.slice(nameMatch![0].length).startsWith('://')) {
      return m;
    }

    if (allowed.has(name)) return m;
    return escapeTag(m);
  });
}
