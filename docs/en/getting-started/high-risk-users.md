# Practical Scenarios: Journalists, Organizers, and At-Risk Users

!!! info "Who this guide is for"
    This lesson is for people who need Nostr as a **communications tool**, not as a developer playground: journalists, organizers, and users in high-risk environments. You do not need to write code.

    By the end you will know how to:

    - Create a **separate** Nostr identity that is not tied to your real name
    - Publish and read notes without depending on one company or one server
    - Choose clients and relays with privacy in mind
    - Avoid the most common mistakes that deanonymize people
    - Know what Nostr **does not** protect you from

!!! warning "Honest limits"
    Nostr gives you **portable identity** and **resistance to a single platform banning you**. It does not make you invisible. Relays can see your IP address unless you take extra steps. Photos, writing style, zap payments, and posting times can still identify you. Treat this as a practical checklist, not a guarantee.

## Why Nostr matters in high-risk settings

Traditional platforms can:

- Suspend an account and erase a source network overnight
- Demand a phone number or government ID
- Hand over account data to a government or employer
- Silently throttle or shadowban coverage of a protest or investigation

On Nostr:

- **You** hold the private key. That *is* the account.
- Notes are signed events. Anyone can verify they came from that key.
- You publish to **several relays**. One hostile operator cannot globally delete you.
- You can switch apps (Damus, Primal, Amethyst, Coracle, …) without rebuilding your identity.

That only helps if you **do not mix** this key with your real-world identity.

---

## Scenario 1 — Journalist covering a sensitive story

**Goal:** Publish updates and talk to sources without tying the key to your byline, newsroom laptop, or personal social accounts.

### Setup (do this once, on a dedicated device if you can)

1. Install a reputable client. Prefer one that stores keys on-device and supports a signer (NIP-07 browser extension or a remote signer such as nsec.app / Amber) instead of pasting your `nsec` into random websites.
2. **Generate a new key pair.** Do not reuse the key from your public journalist profile.
3. Write the `nsec` (or seed) **offline** — paper, not a screenshot, not email, not iCloud notes.
4. Fill kind-0 profile metadata with a **role**, not a name: e.g. `Field notes | protest coverage` and a generic picture. No newsroom logo, no face, no city in the bio if that city is identifying.
5. Add **several** relays in different jurisdictions. Do not rely on a single popular relay.

### Publishing

- Write as if the note will be read by an adversary tomorrow. No hotel names, no “I just landed in…”, no photos with location metadata.
- Strip EXIF from images before posting, or don’t post images from the field at all.
- Prefer **text** for time-sensitive updates. Images and video are high-risk.
- If a source must contact you, give them **this npub only** through a channel you already trust. Do not advertise “DM me for leaks” on your public byline account.

### Talking to sources

- Default DMs on many clients (older NIP-04) leak metadata. Prefer clients that implement **private DMs (NIP-17 / gift wrap)** when the conversation is sensitive.
- Never ask a source to install a random app you have not verified.
- Agree in advance what happens if the key is burned: you rotate to a new npub and tell trusted people out of band.

### Burn checklist

If you think the key is compromised: **stop using it**. Generate a new key. Tell sources through a different channel. You cannot “reset a password” on Nostr.

---

## Scenario 2 — Organizer coordinating a community

**Goal:** Broadcast public information (time, place, legal support) while keeping planning and membership lists off the public feed.

### Split identities on purpose

| Key | Use it for | Do not use it for |
|-----|------------|-------------------|
| **Public organizer npub** | Announcements, mutual aid requests, links to lawyers | Membership lists, private addresses, who is coming |
| **Working-group npub** | Shared only with trusted people | Public posts, zaps from a KYC exchange that names you |
| **Personal npub** | Friends, jokes, zaps | Anything about the action |

Using one key for everything is the most common organizer mistake.

### Public announcements

- Post the same note to **multiple relays** so a single operator cannot take down the announcement.
- Put critical facts in the **text of the note**, not only in an image (images fail on slow connections and are harder to archive).
- Use a consistent hashtag or `t` tag so people can follow the topic without following you.

### Private coordination

- Membership and logistics belong in **encrypted group chat or NIP-17 DMs**, not in a public thread.
- Do not @-mention people who have not agreed to be visible.
- If you run a community relay, write a clear policy: what you log, how long you keep events, and how people request deletion (NIP-09 is best-effort — relays may keep a copy).

### After the event

- Assume public notes are permanent, even if you send a deletion.
- Rotate the working-group key if devices were seized or accounts were coerced.

---

## Scenario 3 — At-risk user who needs to speak without a real-name account

**Goal:** Get on Nostr in under 30 minutes without linking a phone number, email, or national ID.

### First 30 minutes

1. **New key. New profile. New device profile** if possible (separate browser profile or phone user).
2. Do not name the account after your Twitter, Instagram, or email.
3. Connect to 3–5 relays. Include at least one you did not pick from a random tweet.
4. Read before you post. Follow a few npubs you trust. Confirm notes actually appear in another client.
5. Only then publish. First note: no selfies, no workplace, no “my real name is…”.

### Network privacy (plain language)

| Risk | What happens | Practical response |
|------|----------------|-------------------|
| Relay sees your IP | The relay operator may log who connected | Use Tor or a trusted VPN **before** opening the client |
| Phone number | Many “easy” apps ask for it | Use a client that does not require a phone number |
| Lightning zaps | Payments can link to a KYC exchange | Do not zap from an exchange in your legal name if you need anonymity |
| Screenshots | Other people can repost you | Write accordingly |

### What to post — and what not to

**Safer:** general analysis, documentation of public events, copies of already-public documents, links.

**Dangerous:** live location, family photos, ID documents, “I am the only nurse on tonight’s shift at X hospital”, anything a local authority could use to find a house or a workplace.

---

## Shared rules (all three scenarios)

1. **One purpose per key.** Mixing identities is how people get found.
2. **Never paste your `nsec` into a website.** Use a signer extension or a mobile signer.
3. **Backup the key offline.** Lose the key, lose the identity. There is no support desk.
4. **Several relays, not one.** Censorship resistance is a *habit*, not a slogan.
5. **Assume public notes last forever.**
6. **Nostr does not hide your IP by itself.** Combine with Tor/VPN when the threat model requires it.
7. **Verify clients.** Download from official sites or F-Droid / App Store listings you have checked, not from ads.

## Suggested client starting points

These change over time. Check current recommendations, then verify the download source:

- **iOS:** Damus, Primal
- **Android:** Amethyst, Primal
- **Web (with a signer):** Coracle, Snort — use a NIP-07 extension; do not paste `nsec`
- **Hardening:** a dedicated signer (browser extension or Amber-style app) so websites never see the private key

## How this connects to the rest of LearnNostr

- Keys and backups: [Keys](../concepts/keys.md) and [Module 2](../modules/module-02-keys-identity.md)
- Relays and why multiples matter: [Relays](../concepts/relays.md) and [Module 4](../modules/module-04-relays-architecture.md)
- Encryption, DMs, and threat models: [Module 9: Security & Privacy](../modules/module-09-security.md)
- First client walkthrough (technical): [Build a Simple Client](../tutorials/simple-client.md)

## Quick checklist

- [ ] I created a **new** key for this purpose, not my public personal key
- [ ] The `nsec` is written down offline, not in cloud photos
- [ ] Profile has no real name, face, or workplace
- [ ] I am connected to more than one relay
- [ ] I am not pasting my private key into websites
- [ ] I know Nostr does not hide my IP by itself
- [ ] I have a plan to **rotate keys** if a device is seized or a source is burned
