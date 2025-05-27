---
title: LearnNostr - Master the Decentralized Social Protocol
hide:
  - navigation
  - toc
---

<div class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title">
      <span class="gradient-text">Learn Nostr</span>
    </h1>
    <p class="hero-subtitle">
      Master the decentralized social protocol that's revolutionizing online communication
    </p>
    <div class="hero-buttons">
      <a href="getting-started/what-is-nostr/" class="btn btn-primary">
        <span class="material-icons">rocket_launch</span> Get Started
      </a>
      <a href="tutorials/simple-client/" class="btn btn-secondary">
        <span class="material-icons">code</span> Build Your First App
      </a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="nostr-network">
      <div class="node relay"></div>
      <div class="node client"></div>
      <div class="node client"></div>
      <div class="node client"></div>
      <div class="connection"></div>
      <div class="connection"></div>
      <div class="connection"></div>
    </div>
  </div>
</div>

## Why Learn Nostr?

<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon"><span class="material-icons">key</span></div>
    <h3>Own Your Identity</h3>
    <p>Your identity is cryptographically secured and portable across all Nostr applications.</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon"><span class="material-icons">hub</span></div>
    <h3>Censorship Resistant</h3>
    <p>Decentralized relay network ensures your content can't be silenced by any single authority.</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon"><span class="material-icons">flash_on</span></div>
    <h3>Lightning Fast</h3>
    <p>Simple protocol design enables real-time communication with minimal overhead.</p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon"><span class="material-icons">extension</span></div>
    <h3>Extensible</h3>
    <p>NIPs (Nostr Implementation Possibilities) allow for endless innovation and new features.</p>
  </div>
</div>

## Interactive Learning Path

<div class="learning-path">
  <div class="path-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <h3><a href="getting-started/what-is-nostr/">Understanding Nostr</a></h3>
      <p>Learn the fundamentals of the Nostr protocol and its core principles</p>
      <div class="step-tags">
        <span class="tag">Beginner</span>
        <span class="tag">15 min</span>
      </div>
    </div>
  </div>
  
  <div class="path-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <h3><a href="concepts/keys/">Keys & Identity</a></h3>
      <p>Master cryptographic keys and how identity works in Nostr</p>
      <div class="step-tags">
        <span class="tag">Beginner</span>
        <span class="tag">20 min</span>
      </div>
    </div>
  </div>
  
  <div class="path-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <h3><a href="tutorials/simple-client/">Build Your First Client</a></h3>
      <p>Create a working Nostr client from scratch</p>
      <div class="step-tags">
        <span class="tag">Intermediate</span>
        <span class="tag">45 min</span>
      </div>
    </div>
  </div>
</div>

## Code Examples

Get a taste of Nostr development with these interactive examples:

=== "JavaScript"

    ```javascript
    import { generatePrivateKey, getPublicKey, finishEvent, relayInit } from 'nostr-tools'

    // Generate a new keypair
    const sk = generatePrivateKey()
    const pk = getPublicKey(sk)

    // Create and sign an event
    const event = finishEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: 'Hello Nostr! 👋',
    }, sk)

    // Connect to a relay and publish
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

    # Generate a new keypair
    private_key = PrivateKey()
    public_key = private_key.public_key

    # Create and sign an event
    event = Event(
        kind=1,
        content="Hello Nostr! 👋",
        created_at=int(time.time())
    )
    private_key.sign_event(event)

    # Connect to relays and publish
    relay_manager = RelayManager()
    relay_manager.add_relay("wss://relay.damus.io")
    relay_manager.publish_event(event)
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        // Generate a new keypair
        let keys = Keys::generate();

        // Create a client
        let client = Client::new(&keys);
        client.add_relay("wss://relay.damus.io", None).await?;
        client.connect().await;

        // Create and publish an event
        let event = EventBuilder::new_text_note("Hello Nostr! 👋", &[])
            .to_event(&keys)?;
        
        client.send_event(event).await?;
        Ok(())
    }
    ```

---

<div class="footer-cta">
  <h2>Ready to dive into the decentralized future?</h2>
  <p>Start your Nostr journey today and become part of the revolution in social networking.</p>
  <a href="getting-started/what-is-nostr/" class="btn btn-primary btn-large">
    <span class="material-icons">rocket_launch</span> Begin Learning
  </a>
</div> 