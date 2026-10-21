export const palette = {
  accent: 0xece41f,
  ink: 0xffffff,
  muted: 0xa3a3a3,
  line: 0x262626,
  lineStrong: 0x3a3a3a,
};

export function monoFont() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim();
  return family ? `${family}, monospace` : "monospace";
}
