# Cloud AI is a surveillance risk

!!! info "Lab 1 — no install yet"
    By the end you can list **who sees a ChatGPT/Gemini/Claude prompt**, what a payment trail adds, and which strings must never leave the device.

    Write the answers on paper. Do not type your real threat model into a cloud chatbot to “check.”

---

## What you hand over when you “just ask ChatGPT”

A typical hosted assistant is not a notebook. It is a **remote program** tied to an account.

| Layer | What it can retain | Why it matters under a dictator |
|-------|--------------------|----------------------------------|
| Account | Email, phone, Google/Apple ID | Ties the prompt log to a legal person |
| Prompt & files | The text you typed, PDFs, photos | Source names, locations, plans |
| Metadata | IP, time, device, approximate locale | “This person queried X from this café” |
| Payment | Card, PayPal, app-store account | KYC; subpoena to the processor |
| Policy | Training, review, “trust and safety” | Humans or other models may read the log |
| Jurisdiction | US / EU / other vendor HQ | Local law + the vendor’s law |

You cannot audit the server. “We don’t train on your data” is a **policy**, not a protocol. Policies change; logs get copied; staff get warrants.

Nostr already taught this pattern: if a company can lock the account, they can also **produce the history**.

---

## What not to type (ever) into a hosted model

Treat the composer like a form that will be read in court.

Do **not** paste:

- Source names, phone numbers, handles, or “the driver who…”
- Live location, checkpoints, hotel, workplace, or unique schedules
- Unpublished documents, leak dumps, or photos with EXIF
- Your `nsec`, seed phrases, or signer PINs (models will happily echo them)
- Your field `npub` plus a story that only you could have written (stylometry + identity)
- Medical, family, or blackmail material “just to rewrite it”

Safe enough for a **hosted** model only if you would already publish it as a `kind 1` note.

!!! danger "The rewrite trick still leaks"
    “Please remove names from this transcript” **sends the names**. The model seeing the secret is the failure, even if the reply looks clean.

---

## Payments are identity

Cloud AI is rarely free at the volume a researcher needs.

- A **credit card** is a name, address, and bank.
- **App Store / Play** billing is the same Apple or Google account you were told not to mix with a field identity.
- **Crypto paid from a KYC exchange** is still a name if the deposit can be clustered.

If you later use Bitcoin or Cashu for a private provider, fund it in a way that does **not** point at the same legal identity as the field npub. The [zaps warning](../getting-started/high-risk-users.md#8-money-zaps-and-why-they-unmask-people) applies to AI credits too.

---

## Network: the ISP does not need the prompt

Even with HTTPS, a local network operator sees **that** you opened `openai.com` or `gemini.google.com`, when, and how much. In a country that filters those hosts, the connection attempt itself is a signal.

Tor or a trusted VPN **before** the browser changes what the ISP sees. It does **not** stop OpenAI from seeing the prompt if you still send it there.

Order is the same as Nostr: [network first, then the app](../getting-started/first-session.md#1-network-first-then-the-app).

---

## Hands-on (still offline)

!!! example "Exercise — write the red list"

    On paper, three columns:

    1. **Never leaves this room** (names, files, nsec)
    2. **May go to a local model only** (drafts, translations of public facts)
    3. **May go to a remote API** (text you would publish anyway)

    Put today’s real work into those columns. If column 1 is empty, you are not thinking about a real adversary yet.

!!! example "Exercise — vendor map"

    Pick one product you have used (ChatGPT, Gemini, Claude, Copilot, a “free VPN AI”). From memory, write: login method, payment method, company HQ. You do not need their privacy policy. The point is that you **cannot** see the disk.

---

## What “private enough” looks like on this site

1. **Local open-weight model** — prompt never leaves the machine ([next lab](run-local.md)).
2. **Remote with a published security story you can check** — Maple’s TEE + attestation, or Routstr’s pay-without-account path, with their **documented limits** ([lab 3](maple-routstr.md)).
3. **Publish only the public remainder** on Nostr ([lab 4](publish-without-leaking.md)).

---

## Next

[Run an open-weight model locally](run-local.md)
