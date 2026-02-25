# Módulo 3: Eventos y Mensajes

!!! info "Visión General del Módulo"
    **Duración**: 4-5 horas  
    **Nivel**: Intermedio  
    **Prerrequisitos**: Módulos 1-2 completados  
    **Objetivo**: Dominar la creación, firma y validación de eventos Nostr

## 📋 Objetivos de Aprendizaje

Al final de este módulo, podrás:

- ✅ Crear y firmar eventos Nostr
- ✅ Entender diferentes tipos de eventos (kinds)
- ✅ Implementar etiquetas y referencias
- ✅ Validar firmas de eventos
- ✅ Manejar eventos reemplazables y efímeros

## 📦 Estructura de Eventos

Todo en Nostr es un **evento**. Aquí está la estructura básica:

```json
{
  "id": "hash_del_evento",
  "pubkey": "clave_pública_del_autor",
  "created_at": timestamp_unix,
  "kind": tipo_de_evento,
  "tags": [],
  "content": "contenido_del_mensaje",
  "sig": "firma"
}
```

### Campos Requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Hash SHA-256 del evento serializado |
| `pubkey` | string | Clave pública hex del creador |
| `created_at` | number | Timestamp Unix (segundos) |
| `kind` | number | Tipo de evento |
| `tags` | array | Array de arrays de strings |
| `content` | string | Contenido del evento |
| `sig` | string | Firma Schnorr del id |

## 🎨 Tipos de Eventos (Kinds)

### Eventos Básicos

```javascript
const eventKinds = {
  METADATA: 0,        // Perfil de usuario
  TEXT_NOTE: 1,       // Nota de texto
  RECOMMEND_RELAY: 2, // Recomendación de relé (obsoleto)
  CONTACTS: 3,        // Lista de contactos
  DM: 4,              // Mensaje directo cifrado
  DELETE: 5,          // Solicitud de eliminación
  REPOST: 6,          // Repost/Boost
  REACTION: 7,        // Reacción (like)
  BADGE_AWARD: 8,     // Premio de insignia
  // ... muchos más
}
```

### Rangos de Eventos

- `0-999`: Eventos regulares
- `1000-9999`: Eventos regulares (futuro)
- `10000-19999`: Eventos **reemplazables**
- `20000-29999`: Eventos **efímeros**
- `30000-39999`: Eventos reemplazables **parametrizados**

## ✍️ Crear y Firmar Eventos

### Método Básico

```javascript
import { finishEvent, generatePrivateKey } from 'nostr-tools'

// Crear evento sin firmar
const eventTemplate = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: '¡Hola Nostr desde JavaScript!'
}

// Firmar el evento
const privateKey = generatePrivateKey()
const signedEvent = finishEvent(eventTemplate, privateKey)

console.log(signedEvent)
/*
{
  id: "4376c65d...",
  pubkey: "6e468422...",
  created_at: 1673347337,
  kind: 1,
  tags: [],
  content: "¡Hola Nostr desde JavaScript!",
  sig: "908a15e4..."
}
*/
```

### Proceso Manual de Firma

```javascript
import { getPublicKey, getEventHash, getSignature } from 'nostr-tools'

function createAndSignEvent(privateKey, eventTemplate) {
  // 1. Agregar clave pública
  const publicKey = getPublicKey(privateKey)
  const event = {
    ...eventTemplate,
    pubkey: publicKey
  }
  
  // 2. Calcular ID (hash del evento)
  event.id = getEventHash(event)
  
  // 3. Firmar el ID
  event.sig = getSignature(event, privateKey)
  
  return event
}
```

## 🏷️ Trabajar con Etiquetas

Las etiquetas son arrays de strings que agregan metadatos:

```javascript
const event = {
  kind: 1,
  content: "¡Mira esta nota genial!",
  tags: [
    ["e", "event_id_referenciado", "wss://relay.example.com", "reply"],
    ["p", "pubkey_mencionado", "wss://relay.example.com"],
    ["t", "nostr"],
    ["t", "tutorial"]
  ]
}
```

### Tipos Comunes de Etiquetas

| Etiqueta | Propósito | Ejemplo |
|----------|-----------|---------|
| `e` | Referencia a evento | `["e", "event_id", "relay_url", "marker"]` |
| `p` | Referencia a pubkey | `["p", "pubkey", "relay_url"]` |
| `t` | Hashtag | `["t", "nostr"]` |
| `d` | Identificador (reemplazables parametrizados) | `["d", "my-article"]` |
| `a` | Referencia a dirección | `["a", "30023:pubkey:d-tag"]` |

### Construir Hilos de Conversación

```javascript
// Nota raíz (sin etiquetas)
const rootNote = {
  kind: 1,
  content: "¿Quién más ama Nostr?",
  tags: []
}

// Respuesta a la raíz
const reply = {
  kind: 1,
  content: "¡Yo amo Nostr!",
  tags: [
    ["e", rootNote.id, "", "root"],
    ["p", rootNote.pubkey]
  ]
}

// Respuesta a la respuesta
const replyToReply = {
  kind: 1,
  content: "¡Yo también!",
  tags: [
    ["e", rootNote.id, "", "root"],      // Nota raíz original
    ["e", reply.id, "", "reply"],        // Respondiendo directamente a esto
    ["p", rootNote.pubkey],              // Autor original
    ["p", reply.pubkey]                  // Autor de la respuesta
  ]
}
```

## 🔄 Eventos Reemplazables

Los eventos **reemplazables** (kind 10000-19999) solo mantienen la versión más reciente:

```javascript
// Actualizar metadatos de perfil (kind: 0)
const profileUpdate = {
  kind: 0,
  content: JSON.stringify({
    name: "Alice",
    about: "Desarrolladora Nostr",
    picture: "https://example.com/avatar.jpg"
  }),
  tags: []
}

// Enviar a relés - versiones antiguas se eliminan automáticamente
```

### Eventos Reemplazables Parametrizados

Los eventos con kind 30000-39999 son reemplazables por etiqueta `d`:

```javascript
// Artículo (kind: 30023)
const article = {
  kind: 30023,
  content: "# Mi primer artículo...",
  tags: [
    ["d", "my-first-article"],     // Identificador único
    ["title", "Mi Primer Artículo"],
    ["published_at", "1673347337"]
  ]
}

// Actualizar el mismo artículo (misma etiqueta "d")
const updatedArticle = {
  kind: 30023,
  content: "# Mi primer artículo (editado)...",
  tags: [
    ["d", "my-first-article"],     // Mismo identificador
    ["title", "Mi Primer Artículo (Editado)"]
  ]
}
```

## ⚡ Eventos Efímeros

Los eventos **efímeros** (kind 20000-29999) no se almacenan en relés:

```javascript
// Indicador de escritura (kind: 20001)
const typingIndicator = {
  kind: 20001,
  content: "",
  tags: [
    ["p", "recipient_pubkey"]
  ]
}

// Los relés transmiten pero NO almacenan esto
```

## ✅ Validar Eventos

Siempre valida eventos antes de confiar en ellos:

```javascript
import { verifySignature } from 'nostr-tools'

function validateEvent(event) {
  // 1. Verificar campos requeridos
  if (!event.id || !event.pubkey || !event.sig) {
    return false
  }
  
  // 2. Verificar firma
  const isValid = verifySignature(event)
  if (!isValid) {
    console.error('¡Firma inválida!')
    return false
  }
  
  // 3. Verificar timestamp (no demasiado en el futuro)
  const now = Math.floor(Date.now() / 1000)
  if (event.created_at > now + 900) { // 15 minutos de margen
    console.error('¡Evento demasiado en el futuro!')
    return false
  }
  
  return true
}
```

## 🎯 Ejercicios Prácticos

### Ejercicio 1: Crear Diferentes Tipos de Eventos

```javascript
// 1. Nota de texto
const textNote = finishEvent({
  kind: 1,
  content: "¡Mi primera nota!",
  tags: [["t", "hola-mundo"]],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)

// 2. Reacción (like)
const reaction = finishEvent({
  kind: 7,
  content: "🔥",
  tags: [
    ["e", targetEventId],
    ["p", targetPubkey]
  ],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)

// 3. Repost
const repost = finishEvent({
  kind: 6,
  content: "",
  tags: [
    ["e", targetEventId, "wss://relay.example.com"],
    ["p", targetPubkey]
  ],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)
```

### Ejercicio 2: Construir un Hilo

Crea una conversación de 3 notas con referencias adecuadas.

### Ejercicio 3: Actualizar Perfil

Crea un evento de metadatos con tu información.

## 📝 Cuestionario del Módulo 3

1. **¿Cuál es la diferencia entre eventos regulares y reemplazables?**
   <details>
   <summary>Respuesta</summary>
   Los eventos regulares (kind 0-9999) se almacenan todos. Los eventos reemplazables (kind 10000-19999) solo mantienen la versión más reciente del mismo autor. Los relés eliminan automáticamente las versiones antiguas.
   </details>

2. **¿Por qué los eventos efímeros no se almacenan?**
   <details>
   <summary>Respuesta</summary>
   Los eventos efímeros (kind 20000-29999) son para datos de corta duración como indicadores de escritura o presencia. Los relés solo los transmiten pero no los almacenan, reduciendo requisitos de almacenamiento.
   </details>

## 🎯 Evaluación del Módulo 3

- [ ] Crear y firmar eventos básicos
- [ ] Usar etiquetas para referencias y metadatos
- [ ] Construir hilos de conversación
- [ ] Implementar eventos reemplazables
- [ ] Validar firmas de eventos

---

!!! success "¡Excelente Trabajo!"
    ¡Dominas los eventos de Nostr! Siguiente: Relés y Arquitectura.

[Continuar al Módulo 4: Relés y Arquitectura →](module-04-relays-architecture.md)
