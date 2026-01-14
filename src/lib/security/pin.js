import crypto from 'crypto';

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export async function hashPin4(pin) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(pin, salt);
  const hash = Buffer.from(derivedKey).toString('hex');
  return `${salt}:${hash}`;
}

export async function verifyPin4(pin, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const parts = stored.split(':');
  if (parts.length !== 2) return false;

  const [salt, expectedHash] = parts;
  const derivedKey = await scryptAsync(pin, salt);
  const actualHash = Buffer.from(derivedKey).toString('hex');

  const a = Buffer.from(actualHash, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}
