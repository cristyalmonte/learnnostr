# Essential Nostr Tools

The Nostr ecosystem has a rich collection of tools for developers, relay operators, and users. This guide covers the most important tools you'll need for working with Nostr.

## Development Tools

### 1. Nostr-Tools (JavaScript/TypeScript)

The most popular JavaScript library for Nostr development.

```bash
npm install nostr-tools
```

**Key Features:**
- Event creation and signing
- Key generation and management
- Relay communication
- NIP implementations

```javascript
import { generatePrivateKey, getPublicKey, finishEvent, relayInit } from 'nostr-tools'

// Generate keys
const sk = generatePrivateKey()
const pk = getPublicKey(sk)

// Create event
const event = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Hello Nostr!'
}, sk)
```

### 2. Python-Nostr

Python library for Nostr protocol implementation.

```bash
pip install nostr
```

```python
from nostr.key import PrivateKey
from nostr.event import Event
from nostr.relay_manager import RelayManager

# Generate keys
private_key = PrivateKey()
public_key = private_key.public_key

# Create event
event = Event(
    kind=1,
    content="Hello from Python!",
    created_at=int(time.time())
)
private_key.sign_event(event)
```

### 3. Nostr-SDK (Rust)

High-performance Rust library with bindings for multiple languages.

```toml
[dependencies]
nostr-sdk = "0.24"
```

```rust
use nostr_sdk::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let keys = Keys::generate();
    let client = Client::new(&keys);
    
    client.add_relay("wss://relay.damus.io", None).await?;
    client.connect().await;
    
    let event = EventBuilder::new_text_note("Hello Rust!", &[])
        .to_event(&keys)?;
    
    client.send_event(event).await?;
    Ok(())
}
```

## Command Line Tools

### 1. Nostril

Command-line tool for creating and publishing Nostr events.

```bash
# Install
go install github.com/fiatjaf/nostril@latest

# Create a text note
nostril --content "Hello Nostr!" --sec <your-private-key>

# Publish to relay
nostril --content "Hello!" --sec <key> | websocat wss://relay.damus.io
```

### 2. Nak

Swiss Army knife for Nostr operations.

```bash
# Install
go install github.com/fiatjaf/nak@latest

# Generate keys
nak key generate

# Publish note
nak event --content "Hello!" --sec <key> wss://relay.damus.io

# Query events
nak req -k 1 --limit 10 wss://relay.damus.io
```

### 3. Nostr-CLI

Python-based CLI tool for Nostr operations.

```bash
# Install
pip install nostr-cli

# Generate keys
nostr-cli generate-keys

# Publish note
nostr-cli publish --content "Hello!" --private-key <key> --relay wss://relay.damus.io

# Subscribe to events
nostr-cli subscribe --kinds 1 --limit 10 --relay wss://relay.damus.io
```

## Key Management Tools

### 1. Alby Extension

Browser extension for key management and signing.

- **Features**: Key storage, event signing, Lightning integration
- **Platforms**: Chrome, Firefox, Safari
- **Website**: [getalby.com](https://getalby.com)

### 2. Nos2x

Lightweight browser extension for Nostr key management.

- **Features**: Simple key storage, event signing
- **Platforms**: Chrome, Firefox
- **GitHub**: [github.com/fiatjaf/nos2x](https://github.com/fiatjaf/nos2x)

### 3. Nostore

Advanced key management with multiple account support.

- **Features**: Multiple keys, backup/restore, hardware wallet support
- **Platform**: Browser extension
- **GitHub**: [github.com/ursuscamp/nostore](https://github.com/ursuscamp/nostore)

## Relay Tools

### 1. Relay Tester

Tool for testing relay functionality and performance.

```bash
# Install
npm install -g nostr-relay-tester

# Test relay
nostr-relay-tester wss://relay.damus.io
```

### 2. Relay Monitor

Monitor relay health and statistics.

```bash
# Install
go install github.com/fiatjaf/relay-monitor@latest

# Monitor relay
relay-monitor --relay wss://relay.damus.io --interval 30s
```

### 3. Strfry Tools

Administrative tools for Strfry relay.

```bash
# Export events
./strfry export --since=1day > events.jsonl

# Import events
./strfry import < events.jsonl

# Database statistics
./strfry stats

# Compact database
./strfry compact
```

## Development Utilities

### 1. Nostr Debugger

Web-based tool for debugging Nostr events and relays.

- **URL**: [nostrdebug.com](https://nostrdebug.com)
- **Features**: Event inspection, relay testing, key validation

### 2. Nostr Army Knife

Multi-purpose web tool for Nostr operations.

- **URL**: [nak.nostr.com](https://nak.nostr.com)
- **Features**: Key generation, event creation, relay queries

### 3. Nostr.band

Analytics and search tool for the Nostr network.

- **URL**: [nostr.band](https://nostr.band)
- **Features**: Network statistics, event search, trending content

## Testing Tools

### 1. Nostr Test Suite

Comprehensive test suite for Nostr implementations.

```bash
# Clone repository
git clone https://github.com/nostr-protocol/nostr-test-suite.git
cd nostr-test-suite

# Run tests
npm install
npm test
```

### 2. Relay Benchmark

Performance testing tool for relays.

```bash
# Install
go install github.com/fiatjaf/relay-benchmark@latest

# Benchmark relay
relay-benchmark --relay wss://relay.damus.io --connections 100 --duration 60s
```

## Monitoring and Analytics

### 1. Nostr.watch

Real-time relay monitoring and statistics.

- **URL**: [nostr.watch](https://nostr.watch)
- **Features**: Relay uptime, performance metrics, geographic distribution

### 2. Stats.nostr.band

Network-wide statistics and analytics.

- **URL**: [stats.nostr.band](https://stats.nostr.band)
- **Features**: User growth, event volume, relay statistics

### 3. Relay.tools

Comprehensive relay analysis and monitoring.

- **URL**: [relay.tools](https://relay.tools)
- **Features**: Relay comparison, performance analysis, NIP support

## Content Creation Tools

### 1. Habla

Long-form content publishing on Nostr.

- **URL**: [habla.news](https://habla.news)
- **Features**: Article publishing, markdown support, commenting

### 2. Highlighter

Highlight and share content on Nostr.

- **URL**: [highlighter.com](https://highlighter.com)
- **Features**: Content highlighting, social sharing, discovery

### 3. Zap.stream

Live streaming platform built on Nostr.

- **URL**: [zap.stream](https://zap.stream)
- **Features**: Live streaming, chat integration, zaps

## Mobile Development

### 1. Nostr-React-Native

React Native components for Nostr apps.

```bash
npm install nostr-react-native
```

### 2. NostrKit (iOS)

Swift library for iOS Nostr development.

```swift
import NostrKit

let keys = Keys.generate()
let client = NostrClient(keys: keys)
```

### 3. Nostr-Android

Android library for Nostr integration.

```gradle
implementation 'com.github.nostr:nostr-android:1.0.0'
```

## Backup and Migration Tools

### 1. Nostr Backup

Tool for backing up your Nostr data.

```bash
# Install
npm install -g nostr-backup

# Backup profile and notes
nostr-backup --pubkey <your-pubkey> --output backup.json
```

### 2. Profile Migrator

Migrate profiles between different Nostr clients.

```bash
# Export from client A
nostr-export --client damus --output profile.json

# Import to client B
nostr-import --client amethyst --input profile.json
```

## Security Tools

### 1. Key Validator

Validate Nostr keys and addresses.

```bash
# Install
npm install -g nostr-key-validator

# Validate key
nostr-validate-key <public-key>
```

### 2. Event Verifier

Verify event signatures and integrity.

```bash
# Verify event signature
nostr-verify-event <event-json>
```

## Integration Tools

### 1. Zapier Integration

Connect Nostr to other services via Zapier.

- **Features**: Automated workflows, cross-platform integration
- **Use cases**: Social media cross-posting, notification systems

### 2. IFTTT Connector

If This Then That integration for Nostr.

- **Features**: Trigger-based automation
- **Use cases**: Smart home integration, productivity workflows

## Getting Started Recommendations

### For Developers
1. Start with **nostr-tools** (JavaScript) or **nostr-sdk** (Rust)
2. Use **nostril** or **nak** for command-line testing
3. Set up **nostr-debugger** for development debugging

### For Relay Operators
1. Use **strfry** with its built-in tools
2. Monitor with **nostr.watch** and **relay.tools**
3. Test with **relay-tester** and **relay-benchmark**

### For Content Creators
1. Install **Alby** or **nos2x** for key management
2. Use **habla.news** for long-form content
3. Try **zap.stream** for live streaming

### For Power Users
1. Use **nak** for advanced operations
2. Set up **nostr-backup** for data safety
3. Monitor network with **nostr.band** and **stats.nostr.band**

## Tool Comparison Matrix

| Tool | Language | Use Case | Difficulty | Active |
|------|----------|----------|------------|--------|
| nostr-tools | JS/TS | Development | Easy | ✅ |
| nostr-sdk | Rust | Development | Medium | ✅ |
| nostril | Go | CLI | Easy | ✅ |
| nak | Go | CLI | Easy | ✅ |
| strfry | C++ | Relay | Hard | ✅ |
| Alby | Browser | Keys | Easy | ✅ |

## Contributing to Tools

Many Nostr tools are open source and welcome contributions:

1. **Find issues**: Look for "good first issue" labels
2. **Documentation**: Help improve tool documentation
3. **Testing**: Report bugs and test new features
4. **Development**: Submit pull requests for new features

## Resources

- [Awesome Nostr](https://github.com/aljazceru/awesome-nostr) - Comprehensive tool list
- [Nostr Protocol](https://github.com/nostr-protocol/nostr) - Official protocol repository
- [NIPs Repository](https://github.com/nostr-protocol/nips) - Protocol specifications
- [Nostr Dev Chat](https://t.me/nostr_dev) - Developer community

!!! tip "Tool Selection"
    Choose tools based on your specific needs and technical expertise. Start with simpler tools and gradually move to more advanced ones as you become comfortable with the Nostr ecosystem. 