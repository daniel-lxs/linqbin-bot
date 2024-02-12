export async function hashPasskey(passkey: string) {
  const hash = new Bun.CryptoHasher('sha256');
  hash.update(passkey);
  const hashHex = hash.digest('hex');
  return hashHex;
}
