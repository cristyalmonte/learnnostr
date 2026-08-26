# Your first hour on Nostr

!!! info "Who this is for"
    You do not need to write code. You need a way to **publish and read without creating a company account**.

    By the end of this hour you should have:

    - A **new key** that never lived in a cloud password manager you did not choose
    - A **paper backup** of the secret (`nsec`)
    - A client that **does not demand a phone number**
    - Notes written to **more than one relay**
    - Proof that a **second device or browser** can see the note

    If you are a journalist, organizer, or anyone facing targeted surveillance, read this page, then continue with the [field guide](high-risk-users.md).

!!! warning "Nostr is not anonymous by default"
    Relays see your **IP address** unless you connect through Tor or a trusted VPN **before** opening the client. Notes are **public**. There is **no password reset**.

---

## 0. One sentence before you install anything

Write this on paper:

> Who might try to silence or unmask me, and what happens if they succeed?

That sentence decides whether you use a daily phone, a dedicated browser profile, or a throwaway key. A public hobby account and a reporting identity are different jobs. Do not mix them.

---

## 1. Network first, then the app

Order matters:

1. Connect **Tor** (preferred for anonymity) or a VPN you did not pay for with a personal card.
2. Open a **new browser profile** or a phone user that is **not** logged into Google, Apple, or a work account.
3. Only then install or open a Nostr client.

!!! danger "Do not paste an `nsec` into a website"
    If a page asks you to “log in” by pasting your secret key, leave. Use a [signer](keys-without-accounts.md#signers-the-secret-stays-off-the-website) (NIP-07 in the browser, or an Android signer such as Amber) so the website never holds the key.

---

## 2. Pick a client (starting points, not endorsements)

Clients change quickly. Verify the publisher. None of these require a phone number.

| You have | Start with | Keep the key in |
|----------|------------|-----------------|
| iPhone | Damus or Primal from the official App Store listing | The app (dedicated device is safer) |
| Android | Amethyst or Primal from F-Droid / the project’s own site — **not** a random APK | The app, or Amber so other apps never see `nsec` |
| Laptop | Coracle or Snort **plus** a NIP-07 extension (nos2x, Alby, or similar) | The extension, never the website |

Re-check permissions after every update. A client is a window onto relays. It is **not** your account.

---

## 3. Create the key on this device

1. Use **Generate** / **Create account** in the client or signer. Do this **offline enough**: you should not be generating a secret on a random “key tool” website.
2. You will see two strings:

    | String | Prefix | Share it? |
    |--------|--------|-----------|
    | Public key | `npub1…` | Yes. This is your address. |
    | Secret key | `nsec1…` | **Never.** This *is* the account. |

3. Write the `nsec` on **paper** (two copies, two places if this identity must last). Do not screenshot it. Do not send it to yourself on WhatsApp, Signal, iCloud Notes, or email.
4. Confirm you can **restore** from that paper in a second profile **before** you publish anything you care about.

There is no customer support. [NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) only encodes keys for humans (`npub` / `nsec`). The protocol itself uses hex. Loss of `nsec` is loss of that identity.

---

## 4. Relays: write to several, read from several

A relay is a server that stores JSON events. Anyone can run one. **One operator is not the network.**

In the client, add **at least three** write relays in **more than one country** if you can. Then:

- Publish a **boring** test note: `learnnostr first-hour test` — no city, no workplace, no selfie.
- Open a **second** client (library computer, friend’s phone, or a private window with a different client) and search for your `npub`.
- If the note is missing, that relay dropped or never stored it. That is normal. Add another relay and publish again. The **same signed event** can be sent to many relays; they cannot forge it, but they can refuse it.

How to choose, inspect, and mix relays is the next lesson: [Choosing relays](choose-relays.md).

---

## 5. Profile: keep it a role, not a passport

Your profile is a `kind 0` event ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)): a signed JSON blob with a name, about text, and picture URL. It is **public** and **replaceable**.

For a first hour, use:

- A generic name (`Field notes`, `Civic updates`)
- No photo of your face
- No website, NIP-05 address, or Lightning address

You can add those later on a **public** identity you intend to stand behind. Do not add them to a compartment you need unnamed. Details: [Keys without cloud accounts](keys-without-accounts.md).

---

## Hands-on: finish this checklist

!!! example "First-hour exercise"

    Do these in order. Check them off on paper.

    - [ ] Threat sentence written
    - [ ] Tor or VPN **before** the client
    - [ ] New browser profile or phone user
    - [ ] Client installed from an official listing
    - [ ] New key generated on this device
    - [ ] `nsec` on paper; restore tested
    - [ ] At least three relays
    - [ ] Test note published (no identifying details)
    - [ ] Same note visible from a **second** client or device
    - [ ] Profile has no real name, NIP-05, or KYC Lightning

---

## What you just proved

1. **You can have an identity without a company.** No email, no SMS.
2. **A single app store or a single relay cannot globally erase you.** Copies live where you sent them.
3. **The secret is the account.** Cloud “backup” of `nsec` is someone else holding the account.

That is the HRF use case in practice: pseudonymous identity and publishing that does not depend on a platform remaining friendly.

---

## Next

<div class="grid cards" markdown>

-   **Keys without cloud accounts**

    ---

    How `nsec` / `npub` work, signers, backups, and how people unmask themselves.

    [Read →](keys-without-accounts.md)

-   **Choosing relays**

    ---

    What operators see, how to inspect a relay, and why you write to more than one.

    [Read →](choose-relays.md)

-   **Field guide**

    ---

    Journalists, organizers, sources, and incident checklists.

    [Read →](high-risk-users.md)

</div>
