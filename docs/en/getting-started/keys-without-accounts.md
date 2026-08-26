# Keys without cloud accounts

!!! info "Learning objectives"
    After this lesson you can:

    - Explain why Nostr has **no username, phone number, or password reset**
    - Tell `nsec` from `npub` and keep the secret **off websites and cloud backups**
    - Use a **signer** so a web client never holds the key ([NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md), [NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md))
    - Keep **compartments**: separate keys for public work and sensitive publishing

    Protocol background (optional): [Keys](../concepts/keys.md) · [Module 2](../modules/module-02-keys-identity.md)

---

## The account is a number you hold

Nostr identity is a [secp256k1](https://bips.xyz/340) key pair, the same curve Bitcoin uses.

- The **secret key** signs events. Anyone with it **is** you.
- The **public key** is the address others follow. It cannot be turned back into the secret with any practical attack.

There is no company database of accounts. Relays store **signed events**, not logins. That is why a dictator, an app store, or a social network cannot “delete your account” globally — and why **nobody can restore it** if you lose the secret.

### What you will see in a client

[NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) encodes keys for humans. These prefixes are **display only**. On the wire, events use 32-byte hex.

| You see | Meaning | Safe to share? |
|---------|---------|----------------|
| `npub1…` | Public key | Yes |
| `nsec1…` | Secret key | **No** |
| `note1…` | Event id | Yes (the note is already public) |
| hex, 64 characters | Same keys/ids without a prefix | Secret if it came from `nsec` |

If a string starts with `nsec`, treat it like a loaded wallet seed. Screenshots, chat “saved messages”, and iCloud/Google Photos backups of that screenshot are **cloud copies of the account**.

---

## Generate locally — never in someone else’s form

!!! success "Do this"
    Generate the key **in the client or signer that will use it**, on the device that will use it. Write `nsec` on paper. Test restore.

!!! danger "Do not do this"
    - Paste `nsec` into Coracle, Snort, or any other website
    - Generate a key on a random webpage and trust it did not keep a copy
    - Store `nsec` in Gmail, iCloud Keychain synced to a seized phone, or a password manager tied to your legal name **if this identity must stay unnamed**
    - Reuse a key you already posted from a real-name profile

### Hands-on: prove you own the key (no website)

This uses [nak](https://github.com/fiatjaf/nak), a command-line tool. Use a **throwaway** key for practice — not the identity you will keep.

```bash
# Generate a throwaway key. This prints nsec / npub.
nak key generate
```

You can convert formats without talking to a relay:

```bash
# npub → hex public key (safe to share the output)
nak decode npub1exampleexampleexampleexampleexampleexampleexampleexamp
```

Do **not** put a real `nsec` in shell history. If you must sign from a terminal, pass the key from a file with locked permissions, then delete the file.

---

## Signers: the secret stays off the website

A **signer** is software that holds `nsec` and only returns signatures.

### NIP-07 — browser extension

A NIP-07 extension injects `window.nostr` into the page. The page may request your public key and ask you to sign. It **must not** receive the secret.

```javascript
// The website never sees nsec. The extension prompts you to approve.
if (!window.nostr) {
  throw new Error('Install a NIP-07 signer (nos2x, Alby, …)')
}

const pubkey = await window.nostr.getPublicKey() // hex, per NIP-07

const signed = await window.nostr.signEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Signed without giving the site my nsec',
})

console.log(signed.id, signed.sig, signed.pubkey)
```

If `window.nostr` is missing, the site is asking you to paste a key. Leave.

### NIP-46 — remote signer (“bunker”)

[NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md) lets a client send `sign_event` requests to a signer on another device. The client holds a **disposable** keypair used only to talk to the bunker. The user’s signing key stays on the bunker.

You will see connection strings such as `bunker://…` or `nostrconnect://…`. Only paste those into **the signer you installed**, not into a chat with a stranger.

### Android signers

On Android, a dedicated signer app (Amber is the usual example) can approve signatures for other apps so those apps never store `nsec`. Prefer that over typing `nsec` into every client.

---

## Backups that do not recreate a company account

| Method | Use when | Risk |
|--------|----------|------|
| Paper, two places | Default for a lasting identity | Fire, theft, someone photographing the paper |
| Steel plate | Long-term, harsh conditions | Same as paper, plus you must store it |
| Encrypted file **offline** | You already use a password manager well | The password manager account may be in your legal name |
| Hardware device | High-value public identity | Cost, setup; still back up the seed |
| Cloud screenshot | Never | That *is* handing the account to Apple/Google |

Test restore **before** the identity matters. If a phone is seized, assume the key on it is burned. Make a **new** key. Do not “change the display name” on the old one.

---

## Compartments (this is how people stay unnamed)

One human, several keys:

| Key | Public? | Job |
|-----|---------|-----|
| Civic / byline | Yes | Work you will stand behind with your name |
| Field / sensitive | No | Reporting, organizing, or speech that must not point at you |
| Personal | Maybe | Friends. Never the field key |

Follow lists (`kind 3`, [NIP-02](https://github.com/nostr-protocol/nips/blob/master/02.md)) are **public**. Following your byline npub from the field npub **links them**. So do zaps, replies, shared unusual phrasing, and a NIP-05 name on a domain you own.

Profiles (`kind 0`) are public JSON. Extra fields such as `lud16` (Lightning address) and NIP-05 identifiers are convenience **and** name tags. For a secret compartment, leave them empty.

---

## Code: generate and encode keys yourself

Use this only on a machine you control. These snippets create a **new** throwaway key and print the public `npub`. They do not publish anything.

=== "JavaScript (nostr-tools)"

    ```javascript
    import { generateSecretKey, getPublicKey } from 'nostr-tools'
    import { npubEncode, nsecEncode } from 'nostr-tools/nip19'

    const sk = generateSecretKey()           // Uint8Array, 32 bytes
    const pk = getPublicKey(sk)              // hex

    console.log('share this:', npubEncode(pk))
    // Keep nsecEncode(sk) off the screen if anyone can see it.
    ```

=== "Python (nostr-sdk)"

    ```python
    from nostr_sdk import Keys

    keys = Keys.generate()
    print("share this:", keys.public_key().to_bech32())
    # keys.secret_key().to_bech32()  # nsec — do not print on a shared machine
    ```

=== "Rust (nostr-sdk)"

    ```rust
    use nostr_sdk::prelude::*;

    fn main() {
        let keys = Keys::generate();
        println!("share this: {}", keys.public_key().to_bech32().unwrap());
        // keys.secret_key() is the nsec. Do not log it.
    }
    ```

---

## Hands-on exercises

!!! example "Exercise A — restore drill"
    1. Generate a throwaway key in a signer or client.
    2. Write `nsec` on paper. Close the app / delete the profile.
    3. Restore from paper only. Confirm the `npub` matches.
    4. Destroy the throwaway (or keep it as a practice key, never as a real one).

!!! example "Exercise B — refuse the paste box"
    1. Open a web client in a **fresh** profile.
    2. Confirm it offers NIP-07 (or refuse to log in).
    3. If it only offers “paste nsec”, close the tab.

!!! example "Exercise C — compartment check"
    On paper, list every place the field `npub` appears (profile, follows, Lightning, NIP-05, GitHub bio, newsroom page). Each entry is a link. Cross out anything that points at your legal name.

---

## Next

- [Your first hour](first-session.md) — if you have not published a test note yet
- [Choosing relays](choose-relays.md) — where those signatures actually go
- [Field guide](high-risk-users.md) — journalists, sources, organizers
