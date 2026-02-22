# Module 6: Advanced Event Types & NIPs

!!! info "Module Overview"
    **Duration**: 6-7 hours  
    **Level**: Advanced  
    **Prerequisites**: Modules 1-5 completed  
    **Goal**: Master advanced Nostr event types, NIPs, and protocol extensions

## 📋 Learning Objectives

By the end of this module, you will:

- ✅ Understand advanced event kinds and their use cases
- ✅ Implement replaceable and parameterized replaceable events
- ✅ Master long-form content (NIP-23)
- ✅ Work with encrypted direct messages (NIP-04, NIP-44)
- ✅ Implement reactions, reposts, and quotes
- ✅ Build lists and sets (NIP-51)
- ✅ Handle badges and achievements (NIP-58)
- ✅ Integrate Zaps and Lightning (NIP-57)

## 6.1 Event Kind Categories

### Event Structure (NIP-01)

Every Nostr event follows a standard structure defined in NIP-01:

```javascript
{
  "id": "<32-bytes lowercase hex-encoded sha256 of serialized event>",
  "pubkey": "<32-bytes lowercase hex-encoded public key>",
  "created_at": "<unix timestamp in seconds>",
  "kind": "<integer>",
  "tags": [
    ["<single-letter>", "<value>", "<optional-value>"],
    // ... more tags
  ],
  "content": "<arbitrary string>",
  "sig": "<64-bytes lowercase hex of signature of id>"
}
```

#### Event ID Calculation

The event ID is the SHA256 hash of the UTF-8 serialized event data:

```javascript
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

function getEventHash(event) {
  const serialized = JSON.stringify([
    0, // reserved for future use
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
  
  const hash = sha256(new TextEncoder().encode(serialized));
  return bytesToHex(hash);
}

// Example
const event = {
  pubkey: "abc123...",
  created_at: 1640000000,
  kind: 1,
  tags: [],
  content: "Hello Nostr!"
};

event.id = getEventHash(event);
```

#### Event Signature Verification

```javascript
import { schnorr } from '@noble/curves/secp256k1';
import { hexToBytes } from '@noble/hashes/utils';

function verifySignature(event) {
  try {
    return schnorr.verify(
      event.sig,
      event.id,
      event.pubkey
    );
  } catch {
    return false;
  }
}

// Validate complete event
function validateEvent(event) {
  // Check required fields
  if (!event.id || !event.pubkey || !event.sig) {
    return { valid: false, reason: 'Missing required fields' };
  }
  
  // Verify ID matches content
  const calculatedId = getEventHash(event);
  if (calculatedId !== event.id) {
    return { valid: false, reason: 'Invalid event ID' };
  }
  
  // Verify signature
  if (!verifySignature(event)) {
    return { valid: false, reason: 'Invalid signature' };
  }
  
  // Check timestamp reasonableness (not too far in future)
  const now = Math.floor(Date.now() / 1000);
  if (event.created_at > now + 900) { // 15 minutes tolerance
    return { valid: false, reason: 'Timestamp too far in future' };
  }
  
  return { valid: true };
}
```

### Standard Event Kinds

Nostr events are categorized by their `kind` number, which determines their behavior and purpose.

| Range | Category | Behavior | Examples |
|-------|----------|----------|----------|
| 0-999 | Regular Events | Stored permanently | Profiles, notes, reactions |
| 1000-9999 | Regular Events | Stored permanently | Long-form, lists |
| 10000-19999 | Replaceable Events | Only latest kept | Metadata, contact lists |
| 20000-29999 | Ephemeral Events | Not stored | Typing indicators, presence |
| 30000-39999 | Parameterized Replaceable | Latest per param | Articles, products |

### Common Event Kinds

```javascript
const EVENT_KINDS = {
  // Regular Events
  METADATA: 0,              // User profile
  TEXT_NOTE: 1,             // Short text note
  RECOMMEND_RELAY: 2,       // Relay recommendation
  CONTACTS: 3,              // Contact list
  ENCRYPTED_DM: 4,          // Encrypted direct message
  EVENT_DELETION: 5,        // Delete request
  REPOST: 6,                // Repost/boost
  REACTION: 7,              // Like/emoji reaction
  BADGE_AWARD: 8,           // Badge award
  
  // Long-form Content
  LONG_FORM: 30023,         // Articles, blog posts
  
  // Replaceable Events
  RELAY_LIST: 10002,        // User's relay list (NIP-65)
  
  // Lists (NIP-51)
  MUTE_LIST: 10000,
  PIN_LIST: 10001,
  BOOKMARK_LIST: 10003,
  
  // Zaps
  ZAP_REQUEST: 9734,
  ZAP_RECEIPT: 9735,
  
  // Ephemeral
  AUTH: 22242,              // Client authentication
  
  // Community
  CHANNEL_CREATE: 40,
  CHANNEL_METADATA: 41,
  CHANNEL_MESSAGE: 42,
  CHANNEL_HIDE_MESSAGE: 43,
  CHANNEL_MUTE_USER: 44,
};
```

## 6.2 Replaceable Events

### Understanding Replaceability

Replaceable events are automatically replaced when a newer event of the same kind from the same author is received.

```javascript
class ReplaceableEvent {
  constructor(kind, content, tags = []) {
    if (kind < 10000 || kind >= 20000) {
      throw new Error('Not a replaceable event kind');
    }
    
    this.kind = kind;
    this.content = content;
    this.tags = tags;
  }
  
  async publish(pool, privateKey) {
    const event = {
      kind: this.kind,
      created_at: Math.floor(Date.now() / 1000),
      tags: this.tags,
      content: this.content,
    };
    
    // Sign and publish
    const signedEvent = await signEvent(event, privateKey);
    await pool.publish(signedEvent);
    
    // Relays will automatically replace any older event
    // with the same kind from this pubkey
    return signedEvent;
  }
}

// Example: Update user metadata (kind 0)
const metadata = {
  name: "Alice",
  about: "Nostr developer",
  picture: "https://example.com/avatar.jpg",
  nip05: "alice@example.com"
};

const metadataEvent = new ReplaceableEvent(
  0,
  JSON.stringify(metadata)
);

await metadataEvent.publish(pool, privateKey);
```

### NIP-02: Contact Lists (Kind 3)

```javascript
class ContactList {
  constructor() {
    this.contacts = [];
  }
  
  addContact(pubkey, relay = '', petname = '') {
    this.contacts.push({
      pubkey,
      relay,
      petname
    });
  }
  
  removeContact(pubkey) {
    this.contacts = this.contacts.filter(c => c.pubkey !== pubkey);
  }
  
  toEvent() {
    return {
      kind: 3,
      content: '',
      tags: this.contacts.map(c => [
        'p',
        c.pubkey,
        c.relay,
        c.petname
      ]),
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static fromEvent(event) {
    const list = new ContactList();
    
    event.tags
      .filter(tag => tag[0] === 'p')
      .forEach(tag => {
        list.contacts.push({
          pubkey: tag[1],
          relay: tag[2] || '',
          petname: tag[3] || ''
        });
      });
    
    return list;
  }
}

// Usage
const contacts = new ContactList();
contacts.addContact(
  'pubkey123',
  'wss://relay.damus.io',
  'Alice'
);
contacts.addContact(
  'pubkey456',
  'wss://nos.lol',
  'Bob'
);

const event = contacts.toEvent();
// Sign and publish
```

## 6.3 Parameterized Replaceable Events

### NIP-33: Parameterized Replaceable Events

These events use a `d` tag to create multiple replaceable events of the same kind.

```javascript
class ParameterizedReplaceableEvent {
  constructor(kind, identifier, content, tags = []) {
    if (kind < 30000 || kind >= 40000) {
      throw new Error('Not a parameterized replaceable event kind');
    }
    
    this.kind = kind;
    this.identifier = identifier;
    this.content = content;
    this.tags = [['d', identifier], ...tags];
  }
  
  toEvent() {
    return {
      kind: this.kind,
      content: this.content,
      tags: this.tags,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Example: Create a product listing
const product = new ParameterizedReplaceableEvent(
  30018, // Product listing kind
  'vintage-keyboard-001', // Unique identifier
  JSON.stringify({
    title: 'Vintage Mechanical Keyboard',
    description: 'IBM Model M from 1987',
    price: '150 USD',
    images: ['https://...']
  }),
  [
    ['t', 'keyboards'],
    ['t', 'vintage'],
    ['price', '150', 'USD']
  ]
);

// Later, update the same product
const updatedProduct = new ParameterizedReplaceableEvent(
  30018,
  'vintage-keyboard-001', // Same identifier
  JSON.stringify({
    title: 'Vintage Mechanical Keyboard',
    description: 'IBM Model M from 1987',
    price: '120 USD', // Price updated
    images: ['https://...']
  }),
  [
    ['t', 'keyboards'],
    ['t', 'vintage'],
    ['price', '120', 'USD']
  ]
);
```

## 6.4 Long-form Content (NIP-23)

### Creating Articles

```javascript
class Article {
  constructor(title, summary, content, image = '') {
    this.title = title;
    this.summary = summary;
    this.content = content;
    this.image = image;
    this.tags = [];
    this.publishedAt = null;
  }
  
  setPublishedAt(timestamp) {
    this.publishedAt = timestamp;
    return this;
  }
  
  addTag(tag) {
    this.tags.push(tag);
    return this;
  }
  
  addHashtag(hashtag) {
    this.tags.push(['t', hashtag]);
    return this;
  }
  
  setIdentifier(identifier) {
    this.identifier = identifier;
    return this;
  }
  
  toEvent() {
    const tags = [
      ['d', this.identifier || this.generateSlug()],
      ['title', this.title],
      ['summary', this.summary],
      ...this.tags
    ];
    
    if (this.image) {
      tags.push(['image', this.image]);
    }
    
    if (this.publishedAt) {
      tags.push(['published_at', this.publishedAt.toString()]);
    }
    
    return {
      kind: 30023,
      content: this.content,
      tags: tags,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  generateSlug() {
    return this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  static fromEvent(event) {
    const getTag = (name) => {
      const tag = event.tags.find(t => t[0] === name);
      return tag ? tag[1] : '';
    };
    
    const article = new Article(
      getTag('title'),
      getTag('summary'),
      event.content,
      getTag('image')
    );
    
    article.identifier = getTag('d');
    
    const publishedAt = getTag('published_at');
    if (publishedAt) {
      article.publishedAt = parseInt(publishedAt);
    }
    
    article.tags = event.tags.filter(t => t[0] === 't');
    
    return article;
  }
}

// Create and publish an article
const article = new Article(
  'Understanding Nostr Relays',
  'A deep dive into relay architecture and best practices',
  `# Understanding Nostr Relays

Nostr relays are the backbone of the protocol...

## Architecture

Relays use WebSocket connections...

## Best Practices

When running a relay...`
)
  .setIdentifier('understanding-nostr-relays')
  .addHashtag('nostr')
  .addHashtag('relays')
  .addHashtag('tutorial')
  .setPublishedAt(Math.floor(Date.now() / 1000));

const event = article.toEvent();
// Sign and publish
```

### Querying Articles

```javascript
async function getArticlesByAuthor(pool, authorPubkey) {
  return await pool.query({
    kinds: [30023],
    authors: [authorPubkey]
  });
}

async function getArticlesByTag(pool, tag) {
  return await pool.query({
    kinds: [30023],
    '#t': [tag]
  });
}

async function getArticle(pool, authorPubkey, identifier) {
  const results = await pool.query({
    kinds: [30023],
    authors: [authorPubkey],
    '#d': [identifier]
  });
  
  return results[0] ? Article.fromEvent(results[0]) : null;
}
```

## 6.5 Reactions & Engagement (NIP-25)

### Implementing Reactions

Reactions in Nostr use kind 7 events with the `content` field containing the reaction. While the standard like is `+`, clients can use emojis or any text to create expressive reactions.

```javascript
class Reaction {
  static LIKE = '+';
  static DISLIKE = '-';
  
  static create(targetEvent, content = '+') {
    return {
      kind: 7,
      content: content,  // Can be '+', emoji, or any text
      tags: [
        ['e', targetEvent.id],
        ['p', targetEvent.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static createCustom(targetEvent, content) {
    return this.create(targetEvent, content);
  }
  
  static async getReactions(pool, eventId) {
    const reactions = await pool.query({
      kinds: [7],
      '#e': [eventId]
    });
    
    // Group by reaction type
    const grouped = {};
    reactions.forEach(r => {
      const content = r.content || '+';
      if (!grouped[content]) {
        grouped[content] = [];
      }
      grouped[content].push(r);
    });
    
    return grouped;
  }
  
  static async getReactionCount(pool, eventId) {
    const reactions = await this.getReactions(pool, eventId);
    const counts = {};
    
    Object.keys(reactions).forEach(emoji => {
      counts[emoji] = reactions[emoji].length;
    });
    
    return counts;
  }
}

// Usage Examples - Reactions in Practice

// Standard like (universally supported)
const likeEvent = Reaction.create(someEvent, '+');

// Emoji reactions (popular in modern clients)
const heartEvent = Reaction.create(someEvent, '❤️');
const fireEvent = Reaction.create(someEvent, '🔥');
const laughEvent = Reaction.create(someEvent, '😂');

// Text-based reactions (also valid)
const customReaction = Reaction.create(someEvent, 'awesome');

// The content field accepts any string - clients determine how to display it

// Get reaction counts grouped by type
const counts = await Reaction.getReactionCount(pool, eventId);
// Example result: { '+': 42, '❤️': 15, '🔥': 8, '😂': 3 }
```

### Reposts (NIP-18)

```javascript
class Repost {
  static create(originalEvent) {
    return {
      kind: 6,
      content: JSON.stringify(originalEvent),
      tags: [
        ['e', originalEvent.id],
        ['p', originalEvent.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static createQuote(originalEvent, comment) {
    return {
      kind: 1, // Regular note
      content: comment,
      tags: [
        ['e', originalEvent.id, '', 'mention'],
        ['p', originalEvent.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Simple repost
const repost = Repost.create(originalEvent);

// Quote repost (with comment)
const quote = Repost.createQuote(
  originalEvent,
  'This is insightful! Everyone should read this.'
);
```

## 6.6 Lists and Sets (NIP-51)

### User Lists

```javascript
class UserList {
  constructor(kind, title = '') {
    this.kind = kind;
    this.title = title;
    this.items = [];
  }
  
  addPubkey(pubkey, relay = '', petname = '') {
    this.items.push({
      type: 'p',
      value: pubkey,
      relay,
      petname
    });
  }
  
  addEvent(eventId, relay = '', reason = '') {
    this.items.push({
      type: 'e',
      value: eventId,
      relay,
      reason
    });
  }
  
  addHashtag(hashtag) {
    this.items.push({
      type: 't',
      value: hashtag
    });
  }
  
  toEvent() {
    return {
      kind: this.kind,
      content: '',
      tags: this.items.map(item => {
        if (item.type === 'p') {
          return ['p', item.value, item.relay || '', item.petname || ''];
        } else if (item.type === 'e') {
          return ['e', item.value, item.relay || ''];
        } else if (item.type === 't') {
          return ['t', item.value];
        }
      }),
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Mute List (kind 10000)
const muteList = new UserList(10000, 'Muted Users');
muteList.addPubkey('spammer123');
muteList.addPubkey('troll456');
muteList.addHashtag('spam');

// Pin List (kind 10001)
const pinList = new UserList(10001, 'Pinned Notes');
pinList.addEvent('note1abc', '', 'Important announcement');
pinList.addEvent('note2def', '', 'Tutorial');

// Bookmark List (kind 10003)
const bookmarks = new UserList(10003, 'Reading List');
bookmarks.addEvent('article1');
bookmarks.addEvent('article2');

// Categorized Lists (kind 30000-30001)
class CategorizedList extends UserList {
  constructor(identifier, title) {
    super(30001, title);
    this.identifier = identifier;
  }
  
  toEvent() {
    const event = super.toEvent();
    event.tags.unshift(['d', this.identifier]);
    event.tags.push(['title', this.title]);
    return event;
  }
}

const favoriteDevs = new CategorizedList('favorite-devs', 'Favorite Developers');
favoriteDevs.addPubkey('dev1');
favoriteDevs.addPubkey('dev2');
```

## 6.7 Encrypted Direct Messages

### NIP-04: Basic Encryption (Deprecated)

```javascript
import { nip04 } from 'nostr-tools';

class EncryptedDM {
  static async send(pool, senderPrivkey, recipientPubkey, message) {
    const encrypted = await nip04.encrypt(
      senderPrivkey,
      recipientPubkey,
      message
    );
    
    const event = {
      kind: 4,
      content: encrypted,
      tags: [['p', recipientPubkey]],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    const signed = await signEvent(event, senderPrivkey);
    await pool.publish(signed);
    
    return signed;
  }
  
  static async decrypt(privkey, senderPubkey, encryptedContent) {
    return await nip04.decrypt(
      privkey,
      senderPubkey,
      encryptedContent
    );
  }
  
  static async getConversation(pool, userPubkey, otherPubkey) {
    const sent = await pool.query({
      kinds: [4],
      authors: [userPubkey],
      '#p': [otherPubkey]
    });
    
    const received = await pool.query({
      kinds: [4],
      authors: [otherPubkey],
      '#p': [userPubkey]
    });
    
    return [...sent, ...received].sort(
      (a, b) => a.created_at - b.created_at
    );
  }
}
```

### NIP-44: Improved Encryption (Recommended)

```javascript
import { nip44 } from 'nostr-tools';

class SecureEncryptedDM {
  static async send(pool, senderPrivkey, recipientPubkey, message) {
    const encrypted = nip44.encrypt(
      senderPrivkey,
      recipientPubkey,
      message
    );
    
    const event = {
      kind: 4,
      content: encrypted,
      tags: [['p', recipientPubkey]],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    const signed = await signEvent(event, senderPrivkey);
    await pool.publish(signed);
    
    return signed;
  }
  
  static decrypt(privkey, senderPubkey, encryptedContent) {
    return nip44.decrypt(
      privkey,
      senderPubkey,
      encryptedContent
    );
  }
}
```

## 6.8 Zaps & Lightning Integration (NIP-57)

### Understanding Zaps

Zaps are Lightning Network payments associated with Nostr events.

```javascript
class ZapService {
  constructor(lnurlEndpoint) {
    this.lnurlEndpoint = lnurlEndpoint;
  }
  
  async createZapRequest(recipientPubkey, amount, comment = '', eventToZap = null) {
    const zapRequest = {
      kind: 9734,
      content: comment,
      tags: [
        ['p', recipientPubkey],
        ['amount', amount.toString()],
        ['relays', 'wss://relay.damus.io', 'wss://nos.lol']
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    if (eventToZap) {
      zapRequest.tags.push(['e', eventToZap.id]);
    }
    
    return zapRequest;
  }
  
  async requestInvoice(zapRequest, amount) {
    const params = new URLSearchParams({
      amount: amount.toString(),
      nostr: JSON.stringify(zapRequest)
    });
    
    const response = await fetch(
      `${this.lnurlEndpoint}?${params}`
    );
    
    const data = await response.json();
    return data.pr; // Payment request (invoice)
  }
  
  static async getZapsForEvent(pool, eventId) {
    return await pool.query({
      kinds: [9735], // Zap receipts
      '#e': [eventId]
    });
  }
  
  static async getZapsForPubkey(pool, pubkey) {
    return await pool.query({
      kinds: [9735],
      '#p': [pubkey]
    });
  }
  
  static calculateTotalSats(zapReceipts) {
    return zapReceipts.reduce((total, zap) => {
      const boltTag = zap.tags.find(t => t[0] === 'bolt11');
      if (boltTag) {
        const invoice = boltTag[1];
        const amount = this.parseInvoiceAmount(invoice);
        return total + amount;
      }
      return total;
    }, 0);
  }
  
  static parseInvoiceAmount(invoice) {
    // Parse Lightning invoice to extract amount
    // This is simplified - use a proper library
    const match = invoice.match(/lnbc(\d+)([munp]?)/);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2];
      
      const multipliers = {
        'm': 100000,      // milli-satoshi
        'u': 100,         // micro-satoshi
        'n': 0.1,         // nano-satoshi
        'p': 0.0001,      // pico-satoshi
        '': 100000000     // bitcoin
      };
      
      return amount * (multipliers[unit] || 1);
    }
    return 0;
  }
}

// Usage
const zapService = new ZapService('https://lnurl.example.com');

// Create zap request
const zapRequest = await zapService.createZapRequest(
  recipientPubkey,
  1000, // sats
  'Great post!',
  eventToZap
);

// Get invoice
const invoice = await zapService.requestInvoice(zapRequest, 1000);

// Pay invoice with Lightning wallet
// ...

// Query zaps for an event
const zaps = await ZapService.getZapsForEvent(pool, eventId);
const totalSats = ZapService.calculateTotalSats(zaps);
console.log(`Total zapped: ${totalSats} sats`);
```

## 6.9 Badges & Achievements (NIP-58)

### Creating Badge Definitions

```javascript
class Badge {
  constructor(identifier, name, description, image) {
    this.identifier = identifier;
    this.name = name;
    this.description = description;
    this.image = image;
  }
  
  toDefinitionEvent() {
    return {
      kind: 30009,
      content: '',
      tags: [
        ['d', this.identifier],
        ['name', this.name],
        ['description', this.description],
        ['image', this.image]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  createAward(recipientPubkey) {
    return {
      kind: 8,
      content: '',
      tags: [
        ['a', `30009:${this.creatorPubkey}:${this.identifier}`],
        ['p', recipientPubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Create badge definition
const contributorBadge = new Badge(
  'nostr-contributor-2024',
  'Nostr Contributor 2024',
  'Awarded to significant Nostr protocol contributors',
  'https://example.com/badges/contributor.png'
);

const badgeDefEvent = contributorBadge.toDefinitionEvent();
// Sign and publish

// Award badge to someone
const awardEvent = contributorBadge.createAward(developerPubkey);
// Sign and publish
```

## 6.10 Bech32-Encoded Identifiers (NIP-19)

NIP-19 defines special bech32-encoded identifiers for user-friendly representation of keys and events.

### Entity Types

| Prefix | Entity | Use Case |
|--------|--------|----------|
| `npub` | Public key | User profiles, mentions |
| `nsec` | Private key | Backup/import (handle securely!) |
| `note` | Event ID | Share individual notes |
| `nprofile` | Profile with relays | Share profile with relay hints |
| `nevent` | Event with relays | Share event with relay hints |
| `naddr` | Replaceable event address | Reference articles, products |

### Encoding and Decoding

```javascript
import { nip19 } from 'nostr-tools';

// Encode public key
const hexPubkey = "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d";
const npub = nip19.npubEncode(hexPubkey);
// "npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6"

// Decode npub
const decoded = nip19.decode(npub);
console.log(decoded);
// { type: 'npub', data: '3bf0c63fcb...' }

// Encode private key (WARNING: Handle with extreme care!)
const hexPrivkey = "...";
const nsec = nip19.nsecEncode(hexPrivkey);
// "nsec1..."

// Encode note ID
const noteId = "note1abc...";
const note1 = nip19.noteEncode(noteId);

// Encode profile with relay hints
const profilePointer = nip19.nprofileEncode({
  pubkey: hexPubkey,
  relays: ['wss://relay.damus.io', 'wss://nos.lol']
});

// Encode event with context
const eventPointer = nip19.neventEncode({
  id: eventId,
  relays: ['wss://relay.damus.io'],
  author: authorPubkey,
  kind: 1
});

// Encode parameterized replaceable event address
const addressPointer = nip19.naddrEncode({
  identifier: 'my-article',
  pubkey: authorPubkey,
  kind: 30023,
  relays: ['wss://relay.damus.io']
});
```

### Practical Uses

```javascript
class Nip19Helper {
  // Display-friendly public key
  static displayPubkey(hexPubkey) {
    const npub = nip19.npubEncode(hexPubkey);
    return npub.substring(0, 12) + '...' + npub.substring(npub.length - 6);
    // "npub180cvv07...jh6w6"
  }
  
  // Create shareable note link
  static createNoteLink(eventId, relays = []) {
    if (relays.length > 0) {
      return nip19.neventEncode({ id: eventId, relays });
    }
    return nip19.noteEncode(eventId);
  }
  
  // Parse user input (could be hex or bech32)
  static parseUserInput(input) {
    try {
      // Try bech32 decode
      const decoded = nip19.decode(input);
      return {
        type: decoded.type,
        data: decoded.data
      };
    } catch {
      // Assume hex if decode fails
      if (/^[0-9a-f]{64}$/i.test(input)) {
        return {
          type: 'hex',
          data: input.toLowerCase()
        };
      }
      throw new Error('Invalid input format');
    }
  }
  
  // Extract mentions from text
  static extractMentions(text) {
    const mentionRegex = /(npub1[a-z0-9]{58}|nprofile1[a-z0-9]+)/g;
    const matches = text.match(mentionRegex) || [];
    
    return matches.map(mention => {
      const decoded = nip19.decode(mention);
      return {
        mention,
        pubkey: decoded.type === 'npub' ? decoded.data : decoded.data.pubkey
      };
    });
  }
  
  // Replace mentions with user-friendly names
  static async formatMentions(text, pool) {
    const mentions = this.extractMentions(text);
    let formatted = text;
    
    for (const { mention, pubkey } of mentions) {
      // Fetch user profile
      const profile = await pool.queryOne({
        kinds: [0],
        authors: [pubkey]
      });
      
      const name = profile 
        ? JSON.parse(profile.content).name 
        : this.displayPubkey(pubkey);
      
      formatted = formatted.replace(mention, `@${name}`);
    }
    
    return formatted;
  }
}

// Usage examples
const shareableNote = Nip19Helper.createNoteLink(
  eventId, 
  ['wss://relay.damus.io']
);
console.log(`Share this: nostr:${shareableNote}`);

const parsed = Nip19Helper.parseUserInput('npub180cvv07...');
console.log(parsed); // { type: 'npub', data: '3bf0c63...' }

const mentions = Nip19Helper.extractMentions(
  'Hey npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6 check this out!'
);
console.log(mentions); // [{ mention: 'npub1...', pubkey: '3bf0c...' }]
```

### Security Considerations

```javascript
class SecureNip19Handler {
  // NEVER expose nsec in UI or logs
  static handleNsec(nsec) {
    try {
      const { data: privateKey } = nip19.decode(nsec);
      
      // Immediately encrypt or store securely
      this.secureStore(privateKey);
      
      // Clear from memory
      nsec = null;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Validate before decoding
  static validateNip19(input) {
    const validPrefixes = ['npub', 'nsec', 'note', 'nprofile', 'nevent', 'naddr'];
    const prefix = input.substring(0, input.indexOf('1'));
    
    if (!validPrefixes.includes(prefix)) {
      throw new Error(`Invalid NIP-19 prefix: ${prefix}`);
    }
    
    try {
      nip19.decode(input);
      return true;
    } catch {
      return false;
    }
  }
}
```

## 6.11 Practical Exercises

### Exercise 1: Article Platform
Build a long-form content platform:
1. Create article publishing interface
2. Implement article editing (update existing)
3. Add hashtag filtering
4. Build article feed with pagination

### Exercise 2: Social Interactions
Implement engagement features:
1. Like/reaction system with custom emojis
2. Repost functionality
3. Quote reposts with comments
4. Reaction statistics dashboard

### Exercise 3: List Management
Create a bookmark manager:
1. Multiple categorized lists
2. Add/remove items
3. Share lists publicly
4. Import/export lists

### Exercise 4: Encrypted Chat
Build a DM application:
1. Implement NIP-44 encryption
2. Real-time message updates
3. Conversation threading
4. Read receipts

### Exercise 5: Zap Integration
Add zapping to your client:
1. Display zap button on events
2. Show total zaps received
3. List top zappers
4. Create zap leaderboard

## 6.12 Event Delegation (NIP-26)

Event delegation allows one user to authorize another to publish events on their behalf. This is useful for:
- Social media managers posting for brands
- Bot accounts publishing automated content
- Multi-device key management
- Service integrations

### Creating a Delegation Token

```javascript
import { getSignature, getEventHash } from 'nostr-tools';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

class EventDelegation {
  static createDelegation(delegatorPrivateKey, delegatePubkey, conditions = {}) {
    const {
      kinds = [],        // Allowed event kinds
      since = 0,         // Unix timestamp - valid from
      until = null,      // Unix timestamp - valid until
    } = conditions;
    
    // Build conditions string
    const conditionStrings = [];
    
    if (kinds.length > 0) {
      conditionStrings.push(`kind=${kinds.join(',')}`);
    }
    if (since > 0) {
      conditionStrings.push(`created_at>${since}`);
    }
    if (until) {
      conditionStrings.push(`created_at<${until}`);
    }
    
    const conditionsStr = conditionStrings.join('&');
    
    // Create delegation token
    const token = `nostr:delegation:${delegatePubkey}:${conditionsStr}`;
    const hash = sha256(new TextEncoder().encode(token));
    const sig = getSignature(hash, delegatorPrivateKey);
    
    return {
      delegatePubkey,
      conditions: conditionsStr,
      token: bytesToHex(sig)
    };
  }
  
  static applyDelegationToEvent(event, delegatorPubkey, delegationToken) {
    // Add delegation tag
    event.tags.push([
      'delegation',
      delegatorPubkey,
      delegationToken.conditions,
      delegationToken.token
    ]);
    
    return event;
  }
  
  static verifyDelegation(event) {
    const delegationTag = event.tags.find(t => t[0] === 'delegation');
    
    if (!delegationTag) {
      return { valid: false, reason: 'No delegation tag' };
    }
    
    const [_, delegatorPubkey, conditions, token] = delegationTag;
    
    // Verify conditions match event
    const conditionChecks = conditions.split('&');
    
    for (const condition of conditionChecks) {
      if (condition.startsWith('kind=')) {
        const allowedKinds = condition.substring(5).split(',').map(Number);
        if (!allowedKinds.includes(event.kind)) {
          return { valid: false, reason: 'Kind not allowed by delegation' };
        }
      }
      
      if (condition.startsWith('created_at>')) {
        const since = parseInt(condition.substring(11));
        if (event.created_at <= since) {
          return { valid: false, reason: 'Event too old for delegation' };
        }
      }
      
      if (condition.startsWith('created_at<')) {
        const until = parseInt(condition.substring(11));
        if (event.created_at >= until) {
          return { valid: false, reason: 'Event too new for delegation' };
        }
      }
    }
    
    // Verify delegation signature
    const delegationString = `nostr:delegation:${event.pubkey}:${conditions}`;
    const hash = sha256(new TextEncoder().encode(delegationString));
    
    // In practice, use schnorr.verify here
    // For now, assume token is valid if format is correct
    
    return { valid: true, delegator: delegatorPubkey };
  }
}

// Usage Example
const delegatorPrivateKey = "..."; // Brand's key
const delegatePubkey = "...";      // Social media manager's public key

// Create delegation for kind 1 notes, valid for 30 days
const delegation = EventDelegation.createDelegation(
  delegatorPrivateKey,
  delegatePubkey,
  {
    kinds: [1],
    since: Math.floor(Date.now() / 1000),
    until: Math.floor(Date.now() / 1000) + (30 * 86400)
  }
);

// Social media manager creates an event
const event = {
  kind: 1,
  pubkey: delegatePubkey,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "Posted on behalf of the brand"
};

// Apply delegation
EventDelegation.applyDelegationToEvent(
  event,
  getDelegatorPubkey(delegatorPrivateKey), // Derive from private key
  delegation
);

// Sign with delegate's key and publish
// Relays will show this as from the delegator
```

### Practical Delegation Use Cases

```javascript
// 1. Bot Account Delegation
class BotDelegation {
  constructor(ownerPrivateKey, botPubkey) {
    this.delegation = EventDelegation.createDelegation(
      ownerPrivateKey,
      botPubkey,
      {
        kinds: [1], // Only allow text notes
        since: Math.floor(Date.now() / 1000),
        until: Math.floor(Date.now() / 1000) + (365 * 86400) // 1 year
      }
    );
  }
  
  createBotPost(content, botPrivateKey) {
    const event = {
      kind: 1,
      pubkey: getPublicKey(botPrivateKey),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content
    };
    
    EventDelegation.applyDelegationToEvent(event, this.ownerPubkey, this.delegation);
    return finishEvent(event, botPrivateKey);
  }
}

// 2. Temporary Access Delegation
class TemporaryDelegation {
  static createHourlyAccess(ownerKey, tempPubkey) {
    const now = Math.floor(Date.now() / 1000);
    
    return EventDelegation.createDelegation(
      ownerKey,
      tempPubkey,
      {
        since: now,
        until: now + 3600 // 1 hour
      }
    );
  }
}
```

## 6.13 Advanced Patterns

### Event Threading

```javascript
class Thread {
  static createReply(parentEvent, content, mentions = []) {
    const tags = [
      ['e', parentEvent.id, '', 'reply']
    ];
    
    // Add root event if this is a nested reply
    const rootTag = parentEvent.tags.find(t => t[0] === 'e' && t[3] === 'root');
    if (rootTag) {
      tags.unshift(['e', rootTag[1], '', 'root']);
    } else {
      tags.unshift(['e', parentEvent.id, '', 'root']);
    }
    
    // Add author of parent
    tags.push(['p', parentEvent.pubkey]);
    
    // Add mentioned users
    mentions.forEach(pubkey => {
      tags.push(['p', pubkey]);
    });
    
    return {
      kind: 1,
      content,
      tags,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static async getThread(pool, rootEventId) {
    const replies = await pool.query({
      kinds: [1],
      '#e': [rootEventId]
    });
    
    // Build tree structure
    const threadMap = new Map();
    threadMap.set(rootEventId, { replies: [] });
    
    replies.forEach(reply => {
      const replyTag = reply.tags.find(t => t[0] === 'e' && t[3] === 'reply');
      const parentId = replyTag ? replyTag[1] : rootEventId;
      
      if (!threadMap.has(reply.id)) {
        threadMap.set(reply.id, { event: reply, replies: [] });
      } else {
        threadMap.get(reply.id).event = reply;
      }
      
      if (!threadMap.has(parentId)) {
        threadMap.set(parentId, { replies: [] });
      }
      
      threadMap.get(parentId).replies.push(reply.id);
    });
    
    return threadMap;
  }
}
```

### Content Discovery

```javascript
class ContentDiscovery {
  static async getTrending(pool, timeWindow = 86400) {
    const since = Math.floor(Date.now() / 1000) - timeWindow;
    
    // Get recent notes
    const notes = await pool.query({
      kinds: [1],
      since,
      limit: 1000
    });
    
    // Get reactions for these notes
    const noteIds = notes.map(n => n.id);
    const reactions = await pool.query({
      kinds: [7],
      '#e': noteIds,
      since
    });
    
    // Count reactions per note
    const reactionCounts = {};
    reactions.forEach(r => {
      const noteId = r.tags.find(t => t[0] === 'e')[1];
      reactionCounts[noteId] = (reactionCounts[noteId] || 0) + 1;
    });
    
    // Sort by reaction count
    return notes
      .map(note => ({
        ...note,
        reactions: reactionCounts[note.id] || 0
      }))
      .sort((a, b) => b.reactions - a.reactions);
  }
  
  static async getRecommended(pool, userPubkey) {
    // Get user's contacts
    const contacts = await pool.queryOne({
      kinds: [3],
      authors: [userPubkey]
    });
    
    if (!contacts) return [];
    
    const following = contacts.tags
      .filter(t => t[0] === 'p')
      .map(t => t[1]);
    
    // Get recent notes from contacts
    return await pool.query({
      kinds: [1],
      authors: following,
      limit: 100
    });
  }
}
```

## 📝 Module 6 Quiz

1. **What's the difference between replaceable and parameterized replaceable events?**
   <details>
   <summary>Answer</summary>
   Replaceable events (10000-19999) keep only the latest event of that kind per pubkey. Parameterized replaceable events (30000-39999) use a 'd' tag to allow multiple instances, keeping the latest per pubkey+identifier combination.
   </details>

2. **Why is NIP-44 preferred over NIP-04 for encrypted messages?**
   <details>
   <summary>Answer</summary>
   NIP-44 provides better security with improved encryption, padding to prevent message length analysis, and protection against various cryptographic attacks that NIP-04 is vulnerable to.
   </details>

3. **What are the three main components of a Zap?**
   <details>
   <summary>Answer</summary>
   1) Zap request (kind 9734) - client creates and signs
   2) Lightning invoice - LNURL server generates
   3) Zap receipt (kind 9735) - published after payment
   </details>

4. **How do you create a thread reply that maintains the conversation structure?**
   <details>
   <summary>Answer</summary>
   Use 'e' tags with markers: one 'e' tag marked 'root' pointing to the thread root, and one 'e' tag marked 'reply' pointing to the immediate parent comment.
   </details>

5. **What makes long-form content (kind 30023) different from regular notes?**
   <details>
   <summary>Answer</summary>
   Long-form content is parameterized replaceable, supports metadata tags (title, summary, image, published_at), uses a 'd' tag for identification, and is intended for articles and blog posts rather than short messages.
   </details>

## 🎯 Module 6 Checkpoint

Before completing this module, ensure you have:

- [ ] Implemented replaceable events (profile updates, contact lists)
- [ ] Created and updated parameterized replaceable events
- [ ] Built long-form content publishing
- [ ] Added reactions and reposts to your client
- [ ] Implemented at least one type of list (mute, bookmark, etc.)
- [ ] Integrated encrypted direct messaging
- [ ] Understood Zap flow (even if not fully implemented)
- [ ] Experimented with badges or another advanced NIP

## 📚 Additional Resources

- [NIP-01: Basic Protocol Flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-23: Long-form Content](https://github.com/nostr-protocol/nips/blob/master/23.md)
- [NIP-25: Reactions](https://github.com/nostr-protocol/nips/blob/master/25.md)
- [NIP-33: Parameterized Replaceable Events](https://github.com/nostr-protocol/nips/blob/master/33.md)
- [NIP-44: Encrypted Direct Message](https://github.com/nostr-protocol/nips/blob/master/44.md)
- [NIP-51: Lists](https://github.com/nostr-protocol/nips/blob/master/51.md)
- [NIP-57: Lightning Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md)
- [NIP-58: Badges](https://github.com/nostr-protocol/nips/blob/master/58.md)
- [nostr-tools Documentation](https://github.com/nbd-wtf/nostr-tools)

## 💬 Community Discussion

Join our Discord to discuss Module 6:
- Share your advanced implementations
- Get help with NIPs integration
- Discuss protocol proposals
- Collaborate on NIP development

---

!!! success "Congratulations!"
    You've mastered advanced Nostr event types and NIPs! You can now build sophisticated applications with long-form content, encrypted messaging, social interactions, and Lightning integration. You're ready to contribute to the Nostr ecosystem!

[🎓 Course Complete - Next Steps →](#next-steps)

## Next Steps

Now that you've completed all 6 modules, consider:

1. **Build a Production App** - Take what you've learned and create a real Nostr client
2. **Contribute to NIPs** - Propose improvements or new protocol features
3. **Run Infrastructure** - Set up relays, LNURL servers, or other services
4. **Join Development** - Contribute to existing Nostr projects
5. **Create Content** - Share tutorials and help others learn

Welcome to the Nostr ecosystem! 🚀💜
