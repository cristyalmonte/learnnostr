# LearnNostr

An interactive learning platform for the Nostr protocol built with MkDocs Material.

🌐 **Live Site**: [learnnostr.org](https://learnnostr.org)

LearnNostr is bilingual education for people who cannot trust a company account, a phone-number login, a cloud prompt log, or a single platform remaining online.

**Learn Private AI** is the lead path: a short, completable curriculum for using AI under censorship without handing prompts, documents, or identity to OpenAI, Google, Anthropic, or a local ISP. It is the grant artifact for Cristy Almonte’s HRF **AI for Individual Rights** application. LearnNostr is the classroom — it does not re-host Maple, Routstr, Ollama, Freedom Skills, OpenCode, PlebDevs, or Gen AI.

The original **Nostr under censorship** track (first hour, keys, relays, DMs) remains. Developer modules are still here; they are not the only front door.

## Quick Start

```bash
# Clone and setup
git clone https://github.com/cristyalmonte/learnnostr.git
cd learnnostr

# Install dependencies
pip install -r requirements.txt

# Start development server
source venv/bin/activate  # if using virtual environment
mkdocs serve
```

Visit `http://localhost:8000` to see the site locally.

Build the static site with `mkdocs build`.

## What's Inside

**Learn Private AI** (lead path — four completable labs)

- [Overview](docs/en/private-ai/index.md) — who it is for, decision rule, what this site is not
- [Cloud AI is surveillance](docs/en/private-ai/cloud-surveillance.md) — what not to type, logging, KYC, jurisdiction
- [Run a model locally](docs/en/private-ai/run-local.md) — Ollama, local tags only, a real offline rewrite
- [Maple and Routstr](docs/en/private-ai/maple-routstr.md) — TEE + attestation vs Cashu + Nostr discovery, as their current docs describe them
- [Publish without leaking the prompt](docs/en/private-ai/publish-without-leaking.md) — infer locally, edit by hand, post from a throwaway key

**Using Nostr under censorship** (beginner, no code required)

- [Your first hour](docs/en/getting-started/first-session.md) — client, keys on paper, three relays, a test note
- [Keys without cloud accounts](docs/en/getting-started/keys-without-accounts.md) — `nsec` / `npub`, signers, compartments
- [Choosing relays](docs/en/getting-started/choose-relays.md) — inspect NIP-11, write to more than one operator
- [For journalists & at-risk users](docs/en/getting-started/high-risk-users.md) — field guide
- [Private messages](docs/en/getting-started/private-messages.md) — NIP-17 vs NIP-04
- [Publish and verify a note](docs/en/tutorials/publish-and-verify.md) — hands-on workshop

**Build on Nostr**

- **Getting Started**: protocol overview, Lightning wallets, tools, running a relay
- **Core Concepts**: Keys, relays, NIPs, fundamentals
- **Modules 1–9**: structured developer curriculum
- **Tutorials**: Build a client, relay communication, events
- **Interactive Features**: Copy-paste code, syntax highlighting, English / Español

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add content or improvements
4. Test with `mkdocs serve` (or `mkdocs build`)
5. Submit a pull request

Do not invent NIPs. Link the current spec: [nostr-protocol/nips](https://github.com/nostr-protocol/nips).

Do not invent Maple, Routstr, or Ollama behavior. Link their current docs and describe only what those pages say, including limits (cloud tags, upstream forwarding, AWS jurisdiction).

## Tech Stack

- **MkDocs Material** - Documentation framework
- **Python 3.8+** - Build system
- **Custom CSS/JS** - Enhanced interactivity

## License

MIT License - see [LICENSE](LICENSE) for details.

---
