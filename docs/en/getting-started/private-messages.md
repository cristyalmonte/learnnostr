# Private messages

!!! info "Learning objectives"
    After this lesson you can:

    - Treat **public notes** (`kind 1`) as public, forever
    - Explain why legacy DMs ([NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md)) leak **who talked to whom**
    - Use **private DMs** ([NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md)) only in a client that actually implements them
    - Publish an **inbox relay list** (`kind 10050`) — and understand that **no list means “not ready to receive”**
    - Introduce sources **out of band**, never by following them in public

    Developers who need encryption internals: [Module 9](../modules/module-09-security.md) (NIP-44, gift wrap).

!!! warning "Encrypted is not the same as unnamed"
    Gift wrap hides much of the **public** graph. It does not hide your IP from the inbox relay. It does not stop a source from outing themselves by zapping you from their real npub. It does not beat a seized phone that still has the key.

---

## Public by default

If you type it into the main composer, it is a `kind 1` event. Relays store it. Search indexes scrape it. Assume a prosecutor, an employer, or a screenshot account has it.

Use public notes for **facts you can stand behind** or for a throwaway test. Use another channel for anything that would burn a person.

---

## NIP-04 vs NIP-17 (plain language)

The NIP list marks NIP-04 **unrecommended**, replaced by NIP-17.

| | NIP-04 (legacy DM) | NIP-17 (private DM) |
|--|--------------------|---------------------|
| Event you see on relays | `kind 4`, your pubkey, their pubkey in tags | `kind 1059` gift wrap, **random** wrapper key |
| Content | Encrypted (old scheme, no authentication) | [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md) inside a [NIP-59](https://github.com/nostr-protocol/nips/blob/master/59.md) seal + wrap |
| Who talked to whom | **Visible** | Hidden from the public firehose |
| When | `created_at` is the real time | Seal and wrap timestamps are **randomized up to two days back** |
| If the client is vague | Assume NIP-04 | Confirm it says NIP-17 / gift wrap |

NIP-17 chat messages are unsigned **rumors** of `kind 14` (text) or `kind 15` (files). They are sealed as `kind 13` (signed by the sender) and gift-wrapped as `kind 1059` (signed by a **fresh random key** per wrap). Clients **must** check that the seal pubkey matches the rumor pubkey, or anyone could impersonate anyone.

You send a wrap **to each recipient and to yourself** so you can read the thread later on another device.

### Inbox relays (`kind 10050`)

NIP-17 says clients **MUST** publish gift wraps only to relays in the recipient’s `kind 10050` list:

```json
{
  "kind": 10050,
  "tags": [
    ["relay", "wss://inbox.nostr.wine"],
    ["relay", "wss://myrelay.nostr1.com"]
  ],
  "content": ""
}
```

Keep that list **small** (1–3). If someone has **no** `kind 10050`, they are **not ready to receive** NIP-17 messages. Do not invent a mailbox for them.

Relays **SHOULD** serve `kind 1059` only to the `p`-tagged user, using [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) AUTH. Not every relay does. Prefer inbox relays that document this.

---

## Practice: look up inbox relays before you DM

This does **not** send a message. It only fetches a public `kind 10050` (or shows that none exists).

=== "JavaScript (nostr-tools)"

    ```javascript
    import { nip19 } from 'nostr-tools'
    import { SimplePool } from 'nostr-tools/pool'

    const npub = 'npub1…' // paste a public npub you have reason to contact
    const pk = nip19.decode(npub).data

    const relays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://purplepag.es']
    const pool = new SimplePool()
    const events = await pool.querySync(relays, {
      kinds: [10050],
      authors: [pk],
      limit: 1,
    })
    pool.close(relays)

    if (!events.length) {
      console.log('No kind 10050 — this user is not ready for NIP-17 DMs.')
    } else {
      const inboxes = events[0].tags
        .filter((t) => t[0] === 'relay')
        .map((t) => t[1])
      console.log('inbox relays:', inboxes)
    }
    ```

=== "CLI (nak)"

    ```bash
    nak req -k 10050 --limit 1 --author npub1… \
      wss://relay.damus.io wss://purplepag.es
    ```

If you are building a client, implement wrap/unwrap from NIP-17/NIP-59 in a library that already does it (`nostr-tools` NIP-59 helpers, `nostr-sdk` gift wrap APIs). Do not hand-roll encryption. This lesson does not paste a full wrapper: the spec is exact about random wrapper keys, randomized timestamps, and sealing **unsigned** rumors.

---

## How people leak the graph anyway

Even with NIP-17:

- You or they **follow** each other in public (`kind 3`)
- You **@-mention** them in a `kind 1`
- You **zap** from a KYC wallet
- You send a NIP-04 DM “just this once”
- You both post from the same café Wi‑Fi without Tor
- You keep their name in a **public** list (`kind 30000` lists are often public)

For sources and organizers, the [field guide](high-risk-users.md) is the operational document. This page is the protocol reason those rules exist.

---

## Hands-on exercises

!!! example "Exercise 1 — public vs private"
    Publish a throwaway `kind 1` that says `this is public`. Fetch it with `nak req` from a relay you do not usually use. That is the control experiment: anything in the main composer is that easy to copy.

!!! example "Exercise 2 — client audit"
    Open your client’s DM screen. Find whether it documents **NIP-17** (or “gift wrap”). If it only says “encrypted DMs,” treat it as NIP-04 until proven otherwise. Write the result on paper.

!!! example "Exercise 3 — inbox list"
    With a throwaway identity, publish `kind 10050` to 1–2 relays you inspected, **or** decide not to receive DMs at all. Then query it from a second machine. If you cannot fetch your own inbox list, neither can a sender who follows the spec.

!!! example "Exercise 4 — out-of-band intro"
    Write the steps you would use to give a source your field `npub` **without** posting “DM me” on a real-name account. (In person, existing encrypted mail, a printed QR of the `npub` only — never the `nsec`.)

---

## Next

- [Field guide](high-risk-users.md) — sources, organizers, incident checklist
- [Publish and verify](../tutorials/publish-and-verify.md) — public notes, deletion limits
- [Module 9: Security & Privacy](../modules/module-09-security.md) — NIP-44 and implementation
