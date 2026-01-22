# Building a Simple Nostr Client

!!! info "What You'll Build"
    In this tutorial, you'll create a basic Nostr client that can:
    
    - Generate and manage cryptographic keys
    - Connect to Nostr relays
    - Publish text notes
    - Subscribe to and display events
    - Handle user interactions

!!! tip "Prerequisites"
    - Basic JavaScript knowledge
    - Understanding of [Nostr fundamentals](../getting-started/what-is-nostr.md)
    - Node.js installed on your system

## Project Setup

Let's start by creating a new project and installing the necessary dependencies.

### 1. Initialize the Project

```bash
mkdir my-nostr-client
cd my-nostr-client
npm init -y
```

### 2. Install Dependencies

```bash
npm install nostr-tools
npm install --save-dev vite
```

### 3. Create Project Structure

```
my-nostr-client/
├── index.html
├── main.js
├── style.css
└── package.json
```

## Building the HTML Interface

Create a simple but functional interface:

=== "index.html"

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Nostr Client</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🚀 My Nostr Client</h1>
                <div class="connection-status" id="status">Disconnected</div>
            </header>

            <main>
                <!-- Key Management Section -->
                <section class="key-section">
                    <h2>🔑 Your Identity</h2>
                    <div class="key-display">
                        <label>Public Key (npub):</label>
                        <input type="text" id="pubkey" readonly>
                        <button id="generate-keys">Generate New Keys</button>
                    </div>
                </section>

                <!-- Compose Section -->
                <section class="compose-section">
                    <h2>✍️ Compose Note</h2>
                    <textarea id="note-content" placeholder="What's on your mind?"></textarea>
                    <button id="publish-note">Publish Note</button>
                </section>

                <!-- Feed Section -->
                <section class="feed-section">
                    <h2>📰 Global Feed</h2>
                    <div id="feed"></div>
                </section>
            </main>
        </div>

        <script type="module" src="main.js"></script>
    </body>
    </html>
    ```

=== "style.css"

    ```css
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: #333;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    header {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h1 {
        color: #667eea;
        font-size: 2rem;
    }

    .connection-status {
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .connection-status.connected {
        background: #10b981;
        color: white;
    }

    .connection-status.disconnected {
        background: #ef4444;
        color: white;
    }

    section {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    h2 {
        margin-bottom: 15px;
        color: #374151;
    }

    .key-display {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
    }

    input, textarea {
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s;
    }

    input:focus, textarea:focus {
        outline: none;
        border-color: #667eea;
    }

    #pubkey {
        flex: 1;
        min-width: 300px;
        font-family: monospace;
        font-size: 12px;
    }

    #note-content {
        width: 100%;
        min-height: 100px;
        resize: vertical;
        margin-bottom: 10px;
    }

    button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .note {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
    }

    .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-size: 0.9rem;
        color: #6b7280;
    }

    .note-author {
        font-family: monospace;
        font-weight: 600;
    }

    .note-content {
        line-height: 1.6;
        white-space: pre-wrap;
    }

    .loading {
        text-align: center;
        color: #6b7280;
        font-style: italic;
    }
    ```

## Implementing the JavaScript Logic

Now let's build the core functionality:

=== "main.js"

    ```javascript
    import { 
        generatePrivateKey, 
        getPublicKey, 
        finishEvent, 
        relayInit,
        nip19
    } from 'nostr-tools'

    class NostrClient {
        constructor() {
            this.privateKey = null
            this.publicKey = null
            this.relays = []
            this.connectedRelays = new Set()
            
            this.initializeElements()
            this.setupEventListeners()
            this.loadOrGenerateKeys()
            this.connectToRelays()
        }

        initializeElements() {
            this.elements = {
                status: document.getElementById('status'),
                pubkey: document.getElementById('pubkey'),
                generateKeys: document.getElementById('generate-keys'),
                noteContent: document.getElementById('note-content'),
                publishNote: document.getElementById('publish-note'),
                feed: document.getElementById('feed')
            }
        }

        setupEventListeners() {
            this.elements.generateKeys.addEventListener('click', () => {
                this.generateNewKeys()
            })

            this.elements.publishNote.addEventListener('click', () => {
                this.publishNote()
            })

            // Enable publishing with Ctrl+Enter
            this.elements.noteContent.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.publishNote()
                }
            })
        }

        loadOrGenerateKeys() {
            // Try to load existing keys from localStorage
            const savedPrivateKey = localStorage.getItem('nostr-private-key')
            
            if (savedPrivateKey) {
                this.privateKey = savedPrivateKey
                this.publicKey = getPublicKey(savedPrivateKey)
            } else {
                this.generateNewKeys()
            }
            
            this.updateKeyDisplay()
        }

        generateNewKeys() {
            this.privateKey = generatePrivateKey()
            this.publicKey = getPublicKey(this.privateKey)
            
            // Save to localStorage
            localStorage.setItem('nostr-private-key', this.privateKey)
            
            this.updateKeyDisplay()
            this.showNotification('New keys generated! 🎉')
        }

        updateKeyDisplay() {
            if (this.publicKey) {
                const npub = nip19.npubEncode(this.publicKey)
                this.elements.pubkey.value = npub
            }
        }

        async connectToRelays() {
            const relayUrls = [
                'wss://relay.damus.io',
                'wss://nos.lol',
                'wss://relay.snort.social'
            ]

            this.updateStatus('Connecting...')

            for (const url of relayUrls) {
                try {
                    const relay = relayInit(url)
                    
                    relay.on('connect', () => {
                        console.log(`Connected to ${url}`)
                        this.connectedRelays.add(url)
                        this.updateConnectionStatus()
                        this.subscribeToFeed(relay)
                    })

                    relay.on('error', () => {
                        console.log(`Failed to connect to ${url}`)
                        this.connectedRelays.delete(url)
                        this.updateConnectionStatus()
                    })

                    await relay.connect()
                    this.relays.push(relay)
                    
                } catch (error) {
                    console.error(`Error connecting to ${url}:`, error)
                }
            }
        }

        updateConnectionStatus() {
            const connectedCount = this.connectedRelays.size
            if (connectedCount > 0) {
                this.updateStatus(`Connected to ${connectedCount} relays`, 'connected')
            } else {
                this.updateStatus('Disconnected', 'disconnected')
            }
        }

        updateStatus(message, className = '') {
            this.elements.status.textContent = message
            this.elements.status.className = `connection-status ${className}`
        }

        subscribeToFeed(relay) {
            const sub = relay.sub([
                {
                    kinds: [1], // Text notes
                    limit: 20
                }
            ])

            sub.on('event', (event) => {
                this.addEventToFeed(event)
            })
        }

        addEventToFeed(event) {
            const noteElement = this.createNoteElement(event)
            
            // Add to top of feed
            if (this.elements.feed.firstChild) {
                this.elements.feed.insertBefore(noteElement, this.elements.feed.firstChild)
            } else {
                this.elements.feed.appendChild(noteElement)
            }

            // Limit feed to 50 notes
            while (this.elements.feed.children.length > 50) {
                this.elements.feed.removeChild(this.elements.feed.lastChild)
            }
        }

        createNoteElement(event) {
            const noteDiv = document.createElement('div')
            noteDiv.className = 'note'
            
            const date = new Date(event.created_at * 1000)
            const timeString = date.toLocaleString()
            
            // Truncate public key for display
            const shortPubkey = event.pubkey.slice(0, 8) + '...' + event.pubkey.slice(-8)
            
            noteDiv.innerHTML = `
                <div class="note-header">
                    <span class="note-author">${shortPubkey}</span>
                    <span class="note-time">${timeString}</span>
                </div>
                <div class="note-content">${this.escapeHtml(event.content)}</div>
            `
            
            return noteDiv
        }

        escapeHtml(text) {
            const div = document.createElement('div')
            div.textContent = text
            return div.innerHTML
        }

        async publishNote() {
            const content = this.elements.noteContent.value.trim()
            
            if (!content) {
                this.showNotification('Please enter some content!', 'error')
                return
            }

            if (this.connectedRelays.size === 0) {
                this.showNotification('Not connected to any relays!', 'error')
                return
            }

            try {
                this.elements.publishNote.disabled = true
                this.elements.publishNote.textContent = 'Publishing...'

                const event = finishEvent({
                    kind: 1,
                    created_at: Math.floor(Date.now() / 1000),
                    tags: [],
                    content: content,
                }, this.privateKey)

                // Publish to all connected relays
                const publishPromises = this.relays.map(relay => {
                    if (relay.status === 1) { // Connected
                        return relay.publish(event)
                    }
                })

                await Promise.allSettled(publishPromises)

                this.elements.noteContent.value = ''
                this.showNotification('Note published! 🎉')
                
            } catch (error) {
                console.error('Error publishing note:', error)
                this.showNotification('Failed to publish note', 'error')
            } finally {
                this.elements.publishNote.disabled = false
                this.elements.publishNote.textContent = 'Publish Note'
            }
        }

        showNotification(message, type = 'success') {
            // Create notification element
            const notification = document.createElement('div')
            notification.className = `notification ${type}`
            notification.textContent = message
            
            // Style the notification
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '12px 20px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                zIndex: '1000',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease'
            })

            if (type === 'error') {
                notification.style.background = '#ef4444'
            } else {
                notification.style.background = '#10b981'
            }

            document.body.appendChild(notification)

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)'
            }, 100)

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)'
                setTimeout(() => {
                    document.body.removeChild(notification)
                }, 300)
            }, 3000)
        }
    }

    // Initialize the client when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        new NostrClient()
    })
    ```

## Adding Development Scripts

Update your `package.json` to include development scripts:

```json
{
  "name": "my-nostr-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "nostr-tools": "^1.17.0"
  },
  "devDependencies": {
    "vite": "^4.4.0"
  }
}
```

## Running Your Client

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173` and you should see your Nostr client!

## Testing Your Client

!!! tip "Try These Features"
    
    1. **Generate Keys**: Click "Generate New Keys" to create a new identity
    2. **Publish a Note**: Write something in the text area and click "Publish Note"
    3. **View Feed**: Watch as notes from other users appear in the global feed
    4. **Keyboard Shortcut**: Use Ctrl+Enter to quickly publish notes

## Understanding the Code

### Key Management
```javascript
// Generate a new private key
const privateKey = generatePrivateKey()

// Derive the public key
const publicKey = getPublicKey(privateKey)

// Encode as npub for display
const npub = nip19.npubEncode(publicKey)
```

### Event Creation
```javascript
const event = finishEvent({
    kind: 1,              // Text note
    created_at: Math.floor(Date.now() / 1000),
    tags: [],             // No tags for simple notes
    content: "Hello Nostr!",
}, privateKey)
```

### Relay Communication
```javascript
// Connect to relay
const relay = relayInit('wss://relay.damus.io')
await relay.connect()

// Subscribe to events
const sub = relay.sub([{ kinds: [1], limit: 20 }])
sub.on('event', handleEvent)

// Publish event
await relay.publish(event)
```

## Next Steps

Congratulations! You've built a working Nostr client. Here are some ideas for enhancements:

!!! example "Enhancement Ideas"
    
    - **User Profiles**: Display user metadata and avatars
    - **Replies**: Implement threaded conversations
    - **Reactions**: Add like/dislike functionality
    - **Media**: Support image and video uploads
    - **Search**: Add content and user search
    - **Relay Management**: Let users add/remove relays

## Troubleshooting

!!! warning "Common Issues"
    
    **Connection Problems**
    - Check if relays are online
    - Try different relay URLs
    - Check browser console for errors
    
    **Publishing Fails**
    - Ensure you have valid keys
    - Check relay connection status
    - Verify content isn't empty

---

## Related Tutorials

- [Understanding Nostr Events](understanding-events.md) - Deep dive into event structures
- [Relay Communication](relay-communication.md) - Advanced relay interaction patterns
- [Nostr Fundamentals](../concepts/nostr-fundamentals.md) - Core protocol concepts 