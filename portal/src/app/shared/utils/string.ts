export function getLiteralFromIndex(index: number): string {
  const charCode = 'a'.charCodeAt(0);

  const b = [index];
  let sp;
  let out;
  let i;
  let div;

  sp = 0;

  while (sp < b.length) {
    if (b[sp] > 25) {
      div = Math.floor(b[sp] / 26);
      b[sp + 1] = div - 1;
      b[sp] %= 26;
    }
    sp += 1;
  }

  out = '';

  for (i = 0; i < b.length; i += 1) {
    out = String.fromCharCode(charCode + b[i]) + out;
  }

  return out.toUpperCase();
}

export function normalizeText(text: string): string {
  if (!text) return '';

  return text
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
