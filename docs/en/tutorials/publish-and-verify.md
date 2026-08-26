# Publish and verify a note

!!! info "What you will do"
    This is a **workshop**, not a protocol lecture. You will:

    1. Sign a `kind 1` text note ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) / [NIP-10](https://github.com/nostr-protocol/nips/blob/master/10.md))
    2. Send **the same event** to more than one relay
    3. Fetch it back **without trusting the first client’s UI**
    4. See what a deletion request ([NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md)) does — and what it does **not**

    Use a **throwaway key**. Do not practice with an identity you need to keep.

!!! tip "No-code path"
    If you do not want a terminal, do sections 1, 3, and 5 with two different clients (for example Damus and a web client with a NIP-07 signer). The rule is the same: **verify from a second window**.

---

## Why this is the censorship-resistance drill

Platforms make publishing look like a round-trip to one company. On Nostr, publishing is “here is a signed JSON object; please store a copy.” Verification is “did **independent** mailboxes actually keep it?”

Until you have done that once, “relays, not platforms” is a slogan.

---

## 1. Create a boring note

Content should not identify you: no city, workplace, photo, or unique catchphrase.

Good: `learnnostr workshop — throwaway`

The event on the wire looks like this (fields from NIP-01):

```json
{
  "id": "<32-byte hex sha256 of the serialized event>",
  "pubkey": "<32-byte hex public key>",
  "created_at": 1710000000,
  "kind": 1,
  "tags": [],
  "content": "learnnostr workshop — throwaway",
  "sig": "<64-byte hex Schnorr signature of id>"
}
```

`id` is `sha256` of the UTF-8 JSON array `[0, pubkey, created_at, kind, tags, content]`. Relays and other clients recompute it. If someone mutates `content`, the signature fails.

---

## 2. Publish from code (optional)

Replace the example relays if they are down. Inspect [NIP-11](../getting-started/choose-relays.md#nip-11) first.

=== "JavaScript (nostr-tools)"

    ```javascript
    import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools'
    import { npubEncode, noteEncode } from 'nostr-tools/nip19'
    import { SimplePool } from 'nostr-tools/pool'

    const sk = generateSecretKey()
    const pk = getPublicKey(sk)
    console.log('throwaway npub:', npubEncode(pk))

    const event = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['t', 'learnnostr']],
      content: 'learnnostr workshop — throwaway',
    }, sk)

    if (!verifyEvent(event)) throw new Error('bad signature')
    console.log('note id:', noteEncode(event.id))

    const relays = [
      'wss://relay.damus.io',
      'wss://nos.lol',
      'wss://relay.primal.net',
    ]

    const pool = new SimplePool()
    const pubs = pool.publish(relays, event)
    for (const [i, p] of pubs.entries()) {
      try {
        await p
        console.log('accepted', relays[i])
      } catch (err) {
        console.log('rejected', relays[i], err)
      }
    }
    ```

=== "Python (nostr-sdk)"

    ```python
    import asyncio
    from nostr_sdk import Client, EventBuilder, Keys, NostrSigner

    RELAYS = [
        "wss://relay.damus.io",
        "wss://nos.lol",
        "wss://relay.primal.net",
    ]

    async def main():
        keys = Keys.generate()
        print("throwaway npub:", keys.public_key().to_bech32())

        client = Client(NostrSigner.keys(keys))
        for url in RELAYS:
            await client.add_relay(url)
        await client.connect()

        output = await client.send_event_builder(
            EventBuilder.text_note("learnnostr workshop — throwaway")
        )
        print("accepted:", output.success)
        print("rejected:", output.failed)

    asyncio.run(main())
    ```

=== "Rust (nostr-sdk)"

    ```rust
    use nostr_sdk::prelude::*;
    use std::time::Duration;

    #[tokio::main]
    async fn main() -> Result<()> {
        let keys = Keys::generate();
        println!("throwaway npub: {}", keys.public_key().to_bech32()?);

        let client = Client::builder().signer(keys.clone()).build();
        for url in [
            "wss://relay.damus.io",
            "wss://nos.lol",
            "wss://relay.primal.net",
        ] {
            client.add_relay(url).await?;
        }
        client.connect().await;

        let output = client
            .send_event_builder(EventBuilder::text_note(
                "learnnostr workshop — throwaway",
            ))
            .await?;
        println!("id: {}", output.id().to_bech32()?);
        println!("accepted: {:?}", output.success);
        println!("rejected: {:?}", output.failed);

        let filter = Filter::new()
            .kind(Kind::TextNote)
            .author(keys.public_key())
            .limit(5);
        let events = client.fetch_events(filter, Duration::from_secs(10)).await?;
        println!("fetched {} notes back", events.len());
        Ok(())
    }
    ```

=== "CLI (nak)"

    ```bash
    # Throwaway only. Avoid putting nsec on the command line if you can.
    nak event -k 1 --content "learnnostr workshop — throwaway" \
      wss://relay.damus.io wss://nos.lol
    ```

If a library version errors on `text_note` or `send_event_builder`, query the published id with `nak req` instead — that path does not depend on SDK names.

---

## 3. Verify from a second mailbox

Do **not** only look at the client that just said “posted.”

**No-code:** open a different client, paste the `npub`, confirm the note.

**CLI:** query each relay separately so you can see who actually stored it:

```bash
nak req -k 1 --limit 5 --author <npub-or-hex> wss://relay.damus.io
nak req -k 1 --limit 5 --author <npub-or-hex> wss://nos.lol
```

A relay may reply `["OK", "<id>", false, "blocked: …"]` or `rate-limited: …` ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) prefixes). That is **that operator’s** policy. Send the same event elsewhere.

**Web:** some search sites index public notes. Use them only with a throwaway; they are more observers.

---

## 4. Republish is allowed (and expected)

Events are immutable. You do not “edit on the server.” You send the **same** signed object again to new relays. Clients that already have it should treat it as a duplicate (`duplicate:` in an `OK` message is success).

If one jurisdiction blocks a popular relay, your job is: **keep copies on other relays**, and tell readers a `nevent` or `nprofile` that includes relay hints ([NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md)) when you can.

---

## 5. “Delete” is a request (NIP-09)

A `kind 5` event asks relays to drop **your** events listed in `e` (or `a`) tags. Relays **SHOULD** comply for events with the same pubkey. They are **not required** to. Other relays, archives, screenshots, and clients that already downloaded the note keep it.

```javascript
import { finalizeEvent } from 'nostr-tools'

const deletion = finalizeEvent({
  kind: 5,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ['e', eventIdHex],
    ['k', '1'],
  ],
  content: 'published for a workshop; please drop',
}, sk)
```

The `k` tag is recommended by [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md) so relays know the kind being requested.

!!! warning "Assume public notes are forever"
    If the text would harm a source in a screenshot, do not publish it. Deletion will not save you.

---

## Hands-on checklist

!!! example "Workshop complete when"

    - [ ] Throwaway key (not your real identity)
    - [ ] Note published to **≥ 2** relays
    - [ ] Note fetched from a **second** client or from `nak req` on a specific relay
    - [ ] You recorded which relay accepted and which refused
    - [ ] You know NIP-09 is a request, not an eraser
    - [ ] You discarded or isolated the throwaway `nsec`

---

## Next

- [Private messages](../getting-started/private-messages.md) — when not to put it in `kind 1`
- [Build a simple client](simple-client.md) — if you want a UI around this loop
- [Field guide](../getting-started/high-risk-users.md)
