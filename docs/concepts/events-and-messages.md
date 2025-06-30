# Events and Messages in Nostr

!!! info "Learning Objectives"
    After this lesson, you'll understand:
    
    - How everything in Nostr is structured as events
    - Different types of events and their purposes
    - Event structure and required fields
    - How events are signed and verified
    - Common event kinds and their use cases

## Understanding Events

In Nostr, **everything is an event**. Whether you're posting a text note, updating your profile, reacting to a post, or sending a direct message - it's all structured as events.

This unified approach provides several benefits:

- **Consistency**: All data follows the same structure
- **Extensibility**: New features can be added as new event types
- **Simplicity**: One format to rule them all
- **Interoperability**: All clients understand the same basic structure

## Event Structure

Every Nostr event is a JSON object with specific required fields:

```json
{
  "id": "event-id-hash",
  "pubkey": "author-public-key", 
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "Hello Nostr!",
  "sig": "cryptographic-signature"
}
```

Let's break down each field:

### Required Fields

#### **`id`** (Event ID)
- 32-byte SHA-256 hash of the serialized event data
- Serves as the unique identifier for the event
- Calculated from other fields (not arbitrary)

```javascript
// The ID is the SHA-256 of this serialized data:
[
  0,                    // Reserved
  pubkey,              // Author public key
  created_at,          // Timestamp
  kind,                // Event type
  tags,                // Tags array
  content              // Event content
]
```

#### **`pubkey`** (Author)
- 32-byte public key of the event creator
- Identifies who created the event
- Used to verify the signature

#### **`created_at`** (Timestamp)
- Unix timestamp in seconds
- When the event was created
- Used for chronological ordering

#### **`kind`** (Event Type)
- Integer that defines the event type
- Determines how clients should interpret the event
- Standardized in various NIPs

#### **`tags`** (Metadata)
- Array of arrays containing metadata
- Used for references, mentions, hashtags, etc.
- Each tag is an array of strings

#### **`content`** (Message Content)
- The main content of the event
- Can be text, JSON, or empty depending on kind
- Often contains the user-visible message

#### **`sig`** (Signature)
- 64-byte Schnorr signature
- Proves the event was created by the pubkey owner
- Prevents tampering

## Event Kinds

Event kinds determine how the event should be interpreted:

### Text Events

#### **Kind 1: Text Note**
The most common event type - like a tweet:

```json
{
  "kind": 1,
  "content": "Just learned about Nostr! This decentralized social media is amazing 🚀",
  "tags": [
    ["t", "nostr"],
    ["t", "decentralized"]
  ]
}
```

#### **Kind 0: User Metadata**
Profile information:

```json
{
  "kind": 0,
  "content": "{\"name\":\"Alice\",\"about\":\"Nostr enthusiast\",\"picture\":\"https://example.com/avatar.jpg\"}"
}
```

### Social Events

#### **Kind 7: Reaction**
Likes, hearts, and other reactions:

```json
{
  "kind": 7,
  "content": "🤙",
  "tags": [
    ["e", "note-id-being-reacted-to"],
    ["p", "author-of-original-note"]
  ]
}
```

#### **Kind 6: Repost**
Sharing someone else's note:

```json
{
  "kind": 6,
  "content": "",
  "tags": [
    ["e", "event-id-being-reposted"],
    ["p", "original-author-pubkey"]
  ]
}
```

### Communication Events

#### **Kind 4: Encrypted Direct Message**
Private messages between users:

```json
{
  "kind": 4,
  "content": "encrypted-message-content",
  "tags": [
    ["p", "recipient-pubkey"]
  ]
}
```

#### **Kind 42: Channel Message**
Public chat room messages:

```json
{
  "kind": 42,
  "content": "Hello everyone in this channel!",
  "tags": [
    ["e", "channel-creation-event-id", "", "root"]
  ]
}
```

### Management Events

#### **Kind 3: Contact List**
Who you follow:

```json
{
  "kind": 3,
  "content": "",
  "tags": [
    ["p", "pubkey1", "relay-url", "petname"],
    ["p", "pubkey2", "relay-url", "alice"]
  ]
}
```

#### **Kind 5: Event Deletion**
Request to delete your own events:

```json
{
  "kind": 5,
  "content": "Deleting this post",
  "tags": [
    ["e", "event-id-to-delete"],
    ["k", "1"]
  ]
}
```

### Advanced Events

#### **Kind 30023: Long-form Content**
Articles and blog posts:

```json
{
  "kind": 30023,
  "content": "# My Article\n\nThis is a long-form article...",
  "tags": [
    ["d", "my-article-slug"],
    ["title", "My Amazing Article"],
    ["summary", "A brief summary"],
    ["published_at", "1234567890"]
  ]
}
```

#### **Kind 9735: Zap**
Lightning payments:

```json
{
  "kind": 9735,
  "content": "",
  "tags": [
    ["bolt11", "lightning-invoice"],
    ["description", "zap-request-event"],
    ["p", "recipient-pubkey"]
  ]
}
```

## Tag System

Tags provide structured metadata for events:

### Common Tag Types

#### **"e" tags** - Event References
Reference other events:

```json
["e", "event-id", "relay-url", "marker", "pubkey"]
```

- `event-id`: The event being referenced
- `relay-url`: Where to find the event (optional)
- `marker`: "root", "reply", or "mention" (optional)
- `pubkey`: Author of referenced event (optional)

#### **"p" tags** - Pubkey References
Reference users:

```json
["p", "pubkey", "relay-url", "petname"]
```

#### **"t" tags** - Topics/Hashtags
Categorize content:

```json
["t", "nostr"]
["t", "bitcoin"]
```

#### **"d" tags** - Identifiers
For replaceable events:

```json
["d", "unique-identifier"]
```

### Advanced Tags

```json
// Content warning
["content-warning", "reason"]

// Expiration
["expiration", "unix-timestamp"]

// Subject line
["subject", "Email-like subject"]

// Geographic location
["g", "geohash"]
```

## Event Creation Process

### 1. Build Event Object

```javascript
const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["t", "nostr"],
    ["p", "some-pubkey"]
  ],
  content: "Hello Nostr!"
}
```

### 2. Add Pubkey

```javascript
event.pubkey = getPublicKey(privateKey)
```

### 3. Calculate ID

```javascript
import { getEventHash } from 'nostr-tools'

event.id = getEventHash(event)
```

### 4. Sign Event

```javascript
import { signEvent } from 'nostr-tools'

event.sig = signEvent(event, privateKey)
```

### 5. Publish to Relays

```javascript
relays.forEach(relay => {
  relay.publish(event)
})
```

## Event Verification

When receiving events, clients must verify them:

### 1. Verify ID

```javascript
import { getEventHash } from 'nostr-tools'

const calculatedId = getEventHash(event)
if (calculatedId !== event.id) {
  throw new Error('Invalid event ID')
}
```

### 2. Verify Signature

```javascript
import { verifySignature } from 'nostr-tools'

const isValid = verifySignature(event)
if (!isValid) {
  throw new Error('Invalid signature')
}
```

### 3. Check Timestamp

```javascript
const now = Math.floor(Date.now() / 1000)
const age = now - event.created_at

// Reject events too far in the future
if (event.created_at > now + 60) {
  throw new Error('Event from future')
}

// Optionally reject very old events
if (age > 86400 * 30) { // 30 days
  console.warn('Very old event')
}
```

## Event Serialization

Events must be serialized consistently for ID calculation:

```javascript
// Serialization for ID calculation
const serialized = JSON.stringify([
  0,
  event.pubkey,
  event.created_at,
  event.kind,
  event.tags,
  event.content
])

// No whitespace, specific character escaping
const id = sha256(utf8Encode(serialized))
```

### Character Escaping Rules

Specific characters must be escaped in content:

- Line break (`0x0A`) → `\n`
- Double quote (`0x22`) → `\"`
- Backslash (`0x5C`) → `\\`
- Carriage return (`0x0D`) → `\r`
- Tab (`0x09`) → `\t`
- Backspace (`0x08`) → `\b`
- Form feed (`0x0C`) → `\f`

## Event Relationships

Events can reference each other to create complex structures:

### Threads (Replies)

```json
{
  "kind": 1,
  "content": "This is a reply",
  "tags": [
    ["e", "root-event-id", "", "root"],
    ["e", "parent-event-id", "", "reply"],
    ["p", "original-author-pubkey"],
    ["p", "parent-author-pubkey"]
  ]
}
```

### Mentions

```json
{
  "kind": 1,
  "content": "Hey #[0], check this out!",
  "tags": [
    ["p", "mentioned-user-pubkey"]
  ]
}
```

### Quotes

```json
{
  "kind": 1,
  "content": "This is interesting: nostr:note1abc...",
  "tags": [
    ["q", "quoted-event-id"]
  ]
}
```

## Replaceable Events

Some events can be replaced by newer versions:

### Regular Replaceable (10000-19999)
Only the latest event for each `kind` + `pubkey` is kept:

```json
{
  "kind": 10000,
  "content": "My mute list",
  "tags": [
    ["p", "muted-pubkey-1"],
    ["p", "muted-pubkey-2"]
  ]
}
```

### Parameterized Replaceable (30000-39999)
Latest event for each `kind` + `pubkey` + `d` tag:

```json
{
  "kind": 30023,
  "tags": [
    ["d", "my-article-slug"],
    ["title", "My Article"]
  ],
  "content": "Article content..."
}
```

## Event Validation Rules

### Required Validations

- `id` matches SHA-256 of serialized event
- `sig` is valid Schnorr signature
- `pubkey` is valid 32-byte hex
- `created_at` is reasonable timestamp
- `kind` is valid integer
- `tags` is array of arrays of strings

### Optional Validations

- Content length limits
- Tag count limits
- Timestamp freshness
- Proof of work requirements
- Content filtering

## Working with Events in Code

### Creating a Text Note

```javascript
import { finishEvent } from 'nostr-tools'

const event = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["t", "hello"],
    ["t", "nostr"]
  ],
  content: "Hello Nostr world! 👋"
}, privateKey)

console.log('Created event:', event)
```

### Creating a Reply

```javascript
const replyEvent = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["e", originalEvent.id, "", "root"],
    ["p", originalEvent.pubkey]
  ],
  content: "Great post! Thanks for sharing."
}, privateKey)
```

### Creating a Reaction

```javascript
const reaction = finishEvent({
  kind: 7,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["e", noteEvent.id],
    ["p", noteEvent.pubkey],
    ["k", "1"] // kind of event being reacted to
  ],
  content: "🤙"
}, privateKey)
```

## Best Practices

### For Event Creation

!!! success "Do This"
    - Always set reasonable `created_at` timestamps
    - Include relevant `p` tags for notifications
    - Use standard tag formats
    - Keep content size reasonable
    - Include proper event references in replies

!!! danger "Avoid This"
    - Creating events with future timestamps
    - Omitting required `p` tags in replies
    - Using non-standard tag formats
    - Creating excessive tag noise
    - Forgetting to handle special characters

### For Event Processing

- Always verify signatures before trusting events
- Implement reasonable timestamp checks
- Handle missing or malformed fields gracefully
- Cache verification results for performance
- Rate limit event processing to prevent spam

## Common Patterns

### Thread Creation

```javascript
// Root post
const rootPost = finishEvent({
  kind: 1,
  content: "Starting a new thread about Nostr events...",
  // ...
}, privateKey)

// Reply to root
const reply = finishEvent({
  kind: 1,
  content: "First point: events are the core data structure",
  tags: [
    ["e", rootPost.id, "", "root"],
    ["p", rootPost.pubkey]
  ]
  // ...
}, privateKey)
```

### Content Discovery

```javascript
// Subscribe to hashtag
const sub = relay.sub([{
  kinds: [1],
  "#t": ["nostr"]
}])

// Subscribe to mentions
const mentionSub = relay.sub([{
  kinds: [1],
  "#p": [myPubkey]
}])
```

### Event Updates

```javascript
// Replaceable event (profile)
const profile = finishEvent({
  kind: 0,
  content: JSON.stringify({
    name: "Alice",
    about: "Nostr developer",
    picture: "https://example.com/avatar.jpg"
  })
  // ...
}, privateKey)
```

## Next Steps

Understanding events is crucial for building Nostr applications. Next, explore:

- [Relays and Communication](../relays/) - How events travel through the network
- [NIPs](../nips/) - Specifications for different event types
- [Building Applications](../../tutorials/) - Putting it all together

!!! tip "Practice Exercise"
    Try creating different types of events using the examples above. Start with simple text notes and gradually explore more complex event types like replies and reactions.
