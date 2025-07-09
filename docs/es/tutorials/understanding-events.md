# Entendiendo Eventos

Esta página está siendo traducida al español.

**Página original en inglés:** [Understanding Events](/en/tutorials/understanding-events/)

---

## Objetivo del Tutorial

Aprenderás la estructura interna de los eventos Nostr, cómo crearlos, validarlos y trabajar con diferentes tipos.

### Anatomía de un Evento

```json
{
  "id": "a1b2c3d4...",           // Hash SHA-256 del evento
  "pubkey": "48d54b93...",       // Llave pública del autor
  "created_at": 1234567890,      // Timestamp Unix
  "kind": 1,                     // Tipo de evento
  "tags": [                      // Metadatos estructurados
    ["e", "event_id", "relay_url"],
    ["p", "pubkey_mentioned"]
  ],
  "content": "Hola Nostr!",      // Contenido del evento
  "sig": "304402203f..."         // Firma digital Schnorr
}
```

### Tipos de Eventos Comunes

#### Kind 0: Metadatos de Perfil
```json
{
  "kind": 0,
  "content": "{\"name\":\"Juan\",\"about\":\"Desarrollador\",\"picture\":\"https://...\"}",
  "tags": []
}
```

#### Kind 1: Nota de Texto
```json
{
  "kind": 1,
  "content": "¡Mi primera nota en Nostr!",
  "tags": [["t", "nostr"], ["t", "descentralizado"]]
}
```

#### Kind 3: Lista de Contactos
```json
{
  "kind": 3,
  "content": "{\"wss://relay.example.com\":{\"read\":true,\"write\":true}}",
  "tags": [["p", "pubkey1"], ["p", "pubkey2"]]
}
```

#### Kind 7: Reacción
```json
{
  "kind": 7,
  "content": "🔥",
  "tags": [["e", "event_id"], ["p", "author_pubkey"]]
}
```

### Creación de Eventos

#### Paso 1: Construir Estructura Base
```javascript
const baseEvent = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "Mi mensaje",
  pubkey: publicKey
}
```

#### Paso 2: Calcular ID
```javascript
// Serializar para hash
const serialized = JSON.stringify([
  0,                    // Versión
  baseEvent.pubkey,     // Llave pública
  baseEvent.created_at, // Timestamp
  baseEvent.kind,       // Tipo
  baseEvent.tags,       // Etiquetas
  baseEvent.content     // Contenido
])

const eventId = sha256(serialized)
baseEvent.id = eventId
```

#### Paso 3: Firmar Evento
```javascript
const signature = schnorrSign(eventId, privateKey)
baseEvent.sig = signature
```

### Validación de Eventos

```javascript
function validateEvent(event) {
  // Verificar campos requeridos
  const required = ['id', 'pubkey', 'created_at', 'kind', 'tags', 'content', 'sig']
  for (const field of required) {
    if (!(field in event)) return false
  }
  
  // Verificar ID
  const calculatedId = calculateEventId(event)
  if (event.id !== calculatedId) return false
  
  // Verificar firma
  return verifySignature(event.sig, event.id, event.pubkey)
}
```

### Trabajando con Etiquetas

#### Etiquetas de Referencia
```javascript
// Referenciar otro evento
tags.push(["e", eventId, relayUrl, "reply"])

// Mencionar usuario
tags.push(["p", pubkey])

// Hashtags
tags.push(["t", "bitcoin"])
```

#### Extraer Información de Etiquetas
```javascript
function getReferencedEvents(event) {
  return event.tags
    .filter(tag => tag[0] === 'e')
    .map(tag => tag[1])
}

function getMentionedUsers(event) {
  return event.tags
    .filter(tag => tag[0] === 'p')
    .map(tag => tag[1])
}
```

---

*Esta traducción está en progreso. Visita la versión en inglés para el tutorial completo con ejemplos de código.*
