# Understanding NIPs (Nostr Implementation Possibilities)

!!! info "Learning Objectives"
    After this lesson, you'll understand:
    
    - What NIPs are and why they're essential
    - How NIPs enable interoperability and innovation
    - Core NIPs that every implementation should support
    - The NIP development and adoption process
    - How to read and implement NIPs

NIPs are the backbone of Nostr's extensibility and standardization. They define how different parts of the protocol work and enable interoperability between clients and relays.

## What are NIPs?

**NIP** stands for **Nostr Implementation Possibility**. NIPs are technical specifications that describe:

- Protocol features and extensions
- Event formats and structures
- Client and relay behaviors
- Cryptographic standards
- Communication patterns

Think of NIPs as the "rules of the game" that all Nostr applications follow to ensure they can work together seamlessly.

## Why NIPs Matter

### 🔗 **Interoperability**
NIPs ensure that a note posted from Damus can be read on Amethyst, Iris, or any other Nostr client.

### 🚀 **Innovation**
New features can be proposed, tested, and standardized through the NIP process.

### 📋 **Standardization**
Common patterns and best practices are documented for developers.

### 🔄 **Evolution**
The protocol can evolve while maintaining backward compatibility.

## Core NIPs (Essential)

These NIPs form the foundation of Nostr and should be implemented by all clients:

### **NIP-01: Basic Protocol Flow Description**
The foundation of Nostr - defines events, signatures, and basic communication.

**Key concepts:**
- Event structure and serialization
- Digital signatures using Schnorr
- Basic relay communication patterns
- Event kinds and their meanings

```json
{
  "id": "event-id",
  "pubkey": "author-pubkey",
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "Hello Nostr!",
  "sig": "signature"
}
```

### **NIP-02: Follow List**
Defines how users follow each other and manage contact lists.

```json
{
  "kind": 3,
  "tags": [
    ["p", "pubkey1", "relay-url", "alice"],
    ["p", "pubkey2", "relay-url", "bob"]
  ],
  "content": ""
}
```

**Use cases:**
- Building social graphs
- Contact management
- Relay recommendations
- Petname systems

### **NIP-19: bech32-encoded entities**
Human-readable identifiers for Nostr entities.

```
npub1... (public keys)
nsec1... (private keys)  
note1... (note IDs)
nprofile1... (profiles with relay hints)
nevent1... (events with relay hints)
naddr1... (addresses for replaceable events)
nrelay1... (relay URLs)
```

## Communication NIPs

### **NIP-04: Encrypted Direct Message** (Deprecated)
⚠️ **Note: Deprecated in favor of NIP-17**

Enables private messaging between users using shared secrets.

```json
{
  "kind": 4,
  "tags": [["p", "recipient-pubkey"]],
  "content": "encrypted-message-content?iv=initialization-vector"
}
```

### **NIP-17: Private Direct Messages** (Current Standard)
Modern encrypted messaging with improved security.

**Key improvements:**
- Gift wrap pattern for metadata protection
- Better forward secrecy
- Reduced metadata leakage

### **NIP-10: Text Notes and Threads**
Standardizes how to reference other notes and create threads.

```json
{
  "kind": 1,
  "tags": [
    ["e", "root-event-id", "", "root"],
    ["e", "reply-to-id", "", "reply"],
    ["p", "mentioned-pubkey"]
  ],
  "content": "This is a reply"
}
```

**Tag markers:**
- `root`: Points to the thread root
- `reply`: Points to the direct parent
- `mention`: References without reply semantics

## Identity and Verification

### **NIP-05: Mapping Nostr keys to DNS-based internet identifiers**
Links Nostr identities to domain names for verification.

**Process:**
1. User sets `nip05` field in profile: `"alice@example.com"`
2. Client fetches `https://example.com/.well-known/nostr.json?name=alice`
3. Verifies pubkey matches

```json
{
  "names": {
    "alice": "npub1..."
  },
  "relays": {
    "npub1...": ["wss://relay.example.com"]
  }
}
```

### **NIP-39: External Identities in Profiles**
Link external platforms to Nostr profiles.

```json
{
  "kind": 0,
  "content": "{\"name\":\"Alice\"}",
  "tags": [
    ["i", "github:alice", "https://github.com/alice"],
    ["i", "twitter:alice_crypto", "https://twitter.com/alice_crypto"]
  ]
}
```

## Content Types

### **NIP-23: Long-form Content**
Enables publishing articles and long-form content.

```json
{
  "kind": 30023,
  "tags": [
    ["d", "article-slug"],
    ["title", "My Article Title"],
    ["summary", "Article summary"],
    ["published_at", "1234567890"]
  ],
  "content": "# Article Content\n\nThis is a long article..."
}
```

### **NIP-25: Reactions**
Standardizes reactions (likes, hearts, etc.) to events.

```json
{
  "kind": 7,
  "tags": [
    ["e", "reacted-event-id"],
    ["p", "reacted-event-author"],
    ["k", "1"]
  ],
  "content": "🤙"
}
```

### **NIP-18: Reposts**
Two types of reposts:

**Generic Repost (Kind 6):**
```json
{
  "kind": 6,
  "tags": [["e", "reposted-event-id"]],
  "content": ""
}
```

**Quote Repost (Kind 1):**
```json
{
  "kind": 1,
  "tags": [["q", "quoted-event-id"]],
  "content": "This is interesting: nostr:note1..."
}
```

## Lightning Integration

### **NIP-57: Lightning Zaps**
Enables Bitcoin Lightning payments (zaps) on Nostr.

**Zap Request (Kind 9734):**
```json
{
  "kind": 9734,
  "tags": [
    ["p", "recipient-pubkey"],
    ["amount", "21000"],
    ["relays", "wss://relay1.com", "wss://relay2.com"]
  ],
  "content": "Great post! ⚡"
}
```

**Zap Receipt (Kind 9735):**
```json
{
  "kind": 9735,
  "tags": [
    ["bolt11", "lightning-invoice"],
    ["description", "zap-request-event"],
    ["p", "recipient-pubkey"]
  ]
}
```

### **NIP-47: Wallet Connect**
Allows remote wallet control for Lightning payments.

**Supported commands:**
- `pay_invoice`
- `pay_keysend`
- `make_invoice`
- `lookup_invoice`
- `get_balance`
- `get_info`

## Relay Operations

### **NIP-11: Relay Information Document**
Relays provide metadata about their capabilities.

```json
{
  "name": "My Relay",
  "description": "A Nostr relay",
  "pubkey": "relay-pubkey",
  "contact": "admin@relay.com",
  "supported_nips": [1, 2, 9, 11, 15, 16, 20, 22],
  "software": "strfry",
  "version": "0.9.6",
  "limitation": {
    "max_message_length": 16384,
    "max_subscriptions": 300,
    "max_limit": 5000,
    "auth_required": false,
    "payment_required": false
  }
}
```

### **NIP-42: Authentication of clients to relays**
Enables authenticated connections to relays.

**Authentication flow:**
1. Relay sends AUTH challenge
2. Client signs challenge with private key
3. Relay verifies signature
4. Authenticated session established

### **NIP-50: Search Capability**
Standardizes search functionality across relays.

```json
{
  "kinds": [1],
  "search": "nostr protocol",
  "limit": 20
}
```

## Advanced Features

### **NIP-26: Delegated Event Signing** (Unrecommended)
⚠️ **Note: Adds complexity for little gain**

Allows delegation of signing authority to other keys.

### **NIP-44: Encrypted Payloads (Versioned)**
Improved encryption standard for sensitive data.

**Version 2 features:**
- ChaCha20-Poly1305 encryption
- HMAC authentication
- Versioned format for upgrades

### **NIP-59: Gift Wrap**
Advanced encryption pattern for maximum privacy.

**Layers:**
1. **Rumor**: The actual event content
2. **Seal**: Encrypted rumor with metadata
3. **Gift Wrap**: Public event containing the seal

### **NIP-65: Relay List Metadata**
Users publish their preferred relays.

```json
{
  "kind": 10002,
  "tags": [
    ["r", "wss://relay1.com"],
    ["r", "wss://relay2.com", "write"],
    ["r", "wss://relay3.com", "read"]
  ]
}
```

## Specialized Applications

### **NIP-15: Nostr Marketplace**
E-commerce on Nostr.

**Product listing (Kind 30017):**
```json
{
  "kind": 30017,
  "tags": [
    ["d", "product-id"],
    ["title", "Product Name"],
    ["price", "100", "USD"],
    ["location", "New York, NY"]
  ],
  "content": "{\"name\":\"Product\",\"description\":\"...\"}"
}
```

### **NIP-52: Calendar Events**
Event planning and scheduling.

**Time-based event (Kind 31923):**
```json
{
  "kind": 31923,
  "tags": [
    ["d", "event-id"],
    ["title", "Nostr Meetup"],
    ["start", "1234567890"],
    ["end", "1234571490"],
    ["location", "San Francisco"]
  ]
}
```

### **NIP-53: Live Activities**
Real-time streaming and live events.

**Live event (Kind 30311):**
```json
{
  "kind": 30311,
  "tags": [
    ["d", "stream-id"],
    ["title", "Live Coding Session"],
    ["streaming", "https://stream.example.com"],
    ["status", "live"]
  ]
}
```

## Development and Management

### **NIP-34: git stuff**
Git repository management on Nostr.

**Repository announcement (Kind 30617):**
```json
{
  "kind": 30617,
  "tags": [
    ["d", "repo-id"],
    ["name", "my-project"],
    ["clone", "https://github.com/user/repo"],
    ["web", "https://github.com/user/repo"]
  ]
}
```

### **NIP-90: Data Vending Machines**
Decentralized computing services.

**Job request (Kind 5000-5999):**
```json
{
  "kind": 5000,
  "tags": [
    ["i", "input-data"],
    ["output", "text/plain"],
    ["relays", "wss://relay.com"]
  ],
  "content": "Please analyze this data"
}
```

## Complete NIP Reference

Based on the protocol document, here are all current NIPs:

### Core Protocol
- **NIP-01**: Basic protocol flow description
- **NIP-02**: Follow List
- **NIP-03**: OpenTimestamps Attestations for Events
- **NIP-04**: Encrypted Direct Message (deprecated)
- **NIP-05**: Mapping Nostr keys to DNS-based internet identifiers
- **NIP-06**: Basic key derivation from mnemonic seed phrase
- **NIP-07**: window.nostr capability for web browsers
- **NIP-08**: Handling Mentions (deprecated)
- **NIP-09**: Event Deletion Request
- **NIP-10**: Text Notes and Threads
- **NIP-11**: Relay Information Document
- **NIP-13**: Proof of Work
- **NIP-14**: Subject tag in text events
- **NIP-15**: Nostr Marketplace

### Communication & Social
- **NIP-17**: Private Direct Messages
- **NIP-18**: Reposts
- **NIP-19**: bech32-encoded entities
- **NIP-21**: nostr: URI scheme
- **NIP-22**: Comment
- **NIP-23**: Long-form Content
- **NIP-24**: Extra metadata fields and tags
- **NIP-25**: Reactions
- **NIP-26**: Delegated Event Signing (unrecommended)
- **NIP-27**: Text Note References
- **NIP-28**: Public Chat

### Advanced Features
- **NIP-29**: Relay-based Groups
- **NIP-30**: Custom Emoji
- **NIP-31**: Dealing with Unknown Events
- **NIP-32**: Labeling
- **NIP-34**: git stuff
- **NIP-35**: Torrents
- **NIP-36**: Sensitive Content
- **NIP-37**: Draft Events
- **NIP-38**: User Statuses
- **NIP-39**: External Identities in Profiles
- **NIP-40**: Expiration Timestamp

### Authentication & Security
- **NIP-42**: Authentication of clients to relays
- **NIP-44**: Encrypted Payloads (Versioned)
- **NIP-45**: Counting results
- **NIP-46**: Nostr Remote Signing
- **NIP-47**: Nostr Wallet Connect
- **NIP-48**: Proxy Tags
- **NIP-49**: Private Key Encryption

### Discovery & Search
- **NIP-50**: Search Capability
- **NIP-51**: Lists
- **NIP-52**: Calendar Events
- **NIP-53**: Live Activities
- **NIP-54**: Wiki
- **NIP-55**: Android Signer Application
- **NIP-56**: Reporting
- **NIP-57**: Lightning Zaps
- **NIP-58**: Badges
- **NIP-59**: Gift Wrap

### Specialized Applications
- **NIP-60**: Cashu Wallet
- **NIP-61**: Nutzaps
- **NIP-62**: Request to Vanish
- **NIP-64**: Chess (PGN)
- **NIP-65**: Relay List Metadata
- **NIP-66**: Relay Discovery and Liveness Monitoring
- **NIP-68**: Picture-first feeds
- **NIP-69**: Peer-to-peer Order events
- **NIP-70**: Protected Events
- **NIP-71**: Video Events
- **NIP-72**: Moderated Communities
- **NIP-73**: External Content IDs
- **NIP-75**: Zap Goals
- **NIP-77**: Negentropy Syncing
- **NIP-78**: Application-specific data
- **NIP-7D**: Threads
- **NIP-84**: Highlights

### Infrastructure & Tools
- **NIP-86**: Relay Management API
- **NIP-88**: Polls
- **NIP-89**: Recommended Application Handlers
- **NIP-90**: Data Vending Machines
- **NIP-92**: Media Attachments
- **NIP-94**: File Metadata
- **NIP-96**: HTTP File Storage Integration
- **NIP-98**: HTTP Auth
- **NIP-99**: Classified Listings

## NIP Status and Development

### Status Levels

- **Draft**: Under active development, subject to changes
- **Proposed**: Stable specification, ready for implementation  
- **Final**: Widely implemented and stable
- **Deprecated**: No longer recommended

### Development Process

1. **Proposal**: Identify need and write initial specification
2. **Discussion**: Community review and feedback
3. **Implementation**: Prototype and test
4. **Adoption**: Multiple implementations and usage
5. **Finalization**: Specification stabilizes

### Contributing to NIPs

**How to contribute:**
- Join discussions on GitHub and Telegram
- Propose improvements to existing NIPs
- Submit new NIPs for missing functionality
- Implement and test proposed specifications
- Provide feedback on draft NIPs

**NIP writing guidelines:**
- Be specific and unambiguous
- Include examples and test cases
- Consider security implications
- Ensure backward compatibility when possible
- Follow existing formatting conventions

## Implementation Strategy

### For Client Developers

**Minimum viable client:**
- NIP-01 (Basic protocol)
- NIP-02 (Contact lists)
- NIP-19 (Bech32 encoding)
- NIP-25 (Reactions)

**Enhanced client:**
- NIP-10 (Text note references)
- NIP-17 (Private messages)
- NIP-23 (Long-form content)
- NIP-57 (Lightning zaps)

**Advanced client:**
- NIP-42 (Relay authentication)
- NIP-50 (Search)
- NIP-65 (Relay lists)
- Application-specific NIPs

### For Relay Operators

**Basic relay:**
- NIP-01 (Basic protocol)
- NIP-11 (Relay information)
- NIP-20 (Command results)

**Enhanced relay:**
- NIP-42 (Authentication)
- NIP-50 (Search)
- NIP-65 (Relay metadata)

## Testing NIP Compatibility

### Client Testing
```javascript
// Check which NIPs a client supports
const supportedNIPs = client.getSupportedNIPs()
console.log('Supported NIPs:', supportedNIPs)

// Test specific functionality
if (supportedNIPs.includes(57)) {
  // Client supports zaps
  enableZapFeatures()
}
```

### Relay Testing
```bash
# Query relay information
curl -H "Accept: application/nostr+json" https://relay.example.com

# Check supported NIPs
{
  "supported_nips": [1, 2, 9, 11, 15, 16, 20, 22, 33, 40]
}
```

## Resources

- **NIPs Repository**: [github.com/nostr-protocol/nips](https://github.com/nostr-protocol/nips)
- **NIP Discussion**: [Telegram](https://t.me/nostr_protocol)
- **Implementation Examples**: [github.com/nostr-protocol/nostr](https://github.com/nostr-protocol/nostr)
- **NIP Status Tracker**: [nips.nostr.com](https://nips.nostr.com)

!!! info "Stay Updated"
    NIPs are constantly evolving. Follow the GitHub repository and join community discussions to stay informed about new developments and proposals.

!!! tip "Implementation Strategy"
    Start with core NIPs (1, 2, 19) and gradually add more advanced features. Focus on interoperability and user experience over feature completeness.

## Next Steps

Now that you understand NIPs, explore:

- [Relays and Communication](../relays/) - How NIPs work in practice
- [Building Applications](../../tutorials/) - Implementing NIPs in code
- [Advanced Features](../advanced/) - Specialized NIPs for your use case
