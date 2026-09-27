/**
 * Standard SHA-256 Hash utility using native Web Crypto API
 * Works natively in all modern browsers and Node.js environments.
 */
export async function hashPassword(text) {
  if (!text) return '';
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Pre-computed SHA-256 hash of default password 'kmitl'
 */
export const DEFAULT_STUDENT_PASSWORD_HASH = '3048458edca9f5e15d985e6b9976b0bb8348aeae55d95c48b705064815a3de54';
