# LearnNostr

An interactive learning platform for the Nostr protocol built with MkDocs Material.

🌐 **Live Site**: [learnnostr.org](https://learnnostr.org)

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

## Offline Package and Mirrors

Build a self-contained English and Spanish package:

```bash
./scripts/package-offline.sh
```

The ZIP and SHA-256 checksum are written to `dist/`. See [MIRROR.md](MIRROR.md) for local reading, independent hosting, and update instructions.

## What's Inside

- **Getting Started**: Nostr basics, relay setup, essential tools
- **Core Concepts**: Keys, relays, NIPs, fundamentals
- **Tutorials**: Build real Nostr applications step-by-step
- **Interactive Features**: Copy-paste code, syntax highlighting, responsive design

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add content or improvements
4. Test with `mkdocs serve`
5. Submit a pull request

## Tech Stack

- **MkDocs Material** - Documentation framework
- **Python 3.8+** - Build system
- **Custom CSS/JS** - Enhanced interactivity

## License

MIT License - see [LICENSE](LICENSE) for details.

---


