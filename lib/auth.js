const SECRET = process.env.AUTH_SECRET || 'dev-secret-troque-em-producao';
export const AUTH_COOKIE_NAME = 'hm_admin_session';

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSign(message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toHex(signature);
}

// Gera um token assinado (HMAC via Web Crypto, funciona em Edge e Node)
export async function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  const signature = await hmacSign(payload);
  return btoa(`${payload}::${signature}`);
}

export async function isValidSessionToken(token) {
  try {
    const decoded = atob(token);
    const [payload, signature] = decoded.split('::');
    if (!payload || !signature) return false;
    const expected = await hmacSign(payload);
    return expected === signature;
  } catch {
    return false;
  }
}

export function checkPassword(password) {
  const correct = process.env.ADMIN_PASSWORD || 'admin123';
  return password === correct;
}
