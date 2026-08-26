# LearnNostr

An interactive learning platform for the Nostr protocol built with MkDocs Material.

🌐 **Live Site**: [learnnostr.org](https://learnnostr.org)

LearnNostr teaches people how to use Nostr for **pseudonymous identity** and **secure publishing** — including people who cannot trust a company account, a phone-number login, or a single platform remaining online. Developer modules and client tutorials are still here; they are no longer the only front door.

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

## Tech Stack

- **MkDocs Material** - Documentation framework
- **Python 3.8+** - Build system
- **Custom CSS/JS** - Enhanced interactivity

## License

MIT License - see [LICENSE](LICENSE) for details.

---
