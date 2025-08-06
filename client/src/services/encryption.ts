// Client-side encryption using WebCrypto API
class EncryptionService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(plaintext: string, masterPassword: string): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const key = await this.deriveKey(masterPassword, salt);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      this.encoder.encode(plaintext)
    );

    // Combine salt, iv, and encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(encryptedData: string, masterPassword: string): Promise<string> {
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);

    const key = await this.deriveKey(masterPassword, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return this.decoder.decode(decrypted);
  }

  generateSecurePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    return Array.from(array, byte => charset[byte % charset.length]).join('');
  }
}

export const encryptionService = new EncryptionService();