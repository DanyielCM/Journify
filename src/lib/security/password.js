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
  // Hashing
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(pin, salt);
  const hash = Buffer.from(derivedKey).toString('hex');
  return `${salt}:${hash}`;
}
