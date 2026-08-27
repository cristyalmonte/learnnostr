# Construye un Cliente Nostr Simple

Este tutorial crea un pequeño cliente para el navegador con la API actual de `nostr-tools`. Genera una identidad para la sesión, lee notas desde varios relés, verifica los eventos recibidos y publica una nota firmada.

!!! warning "Llaves solo para aprendizaje"
    Este ejemplo mantiene una llave secreta generada en memoria y la pierde al recargar la página. Nunca pegues un `nsec` valioso en código de tutorial. Los clientes de producción deben usar un firmador como una extensión de navegador NIP-07.

## Lo que construirás

- Una identidad Nostr temporal
- Un feed de notas desde varios relés
- Verificación de firmas de eventos
- Un formulario que firma y publica notas de tipo `1`

## 1. Crea el proyecto

```bash
mkdir mi-cliente-nostr
cd mi-cliente-nostr
npm init -y
npm install nostr-tools@2.25.0
npm install --save-dev vite
npm pkg set type=module
npm pkg set scripts.dev=vite
```

Crea dos archivos:

```text
mi-cliente-nostr/
├── index.html
└── main.js
```

## 2. Agrega la interfaz

Crea `index.html`:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mi Cliente Nostr</title>
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
    <h1>Mi Cliente Nostr</h1>

    <p id="status">Iniciando…</p>
    <p><strong>Llave pública de la sesión:</strong> <code id="pubkey"></code></p>

    <form id="composer">
      <label for="content"><strong>Publicar una nota</strong></label>
      <textarea id="content" maxlength="500" required></textarea>
      <button type="submit">Publicar</button>
    </form>

    <h2>Notas recientes</h2>
    <div id="feed"></div>

    <script type="module" src="/main.js"></script>
  </body>
</html>
```

## 3. Conecta, suscríbete y publica

Crea `main.js`:

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
      status.textContent = `Escuchando ${RELAYS.length} relés`
    },
    onclose(reasons) {
      console.log('Suscripción cerrada:', reasons)
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

  status.textContent = 'Publicando…'

  try {
    await Promise.any(pool.publish(RELAYS, signedEvent))
    status.textContent = 'Publicado en al menos un relé'
    content.value = ''
    showEvent(signedEvent)
  } catch (error) {
    status.textContent = 'Ningún relé aceptó la nota'
    console.error(error)
  }
})

window.addEventListener('beforeunload', () => {
  subscription.close()
  pool.close(RELAYS)
})
```

## 4. Ejecuta el cliente

```bash
npm run dev
```

Abre la URL local mostrada por Vite, normalmente `http://localhost:5173`.

Deberías ver:

1. Una llave pública temporal
2. Notas recientes de tipo `1` recibidas desde los relés
3. Tu nota firmada después de que al menos un relé la acepte

## Cómo funciona

### Llaves

`generateSecretKey()` devuelve 32 bytes aleatorios. `getPublicKey()` deriva la llave pública hexadecimal correspondiente. La llave secreta firma los eventos y debe permanecer privada.

### Eventos

`finalizeEvent()` agrega la llave pública, calcula el ID del evento y crea la firma. Una nota de texto es un evento de tipo `1`.

### Relés

`SimplePool` administra conexiones a varios relés. Una suscripción recibe eventos coincidentes, mientras `pool.publish()` envía un evento firmado a cada relé seleccionado.

### Verificación

`verifyEvent()` confirma que el ID y la firma de un evento coinciden con su contenido y llave pública. Nunca presentes eventos sin verificar como datos confiables.

## Ejercicios

- Filtra la suscripción por la llave pública de un autor.
- Agrega una etiqueta de hashtag como `['t', 'learnnostr']`.
- Ordena eventos por `created_at` en lugar de agregarlos al principio.
- Reemplaza la llave generada por un firmador NIP-07.
- Muestra cuáles relés aceptaron o rechazaron la publicación.

## Próximos pasos

- [Entiende los eventos de Nostr](understanding-events.md)
- [Aprende sobre comunicación con relés](relay-communication.md)
- [Continúa con el Módulo 5](../modules/module-05-building-client.md)
- [Revisa la seguridad de las llaves](../concepts/keys.md)
