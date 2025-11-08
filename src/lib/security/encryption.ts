// Security utilities for Introspect V3
// Phase 2: State Management & Security

/**
 * Simple encryption/decryption for localStorage
 * Uses Web Crypto API for AES-GCM encryption
 * 
 * Note: For production, consider using a more robust encryption library
 * or server-side encryption for sensitive data
 */

const ENCRYPTION_KEY_NAME = 'introspect-encryption-key'

// Generate or retrieve encryption key
async function getEncryptionKey(): Promise<CryptoKey> {
  // Check if key exists in sessionStorage (temporary, per-session)
  const existingKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME)
  
  if (existingKey) {
    // Import existing key
    const keyData = Uint8Array.from(atob(existingKey), c => c.charCodeAt(0))
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    )
  }
  
  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  
  // Export and store in sessionStorage
  const exported = await crypto.subtle.exportKey('raw', key)
  const keyString = btoa(String.fromCharCode(...new Uint8Array(exported)))
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, keyString)
  
  return key
}

/**
 * Encrypt a string value for localStorage storage
 */
export async function encrypt(value: string): Promise<string> {
  try {
    const key = await getEncryptionKey()
    const encoder = new TextEncoder()
    const data = encoder.encode(value)
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    )
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption error:', error)
    // Fallback to base64 encoding if encryption fails
    return btoa(value)
  }
}

/**
 * Decrypt a string value from localStorage
 */
export async function decrypt(encryptedValue: string): Promise<string> {
  try {
    const key = await getEncryptionKey()
    
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0))
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )
    
    // Convert to string
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    // Fallback: try to decode as base64
    try {
      return atob(encryptedValue)
    } catch {
      return ''
    }
  }
}

// Synchronous versions for Zustand middleware (simplified)
// These use a simpler approach for compatibility with Zustand's synchronous storage

let encryptionKeyCache: string | null = null

function getSimpleKey(): string {
  if (encryptionKeyCache) return encryptionKeyCache
  
  // Generate a simple key from sessionStorage or create one
  let key = sessionStorage.getItem(ENCRYPTION_KEY_NAME)
  if (!key) {
    // Generate a random key
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    key = btoa(String.fromCharCode(...array))
    sessionStorage.setItem(ENCRYPTION_KEY_NAME, key)
  }
  encryptionKeyCache = key
  return key
}

/**
 * Simple synchronous encryption (XOR-based for compatibility)
 * Note: This is less secure than AES-GCM but works synchronously
 * For production, consider using IndexedDB with async encryption
 */
export function encryptSync(value: string): string {
  try {
    const key = getSimpleKey()
    const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0))
    const valueBytes = new TextEncoder().encode(value)
    
    // Simple XOR encryption (not cryptographically secure, but obfuscates data)
    const encrypted = new Uint8Array(valueBytes.length)
    for (let i = 0; i < valueBytes.length; i++) {
      encrypted[i] = valueBytes[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return btoa(String.fromCharCode(...encrypted))
  } catch (error) {
    console.error('Sync encryption error:', error)
    return btoa(value)
  }
}

/**
 * Simple synchronous decryption
 */
export function decryptSync(encryptedValue: string): string {
  try {
    const key = getSimpleKey()
    const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0))
    const encrypted = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0))
    
    // XOR decryption (same as encryption)
    const decrypted = new Uint8Array(encrypted.length)
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length]
    }
    
    return new TextDecoder().decode(decrypted)
  } catch (error) {
    console.error('Sync decryption error:', error)
    try {
      return atob(encryptedValue)
    } catch {
      return ''
    }
  }
}

