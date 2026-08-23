# Módulo 6: Tipos de Eventos Avanzados y NIPs

!!! info "Visión General del Módulo"
    **Duración**: 6-7 horas  
    **Nivel**: Avanzado  
    **Prerrequisitos**: Módulos 1-5 completados  
    **Objetivo**: Dominar tipos de eventos avanzados de Nostr, NIPs y extensiones del protocolo

## 📋 Objetivos de Aprendizaje

Al final de este módulo, podrás:

- ✅ Comprender kinds de evento avanzados y sus casos de uso
- ✅ Implementar eventos reemplazables y reemplazables parametrizados
- ✅ Dominar el contenido de formato largo (NIP-23)
- ✅ Trabajar con mensajes directos cifrados (NIP-04, NIP-44)
- ✅ Implementar reacciones, reposts y citas
- ✅ Construir listas y conjuntos (NIP-51)
- ✅ Manejar insignias y logros (NIP-58)
- ✅ Integrar Zaps y Lightning (NIP-57)

## 📚 Guía Rápida de Referencia de NIPs

### NIPs Principales Cubiertos en Este Módulo

| NIP | Título | Event Kinds | Estado | Caso de uso |
|-----|--------|-------------|--------|-------------|
| [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) | Protocolo básico | 0, 1, 2, 3, 4, 5, 6, 7 | Obligatorio | Estructura de eventos, kinds, filters |
| [NIP-02](https://github.com/nostr-protocol/nips/blob/master/02.md) | Lista de seguimiento | 3 | Recomendado | Gestión de lista de contactos |
| [NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md) | MD cifrado | 4 | Obsoleto | Cifrado antiguo de MD (usar NIP-17) |
| [NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md) | Identificadores DNS | - | Opcional | Verificación username@domain |
| [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md) | Eliminación de eventos | 5 | Opcional | Solicitar eliminación de eventos |
| [NIP-10](https://github.com/nostr-protocol/nips/blob/master/10.md) | Notas de texto | 1 | Recomendado | Manejo de respuestas/hilos |
| [NIP-11](https://github.com/nostr-protocol/nips/blob/master/11.md) | Info del relé | - | Recomendado | Documento de metadatos del relé |
| [NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md) | Prueba de trabajo | - | Opcional | PoW anti-spam |
| [NIP-14](https://github.com/nostr-protocol/nips/blob/master/14.md) | Etiqueta subject | - | Opcional | Asuntos estilo correo |
| [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md) | MD privados | 14 | Recomendado | Mensajería cifrada moderna |
| [NIP-18](https://github.com/nostr-protocol/nips/blob/master/18.md) | Reposts | 6, 16 | Opcional | Eventos de boost/repost |
| [NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) | Entidades bech32 | - | Recomendado | Codificación npub, note, nevent |
| [NIP-21](https://github.com/nostr-protocol/nips/blob/master/21.md) | URI nostr: | - | Opcional | Esquema de URL nostr: |
| [NIP-23](https://github.com/nostr-protocol/nips/blob/master/23.md) | Formato largo | 30023 | Recomendado | Artículos, entradas de blog |
| [NIP-25](https://github.com/nostr-protocol/nips/blob/master/25.md) | Reacciones | 7 | Recomendado | Likes, reacciones con emoji |
| [NIP-26](https://github.com/nostr-protocol/nips/blob/master/26.md) | Delegación de eventos | - | Opcional | Delegar la firma de eventos |
| [NIP-27](https://github.com/nostr-protocol/nips/blob/master/27.md) | Referencias de texto | - | Recomendado | Formato de menciones |
| [NIP-28](https://github.com/nostr-protocol/nips/blob/master/28.md) | Chat público | 40-44 | Opcional | Canales estilo IRC |
| [NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md) | Grupos de relé | 9000-9030 | Opcional | Grupos privados de relé |
| [NIP-31](https://github.com/nostr-protocol/nips/blob/master/31.md) | Eventos desconocidos | - | Recomendado | Degradación elegante |
| [NIP-32](https://github.com/nostr-protocol/nips/blob/master/32.md) | Etiquetado | 1985 | Opcional | Clasificación de contenido |
| [NIP-36](https://github.com/nostr-protocol/nips/blob/master/36.md) | Contenido sensible | - | Opcional | Advertencias de contenido |
| [NIP-38](https://github.com/nostr-protocol/nips/blob/master/38.md) | Estados de usuario | 30315 | Opcional | Actualizaciones de estado |
| [NIP-39](https://github.com/nostr-protocol/nips/blob/master/39.md) | IDs externos | - | Opcional | Vincular identidades externas |
| [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) | Auth | 22242 | Opcional | Autenticación del cliente |
| [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md) | Payload cifrado | - | Recomendado | Cifrado moderno (versionado) |
| [NIP-45](https://github.com/nostr-protocol/nips/blob/master/45.md) | Conteos de eventos | - | Opcional | Consultas COUNT |
| [NIP-50](https://github.com/nostr-protocol/nips/blob/master/50.md) | Búsqueda | - | Opcional | Búsqueda de texto completo |
| [NIP-51](https://github.com/nostr-protocol/nips/blob/master/51.md) | Listas | 10000-10030, 30000-30030 | Recomendado | Silenciados, pines, favoritos |
| [NIP-56](https://github.com/nostr-protocol/nips/blob/master/56.md) | Reportes | 1984 | Opcional | Reportar spam/contenido ilegal |
| [NIP-57](https://github.com/nostr-protocol/nips/blob/master/57.md) | Zaps | 9734, 9735 | Recomendado | Propinas Lightning |
| [NIP-58](https://github.com/nostr-protocol/nips/blob/master/58.md) | Insignias | 30009, 8 | Opcional | Logros, premios |
| [NIP-59](https://github.com/nostr-protocol/nips/blob/master/59.md) | Gift Wrap | 1059 | Recomendado | Envoltorio que oculta metadatos |
| [NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md) | Lista de relés | 10002 | Recomendado | Preferencias de relé del usuario |

### Referencia de Categorías de Kinds de Evento

Cómo se organizan los kinds de evento en el protocolo Nostr:

```javascript
// Categorías de kinds de evento (NIP-01)
const KIND_RANGES = {
  // Eventos regulares (almacenados de forma permanente)
  REGULAR: {
    range: [1, 10000],
    behavior: 'Stored by all relays',
    examples: [1, 6, 7, 40, 1984]
  },
  
  // Eventos reemplazables (solo se conserva el más reciente)
  REPLACEABLE: {
    range: [10000, 20000],
    behavior: 'Only newest per pubkey kept',
    examples: [0, 3, 10000, 10002]
  },
  
  // Eventos efímeros (no se almacenan)
  EPHEMERAL: {
    range: [20000, 30000],
    behavior: 'Never stored, realtime only',
    examples: [20000, 22242]
  },
  
  // Reemplazables parametrizados (el más reciente por etiqueta d)
  PARAMETERIZED: {
    range: [30000, 40000],
    behavior: 'Only newest per pubkey+d-tag',
    examples: [30000, 30001, 30023, 30315]
  }
};

// Mapa completo de kinds de evento (de la especificación del protocolo Nostr)
const EVENT_KINDS = {
  // Metadatos y perfiles
  0: 'User Metadata (NIP-01)',
  3: 'Contacts/Follow List (NIP-02)',
  
  // Notas y contenido
  1: 'Short Text Note (NIP-01)',
  6: 'Repost (NIP-18)',
  16: 'Generic Repost (NIP-18)',
  30023: 'Long-form Article (NIP-23)',
  30024: 'Draft Article (NIP-23)',
  
  // Reacciones y participación
  7: 'Reaction (NIP-25)',
  9734: 'Zap Request (NIP-57)',
  9735: 'Zap Receipt (NIP-57)',
  
  // Mensajes directos
  4: 'Encrypted DM (NIP-04, deprecated)',
  14: 'Private DM (NIP-17)',
  1059: 'Gift Wrap (NIP-59)',
  
  // Moderación
  5: 'Event Deletion Request (NIP-09)',
  1984: 'Reporting (NIP-56)',
  
  // Listas y colecciones (NIP-51)
  10000: 'Mute List',
  10001: 'Pin List',
  10002: 'Relay List (NIP-65)',
  10003: 'Bookmark List',
  10004: 'Communities List',
  10005: 'Public Chats List',
  10006: 'Blocked Relays',
  10007: 'Search Relays',
  10015: 'Interests List',
  10030: 'User Emoji List',
  
  30000: 'Follow Sets',
  30001: 'Generic Lists (deprecated)',
  30002: 'Relay Sets',
  30003: 'Bookmark Sets',
  30004: 'Curation Sets',
  30008: 'Profile Badges (NIP-58)',
  30009: 'Badge Definition (NIP-58)',
  30015: 'Interest Sets',
  30030: 'Emoji Sets',
  
  // Comunidad y canales (NIP-28)
  40: 'Channel Creation',
  41: 'Channel Metadata',
  42: 'Channel Message',
  43: 'Channel Hide Message',
  44: 'Channel Mute User',
  
  // Autenticación y seguridad
  22242: 'Client Authentication (NIP-42)',
  
  // Estado y presencia
  30315: 'User Status (NIP-38)',
  
  // Marketplace (NIP-15)
  30017: 'Create/Update Stall',
  30018: 'Create/Update Product',
  
  // Otros
  8: 'Badge Award (NIP-58)',
  1111: 'Comments (NIP-22)',
  1985: 'Label (NIP-32)'
};
```

### Referencia de Tipos de Mensaje

Mensajes de cliente a relé y de relé a cliente:

```javascript
// Mensajes de cliente a relé
const CLIENT_MESSAGES = {
  EVENT: ['EVENT', event],        // Publicar un evento
  REQ: ['REQ', subId, ...filters], // Solicitar eventos y suscribirse
  CLOSE: ['CLOSE', subId],        // Terminar la suscripción
  AUTH: ['AUTH', event],          // Autenticación (NIP-42)
  COUNT: ['COUNT', subId, filter] // Solicitar conteos (NIP-45)
};

// Mensajes de relé a cliente
const RELAY_MESSAGES = {
  EVENT: ['EVENT', subId, event],     // Enviar el evento solicitado
  OK: ['OK', eventId, accepted, msg], // Aceptar/rechazar EVENT
  EOSE: ['EOSE', subId],             // Fin de eventos almacenados
  CLOSED: ['CLOSED', subId, msg],     // Suscripción terminada
  NOTICE: ['NOTICE', humanMsg],       // Mensaje legible por humanos
  AUTH: ['AUTH', challenge],          // Solicitar auth (NIP-42)
  COUNT: ['COUNT', subId, {count}]    // Enviar conteo (NIP-45)
};
```

### Referencia de Etiquetas Comunes

Etiquetas estándar usadas en distintos kinds de evento:

| Etiqueta | Descripción | Valores | NIPs |
|----------|-------------|---------|------|
| `e` | Referencia a evento | `[eventId, relay, marker, pubkey]` | 01, 10 |
| `p` | Referencia a pubkey | `[pubkey, relay, petname]` | 01, 02 |
| `a` | Ref. a evento parametrizado | `[kind:pubkey:d-tag, relay]` | 01 |
| `d` | Identificador/d-tag | `[string]` | 01 (addressable) |
| `t` | Hashtag | `[topic]` | 24 |
| `r` | Referencia a URL | `[url]` | 24, 25 |
| `q` | Referencia de cita | `[eventId, relay, pubkey]` | 18 |
| `amount` | Millisats | `[msats]` | 57 (zaps) |
| `bolt11` | Factura Lightning | `[invoice]` | 57 |
| `lnurl` | LNURL | `[lnurl]` | 57 |
| `relays` | Lista de relés | `[url1, url2, ...]` | 57 |
| `client` | Nombre del cliente | `[name, url]` | 89 |
| `title` | Título | `[text]` | 23 |
| `image` | URL de imagen | `[url, dimensions]` | 23, 52 |
| `summary` | Resumen | `[text]` | 23 |
| `published_at` | Hora de publicación | `[timestamp]` | 23 |
| `subject` | Línea de asunto | `[text]` | 14, 17 |
| `alt` | Descripción alternativa | `[text]` | 31 |
| `expiration` | Hora de expiración | `[timestamp]` | 40 |
| `content-warning` | Advertencia | `[reason]` | 36 |
| `delegation` | Token de delegación | `[delegator, conditions, token]` | 26 |
| `proxy` | ID externo | `[id, protocol]` | 48 |
| `i` | Identidad externa | `[platform:identity, proof]` | 39, 73 |
| `k` | Número de kind | `[number]` | 18, 25 |
| `l` | Etiqueta (label) | `[label, namespace]` | 32 |
| `L` | Espacio de nombres de label | `[namespace]` | 32 |

## 6.1 Categorías de Kinds de Evento

### Estructura del Evento (NIP-01)

Todo evento Nostr sigue una estructura estándar definida en NIP-01:

```javascript
{
  "id": "<32-bytes lowercase hex-encoded sha256 of serialized event>",
  "pubkey": "<32-bytes lowercase hex-encoded public key>",
  "created_at": "<unix timestamp in seconds>",
  "kind": "<integer>",
  "tags": [
    ["<single-letter>", "<value>", "<optional-value>"],
    // ... más etiquetas
  ],
  "content": "<arbitrary string>",
  "sig": "<64-bytes lowercase hex of signature of id>"
}
```

#### Cálculo del ID del Evento

El ID del evento es el hash SHA256 de los datos del evento serializados en UTF-8:

```javascript
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

function getEventHash(event) {
  const serialized = JSON.stringify([
    0, // reservado para uso futuro
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
  
  const hash = sha256(new TextEncoder().encode(serialized));
  return bytesToHex(hash);
}

// Ejemplo
const event = {
  pubkey: "abc123...",
  created_at: 1640000000,
  kind: 1,
  tags: [],
  content: "Hello Nostr!"
};

event.id = getEventHash(event);
```

#### Verificación de la Firma del Evento

```javascript
import { schnorr } from '@noble/curves/secp256k1';
import { hexToBytes } from '@noble/hashes/utils';

function verifySignature(event) {
  try {
    return schnorr.verify(
      event.sig,
      event.id,
      event.pubkey
    );
  } catch {
    return false;
  }
}

// Validar el evento completo
function validateEvent(event) {
  // Comprobar campos requeridos
  if (!event.id || !event.pubkey || !event.sig) {
    return { valid: false, reason: 'Missing required fields' };
  }
  
  // Verificar que el ID coincida con el contenido
  const calculatedId = getEventHash(event);
  if (calculatedId !== event.id) {
    return { valid: false, reason: 'Invalid event ID' };
  }
  
  // Verificar la firma
  if (!verifySignature(event)) {
    return { valid: false, reason: 'Invalid signature' };
  }
  
  // Comprobar que el timestamp sea razonable (no demasiado en el futuro)
  const now = Math.floor(Date.now() / 1000);
  if (event.created_at > now + 900) { // tolerancia de 15 minutos
    return { valid: false, reason: 'Timestamp too far in future' };
  }
  
  return { valid: true };
}
```

### Kinds de Evento Estándar

Los eventos Nostr se categorizan por su número `kind`, que determina su comportamiento y propósito.

| Rango | Categoría | Comportamiento | Ejemplos |
|-------|-----------|----------------|----------|
| 0-999 | Eventos regulares | Almacenados de forma permanente | Perfiles, notas, reacciones |
| 1000-9999 | Eventos regulares | Almacenados de forma permanente | Formato largo, listas |
| 10000-19999 | Eventos reemplazables | Solo se conserva el más reciente | Metadatos, listas de contactos |
| 20000-29999 | Eventos efímeros | No se almacenan | Indicadores de escritura, presencia |
| 30000-39999 | Reemplazables parametrizados | El más reciente por parámetro | Artículos, productos |

### Kinds de Evento Comunes

```javascript
const EVENT_KINDS = {
  // Eventos regulares
  METADATA: 0,              // Perfil de usuario
  TEXT_NOTE: 1,             // Nota de texto corta
  RECOMMEND_RELAY: 2,       // Recomendación de relé
  CONTACTS: 3,              // Lista de contactos
  ENCRYPTED_DM: 4,          // Mensaje directo cifrado
  EVENT_DELETION: 5,        // Solicitud de eliminación
  REPOST: 6,                // Repost/boost
  REACTION: 7,              // Like/reacción con emoji
  BADGE_AWARD: 8,           // Premio de insignia
  
  // Contenido de formato largo
  LONG_FORM: 30023,         // Artículos, entradas de blog
  
  // Eventos reemplazables
  RELAY_LIST: 10002,        // Lista de relés del usuario (NIP-65)
  
  // Listas (NIP-51)
  MUTE_LIST: 10000,
  PIN_LIST: 10001,
  BOOKMARK_LIST: 10003,
  
  // Zaps
  ZAP_REQUEST: 9734,
  ZAP_RECEIPT: 9735,
  
  // Efímeros
  AUTH: 22242,              // Autenticación del cliente
  
  // Comunidad
  CHANNEL_CREATE: 40,
  CHANNEL_METADATA: 41,
  CHANNEL_MESSAGE: 42,
  CHANNEL_HIDE_MESSAGE: 43,
  CHANNEL_MUTE_USER: 44,
};
```

## 6.2 Eventos Reemplazables

### Entender la Reemplazabilidad

Los eventos reemplazables se sustituyen automáticamente cuando se recibe un evento más reciente del mismo kind y del mismo autor.

```javascript
class ReplaceableEvent {
  constructor(kind, content, tags = []) {
    if (kind < 10000 || kind >= 20000) {
      throw new Error('Not a replaceable event kind');
    }
    
    this.kind = kind;
    this.content = content;
    this.tags = tags;
  }
  
  async publish(pool, privateKey) {
    const event = {
      kind: this.kind,
      created_at: Math.floor(Date.now() / 1000),
      tags: this.tags,
      content: this.content,
    };
    
    // Firmar y publicar
    const signedEvent = await signEvent(event, privateKey);
    await pool.publish(signedEvent);
    
    // Los relés reemplazarán automáticamente cualquier evento más antiguo
    // del mismo kind proveniente de esta pubkey
    return signedEvent;
  }
}

// Ejemplo: actualizar metadatos de usuario (kind 0)
const metadata = {
  name: "Alice",
  about: "Nostr developer",
  picture: "https://example.com/avatar.jpg",
  nip05: "alice@example.com"
};

const metadataEvent = new ReplaceableEvent(
  0,
  JSON.stringify(metadata)
);

await metadataEvent.publish(pool, privateKey);
```

### NIP-02: Listas de Contactos (Kind 3)

```javascript
class ContactList {
  constructor() {
    this.contacts = [];
  }
  
  addContact(pubkey, relay = '', petname = '') {
    this.contacts.push({
      pubkey,
      relay,
      petname
    });
  }
  
  removeContact(pubkey) {
    this.contacts = this.contacts.filter(c => c.pubkey !== pubkey);
  }
  
  toEvent() {
    return {
      kind: 3,
      content: '',
      tags: this.contacts.map(c => [
        'p',
        c.pubkey,
        c.relay,
        c.petname
      ]),
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static fromEvent(event) {
    const list = new ContactList();
    
    event.tags
      .filter(tag => tag[0] === 'p')
      .forEach(tag => {
        list.contacts.push({
          pubkey: tag[1],
          relay: tag[2] || '',
          petname: tag[3] || ''
        });
      });
    
    return list;
  }
}

// Uso
const contacts = new ContactList();
contacts.addContact(
  'pubkey123',
  'wss://relay.damus.io',
  'Alice'
);
contacts.addContact(
  'pubkey456',
  'wss://nos.lol',
  'Bob'
);

const event = contacts.toEvent();
// Firmar y publicar
```

## 6.3 Eventos Reemplazables Parametrizados

### NIP-33: Eventos Reemplazables Parametrizados

Estos eventos usan una etiqueta `d` para crear varios eventos reemplazables del mismo kind.

```javascript
class ParameterizedReplaceableEvent {
  constructor(kind, identifier, content, tags = []) {
    if (kind < 30000 || kind >= 40000) {
      throw new Error('Not a parameterized replaceable event kind');
    }
    
    this.kind = kind;
    this.identifier = identifier;
    this.content = content;
    this.tags = [['d', identifier], ...tags];
  }
  
  toEvent() {
    return {
      kind: this.kind,
      content: this.content,
      tags: this.tags,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Ejemplo: crear un listado de producto
const product = new ParameterizedReplaceableEvent(
  30018, // kind de listado de producto
  'vintage-keyboard-001', // identificador único
  JSON.stringify({
    title: 'Vintage Mechanical Keyboard',
    description: 'IBM Model M from 1987',
    price: '150 USD',
    images: ['https://...']
  }),
  [
    ['t', 'keyboards'],
    ['t', 'vintage'],
    ['price', '150', 'USD']
  ]
);

// Más tarde, actualizar el mismo producto
const updatedProduct = new ParameterizedReplaceableEvent(
  30018,
  'vintage-keyboard-001', // el mismo identificador
  JSON.stringify({
    title: 'Vintage Mechanical Keyboard',
    description: 'IBM Model M from 1987',
    price: '120 USD', // precio actualizado
    images: ['https://...']
  }),
  [
    ['t', 'keyboards'],
    ['t', 'vintage'],
    ['price', '120', 'USD']
  ]
);
```

## 6.4 Contenido de Formato Largo (NIP-23)

### Crear Artículos

```javascript
class Article {
  constructor(title, summary, content, image = '') {
    this.title = title;
    this.summary = summary;
    this.content = content;
    this.image = image;
    this.tags = [];
    this.publishedAt = null;
  }
  
  setPublishedAt(timestamp) {
    this.publishedAt = timestamp;
    return this;
  }
  
  addTag(tag) {
    this.tags.push(tag);
    return this;
  }
  
  addHashtag(hashtag) {
    this.tags.push(['t', hashtag]);
    return this;
  }
  
  setIdentifier(identifier) {
    this.identifier = identifier;
    return this;
  }
  
  toEvent() {
    const tags = [
      ['d', this.identifier || this.generateSlug()],
      ['title', this.title],
      ['summary', this.summary],
      ...this.tags
    ];
    
    if (this.image) {
      tags.push(['image', this.image]);
    }
    
    if (this.publishedAt) {
      tags.push(['published_at', this.publishedAt.toString()]);
    }
    
    return {
      kind: 30023,
      content: this.content,
      tags: tags,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  generateSlug() {
    return this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  static fromEvent(event) {
    const getTag = (name) => {
      const tag = event.tags.find(t => t[0] === name);
      return tag ? tag[1] : '';
    };
    
    const article = new Article(
      getTag('title'),
      getTag('summary'),
      event.content,
      getTag('image')
    );
    
    article.identifier = getTag('d');
    
    const publishedAt = getTag('published_at');
    if (publishedAt) {
      article.publishedAt = parseInt(publishedAt);
    }
    
    article.tags = event.tags.filter(t => t[0] === 't');
    
    return article;
  }
}

// Crear y publicar un artículo
const article = new Article(
  'Understanding Nostr Relays',
  'A deep dive into relay architecture and best practices',
  `# Understanding Nostr Relays

Nostr relays are the backbone of the protocol...

## Architecture

Relays use WebSocket connections...

## Best Practices

When running a relay...`
)
  .setIdentifier('understanding-nostr-relays')
  .addHashtag('nostr')
  .addHashtag('relays')
  .addHashtag('tutorial')
  .setPublishedAt(Math.floor(Date.now() / 1000));

const event = article.toEvent();
// Firmar y publicar
```

### Consultar Artículos

```javascript
async function getArticlesByAuthor(pool, authorPubkey) {
  return await pool.query({
    kinds: [30023],
    authors: [authorPubkey]
  });
}

async function getArticlesByTag(pool, tag) {
  return await pool.query({
    kinds: [30023],
    '#t': [tag]
  });
}

async function getArticle(pool, authorPubkey, identifier) {
  const results = await pool.query({
    kinds: [30023],
    authors: [authorPubkey],
    '#d': [identifier]
  });
  
  return results[0] ? Article.fromEvent(results[0]) : null;
}
```

## 6.5 Reacciones y Participación (NIP-25)

### Implementar Reacciones

Las reacciones en Nostr usan eventos de kind 7 con el campo `content` que contiene la reacción. Aunque el like estándar es `+`, los clientes pueden usar emojis o cualquier texto para crear reacciones expresivas.

```javascript
class Reaction {
  static LIKE = '+';
  static DISLIKE = '-';
  
  static create(targetEvent, content = '+') {
    return {
      kind: 7,
      content: content,  // Puede ser '+', un emoji o cualquier texto
      tags: [
        ['e', targetEvent.id],
        ['p', targetEvent.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static createCustom(targetEvent, content) {
    return this.create(targetEvent, content);
  }
  
  static async getReactions(pool, eventId) {
    const reactions = await pool.query({
      kinds: [7],
      '#e': [eventId]
    });
    
    // Agrupar por tipo de reacción
    const grouped = {};
    reactions.forEach(r => {
      const content = r.content || '+';
      if (!grouped[content]) {
        grouped[content] = [];
      }
      grouped[content].push(r);
    });
    
    return grouped;
  }
  
  static async getReactionCount(pool, eventId) {
    const reactions = await this.getReactions(pool, eventId);
    const counts = {};
    
    Object.keys(reactions).forEach(emoji => {
      counts[emoji] = reactions[emoji].length;
    });
    
    return counts;
  }
}

// Ejemplos de uso: reacciones en la práctica

// Like estándar (soportado de forma universal)
const likeEvent = Reaction.create(someEvent, '+');

// Reacciones con emoji (populares en clientes modernos)
const heartEvent = Reaction.create(someEvent, '❤️');
const fireEvent = Reaction.create(someEvent, '🔥');
const laughEvent = Reaction.create(someEvent, '😂');

// Reacciones basadas en texto (también válidas)
const customReaction = Reaction.create(someEvent, 'awesome');

// El campo content acepta cualquier string; los clientes deciden cómo mostrarlo

// Obtener conteos de reacción agrupados por tipo
const counts = await Reaction.getReactionCount(pool, eventId);
// Resultado de ejemplo: { '+': 42, '❤️': 15, '🔥': 8, '😂': 3 }
```

### Reposts (NIP-18)

```javascript
class Repost {
  static create(originalEvent) {
    return {
      kind: 6,
      content: JSON.stringify(originalEvent),
      tags: [
        ['e', originalEvent.id],
        ['p', originalEvent.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static createQuote(originalEvent, comment) {
    return {
      kind: 1, // Nota regular
      content: comment,
      tags: [
        ['e', originalEvent.id, '', 'mention'],
        ['p', originalEvent.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Repost simple
const repost = Repost.create(originalEvent);

// Repost con cita (con comentario)
const quote = Repost.createQuote(
  originalEvent,
  'This is insightful! Everyone should read this.'
);
```

## 6.6 Listas y Conjuntos (NIP-51)

### Listas de Usuario

```javascript
class UserList {
  constructor(kind, title = '') {
    this.kind = kind;
    this.title = title;
    this.items = [];
  }
  
  addPubkey(pubkey, relay = '', petname = '') {
    this.items.push({
      type: 'p',
      value: pubkey,
      relay,
      petname
    });
  }
  
  addEvent(eventId, relay = '', reason = '') {
    this.items.push({
      type: 'e',
      value: eventId,
      relay,
      reason
    });
  }
  
  addHashtag(hashtag) {
    this.items.push({
      type: 't',
      value: hashtag
    });
  }
  
  toEvent() {
    return {
      kind: this.kind,
      content: '',
      tags: this.items.map(item => {
        if (item.type === 'p') {
          return ['p', item.value, item.relay || '', item.petname || ''];
        } else if (item.type === 'e') {
          return ['e', item.value, item.relay || ''];
        } else if (item.type === 't') {
          return ['t', item.value];
        }
      }),
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Lista de silenciados (kind 10000)
const muteList = new UserList(10000, 'Muted Users');
muteList.addPubkey('spammer123');
muteList.addPubkey('troll456');
muteList.addHashtag('spam');

// Lista de pines (kind 10001)
const pinList = new UserList(10001, 'Pinned Notes');
pinList.addEvent('note1abc', '', 'Important announcement');
pinList.addEvent('note2def', '', 'Tutorial');

// Lista de favoritos (kind 10003)
const bookmarks = new UserList(10003, 'Reading List');
bookmarks.addEvent('article1');
bookmarks.addEvent('article2');

// Listas categorizadas (kind 30000-30001)
class CategorizedList extends UserList {
  constructor(identifier, title) {
    super(30001, title);
    this.identifier = identifier;
  }
  
  toEvent() {
    const event = super.toEvent();
    event.tags.unshift(['d', this.identifier]);
    event.tags.push(['title', this.title]);
    return event;
  }
}

const favoriteDevs = new CategorizedList('favorite-devs', 'Favorite Developers');
favoriteDevs.addPubkey('dev1');
favoriteDevs.addPubkey('dev2');
```

## 6.7 Mensajes Directos Cifrados

### NIP-04: Cifrado Básico (Obsoleto)

```javascript
import { nip04 } from 'nostr-tools';

class EncryptedDM {
  static async send(pool, senderPrivkey, recipientPubkey, message) {
    const encrypted = await nip04.encrypt(
      senderPrivkey,
      recipientPubkey,
      message
    );
    
    const event = {
      kind: 4,
      content: encrypted,
      tags: [['p', recipientPubkey]],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    const signed = await signEvent(event, senderPrivkey);
    await pool.publish(signed);
    
    return signed;
  }
  
  static async decrypt(privkey, senderPubkey, encryptedContent) {
    return await nip04.decrypt(
      privkey,
      senderPubkey,
      encryptedContent
    );
  }
  
  static async getConversation(pool, userPubkey, otherPubkey) {
    const sent = await pool.query({
      kinds: [4],
      authors: [userPubkey],
      '#p': [otherPubkey]
    });
    
    const received = await pool.query({
      kinds: [4],
      authors: [otherPubkey],
      '#p': [userPubkey]
    });
    
    return [...sent, ...received].sort(
      (a, b) => a.created_at - b.created_at
    );
  }
}
```

### NIP-44: Cifrado Mejorado (Recomendado)

```javascript
import { nip44 } from 'nostr-tools';

class SecureEncryptedDM {
  static async send(pool, senderPrivkey, recipientPubkey, message) {
    const encrypted = nip44.encrypt(
      senderPrivkey,
      recipientPubkey,
      message
    );
    
    const event = {
      kind: 4,
      content: encrypted,
      tags: [['p', recipientPubkey]],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    const signed = await signEvent(event, senderPrivkey);
    await pool.publish(signed);
    
    return signed;
  }
  
  static decrypt(privkey, senderPubkey, encryptedContent) {
    return nip44.decrypt(
      privkey,
      senderPubkey,
      encryptedContent
    );
  }
}
```

## 6.8 Zaps e Integración con Lightning (NIP-57)

### Entender los Zaps

Los Zaps son pagos de Lightning Network asociados a eventos Nostr.

```javascript
class ZapService {
  constructor(lnurlEndpoint) {
    this.lnurlEndpoint = lnurlEndpoint;
  }
  
  async createZapRequest(recipientPubkey, amount, comment = '', eventToZap = null) {
    const zapRequest = {
      kind: 9734,
      content: comment,
      tags: [
        ['p', recipientPubkey],
        ['amount', amount.toString()],
        ['relays', 'wss://relay.damus.io', 'wss://nos.lol']
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
    
    if (eventToZap) {
      zapRequest.tags.push(['e', eventToZap.id]);
    }
    
    return zapRequest;
  }
  
  async requestInvoice(zapRequest, amount) {
    const params = new URLSearchParams({
      amount: amount.toString(),
      nostr: JSON.stringify(zapRequest)
    });
    
    const response = await fetch(
      `${this.lnurlEndpoint}?${params}`
    );
    
    const data = await response.json();
    return data.pr; // Solicitud de pago (factura)
  }
  
  static async getZapsForEvent(pool, eventId) {
    return await pool.query({
      kinds: [9735], // Recibos de Zap
      '#e': [eventId]
    });
  }
  
  static async getZapsForPubkey(pool, pubkey) {
    return await pool.query({
      kinds: [9735],
      '#p': [pubkey]
    });
  }
  
  static calculateTotalSats(zapReceipts) {
    return zapReceipts.reduce((total, zap) => {
      const boltTag = zap.tags.find(t => t[0] === 'bolt11');
      if (boltTag) {
        const invoice = boltTag[1];
        const amount = this.parseInvoiceAmount(invoice);
        return total + amount;
      }
      return total;
    }, 0);
  }
  
  static parseInvoiceAmount(invoice) {
    // Analizar la factura Lightning para extraer el monto
    // Esto está simplificado: usa una biblioteca adecuada
    const match = invoice.match(/lnbc(\d+)([munp]?)/);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2];
      
      const multipliers = {
        'm': 100000,      // milli-satoshi
        'u': 100,         // micro-satoshi
        'n': 0.1,         // nano-satoshi
        'p': 0.0001,      // pico-satoshi
        '': 100000000     // bitcoin
      };
      
      return amount * (multipliers[unit] || 1);
    }
    return 0;
  }
}

// Uso
const zapService = new ZapService('https://lnurl.example.com');

// Crear solicitud de Zap
const zapRequest = await zapService.createZapRequest(
  recipientPubkey,
  1000, // sats
  'Great post!',
  eventToZap
);

// Obtener factura
const invoice = await zapService.requestInvoice(zapRequest, 1000);

// Pagar la factura con una billetera Lightning
// ...

// Consultar Zaps de un evento
const zaps = await ZapService.getZapsForEvent(pool, eventId);
const totalSats = ZapService.calculateTotalSats(zaps);
console.log(`Total zapped: ${totalSats} sats`);
```

## 6.9 Insignias y Logros (NIP-58)

### Crear Definiciones de Insignia

```javascript
class Badge {
  constructor(identifier, name, description, image) {
    this.identifier = identifier;
    this.name = name;
    this.description = description;
    this.image = image;
  }
  
  toDefinitionEvent() {
    return {
      kind: 30009,
      content: '',
      tags: [
        ['d', this.identifier],
        ['name', this.name],
        ['description', this.description],
        ['image', this.image]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  createAward(recipientPubkey) {
    return {
      kind: 8,
      content: '',
      tags: [
        ['a', `30009:${this.creatorPubkey}:${this.identifier}`],
        ['p', recipientPubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Crear definición de insignia
const contributorBadge = new Badge(
  'nostr-contributor-2024',
  'Nostr Contributor 2024',
  'Awarded to significant Nostr protocol contributors',
  'https://example.com/badges/contributor.png'
);

const badgeDefEvent = contributorBadge.toDefinitionEvent();
// Firmar y publicar

// Otorgar la insignia a alguien
const awardEvent = contributorBadge.createAward(developerPubkey);
// Firmar y publicar
```

## 6.10 Identificadores Codificados en Bech32 (NIP-19)

NIP-19 define identificadores especiales codificados en bech32 para una representación amigable de claves y eventos.

### Tipos de Entidad

| Prefijo | Entidad | Caso de uso |
|---------|---------|-------------|
| `npub` | Clave pública | Perfiles de usuario, menciones |
| `nsec` | Clave privada | Respaldo/importación (¡manéjala con seguridad!) |
| `note` | ID de evento | Compartir notas individuales |
| `nprofile` | Perfil con relés | Compartir perfil con pistas de relé |
| `nevent` | Evento con relés | Compartir evento con pistas de relé |
| `naddr` | Dirección de evento reemplazable | Referenciar artículos, productos |

### Codificar y Decodificar

```javascript
import { nip19 } from 'nostr-tools';

// Codificar clave pública
const hexPubkey = "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d";
const npub = nip19.npubEncode(hexPubkey);
// "npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6"

// Decodificar npub
const decoded = nip19.decode(npub);
console.log(decoded);
// { type: 'npub', data: '3bf0c63fcb...' }

// Codificar clave privada (ADVERTENCIA: ¡manéjala con extremo cuidado!)
const hexPrivkey = "...";
const nsec = nip19.nsecEncode(hexPrivkey);
// "nsec1..."

// Codificar ID de nota
const noteId = "note1abc...";
const note1 = nip19.noteEncode(noteId);

// Codificar perfil con pistas de relé
const profilePointer = nip19.nprofileEncode({
  pubkey: hexPubkey,
  relays: ['wss://relay.damus.io', 'wss://nos.lol']
});

// Codificar evento con contexto
const eventPointer = nip19.neventEncode({
  id: eventId,
  relays: ['wss://relay.damus.io'],
  author: authorPubkey,
  kind: 1
});

// Codificar dirección de evento reemplazable parametrizado
const addressPointer = nip19.naddrEncode({
  identifier: 'my-article',
  pubkey: authorPubkey,
  kind: 30023,
  relays: ['wss://relay.damus.io']
});
```

### Usos Prácticos

```javascript
class Nip19Helper {
  // Clave pública amigable para mostrar
  static displayPubkey(hexPubkey) {
    const npub = nip19.npubEncode(hexPubkey);
    return npub.substring(0, 12) + '...' + npub.substring(npub.length - 6);
    // "npub180cvv07...jh6w6"
  }
  
  // Crear enlace compartible a una nota
  static createNoteLink(eventId, relays = []) {
    if (relays.length > 0) {
      return nip19.neventEncode({ id: eventId, relays });
    }
    return nip19.noteEncode(eventId);
  }
  
  // Analizar entrada del usuario (puede ser hex o bech32)
  static parseUserInput(input) {
    try {
      // Intentar decodificar bech32
      const decoded = nip19.decode(input);
      return {
        type: decoded.type,
        data: decoded.data
      };
    } catch {
      // Asumir hex si la decodificación falla
      if (/^[0-9a-f]{64}$/i.test(input)) {
        return {
          type: 'hex',
          data: input.toLowerCase()
        };
      }
      throw new Error('Invalid input format');
    }
  }
  
  // Extraer menciones del texto
  static extractMentions(text) {
    const mentionRegex = /(npub1[a-z0-9]{58}|nprofile1[a-z0-9]+)/g;
    const matches = text.match(mentionRegex) || [];
    
    return matches.map(mention => {
      const decoded = nip19.decode(mention);
      return {
        mention,
        pubkey: decoded.type === 'npub' ? decoded.data : decoded.data.pubkey
      };
    });
  }
  
  // Reemplazar menciones con nombres amigables
  static async formatMentions(text, pool) {
    const mentions = this.extractMentions(text);
    let formatted = text;
    
    for (const { mention, pubkey } of mentions) {
      // Obtener el perfil del usuario
      const profile = await pool.queryOne({
        kinds: [0],
        authors: [pubkey]
      });
      
      const name = profile 
        ? JSON.parse(profile.content).name 
        : this.displayPubkey(pubkey);
      
      formatted = formatted.replace(mention, `@${name}`);
    }
    
    return formatted;
  }
}

// Ejemplos de uso
const shareableNote = Nip19Helper.createNoteLink(
  eventId, 
  ['wss://relay.damus.io']
);
console.log(`Share this: nostr:${shareableNote}`);

const parsed = Nip19Helper.parseUserInput('npub180cvv07...');
console.log(parsed); // { type: 'npub', data: '3bf0c63...' }

const mentions = Nip19Helper.extractMentions(
  'Hey npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6 check this out!'
);
console.log(mentions); // [{ mention: 'npub1...', pubkey: '3bf0c...' }]
```

### Consideraciones de Seguridad

```javascript
class SecureNip19Handler {
  // NUNCA expongas nsec en la interfaz o en los logs
  static handleNsec(nsec) {
    try {
      const { data: privateKey } = nip19.decode(nsec);
      
      // Cifrar o almacenar de forma segura de inmediato
      this.secureStore(privateKey);
      
      // Borrar de la memoria
      nsec = null;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Validar antes de decodificar
  static validateNip19(input) {
    const validPrefixes = ['npub', 'nsec', 'note', 'nprofile', 'nevent', 'naddr'];
    const prefix = input.substring(0, input.indexOf('1'));
    
    if (!validPrefixes.includes(prefix)) {
      throw new Error(`Invalid NIP-19 prefix: ${prefix}`);
    }
    
    try {
      nip19.decode(input);
      return true;
    } catch {
      return false;
    }
  }
}
```

## 6.11 Ejercicios Prácticos

### Ejercicio 1: Plataforma de Artículos
Construye una plataforma de contenido de formato largo:
1. Crear una interfaz de publicación de artículos
2. Implementar edición de artículos (actualizar los existentes)
3. Agregar filtrado por hashtags
4. Construir un feed de artículos con paginación

### Ejercicio 2: Interacciones Sociales
Implementa funciones de participación:
1. Sistema de likes/reacciones con emojis personalizados
2. Funcionalidad de repost
3. Reposts con cita y comentarios
4. Panel de estadísticas de reacciones

### Ejercicio 3: Gestión de Listas
Crea un gestor de favoritos:
1. Varias listas categorizadas
2. Agregar/quitar elementos
3. Compartir listas de forma pública
4. Importar/exportar listas

### Ejercicio 4: Chat Cifrado
Construye una aplicación de MD:
1. Implementar cifrado NIP-44
2. Actualizaciones de mensajes en tiempo real
3. Hilos de conversación
4. Confirmaciones de lectura

### Ejercicio 5: Integración de Zaps
Agrega zapping a tu cliente:
1. Mostrar un botón de Zap en los eventos
2. Mostrar el total de Zaps recibidos
3. Listar a los principales zappers
4. Crear una tabla de clasificación de Zaps

## 6.12 Delegación de Eventos (NIP-26)

La delegación de eventos permite que un usuario autorice a otro a publicar eventos en su nombre. Esto es útil para:
- Community managers que publican para marcas
- Cuentas bot que publican contenido automatizado
- Gestión de claves en varios dispositivos
- Integraciones de servicios

### Crear un Token de Delegación

```javascript
import { getSignature, getEventHash } from 'nostr-tools';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

class EventDelegation {
  static createDelegation(delegatorPrivateKey, delegatePubkey, conditions = {}) {
    const {
      kinds = [],        // kinds de evento permitidos
      since = 0,         // timestamp Unix: válido desde
      until = null,      // timestamp Unix: válido hasta
    } = conditions;
    
    // Construir la cadena de condiciones
    const conditionStrings = [];
    
    if (kinds.length > 0) {
      conditionStrings.push(`kind=${kinds.join(',')}`);
    }
    if (since > 0) {
      conditionStrings.push(`created_at>${since}`);
    }
    if (until) {
      conditionStrings.push(`created_at<${until}`);
    }
    
    const conditionsStr = conditionStrings.join('&');
    
    // Crear el token de delegación
    const token = `nostr:delegation:${delegatePubkey}:${conditionsStr}`;
    const hash = sha256(new TextEncoder().encode(token));
    const sig = getSignature(hash, delegatorPrivateKey);
    
    return {
      delegatePubkey,
      conditions: conditionsStr,
      token: bytesToHex(sig)
    };
  }
  
  static applyDelegationToEvent(event, delegatorPubkey, delegationToken) {
    // Agregar etiqueta de delegación
    event.tags.push([
      'delegation',
      delegatorPubkey,
      delegationToken.conditions,
      delegationToken.token
    ]);
    
    return event;
  }
  
  static verifyDelegation(event) {
    const delegationTag = event.tags.find(t => t[0] === 'delegation');
    
    if (!delegationTag) {
      return { valid: false, reason: 'No delegation tag' };
    }
    
    const [_, delegatorPubkey, conditions, token] = delegationTag;
    
    // Verificar que las condiciones coincidan con el evento
    const conditionChecks = conditions.split('&');
    
    for (const condition of conditionChecks) {
      if (condition.startsWith('kind=')) {
        const allowedKinds = condition.substring(5).split(',').map(Number);
        if (!allowedKinds.includes(event.kind)) {
          return { valid: false, reason: 'Kind not allowed by delegation' };
        }
      }
      
      if (condition.startsWith('created_at>')) {
        const since = parseInt(condition.substring(11));
        if (event.created_at <= since) {
          return { valid: false, reason: 'Event too old for delegation' };
        }
      }
      
      if (condition.startsWith('created_at<')) {
        const until = parseInt(condition.substring(11));
        if (event.created_at >= until) {
          return { valid: false, reason: 'Event too new for delegation' };
        }
      }
    }
    
    // Verificar la firma de delegación
    const delegationString = `nostr:delegation:${event.pubkey}:${conditions}`;
    const hash = sha256(new TextEncoder().encode(delegationString));
    
    // En la práctica, usa schnorr.verify aquí
    // Por ahora, asumimos que el token es válido si el formato es correcto
    
    return { valid: true, delegator: delegatorPubkey };
  }
}

// Ejemplo de uso
const delegatorPrivateKey = "..."; // Clave de la marca
const delegatePubkey = "...";      // Clave pública del community manager

// Crear delegación para notas de kind 1, válida 30 días
const delegation = EventDelegation.createDelegation(
  delegatorPrivateKey,
  delegatePubkey,
  {
    kinds: [1],
    since: Math.floor(Date.now() / 1000),
    until: Math.floor(Date.now() / 1000) + (30 * 86400)
  }
);

// El community manager crea un evento
const event = {
  kind: 1,
  pubkey: delegatePubkey,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "Posted on behalf of the brand"
};

// Aplicar la delegación
EventDelegation.applyDelegationToEvent(
  event,
  getDelegatorPubkey(delegatorPrivateKey), // Derivar de la clave privada
  delegation
);

// Firmar con la clave del delegado y publicar
// Los relés mostrarán esto como proveniente del delegante
```

### Casos de Uso Prácticos de Delegación

```javascript
// 1. Delegación de cuenta bot
class BotDelegation {
  constructor(ownerPrivateKey, botPubkey) {
    this.delegation = EventDelegation.createDelegation(
      ownerPrivateKey,
      botPubkey,
      {
        kinds: [1], // Solo permitir notas de texto
        since: Math.floor(Date.now() / 1000),
        until: Math.floor(Date.now() / 1000) + (365 * 86400) // 1 año
      }
    );
  }
  
  createBotPost(content, botPrivateKey) {
    const event = {
      kind: 1,
      pubkey: getPublicKey(botPrivateKey),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content
    };
    
    EventDelegation.applyDelegationToEvent(event, this.ownerPubkey, this.delegation);
    return finishEvent(event, botPrivateKey);
  }
}

// 2. Delegación de acceso temporal
class TemporaryDelegation {
  static createHourlyAccess(ownerKey, tempPubkey) {
    const now = Math.floor(Date.now() / 1000);
    
    return EventDelegation.createDelegation(
      ownerKey,
      tempPubkey,
      {
        since: now,
        until: now + 3600 // 1 hora
      }
    );
  }
}
```

## 6.13 Patrones Avanzados

### Hilos de Eventos

```javascript
class Thread {
  static createReply(parentEvent, content, mentions = []) {
    const tags = [
      ['e', parentEvent.id, '', 'reply']
    ];
    
    // Agregar el evento raíz si esta es una respuesta anidada
    const rootTag = parentEvent.tags.find(t => t[0] === 'e' && t[3] === 'root');
    if (rootTag) {
      tags.unshift(['e', rootTag[1], '', 'root']);
    } else {
      tags.unshift(['e', parentEvent.id, '', 'root']);
    }
    
    // Agregar al autor del padre
    tags.push(['p', parentEvent.pubkey]);
    
    // Agregar usuarios mencionados
    mentions.forEach(pubkey => {
      tags.push(['p', pubkey]);
    });
    
    return {
      kind: 1,
      content,
      tags,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  static async getThread(pool, rootEventId) {
    const replies = await pool.query({
      kinds: [1],
      '#e': [rootEventId]
    });
    
    // Construir estructura de árbol
    const threadMap = new Map();
    threadMap.set(rootEventId, { replies: [] });
    
    replies.forEach(reply => {
      const replyTag = reply.tags.find(t => t[0] === 'e' && t[3] === 'reply');
      const parentId = replyTag ? replyTag[1] : rootEventId;
      
      if (!threadMap.has(reply.id)) {
        threadMap.set(reply.id, { event: reply, replies: [] });
      } else {
        threadMap.get(reply.id).event = reply;
      }
      
      if (!threadMap.has(parentId)) {
        threadMap.set(parentId, { replies: [] });
      }
      
      threadMap.get(parentId).replies.push(reply.id);
    });
    
    return threadMap;
  }
}
```

### Descubrimiento de Contenido

```javascript
class ContentDiscovery {
  static async getTrending(pool, timeWindow = 86400) {
    const since = Math.floor(Date.now() / 1000) - timeWindow;
    
    // Obtener notas recientes
    const notes = await pool.query({
      kinds: [1],
      since,
      limit: 1000
    });
    
    // Obtener reacciones de estas notas
    const noteIds = notes.map(n => n.id);
    const reactions = await pool.query({
      kinds: [7],
      '#e': noteIds,
      since
    });
    
    // Contar reacciones por nota
    const reactionCounts = {};
    reactions.forEach(r => {
      const noteId = r.tags.find(t => t[0] === 'e')[1];
      reactionCounts[noteId] = (reactionCounts[noteId] || 0) + 1;
    });
    
    // Ordenar por conteo de reacciones
    return notes
      .map(note => ({
        ...note,
        reactions: reactionCounts[note.id] || 0
      }))
      .sort((a, b) => b.reactions - a.reactions);
  }
  
  static async getRecommended(pool, userPubkey) {
    // Obtener los contactos del usuario
    const contacts = await pool.queryOne({
      kinds: [3],
      authors: [userPubkey]
    });
    
    if (!contacts) return [];
    
    const following = contacts.tags
      .filter(t => t[0] === 'p')
      .map(t => t[1]);
    
    // Obtener notas recientes de los contactos
    return await pool.query({
      kinds: [1],
      authors: following,
      limit: 100
    });
  }
}
```

## 📝 Cuestionario del Módulo 6

1. **¿Cuál es la diferencia entre eventos reemplazables y eventos reemplazables parametrizados?**
   <details>
   <summary>Respuesta</summary>
   Los eventos reemplazables (10000-19999) conservan solo el evento más reciente de ese kind por pubkey. Los eventos reemplazables parametrizados (30000-39999) usan una etiqueta `d` para permitir varias instancias, conservando la más reciente por combinación pubkey+identificador.
   </details>

2. **¿Por qué se prefiere NIP-44 sobre NIP-04 para mensajes cifrados?**
   <details>
   <summary>Respuesta</summary>
   NIP-44 ofrece mejor seguridad con cifrado mejorado, relleno para impedir el análisis de la longitud del mensaje y protección contra varios ataques criptográficos a los que NIP-04 es vulnerable.
   </details>

3. **¿Cuáles son los tres componentes principales de un Zap?**
   <details>
   <summary>Respuesta</summary>
   1) Solicitud de Zap (kind 9734): el cliente la crea y la firma
   2) Factura Lightning: la genera el servidor LNURL
   3) Recibo de Zap (kind 9735): se publica después del pago
   </details>

4. **¿Cómo se crea una respuesta de hilo que mantiene la estructura de la conversación?**
   <details>
   <summary>Respuesta</summary>
   Usa etiquetas `e` con marcadores: una etiqueta `e` marcada `root` que apunta a la raíz del hilo, y una etiqueta `e` marcada `reply` que apunta al comentario padre inmediato.
   </details>

5. **¿Qué hace distinto al contenido de formato largo (kind 30023) de las notas regulares?**
   <details>
   <summary>Respuesta</summary>
   El contenido de formato largo es reemplazable parametrizado, admite etiquetas de metadatos (`title`, `summary`, `image`, `published_at`), usa una etiqueta `d` para identificación y está pensado para artículos y entradas de blog en lugar de mensajes cortos.
   </details>

## 🎯 Punto de Control del Módulo 6

Antes de completar este módulo, asegúrate de haber:

- [ ] Implementado eventos reemplazables (actualizaciones de perfil, listas de contactos)
- [ ] Creado y actualizado eventos reemplazables parametrizados
- [ ] Construido la publicación de contenido de formato largo
- [ ] Agregado reacciones y reposts a tu cliente
- [ ] Implementado al menos un tipo de lista (silenciados, favoritos, etc.)
- [ ] Integrado mensajería directa cifrada
- [ ] Comprendido el flujo de Zap (aunque no esté implementado por completo)
- [ ] Experimentado con insignias u otro NIP avanzado

## 📚 Recursos Adicionales

- [NIP-01: Basic Protocol Flow](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-23: Long-form Content](https://github.com/nostr-protocol/nips/blob/master/23.md)
- [NIP-25: Reactions](https://github.com/nostr-protocol/nips/blob/master/25.md)
- [NIP-33: Parameterized Replaceable Events](https://github.com/nostr-protocol/nips/blob/master/33.md)
- [NIP-44: Encrypted Direct Message](https://github.com/nostr-protocol/nips/blob/master/44.md)
- [NIP-51: Lists](https://github.com/nostr-protocol/nips/blob/master/51.md)
- [NIP-57: Lightning Zaps](https://github.com/nostr-protocol/nips/blob/master/57.md)
- [NIP-58: Badges](https://github.com/nostr-protocol/nips/blob/master/58.md)
- [Documentación de nostr-tools](https://github.com/nbd-wtf/nostr-tools)

## 💬 Discusión de la Comunidad

Únete a nuestro Discord para hablar del Módulo 6:
- Comparte tus implementaciones avanzadas
- Obtén ayuda con la integración de NIPs
- Discute propuestas de protocolo
- Colabora en el desarrollo de NIPs

---

!!! success "¡Felicitaciones!"
    ¡Has dominado los tipos de eventos avanzados y los NIPs de Nostr! Ahora puedes construir aplicaciones sofisticadas con contenido de formato largo, mensajería cifrada, interacciones sociales e integración con Lightning. ¡Estás listo para contribuir al ecosistema Nostr!

[🎓 Curso Completado - Próximos Pasos →](#next-steps)

## Próximos Pasos

Ahora que has completado los 6 módulos, considera:

1. **Construir una app de producción** — Toma lo que aprendiste y crea un cliente Nostr real
2. **Contribuir a los NIPs** — Propón mejoras o nuevas funciones del protocolo
3. **Operar infraestructura** — Configura relés, servidores LNURL u otros servicios
4. **Unirte al desarrollo** — Contribuye a proyectos Nostr existentes
5. **Crear contenido** — Comparte tutoriales y ayuda a otras personas a aprender

¡Bienvenido al ecosistema Nostr! 🚀💜
