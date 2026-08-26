# Learn Private AI

!!! info "Who this path is for"
    You need to use AI **without handing prompts, documents, or your name** to OpenAI, Google, Anthropic, or the ISP that can see those HTTPS hosts.

    This is education on LearnNostr — not Maple, Routstr, Ollama, or anyone else’s product. We link their **current docs** and give copy-paste labs. We do not re-host their software.

    Four labs. Do them in order. Local first; paid/remote only when local is not enough.

!!! warning "AI is not a source-protection tool by itself"
    A model that runs on your laptop still **outputs text**. If you paste that text onto a relay, the note is public. If you paste a source’s name into *any* remote API, that operator (or their upstream) may keep it. Pair this path with [Your first hour](../getting-started/first-session.md) and the [field guide](../getting-started/high-risk-users.md).

---

## Why this exists

Cloud chat products are convenient because they are **accounts**: email, phone, credit card, a log of every prompt. For someone living under censorship that log is evidence.

Human Rights Foundation’s AI-for-rights work is about **individual control of inference** — the same sovereignty this site already teaches for identity and publishing. This track is the grant artifact for that: a short path a journalist or organizer can finish.

## The four labs

<div class="grid cards" markdown>

-   **1. Cloud AI is surveillance**

    ---

    What not to type, who logs it, KYC payments, and jurisdiction.

    [Start →](cloud-surveillance.md)

-   **2. Run a model locally**

    ---

    Install Ollama, keep the weights on disk, finish a real rewrite **offline**.

    [Lab →](run-local.md)

-   **3. When local is not enough**

    ---

    Maple (TEE + attestation) and Routstr (Nostr discovery + Cashu) — as their docs describe them, including what they do **not** hide.

    [Lab →](maple-routstr.md)

-   **4. Publish without leaking the prompt**

    ---

    How Nostr keys, relays, and AI queries interact. Worked example: sanitize locally, then publish only the public note.

    [Lab →](publish-without-leaking.md)

</div>

## Decision rule (keep this on paper)

| Situation | Default |
|-----------|---------|
| Draft, translate, or rewrite **sensitive** notes | **Local** open-weight model ([lab 2](run-local.md)) |
| Need a stronger model, still not OpenAI/Google/Anthropic plaintext | Maple’s documented TEE path ([lab 3](maple-routstr.md)) |
| Need permissionless pay-per-request, no credit card | Routstr’s documented Cashu path — **read the prompt-privacy warning first** |
| Anything you would not put in a `kind 1` note | Do not paste it into a remote model |

---

## Next

Start with [why cloud AI is a surveillance risk](cloud-surveillance.md). If you already know that and have a machine that can run a small model, skip to [run locally](run-local.md).
