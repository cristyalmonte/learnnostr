# Module 9: Security & Privacy in Nostr

!!! info "Module Overview"
    **Duration**: 8-10 hours  
    **Level**: Advanced  
    **Prerequisites**: Modules 1-8 completed  
    **Goal**: Implement comprehensive security and privacy measures for Nostr applications

## 📋 Learning Objectives

By the end of this module, you will:

- ✅ Implement end-to-end encryption using NIP-44
- ✅ Secure private key management and storage (NIP-49)
- ✅ Build private direct messaging systems (NIP-17)
- ✅ Implement authentication and authorization (NIP-42, NIP-98)
- ✅ Understand and prevent common attack vectors
- ✅ Implement proof-of-work anti-spam measures (NIP-13)
- ✅ Secure remote signing workflows (NIP-46)
- ✅ Build privacy-preserving applications

## 🔒 Core Security Principles in Nostr

### The Security Model

Nostr's security is built on several key principles:

1. **Cryptographic Identity**: Every user is identified by a public key
2. **Message Integrity**: All events are signed with private keys
3. **No Central Authority**: Security doesn't depend on trusted servers
4. **Public by Default**: Most content is designed to be public
5. **Opt-in Privacy**: Privacy features must be explicitly implemented

### Threat Model

Understanding what Nostr protects against (and what it doesn't):

| Threat | Protected | Notes |
|--------|-----------|-------|
| Message tampering | ✅ Yes | Signatures prevent modification |
| Identity spoofing | ✅ Yes | Cryptographic signatures |
| Censorship | ✅ Partial | Multiple relays provide redundancy |
| Metadata leakage | ❌ No | Created_at, pubkeys are visible |
| Network analysis | ❌ Limited | Relay connections can be monitored |
| Content privacy | ❌ No | Without encryption, content is public |
| Key compromise | ❌ No | Compromised keys cannot be recovered |

## 🔐 Encryption in Nostr

### NIP-04 vs NIP-44: Understanding the Evolution

#### NIP-04 (Deprecated)

The original encryption standard had several security flaws:

```javascript
// NIP-04 (DO NOT USE - shown for educational purposes)
import * as secp from '@noble/secp256k1';
import crypto from 'crypto';

// DEPRECATED: Security vulnerabilities
function nip04Encrypt(privkey, pubkey, text) {
  const key = secp.getSharedSecret(privkey, '02' + pubkey);
  const normalizedKey = key.slice(1, 33); // Only X coordinate
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', normalizedKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return encrypted + '?iv=' + iv.toString('base64');
}
```

**Why NIP-04 is deprecated:**
- No authentication (vulnerable to tampering)
- Padding oracle attacks possible
- Weak IV generation in some implementations
- No forward secrecy
- Metadata leakage

#### NIP-44: Modern Encryption Standard

NIP-44 is the current standard using XChaCha20-Poly1305:

```javascript
import { nip44 } from 'nostr-tools';
import { getPublicKey, generateSecretKey } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';

class SecureMessaging {
  constructor(privateKey) {
    this.privateKey = privateKey;
    this.publicKey = getPublicKey(privateKey);
  }

  // Encrypt a message to a recipient
  encrypt(recipientPubkey, plaintext) {
    try {
      // Generate conversation key (HKDF-based)
      const conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(this.privateKey),
        recipientPubkey
      );
      
      // Encrypt with XChaCha20-Poly1305
      const ciphertext = nip44.v2.encrypt(
        plaintext,
        conversationKey
      );
      
      return ciphertext;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  // Decrypt a message from a sender
  decrypt(senderPubkey, ciphertext) {
    try {
      const conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(this.privateKey),
        senderPubkey
      );
      
      const plaintext = nip44.v2.decrypt(
        ciphertext,
        conversationKey
      );
      
      return plaintext;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt message');
    }
  }
}

// Usage
const alice = new SecureMessaging(generateSecretKey());
const bob = new SecureMessaging(generateSecretKey());

const encrypted = alice.encrypt(bob.publicKey, "Secret message");
const decrypted = bob.decrypt(alice.publicKey, encrypted);

console.log('Decrypted:', decrypted); // "Secret message"
```

### NIP-44 Security Features

1. **Authenticated Encryption**: ChaCha20-Poly1305 provides both confidentiality and authenticity
2. **Conversation Keys**: Derived using HKDF for proper key separation
3. **Random Nonces**: 24-byte nonces prevent replay attacks
4. **Padding**: Leaks less information about message length
5. **No Malleable Encryption**: Cannot modify ciphertext without detection

## 💬 Private Direct Messages (NIP-17)

NIP-17 provides metadata-hiding for direct messages using gift wrapping:

```javascript
import { nip44, getPublicKey, generateSecretKey, finalizeEvent } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';

class PrivateMessaging {
  // Create a "rumor" (unsigned event)
  createRumor(senderPubkey, recipientPubkey, content) {
    return {
      pubkey: senderPubkey,
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800), // Random time within 2 days
      kind: 14, // Private direct message
      tags: [['p', recipientPubkey]],
      content: content,
    };
  }

  // Seal the rumor (sign and encrypt)
  sealRumor(rumor, senderPrivkey, recipientPubkey) {
    // Sign the rumor
    const signedRumor = finalizeEvent(rumor, senderPrivkey);
    
    // Encrypt the signed rumor
    const conversationKey = nip44.v2.utils.getConversationKey(
      bytesToHex(senderPrivkey),
      recipientPubkey
    );
    
    const sealContent = nip44.v2.encrypt(
      JSON.stringify(signedRumor),
      conversationKey
    );

    // Create seal event
    return {
      pubkey: getPublicKey(senderPrivkey),
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800),
      kind: 13, // Seal
      tags: [],
      content: sealContent,
    };
  }

  // Gift wrap the seal (final layer)
  giftWrap(seal, senderPrivkey, recipientPubkey) {
    // Generate ephemeral key for gift wrap
    const ephemeralKey = generateSecretKey();
    const ephemeralPubkey = getPublicKey(ephemeralKey);
    
    // Encrypt seal with ephemeral key
    const conversationKey = nip44.v2.utils.getConversationKey(
      bytesToHex(ephemeralKey),
      recipientPubkey
    );
    
    const signedSeal = finalizeEvent(seal, senderPrivkey);
    const giftWrapContent = nip44.v2.encrypt(
      JSON.stringify(signedSeal),
      conversationKey
    );

    // Create gift wrap event
    const giftWrapEvent = {
      pubkey: ephemeralPubkey,
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800),
      kind: 1059, // Gift wrap
      tags: [['p', recipientPubkey]],
      content: giftWrapContent,
    };

    return finalizeEvent(giftWrapEvent, ephemeralKey);
  }

  // Send private DM
  async sendPrivateDM(relay, senderPrivkey, recipientPubkey, message) {
    const senderPubkey = getPublicKey(senderPrivkey);
    
    // Create rumor
    const rumor = this.createRumor(senderPubkey, recipientPubkey, message);
    
    // Seal it
    const seal = this.sealRumor(rumor, senderPrivkey, recipientPubkey);
    
    // Gift wrap it
    const giftWrap = this.giftWrap(seal, senderPrivkey, recipientPubkey);
    
    // Publish to relay
    await relay.publish(giftWrap);
    
    return giftWrap;
  }

  // Unwrap and decrypt received DM
  unwrapGiftWrap(giftWrapEvent, recipientPrivkey) {
    try {
      // Decrypt gift wrap to get seal
      const conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(recipientPrivkey),
        giftWrapEvent.pubkey
      );
      
      const sealJson = nip44.v2.decrypt(giftWrapEvent.content, conversationKey);
      const seal = JSON.parse(sealJson);
      
      // Decrypt seal to get rumor
      const rumorConversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(recipientPrivkey),
        seal.pubkey
      );
      
      const rumorJson = nip44.v2.decrypt(seal.content, rumorConversationKey);
      const rumor = JSON.parse(rumorJson);
      
      return rumor;
    } catch (error) {
      console.error('Failed to unwrap gift:', error);
      return null;
    }
  }
}
```

### Why Gift Wrapping?

Gift wrapping provides several privacy benefits:

1. **Sender Anonymity**: Ephemeral keys hide the sender's identity from relays
2. **Recipient Privacy**: Only recipient can decrypt
3. **Metadata Protection**: Random timestamps hide when messages were actually sent
4. **Relay Privacy**: Relays can't see content or true sender
5. **Deniability**: Messages can't be proven to be from sender

## 🔑 Private Key Security

### NIP-49: Private Key Encryption

Never store private keys in plaintext. Use NIP-49 for encrypted storage:

```javascript
import { nip49 } from 'nostr-tools';
import { generateSecretKey } from 'nostr-tools';

class KeyManagement {
  // Encrypt private key with password
  encryptPrivateKey(privateKey, password, logN = 16) {
    try {
      // logN determines computation difficulty
      // 16 = 64 MiB, ~100ms on fast computer
      // 18 = 256 MiB
      // 20 = 1 GiB, ~2 seconds
      
      const encrypted = nip49.encrypt(
        privateKey,
        password,
        logN,
        0x02 // Key security byte: 0x02 = unknown security
      );
      
      return encrypted; // Returns ncryptsec1... string
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  // Decrypt private key with password
  decryptPrivateKey(ncryptsec, password) {
    try {
      const privateKey = nip49.decrypt(ncryptsec, password);
      return privateKey;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Invalid password or corrupted key');
    }
  }

  // Secure key generation and storage
  async generateAndStoreKey(password) {
    const privateKey = generateSecretKey();
    const encrypted = this.encryptPrivateKey(privateKey, password);
    
    // Store encrypted key securely
    localStorage.setItem('nostr_encrypted_key', encrypted);
    
    // NEVER store plaintext key
    // Clear from memory
    privateKey.fill(0);
    
    return encrypted;
  }

  // Load and decrypt key
  async loadKey(password) {
    const encrypted = localStorage.getItem('nostr_encrypted_key');
    if (!encrypted) {
      throw new Error('No stored key found');
    }
    
    const privateKey = this.decryptPrivateKey(encrypted, password);
    return privateKey;
  }
}

// Usage
const keyMgmt = new KeyManagement();

// First time setup
const encrypted = await keyMgmt.generateAndStoreKey('strong-password-123');
console.log('Encrypted key:', encrypted);

// Later, load the key
const privateKey = await keyMgmt.loadKey('strong-password-123');
```

### Key Storage Best Practices

```javascript
class SecureKeyStorage {
  // Different strategies for different platforms

  // Browser: Use IndexedDB with encryption
  async storeBrowser(encryptedKey, keyName = 'default') {
    const db = await this.openDB();
    const tx = db.transaction('keys', 'readwrite');
    await tx.objectStore('keys').put({
      name: keyName,
      encrypted: encryptedKey,
      created: Date.now()
    });
  }

  // Mobile: Use secure keychain/keystore
  async storeMobile(encryptedKey) {
    if (typeof window !== 'undefined' && window.SecureStorage) {
      // React Native Secure Storage example
      await window.SecureStorage.setItem('nostr_key', encryptedKey);
    }
  }

  // Desktop: Use OS keychain
  async storeDesktop(encryptedKey) {
    // Electron example
    if (typeof require !== 'undefined') {
      const keytar = require('keytar');
      await keytar.setPassword('nostr-app', 'default-key', encryptedKey);
    }
  }

  // Hardware wallet integration
  async useHardwareWallet() {
    // For maximum security, use hardware signing devices
    // This would integrate with NIP-46 for remote signing
    return {
      signEvent: async (event) => {
        // Send to hardware device for signing
        // Device never exposes private key
      }
    };
  }
}
```

## 🛡️ Authentication & Authorization

### NIP-42: Relay Authentication

Relays can require authentication before allowing access:

```javascript
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';

class RelayAuth {
  async authenticate(relay, privateKey) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Authentication timeout'));
      }, 10000);

      relay.on('auth', async (challenge) => {
        clearTimeout(timeout);
        
        // Create authentication event
        const authEvent = {
          kind: 22242,
          created_at: Math.floor(Date.now() / 1000),
          tags: [
            ['relay', relay.url],
            ['challenge', challenge]
          ],
          content: ''
        };

        const signedAuth = finalizeEvent(authEvent, privateKey);
        
        // Send AUTH response
        relay.auth(signedAuth);
        
        resolve();
      });
    });
  }

  async connectWithAuth(relayUrl, privateKey) {
    const relay = await Relay.connect(relayUrl);
    
    try {
      await this.authenticate(relay, privateKey);
      console.log('Authenticated successfully');
      return relay;
    } catch (error) {
      console.error('Authentication failed:', error);
      relay.close();
      throw error;
    }
  }
}

// Usage
const auth = new RelayAuth();
const relay = await auth.connectWithAuth(
  'wss://private-relay.example.com',
  myPrivateKey
);
```

### NIP-98: HTTP Authentication

For HTTP APIs that need Nostr-based auth:

```javascript
import { finalizeEvent, getPublicKey } from 'nostr-tools';

class HTTPAuth {
  // Create authorization header
  async createAuthHeader(method, url, privateKey, payload = null) {
    const event = {
      kind: 27235,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['u', url],
        ['method', method]
      ],
      content: ''
    };

    // Add payload hash if present
    if (payload) {
      const hash = await this.sha256(payload);
      event.tags.push(['payload', hash]);
    }

    const signedEvent = finalizeEvent(event, privateKey);
    const base64Event = btoa(JSON.stringify(signedEvent));
    
    return `Nostr ${base64Event}`;
  }

  async sha256(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Make authenticated request
  async authenticatedFetch(url, method, privateKey, body = null) {
    const authHeader = await this.createAuthHeader(method, url, privateKey, body);
    
    const options = {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = body;
    }

    const response = await fetch(url, options);
    
    if (response.status === 401) {
      throw new Error('Authentication failed');
    }

    return response;
  }
}

// Usage
const httpAuth = new HTTPAuth();
const response = await httpAuth.authenticatedFetch(
  'https://api.example.com/upload',
  'POST',
  myPrivateKey,
  JSON.stringify({ file: 'data' })
);
```

## 🚫 Anti-Spam & Abuse Prevention

### NIP-13: Proof of Work

Implement PoW to make spam economically expensive:

```javascript
import { getEventHash } from 'nostr-tools';

class ProofOfWork {
  // Mine event to meet difficulty target
  async mineEvent(event, targetDifficulty) {
    let nonce = 0;
    const maxIterations = 1000000;
    
    while (nonce < maxIterations) {
      // Add nonce tag
      const eventWithNonce = {
        ...event,
        tags: [
          ...event.tags.filter(t => t[0] !== 'nonce'),
          ['nonce', nonce.toString(), targetDifficulty.toString()]
        ]
      };

      // Calculate hash
      const id = getEventHash(eventWithNonce);
      
      // Check if meets difficulty
      const difficulty = this.countLeadingZeroBits(id);
      
      if (difficulty >= targetDifficulty) {
        return eventWithNonce;
      }

      nonce++;
    }

    throw new Error(`Could not find valid nonce after ${maxIterations} attempts`);
  }

  // Count leading zero bits in hex string
  countLeadingZeroBits(hex) {
    let count = 0;
    
    for (let i = 0; i < hex.length; i++) {
      const nibble = parseInt(hex[i], 16);
      
      if (nibble === 0) {
        count += 4;
      } else {
        // Count leading zeros in this nibble
        count += Math.clz32(nibble) - 28;
        break;
      }
    }

    return count;
  }

  // Verify PoW
  verifyPoW(event, requiredDifficulty) {
    const nonceTag = event.tags.find(t => t[0] === 'nonce');
    
    if (!nonceTag) {
      return false;
    }

    const claimedDifficulty = parseInt(nonceTag[2]);
    
    if (claimedDifficulty < requiredDifficulty) {
      return false;
    }

    const difficulty = this.countLeadingZeroBits(event.id);
    return difficulty >= requiredDifficulty;
  }
}

// Usage
const pow = new ProofOfWork();

const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "This note has proof of work",
  pubkey: myPubkey
};

// Mine with difficulty 20 (~1 second on modern CPU)
const minedEvent = await pow.mineEvent(event, 20);
console.log('Mined event:', minedEvent);

// Verify
const isValid = pow.verifyPoW(minedEvent, 20);
console.log('PoW valid:', isValid);
```

### Rate Limiting and Access Control

```javascript
class SecurityMiddleware {
  constructor() {
    this.rateLimits = new Map();
    this.blacklist = new Set();
  }

  // Rate limiting by pubkey
  checkRateLimit(pubkey, maxPerMinute = 10) {
    const now = Date.now();
    const key = `${pubkey}:${Math.floor(now / 60000)}`;
    
    const count = this.rateLimits.get(key) || 0;
    
    if (count >= maxPerMinute) {
      return {
        allowed: false,
        reason: 'rate-limited: slow down there chief'
      };
    }

    this.rateLimits.set(key, count + 1);
    
    // Cleanup old entries
    this.cleanupRateLimits();
    
    return { allowed: true };
  }

  cleanupRateLimits() {
    const now = Date.now();
    const cutoff = now - 120000; // 2 minutes ago
    
    for (const [key, _] of this.rateLimits) {
      const timestamp = parseInt(key.split(':')[1]) * 60000;
      if (timestamp < cutoff) {
        this.rateLimits.delete(key);
      }
    }
  }

  // Content filtering
  checkContent(event) {
    const content = event.content.toLowerCase();
    
    // Check for spam patterns
    const spamPatterns = [
      /\b(viagra|cialis|casino)\b/i,
      /(https?:\/\/[^\s]+){5,}/, // Multiple URLs
      /(.)\1{10,}/ // Repeated characters
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(content)) {
        return {
          allowed: false,
          reason: 'invalid: content appears to be spam'
        };
      }
    }

    return { allowed: true };
  }

  // Verify event signature
  verifySignature(event) {
    try {
      // Verify the event signature matches
      const hash = getEventHash(event);
      
      if (hash !== event.id) {
        return {
          allowed: false,
          reason: 'invalid: id does not match hash'
        };
      }

      // Verify signature
      const isValid = verifySignature(event);
      
      if (!isValid) {
        return {
          allowed: false,
          reason: 'invalid: signature verification failed'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: 'invalid: signature check error'
      };
    }
  }

  // Check event against all security rules
  async checkEvent(event) {
    // 1. Verify signature
    const sigCheck = this.verifySignature(event);
    if (!sigCheck.allowed) return sigCheck;

    // 2. Check blacklist
    if (this.blacklist.has(event.pubkey)) {
      return {
        allowed: false,
        reason: 'blocked: pubkey is banned'
      };
    }

    // 3. Rate limiting
    const rateCheck = this.checkRateLimit(event.pubkey);
    if (!rateCheck.allowed) return rateCheck;

    // 4. Content filtering
    const contentCheck = this.checkContent(event);
    if (!contentCheck.allowed) return contentCheck;

    // 5. PoW check (if required)
    if (this.powRequired) {
      const pow = new ProofOfWork();
      if (!pow.verifyPoW(event, this.powRequired)) {
        return {
          allowed: false,
          reason: `pow: difficulty ${this.powRequired} required`
        };
      }
    }

    return { allowed: true };
  }
}
```

## 🎭 Remote Signing (NIP-46)

Nostr Connect allows applications to request signatures without accessing private keys:

```javascript
import { finalizeEvent, nip04, getPublicKey } from 'nostr-tools';

class NostrConnect {
  constructor(bunkerUrl) {
    this.bunkerUrl = bunkerUrl;
    this.clientSecret = generateSecretKey();
    this.clientPubkey = getPublicKey(this.clientSecret);
    this.remotePubkey = null;
    this.relay = null;
  }

  // Parse bunker URL
  parseBunkerUrl(url) {
    // bunker://<remote-signer-pubkey>?relay=<relay-url>&secret=<secret>
    const parsed = new URL(url);
    return {
      remotePubkey: parsed.hostname,
      relay: parsed.searchParams.get('relay'),
      secret: parsed.searchParams.get('secret')
    };
  }

  // Connect to remote signer
  async connect() {
    const { remotePubkey, relay: relayUrl, secret } = this.parseBunkerUrl(this.bunkerUrl);
    
    this.remotePubkey = remotePubkey;
    this.relay = await Relay.connect(relayUrl);

    // Send connect request
    const request = {
      id: this.generateId(),
      method: 'connect',
      params: [this.clientPubkey, secret]
    };

    const response = await this.sendRequest(request);
    
    if (response.result !== 'ack') {
      throw new Error('Connection rejected');
    }

    // Get user's public key
    const pubkeyResponse = await this.sendRequest({
      id: this.generateId(),
      method: 'get_public_key',
      params: []
    });

    this.userPubkey = pubkeyResponse.result;
    return this.userPubkey;
  }

  // Send encrypted request
  async sendRequest(request) {
    const encrypted = await nip04.encrypt(
      this.clientSecret,
      this.remotePubkey,
      JSON.stringify(request)
    );

    const event = {
      kind: 24133,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', this.remotePubkey]],
      content: encrypted,
      pubkey: this.clientPubkey
    };

    const signed = finalizeEvent(event, this.clientSecret);
    await this.relay.publish(signed);

    // Wait for response
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      const sub = this.relay.subscribe([{
        kinds: [24133],
        '#p': [this.clientPubkey],
        authors: [this.remotePubkey]
      }]);

      sub.on('event', async (event) => {
        const decrypted = await nip04.decrypt(
          this.clientSecret,
          this.remotePubkey,
          event.content
        );
        
        const response = JSON.parse(decrypted);
        
        if (response.id === request.id) {
          clearTimeout(timeout);
          sub.unsub();
          resolve(response);
        }
      });
    });
  }

  // Sign event remotely
  async signEvent(unsignedEvent) {
    const response = await this.sendRequest({
      id: this.generateId(),
      method: 'sign_event',
      params: [JSON.stringify(unsignedEvent)]
    });

    return JSON.parse(response.result);
  }

  generateId() {
    return Math.random().toString(36).substring(7);
  }
}

// Usage
const bunker = new NostrConnect('bunker://abc...?relay=wss://relay.com&secret=xyz');
await bunker.connect();

const unsignedEvent = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Signed remotely!'
};

const signedEvent = await bunker.signEvent(unsignedEvent);
```

## 🔒 Complete Security Checklist

### Application Security

```markdown
## Client Application Security Checklist

### Key Management
- [ ] Never log or display private keys
- [ ] Use NIP-49 for key encryption when storing
- [ ] Implement secure key derivation (NIP-06)
- [ ] Offer hardware wallet support (NIP-46)
- [ ] Zero out key material after use
- [ ] Use secure random number generation

### Encryption
- [ ] Use NIP-44 for all new encryption (never NIP-04)
- [ ] Implement gift wrapping for DMs (NIP-17)
- [ ] Verify encryption before sending sensitive data
- [ ] Handle decryption errors gracefully
- [ ] Clear decrypted content from memory when done

### Authentication
- [ ] Implement NIP-42 for relay authentication
- [ ] Use NIP-98 for HTTP API authentication
- [ ] Validate all incoming events
- [ ] Verify signatures before processing
- [ ] Check event timestamps for reasonableness

### Network Security
- [ ] Use WSS (WebSocket Secure) for relay connections
- [ ] Implement connection timeouts
- [ ] Validate relay URLs before connecting
- [ ] Handle connection errors gracefully
- [ ] Implement exponential backoff for reconnection

### Content Security
- [ ] Sanitize all user input
- [ ] Validate event content before display
- [ ] Implement content filtering options
- [ ] Check for malicious links
- [ ] Escape HTML in user content

### Privacy
- [ ] Randomize timestamps for private messages (NIP-17)
- [ ] Use multiple relays to reduce metadata leakage
- [ ] Implement local caching to reduce relay queries
- [ ] Offer Tor/proxy support
- [ ] Minimize unnecessary metadata

### Anti-Spam
- [ ] Implement rate limiting
- [ ] Support PoW requirements (NIP-13)
- [ ] Offer content filtering
- [ ] Implement mute/block functionality
- [ ] Support relay-based moderation
```

### Relay Security

```markdown
## Relay Security Checklist

### Access Control
- [ ] Implement NIP-42 authentication
- [ ] Support IP-based rate limiting
- [ ] Implement pubkey-based rate limiting
- [ ] Support blacklist/whitelist
- [ ] Implement PoW requirements (NIP-13)

### Data Protection
- [ ] Use TLS/SSL for all connections
- [ ] Encrypt database at rest
- [ ] Implement backup procedures
- [ ] Secure deletion for private content (NIP-70)
- [ ] Handle expiration tags (NIP-40)

### Monitoring
- [ ] Log authentication attempts
- [ ] Monitor for abuse patterns
- [ ] Track resource usage per client
- [ ] Implement alerting for anomalies
- [ ] Regular security audits

### Operations
- [ ] Keep software updated
- [ ] Use secure configuration
- [ ] Implement CORS properly
- [ ] Handle errors securely
- [ ] Regular backups
```

## 🚨 Common Attack Vectors

### 1. Private Key Compromise

**Attack**: Attacker obtains user's private key

**Prevention**:
- Never store keys in plaintext
- Use NIP-49 encryption
- Support hardware wallets
- Implement key rotation (not yet standardized)

**Mitigation**:
- Broadcast key compromise event (kind 62)
- Educate users on key hygiene
- Monitor for suspicious activity

### 2. Relay Snooping

**Attack**: Malicious relay collects metadata

**Prevention**:
- Use gift wrapping (NIP-17) for private content
- Randomize timestamps
- Use multiple relays
- Consider Tor for sensitive communications

### 3. Man-in-the-Middle

**Attack**: Attacker intercepts relay connections

**Prevention**:
- Always use WSS (secure WebSockets)
- Verify event signatures
- Pin relay certificates (advanced)

### 4. Spam and DoS

**Attack**: Flood relay with events

**Prevention**:
- Implement PoW requirements (NIP-13)
- Rate limiting
- Content filtering
- Authentication requirements

### 5. Social Engineering

**Attack**: Trick users into revealing keys

**Prevention**:
- User education
- Clear security warnings
- Never ask for keys in-app
- Phishing detection

## 📚 Practice Exercises

### Exercise 1: Secure Key Storage

Build a key management system that:
1. Generates keys securely
2. Encrypts with NIP-49
3. Stores in browser IndexedDB
4. Supports key export
5. Implements password requirements

### Exercise 2: Private Messaging

Create a private messaging application:
1. Implement NIP-44 encryption
2. Use gift wrapping (NIP-17)
3. Support multiple recipients
4. Handle key rotation
5. Implement read receipts securely

### Exercise 3: Secure Relay

Build a relay with:
1. NIP-42 authentication
2. Rate limiting
3. PoW requirements
4. Content filtering
5. Abuse reporting

### Exercise 4: Security Audit Tool

Create a tool that:
1. Scans events for security issues
2. Checks encryption implementations
3. Validates signatures
4. Tests relay security
5. Generates security reports

## 🔗 Additional Resources

- [NIP-44 Audit Report](https://cure53.de/audit-report_nip44-implementations.pdf)
- [NIP-17 Specification](https://github.com/nostr-protocol/nips/blob/master/17.md)
- [Nostr Security Best Practices](https://github.com/nostr-protocol/nips/blob/master/SECURITY.md)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

## 📝 Summary

In this module, you learned:

- ✅ Modern encryption with NIP-44
- ✅ Private messaging with gift wrapping (NIP-17)
- ✅ Secure key storage with NIP-49
- ✅ Authentication mechanisms (NIP-42, NIP-98)
- ✅ Anti-spam techniques (NIP-13)
- ✅ Remote signing with NIP-46
- ✅ Common attack vectors and mitigations
- ✅ Security best practices for Nostr applications

Security and privacy in Nostr require careful attention to cryptographic details and proper implementation of NIPs. Always stay updated with the latest security recommendations and audit your code regularly.

## Next Steps

- Review the [Security Best Practices](../../concepts/security-best-practices.md)
- Build a secure application using these principles
- Contribute to Nostr security research
- Stay updated on new security NIPs

---

[← Previous Module](module-08-scaling-performance.md) | [Module Index](index.md)
