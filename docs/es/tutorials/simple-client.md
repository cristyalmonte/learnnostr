# Construir un Cliente Nostr Simple

!!! info "Lo Que Construirás"
    En este tutorial, crearás un cliente Nostr básico que puede:
    
    - Generar y gestionar llaves criptográficas
    - Conectarse a relés Nostr
    - Publicar notas de texto
    - Suscribirse y mostrar eventos
    - Manejar interacciones de usuario

!!! tip "Prerrequisitos"
    - Conocimiento básico de JavaScript
    - Comprensión de [fundamentos de Nostr](../getting-started/what-is-nostr.md)
    - Node.js instalado en tu sistema

## Configuración del Proyecto

Empecemos creando un nuevo proyecto e instalando las dependencias necesarias.

### 1. Inicializar el Proyecto

```bash
mkdir mi-cliente-nostr
cd mi-cliente-nostr
npm init -y
```

### 2. Instalar Dependencias

```bash
npm install nostr-tools
npm install --save-dev vite
```

### 3. Crear Estructura del Proyecto

```
mi-cliente-nostr/
├── index.html
├── main.js
├── style.css
└── package.json
```

## Construir la Interfaz HTML

Crea una interfaz simple pero funcional:

=== "index.html"

    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mi Cliente Nostr</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="container">
            <header>
                <h1>Mi Cliente Nostr</h1>
                <div class="connection-status" id="status">Desconectado</div>
            </header>

            <main>
                <!-- Sección de Gestión de Llaves -->
                <section class="key-section">
                    <h2>Tu Identidad</h2>
                    <div class="key-display">
                        <label>Llave Pública (npub):</label>
                        <input type="text" id="pubkey" readonly>
                        <button id="generate-keys">Generar Nuevas Llaves</button>
                    </div>
                </section>

                <!-- Sección de Composición -->
                <section class="compose-section">
                    <h2>Escribir Nota</h2>
                    <textarea id="note-content" placeholder="¿Qué tienes en mente?"></textarea>
                    <button id="publish-note">Publicar Nota</button>
                </section>

                <!-- Sección de Feed -->
                <section class="feed-section">
                    <h2>Feed Global</h2>
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

## Implementar la Lógica JavaScript

Ahora construyamos la funcionalidad principal:

=== "main.js"

    ```javascript
    import { 
        generatePrivateKey, 
        getPublicKey, 
        finishEvent, 
        relayInit,
        nip19
    } from 'nostr-tools'

    class ClienteNostr {
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

            // Habilitar publicación con Ctrl+Enter
            this.elements.noteContent.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.publishNote()
                }
            })
        }

        loadOrGenerateKeys() {
            // Intentar cargar llaves existentes desde localStorage
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
            
            // Guardar en localStorage
            localStorage.setItem('nostr-private-key', this.privateKey)
            
            this.updateKeyDisplay()
            this.showNotification('¡Nuevas llaves generadas! 🎉')
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

            this.updateStatus('Conectando...')

            for (const url of relayUrls) {
                try {
                    const relay = relayInit(url)
                    
                    relay.on('connect', () => {
                        console.log(`Conectado a ${url}`)
                        this.connectedRelays.add(url)
                        this.updateConnectionStatus()
                        this.subscribeToFeed(relay)
                    })

                    relay.on('error', () => {
                        console.log(`Falló conexión a ${url}`)
                        this.connectedRelays.delete(url)
                        this.updateConnectionStatus()
                    })

                    await relay.connect()
                    this.relays.push(relay)
                    
                } catch (error) {
                    console.error(`Error conectando a ${url}:`, error)
                }
            }
        }

        updateConnectionStatus() {
            const connectedCount = this.connectedRelays.size
            if (connectedCount > 0) {
                this.updateStatus(`Conectado a ${connectedCount} relés`, 'connected')
            } else {
                this.updateStatus('Desconectado', 'disconnected')
            }
        }

        updateStatus(message, className = '') {
            this.elements.status.textContent = message
            this.elements.status.className = `connection-status ${className}`
        }

        subscribeToFeed(relay) {
            const sub = relay.sub([
                {
                    kinds: [1], // Notas de texto
                    limit: 20
                }
            ])

            sub.on('event', (event) => {
                this.addEventToFeed(event)
            })
        }

        addEventToFeed(event) {
            const noteElement = this.createNoteElement(event)
            
            // Agregar al principio del feed
            if (this.elements.feed.firstChild) {
                this.elements.feed.insertBefore(noteElement, this.elements.feed.firstChild)
            } else {
                this.elements.feed.appendChild(noteElement)
            }

            // Limitar feed a 50 notas
            while (this.elements.feed.children.length > 50) {
                this.elements.feed.removeChild(this.elements.feed.lastChild)
            }
        }

        createNoteElement(event) {
            const noteDiv = document.createElement('div')
            noteDiv.className = 'note'
            
            const date = new Date(event.created_at * 1000)
            const timeString = date.toLocaleString()
            
            // Truncar llave pública para mostrar
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
                this.showNotification('¡Por favor ingresa algún contenido!', 'error')
                return
            }

            if (this.connectedRelays.size === 0) {
                this.showNotification('¡No conectado a ningún relé!', 'error')
                return
            }

            try {
                this.elements.publishNote.disabled = true
                this.elements.publishNote.textContent = 'Publicando...'

                const event = finishEvent({
                    kind: 1,
                    created_at: Math.floor(Date.now() / 1000),
                    tags: [],
                    content: content,
                }, this.privateKey)

                // Publicar a todos los relés conectados
                const publishPromises = this.relays.map(relay => {
                    if (relay.status === 1) { // Conectado
                        return relay.publish(event)
                    }
                })

                await Promise.allSettled(publishPromises)

                this.elements.noteContent.value = ''
                this.showNotification('¡Nota publicada! 🎉')
                
            } catch (error) {
                console.error('Error publicando nota:', error)
                this.showNotification('Falló la publicación de la nota', 'error')
            } finally {
                this.elements.publishNote.disabled = false
                this.elements.publishNote.textContent = 'Publicar Nota'
            }
        }

        showNotification(message, type = 'success') {
            // Crear elemento de notificación
            const notification = document.createElement('div')
            notification.className = `notification ${type}`
            notification.textContent = message
            
            // Estilar la notificación
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

            // Animar entrada
            setTimeout(() => {
                notification.style.transform = 'translateX(0)'
            }, 100)

            // Remover después de 3 segundos
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)'
                setTimeout(() => {
                    document.body.removeChild(notification)
                }, 300)
            }, 3000)
        }
    }

    // Inicializar el cliente cuando la página carga
    document.addEventListener('DOMContentLoaded', () => {
        new ClienteNostr()
    })
    ```

## Agregar Scripts de Desarrollo

Actualiza tu `package.json` para incluir scripts de desarrollo:

```json
{
  "name": "mi-cliente-nostr",
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

## Ejecutar Tu Cliente

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173` y ¡deberías ver tu cliente Nostr!

## Probar Tu Cliente

!!! tip "Prueba Estas Características"
    
    1. **Generar Llaves**: Haz clic en "Generar Nuevas Llaves" para crear una nueva identidad
    2. **Publicar una Nota**: Escribe algo en el área de texto y haz clic en "Publicar Nota"
    3. **Ver Feed**: Observa como aparecen notas de otros usuarios en el feed global
    4. **Atajo de Teclado**: Usa Ctrl+Enter para publicar notas rápidamente

## Entendiendo el Código

### Gestión de Llaves
```javascript
// Generar una nueva llave privada
const privateKey = generatePrivateKey()

// Derivar la llave pública
const publicKey = getPublicKey(privateKey)

// Codificar como npub para mostrar
const npub = nip19.npubEncode(publicKey)
```

### Creación de Eventos
```javascript
const event = finishEvent({
    kind: 1,              // Nota de texto
    created_at: Math.floor(Date.now() / 1000),
    tags: [],             // Sin etiquetas para notas simples
    content: "¡Hola Nostr!",
}, privateKey)
```

### Comunicación con Relés
```javascript
// Conectar a relé
const relay = relayInit('wss://relay.damus.io')
await relay.connect()

// Suscribirse a eventos
const sub = relay.sub([{ kinds: [1], limit: 20 }])
sub.on('event', handleEvent)

// Publicar evento
await relay.publish(event)
```

## Próximos Pasos

¡Felicitaciones! Has construido un cliente Nostr funcional. Aquí hay algunas ideas para mejoras:

!!! example "Ideas de Mejoras"
    
    - **Perfiles de Usuario**: Mostrar metadatos de usuario y avatares
    - **Respuestas**: Implementar conversaciones con hilos
    - **Reacciones**: Agregar funcionalidad de me gusta/no me gusta
    - **Multimedia**: Soporte para subida de imágenes y videos
    - **Búsqueda**: Agregar búsqueda de contenido y usuarios
    - **Gestión de Relés**: Permitir que usuarios agreguen/eliminen relés

## Solución de Problemas

!!! warning "Problemas Comunes"
    
    **Problemas de Conexión**
    - Verifica si los relés están en línea
    - Prueba diferentes URLs de relés
    - Revisa la consola del navegador para errores
    
    **Falla la Publicación**
    - Asegúrate de tener llaves válidas
    - Verifica el estado de conexión del relé
    - Confirma que el contenido no esté vacío

---

<div class="tutorial-navigation">
  <a href="../bot/" class="btn btn-outline">
    ← Anterior: Creando un Bot
  </a>
  <a href="../advanced/" class="btn btn-primary">
    Siguiente: Características Avanzadas →
  </a>
</div>