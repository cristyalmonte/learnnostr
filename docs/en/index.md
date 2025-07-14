---
template: home.html
title: LearnNostr - Learn the decentralized social protocol
hide:
  - toc
  - navigation
  - feedback
---

# Why LearnNostr?

<div class="grid cards" markdown>

-   :material-account-key:{ .lg .middle } __True Digital Identity__

    ---

    Own your identity with cryptographic keys. No central authority can delete your account, censor your content, or control your digital presence.

    [:octicons-arrow-right-24: Learn About Keys](concepts/keys.md)

-   :material-network:{ .lg .middle } __Censorship Resistant__

    ---

    Built on a decentralized network of relays that no single entity controls. Your voice can't be silenced by corporations or governments.

    [:octicons-arrow-right-24: Getting Started](getting-started/what-is-nostr.md)

-   :material-lightning-bolt:{ .lg .middle } __Lightning Integration__

    ---

    Seamless Bitcoin payments through Lightning Network integration. Send and receive value instantly across the protocol.

    [:octicons-arrow-right-24: Build Applications](tutorials/simple-client.md)

</div>

<style>
/* Hero section styling */
.hero {
    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    margin: -2rem -2rem 2rem -2rem;
    border-radius: 0 0 1rem 1rem;
}

.hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
}

.hero-button {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    display: inline-block;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.hero-button:hover {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

/* Learning Path Header */
.learning-path-header {
    text-align: center;
    padding: 1rem 0;
    margin: -1.5rem 0 1rem;  /* Increased negative top margin to pull it much higher */
}

.learning-path-header h1 {
    font-size: 1.8rem;
    margin: 0 0 0.5rem;
    color: #9C27B0;
    font-weight: 700;
}

.learning-path-header p {
    font-size: 0.9rem;
    color: var(--md-default-fg-color--light);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.4;
}

/* Reduce spacing around horizontal rules */
hr {
    margin: 1rem 0 !important;
}

/* Target the area right before Learning Path to reduce spacing */
.learning-path-header + * {
    margin-top: 0.5rem;
}

/* Reduce spacing after the feature cards section */
.grid.cards {
    margin-bottom: 1rem !important;
}

/* Learning Path Grid - Compact Responsive Design */
.learning-path-grid {
    display: grid;
    gap: 0.75rem;
    margin: 1rem 0;
    /* Default: 2x2 grid for large screens */
    grid-template-columns: repeat(2, 1fr);
}

/* Tablet layout: 2x2 grid maintained */
@media screen and (max-width: 76rem) and (min-width: 60rem) {
    .learning-path-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

/* Small tablet layout: 2x2 grid maintained */
@media screen and (max-width: 59.9375rem) and (min-width: 48rem) {
    .learning-path-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

/* Mobile layout: single column */
@media screen and (max-width: 47.9375rem) {
    .learning-path-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}

/* Learning Path Cards - More Compact */
.learning-path-grid .card {
    background: var(--md-default-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    position: relative;
    overflow: hidden;
}

.learning-path-grid .card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.12);
    border-color: #9C27B0;
}

.learning-path-grid .card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #9C27B0, #7B1FA2);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.learning-path-grid .card:hover:before {
    opacity: 1;
}

.learning-path-grid .card h3 {
    color: #9C27B0;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.learning-path-grid .card p {
    margin-bottom: 0.75rem;
    line-height: 1.4;
    font-size: 0.85rem;
}

.learning-path-grid .card ul {
    margin: 0.5rem 0 0.75rem;
    padding-left: 1rem;
}

.learning-path-grid .card li {
    margin-bottom: 0.15rem;
    color: var(--md-default-fg-color--light);
    font-size: 0.8rem;
}

.learning-path-grid .card .md-button {
    background: #9C27B0;
    color: white;
    border-radius: 4px;
    padding: 0.3rem 0.7rem;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
    transition: all 0.2s ease;
    font-size: 0.8rem;
}

.learning-path-grid .card .md-button:hover {
    background: #7B1FA2;
    transform: translateX(2px);
}

/* General grid cards (for other sections) - keep existing responsive behavior */
.grid.cards:not(.learning-path-grid) {
    display: grid;
    gap: 2rem;
    margin: 2rem 0;
}

@media screen and (min-width: 76rem) {
    .grid.cards:not(.learning-path-grid) {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (min-width: 60rem) and (max-width: 75.9375rem) {
    .grid.cards:not(.learning-path-grid) {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (max-width: 59.9375rem) {
    .grid.cards:not(.learning-path-grid) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
</style>

<div class="learning-path-header" markdown>
# 🎯 Learning Path
**Master Nostr in 4 Progressive Steps** — From understanding the basics to building your own applications, this guided learning path will take you from beginner to developer.

</div>

<div class="learning-path-grid" markdown>

<div class="card" markdown>

:material-school:{ .lg .middle } **Start Here: Protocol Fundamentals**

---
**New to Nostr?** Begin with the basics. Learn what makes Nostr different from traditional social platforms and understand the core concepts that power this decentralized protocol.

**What you'll learn:**

• Protocol architecture and design principles  
• Decentralization vs. centralized platforms  
• Basic terminology and concepts

[:octicons-arrow-right-24: Start Learning](getting-started/what-is-nostr.md){ .md-button }

</div>

<div class="card" markdown>

:material-key-variant:{ .lg .middle } **Master: Identity & Security**

---

**Essential Skills.** Dive deep into cryptographic keys, digital signatures, and identity management. These concepts are fundamental to everything you'll build on Nostr.

**What you'll learn:**

• Public/private key cryptography  
• Digital identity and signatures  
• Security best practices

[:octicons-arrow-right-24: Master Keys](concepts/keys.md){ .md-button }

</div>

<div class="card" markdown>

:material-code-tags:{ .lg .middle } **Build: Your First Application**

---

**Hands-on Development.** Put theory into practice by building real Nostr applications. Learn to connect to relays, publish events, and create interactive experiences.

**What you'll build:**

• Simple Nostr client  
• Event publishing system  
• Relay communication

[:octicons-arrow-right-24: Start Building](tutorials/simple-client.md){ .md-button }

</div>

<div class="card" markdown>

:material-library:{ .lg .middle } **Reference: Complete Definitions**

---

**Deep Dive Resources.** Access comprehensive definitions and explanations of all Nostr concepts, protocols, and technical specifications in one organized location.

**What you'll find:**

• Technical definitions and explanations  
• Protocol specifications (NIPs)  
• Development tools and libraries

[:octicons-arrow-right-24: Browse Definitions](definitions.md){ .md-button }

</div>

</div>

## Code Example

Here's how to publish your first event to the Nostr network:

=== "JavaScript"

    ```javascript
    import { generatePrivateKey, getPublicKey, finishEvent, relayInit } from 'nostr-tools'

    // Generate your identity
    const sk = generatePrivateKey()
    const pk = getPublicKey(sk)

    // Create an event
    const event = finishEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: 'Hello Nostr!',
    }, sk)

    // Publish to relay
    const relay = relayInit('wss://relay.damus.io')
    await relay.connect()
    await relay.publish(event)
    ```

=== "Python"

    ```python
    from nostr.key import PrivateKey
    from nostr.event import Event
    from nostr.relay_manager import RelayManager
    import time

    # Generate identity
    private_key = PrivateKey()
    public_key = private_key.public_key

    # Create event
    event = Event(
        kind=1,
        content="Hello Nostr!",
        created_at=int(time.time())
    )
    private_key.sign_event(event)

    # Publish event
    relay_manager = RelayManager()
    relay_manager.add_relay("wss://relay.damus.io")
    relay_manager.publish_event(event)
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        // Generate keys
        let keys = Keys::generate();

        // Connect to relay
        let client = Client::new(&keys);
        client.add_relay("wss://relay.damus.io", None).await?;
        client.connect().await;

        // Publish event
        let event = EventBuilder::new_text_note("Hello Nostr!", &[])
            .to_event(&keys)?;
        
        client.send_event(event).await?;
        Ok(())
    }
    ```

