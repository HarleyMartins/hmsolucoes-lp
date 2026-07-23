// Mistura uma cor hex com branco ou preto para gerar variações claras/escuras.
// Usado para transformar as duas cores definidas no admin (primária/secundária)
// em uma paleta completa (DEFAULT, light, dark) sem precisar o admin escolher 6 cores.
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hex, target, amount) {
  const c = hexToRgb(hex);
  const t = hexToRgb(target);
  return rgbToHex({
    r: c.r + (t.r - c.r) * amount,
    g: c.g + (t.g - c.g) * amount,
    b: c.b + (t.b - c.b) * amount,
  });
}

export function lighten(hex, amount = 0.25) {
  return mix(hex, '#ffffff', amount);
}

export function darken(hex, amount = 0.25) {
  return mix(hex, '#000000', amount);
}

// Gera as 6 variáveis CSS de cor a partir das duas cores base do tema
export function buildThemeVars(primary, secondary) {
  return {
    '--color-primary': primary,
    '--color-primary-light': lighten(primary, 0.28),
    '--color-primary-dark': darken(primary, 0.22),
    '--color-secondary': secondary,
    '--color-secondary-light': lighten(secondary, 0.22),
    '--color-secondary-dark': darken(secondary, 0.35),
  };
}
