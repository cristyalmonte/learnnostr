---
template: home.html
title: LearnNostr - Learn the decentralized social protocol
hide:
  - toc
  - navigation
  - feedback
---

<!-- Material injects a nav-title heading unless the page already contains <h1 -->

<div class="grid cards" markdown>

-   :material-account-key:{ .lg .middle } **Your keys, your identity**

    ---

    You hold the cryptographic keys. No company can delete your account or speak for you.

    [Keys →](concepts/keys.md)

-   :material-network:{ .lg .middle } **Relays, not platforms**

    ---

    Notes live on a network of servers anyone can run. No single operator is the network.

    [What is Nostr? →](getting-started/what-is-nostr.md)

-   :material-lightning-bolt:{ .lg .middle } **Bitcoin built in**

    ---

    Lightning zaps send value over the same protocol as notes and identity.

    [Build a client →](tutorials/simple-client.md)

</div>

## Learning path

Four short steps, from first note to a working client.

<div class="home-path" markdown>

1.  **What is Nostr?**  
    How the protocol works, and why it is not a social network.  
    [Start →](getting-started/what-is-nostr.md)

2.  **Keys & identity**  
    Signatures, npubs, and how accounts stay yours.  
    [Read →](concepts/keys.md)

3.  **Build a client**  
    Connect to a relay and publish an event.  
    [Tutorial →](tutorials/simple-client.md)

4.  **Reference**  
    Terms, NIPs, and tools in one place.  
    [Browse →](definitions.md)

</div>

## Publish a note

=== "JavaScript"

    ```javascript
    import { generateSecretKey, getPublicKey, finalizeEvent, Relay } from 'nostr-tools'

    const sk = generateSecretKey()
    const pk = getPublicKey(sk)

    const event = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: 'Hello Nostr!',
    }, sk)

    const relay = await Relay.connect('wss://relay.damus.io')
    await relay.publish(event)
    ```

=== "Python"

    ```python
    from nostr.key import PrivateKey
    from nostr.event import Event
    from nostr.relay_manager import RelayManager
    import time

    private_key = PrivateKey()
    event = Event(kind=1, content="Hello Nostr!", created_at=int(time.time()))
    private_key.sign_event(event)

    relay_manager = RelayManager()
    relay_manager.add_relay("wss://relay.damus.io")
    relay_manager.publish_event(event)
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        let keys = Keys::generate();
        let client = Client::new(&keys);
        client.add_relay("wss://relay.damus.io").await?;
        client.connect().await;
        client.publish_text_note("Hello Nostr!", []).await?;
        Ok(())
    }
    ```
