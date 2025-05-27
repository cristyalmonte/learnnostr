# LearnNostr 🚀

A beautiful, interactive learning platform for the Nostr protocol, built with MkDocs Material. Learn Nostr through hands-on tutorials, comprehensive guides, and a developer-friendly experience.


## ✨ Features

- **Beautiful Design**: Modern, responsive interface with smooth animations
- **Interactive Tutorials**: Step-by-step guides with working code examples
- **Multi-language Support**: Code examples in JavaScript, Python, and Rust
- **Progressive Learning**: Structured learning path from basics to advanced
- **Developer-Friendly**: Copy-paste code blocks, syntax highlighting, and more
- **Community-Driven**: Open source and welcoming contributions

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/learnnostr/learnnostr.git
   cd learnnostr
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the development server**
   ```bash
   mkdocs serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000` to see the site!

## 📁 Project Structure

```
learnnostr/
├── docs/                          # Documentation content
│   ├── index.md                   # Homepage
│   ├── getting-started/           # Beginner tutorials
│   ├── concepts/                  # Core concepts
│   ├── tutorials/                 # Interactive tutorials
│   ├── dev/                       # Developer guides
│   ├── reference/                 # Reference materials
│   ├── community/                 # Community resources
│   ├── assets/                    # Images and media
│   ├── stylesheets/              # Custom CSS
│   └── javascripts/              # Custom JavaScript
├── overrides/                     # Theme customizations
├── mkdocs.yml                     # MkDocs configuration
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## 🎨 Customization

### Themes and Colors

The site uses a custom purple gradient theme. You can modify colors in:
- `docs/stylesheets/extra.css` - Main styling
- `mkdocs.yml` - Theme configuration

### Adding Content

1. **Create new pages** in the appropriate `docs/` subdirectory
2. **Update navigation** in `mkdocs.yml`
3. **Use markdown extensions** for enhanced formatting:
   - Code blocks with syntax highlighting
   - Admonitions (info, warning, tip boxes)
   - Tabbed content
   - Mermaid diagrams

### Interactive Elements

The site includes several interactive features:
- **Copy buttons** on code blocks
- **Progress indicators** on tutorial pages
- **Interactive quizzes** with show/hide answers
- **Smooth animations** and hover effects

## 📝 Content Guidelines

### Writing Style

- **Clear and concise**: Explain concepts simply
- **Hands-on approach**: Include practical examples
- **Progressive difficulty**: Start simple, build complexity
- **Code examples**: Provide working, copy-paste code

### Markdown Features

Use these MkDocs Material features:

```markdown
!!! info "Information Box"
    This creates a blue information box

!!! tip "Pro Tip"
    This creates a green tip box

!!! warning "Important"
    This creates an orange warning box

=== "Tab 1"
    Content for tab 1

=== "Tab 2"
    Content for tab 2
```

## 🛠️ Development

### Local Development

```bash
# Install in development mode
pip install -r requirements.txt

# Start live-reloading server
mkdocs serve

# Build static site
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy
```

### Adding New Tutorials

1. Create a new `.md` file in the appropriate directory
2. Add frontmatter with metadata
3. Use the tutorial template structure
4. Update navigation in `mkdocs.yml`
5. Test locally before committing

### Custom Components

The site includes custom CSS classes for enhanced styling:

- `.hero-section` - Homepage hero area
- `.feature-grid` - Feature card layout
- `.learning-path` - Step-by-step learning progression
- `.community-section` - Community resource cards

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-tutorial`
3. **Make your changes**: Add content, fix bugs, improve design
4. **Test locally**: Ensure everything works with `mkdocs serve`
5. **Submit a pull request**: Describe your changes clearly

### Contribution Ideas

- **New tutorials**: Nostr bots, advanced features, specific use cases
- **Code examples**: More programming languages, frameworks
- **Improvements**: Better explanations, visual aids, interactive elements
- **Translations**: Help make Nostr accessible globally
- **Bug fixes**: Typos, broken links, formatting issues

## 📚 Learning Path

The site is organized into a progressive learning experience:

1. **Getting Started** - What is Nostr, why it matters, basic setup
2. **Core Concepts** - Keys, events, relays, NIPs
3. **Tutorials** - Build real applications step-by-step
4. **Developer Guide** - Best practices, libraries, deployment
5. **Reference** - Complete documentation and resources

## 🌟 Acknowledgments

- **Nostr Community** - For building an amazing protocol
- **MkDocs Material** - For the excellent documentation framework
- **Contributors** - Everyone who helps improve this resource

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Site**: [learnnostr.com](https://learnnostr.com)
- **Nostr Protocol**: [github.com/nostr-protocol/nostr](https://github.com/nostr-protocol/nostr)
- **MkDocs Material**: [squidfunk.github.io/mkdocs-material](https://squidfunk.github.io/mkdocs-material/)

---

<div align="center">
  <strong>Ready to learn Nostr? <a href="https://learnnostr.com">Get started now!</a></strong>
</div>
