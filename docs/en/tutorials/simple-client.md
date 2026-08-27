# Build a Simple Nostr Client

This tutorial builds a small browser client with the current `nostr-tools` API. It generates an identity for the session, reads notes from multiple relays, verifies incoming events, and publishes a signed note.

!!! warning "Learning keys only"
    This example keeps a generated secret key in memory and loses it when the page reloads. Never paste a valuable `nsec` into tutorial code. Production clients should use a signer such as a NIP-07 browser extension.

## What you will build

- A temporary Nostr identity
- A multi-relay text-note feed
- Event signature verification
- A form that signs and publishes kind `1` notes

## 1. Create the project

```bash
mkdir my-nostr-client
cd my-nostr-client
npm init -y
npm install nostr-tools@2.25.0
npm install --save-dev vite
npm pkg set type=module
npm pkg set scripts.dev=vite
```

Create two files:

```text
my-nostr-client/
├── index.html
└── main.js
```

## 2. Add the interface

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Nostr Client</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 48rem;
        margin: 2rem auto;
        padding: 0 1rem;
        line-height: 1.5;
      }
      form, article {
        border: 1px solid #ccc;
        border-radius: .5rem;
        padding: 1rem;
        margin: 1rem 0;
      }
      textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 6rem;
        padding: .75rem;
      }
      button {
        margin-top: .75rem;
        padding: .6rem 1rem;
      }
      code {
        overflow-wrap: anywhere;
      }
    </style>
  </head>
  <body>
    <h1>My Nostr Client</h1>

    <p id="status">Starting…</p>
    <p><strong>Session public key:</strong> <code id="pubkey"></code></p>

    <form id="composer">
      <label for="content"><strong>Publish a note</strong></label>
      <textarea id="content" maxlength="500" required></textarea>
      <button type="submit">Publish</button>
    </form>

    <h2>Recent notes</h2>
    <div id="feed"></div>

    <script type="module" src="/main.js"></script>
  </body>
</html>
```

## 3. Connect, subscribe, and publish

Create `main.js`:

```javascript
import {
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  verifyEvent,
} from 'nostr-tools/pure'
import { SimplePool } from 'nostr-tools/pool'

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
]

const pool = new SimplePool({ enableReconnect: true })
const secretKey = generateSecretKey()
const publicKey = getPublicKey(secretKey)

const status = document.querySelector('#status')
const pubkey = document.querySelector('#pubkey')
const composer = document.querySelector('#composer')
const content = document.querySelector('#content')
const feed = document.querySelector('#feed')

pubkey.textContent = publicKey

function shortKey(key) {
  return `${key.slice(0, 12)}…${key.slice(-8)}`
}

function showEvent(event) {
  if (!verifyEvent(event)) return

  const article = document.createElement('article')
  const author = document.createElement('strong')
  const body = document.createElement('p')
  const time = document.createElement('small')

  author.textContent = shortKey(event.pubkey)
  body.textContent = event.content
  time.textContent = new Date(event.created_at * 1000).toLocaleString()

  article.append(author, body, time)
  feed.prepend(article)
}

const subscription = pool.subscribe(
  RELAYS,
  { kinds: [1], limit: 30 },
  {
    onevent: showEvent,
    oneose() {
      status.textContent = `Listening on ${RELAYS.length} relays`
    },
    onclose(reasons) {
      console.log('Subscription closed:', reasons)
    },
  },
)

composer.addEventListener('submit', async (event) => {
  event.preventDefault()

  const note = content.value.trim()
  if (!note) return

  const signedEvent = finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: note,
    },
    secretKey,
  )

  status.textContent = 'Publishing…'

  try {
    await Promise.any(pool.publish(RELAYS, signedEvent))
    status.textContent = 'Published to at least one relay'
    content.value = ''
    showEvent(signedEvent)
  } catch (error) {
    status.textContent = 'No relay accepted the note'
    console.error(error)
  }
})

window.addEventListener('beforeunload', () => {
  subscription.close()
  pool.close(RELAYS)
})
```

## 4. Run the client

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

You should see:

1. A temporary public key
2. Recent kind `1` notes arriving from the relays
3. Your signed note appearing after at least one relay accepts it

## How it works

### Keys

`generateSecretKey()` returns 32 random bytes. `getPublicKey()` derives the corresponding hexadecimal public key. The secret key signs events and must remain private.

### Events

`finalizeEvent()` adds the public key, calculates the event ID, and creates the signature. A text note is a kind `1` event.

### Relays

`SimplePool` manages connections to multiple relays. A subscription receives matching events, while `pool.publish()` sends one signed event to every selected relay.

### Verification

`verifyEvent()` confirms that an event ID and signature match its contents and public key. Never render unverified events as trusted data.

## Exercises

- Filter the subscription by an author's public key.
- Add a hashtag tag such as `['t', 'learnnostr']`.
- Sort events by `created_at` instead of prepending them.
- Replace the generated key with a NIP-07 signer.
- Show which relays accepted or rejected a publish request.

## Next steps

- [Understand Nostr events](understanding-events.md)
- [Learn relay communication](relay-communication.md)
- [Continue with Module 5](../modules/module-05-building-client.md)
- [Review key security](../concepts/keys.md)
