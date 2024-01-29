import CryptoJS from 'crypto-js';

export function decryptContent(
  encryptedContent: string,
  passkey: string
): string | null {
  try {
    // Extract the salt and IV from the encrypted content
    const salt = CryptoJS.enc.Hex.parse(encryptedContent.slice(0, 32));
    const iv = CryptoJS.enc.Hex.parse(encryptedContent.slice(32, 64));

    // Extract the encrypted data
    const encryptedData = encryptedContent.substring(64);

    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(passkey, salt, {
      keySize: 256 / 32,
      iterations: 4096,
    });

    // Attempt to decrypt the content
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    // Convert the decrypted result to a string
    const decryptedContent = decrypted.toString(CryptoJS.enc.Utf8);

    // Check if decryption was successful
    if (decryptedContent !== undefined && decryptedContent !== '') {
      return decryptedContent;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
