---
template: home.html
title: LearnNostr - Learn the decentralized social protocol
hide:
  - toc
  - navigation
  - feedback
---

<!-- Material injects a nav-title heading unless the page already contains <h1 -->

If a company or a government can lock the account, lock the phone number, or delete the post, this is the other path: **keys you hold**, **relays anyone can run**, notes that do not live in one database.

<div class="grid cards" markdown>

-   :material-account-key:{ .lg .middle } **Your keys, your identity**

    ---

    You hold the cryptographic keys. No company can delete your account or speak for you.

    [Keys without cloud accounts →](getting-started/keys-without-accounts.md)

-   :material-network:{ .lg .middle } **Relays, not platforms**

    ---

    Notes live on a network of servers anyone can run. No single operator is the network.

    [Choosing relays →](getting-started/choose-relays.md)

-   :material-shield-account:{ .lg .middle } **Publish under pressure**

    ---

    Pseudonymous identity and secure publishing for people who cannot trust a platform.

    [First hour →](getting-started/first-session.md)

</div>

## Learning path

Two tracks. Same protocol. Pick why you are here.

### Use Nostr when a platform can silence you

Hands-on steps for pseudonymous identity and publishing — the use case Human Rights Foundation funded this site to teach.

<div class="home-path" markdown>

1.  **First hour**  
    Client, keys on paper, three relays, a test note you can see from a second device.  
    [Start →](getting-started/first-session.md)

2.  **Keys without cloud accounts**  
    `nsec` vs `npub`, signers so websites never hold the secret, compartments.  
    [Read →](getting-started/keys-without-accounts.md)

3.  **Choosing relays**  
    What operators log, how to inspect NIP-11, why you write to more than one.  
    [Read →](getting-started/choose-relays.md)

4.  **Field guide**  
    Journalists, organizers, sources, and an incident checklist.  
    [Read →](getting-started/high-risk-users.md)

</div>

Workshops next: [publish and verify a note](tutorials/publish-and-verify.md) · [private messages (NIP-17)](getting-started/private-messages.md)

### Build on Nostr

Four short steps if you want a working client.

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

Same signed event, several relays. A rejection on one is not a global ban.

=== "JavaScript"

    ```javascript
    import { generateSecretKey, finalizeEvent } from 'nostr-tools'
    import { SimplePool } from 'nostr-tools/pool'

    const sk = generateSecretKey()
    const event = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: 'Hello Nostr!',
    }, sk)

    const relays = ['wss://relay.damus.io', 'wss://nos.lol']
    const pool = new SimplePool()
    await Promise.any(pool.publish(relays, event))
    pool.close(relays)
    ```

=== "Python"

    ```python
    import asyncio
    from nostr_sdk import Client, EventBuilder, Keys, NostrSigner

    async def main():
        keys = Keys.generate()
        client = Client(NostrSigner.keys(keys))
        await client.add_relay("wss://relay.damus.io")
        await client.add_relay("wss://nos.lol")
        await client.connect()
        await client.send_event_builder(EventBuilder.text_note("Hello Nostr!"))

    asyncio.run(main())
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        let keys = Keys::generate();
        let client = Client::builder().signer(keys).build();
        client.add_relay("wss://relay.damus.io").await?;
        client.add_relay("wss://nos.lol").await?;
        client.connect().await;
        client
            .send_event_builder(EventBuilder::text_note("Hello Nostr!"))
            .await?;
        Ok(())
    }
    ```
