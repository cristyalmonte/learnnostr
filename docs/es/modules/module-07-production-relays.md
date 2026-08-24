# Módulo 7: Relés en Producción

!!! info "Visión General del Módulo"
    **Duración**: 8-10 horas  
    **Nivel**: Avanzado  
    **Prerrequisitos**: Módulos 1-6 completados  
    **Objetivo**: Diseñar, desplegar y operar relés Nostr de grado de producción a escala

## 📋 Objetivos de Aprendizaje

Al final de este módulo, serás capaz de:

- ✅ Comprender la arquitectura de relés y los requisitos de infraestructura
- ✅ Desplegar y configurar relés de producción
- ✅ Implementar filtrado avanzado y prevención de spam
- ✅ Optimizar el rendimiento y la escalabilidad del relé
- ✅ Monitorear la salud del relé y resolver problemas
- ✅ Implementar estrategias de monetización del relé
- ✅ Gestionar amenazas de seguridad y abuso
- ✅ Planificar alta disponibilidad y recuperación ante desastres

## 📚 Referencia de NIPs para Implementación de Relés

### NIPs esenciales para operadores de relés

| NIP | Título | Implementación | Prioridad | Propósito |
|-----|--------|----------------|-----------|-----------|
| [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) | Protocolo básico | Obligatorio | **Crítico** | Estructura de eventos, tipos de mensajes |
| [NIP-11](https://github.com/nostr-protocol/nips/blob/master/11.md) | Documento de información del relé | Obligatorio | **Crítico** | Metadatos y capacidades del relé |
| [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md) | Eliminación de eventos | Opcional | Alta | Gestionar solicitudes de eliminación |
| [NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md) | Prueba de trabajo | Opcional | Alta | Validación PoW anti-spam |
| [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md) | Autenticación | Opcional | Alta | AUTH de cliente (control de acceso) |
| [NIP-40](https://github.com/nostr-protocol/nips/blob/master/40.md) | Expiración | Opcional | Media | Expirar eventos automáticamente |
| [NIP-45](https://github.com/nostr-protocol/nips/blob/master/45.md) | Conteos de eventos | Opcional | Media | Soporte de consultas COUNT |
| [NIP-50](https://github.com/nostr-protocol/nips/blob/master/50.md) | Búsqueda | Opcional | Media | Capacidad de búsqueda de texto completo |
| [NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md) | Metadatos de lista de relés | Recomendado | Media | Preferencias de relés del usuario |
| [NIP-70](https://github.com/nostr-protocol/nips/blob/master/70.md) | Eventos protegidos | Opcional | Baja | Republicación solo por el autor |

### Flujo de mensajes del relé (NIP-01)

```javascript
// MENSAJES DEL CLIENTE AL RELÉ
const ClientMessages = {
  // Publicar un evento
  EVENT: ['EVENT', {
    id: '...',
    pubkey: '...',
    created_at: 1234567890,
    kind: 1,
    tags: [],
    content: 'Hello',
    sig: '...'
  }],
  
  // Suscribirse a eventos
  REQ: ['REQ', 'subscription-id', {
    kinds: [1],
    authors: ['pubkey...'],
    since: 1234567890,
    limit: 100
  }],
  
  // Cerrar suscripción
  CLOSE: ['CLOSE', 'subscription-id'],
  
  // Autenticar (NIP-42)
  AUTH: ['AUTH', {
    kind: 22242,
    tags: [
      ['relay', 'wss://relay.example.com'],
      ['challenge', '...']
    ]
    // ...
  }],
  
  // Solicitar recuento (NIP-45)
  COUNT: ['COUNT', 'count-id', {kinds: [1]}]
};

// MENSAJES DEL RELÉ AL CLIENTE
const RelayMessages = {
  // Enviar evento al suscriptor
  EVENT: ['EVENT', 'subscription-id', event],
  
  // Confirmar recepción del evento
  OK: ['OK', 'event-id', true, ''],
  OK_REJECTED: ['OK', 'event-id', false, 'blocked: spam detected'],
  
  // Fin de los eventos almacenados
  EOSE: ['EOSE', 'subscription-id'],
  
  // Suscripción cerrada
  CLOSED: ['CLOSED', 'subscription-id', 'auth-required: must authenticate'],
  
  // Aviso legible por humanos
  NOTICE: ['NOTICE', 'This relay requires payment'],
  
  // Desafío de autenticación (NIP-42)
  AUTH: ['AUTH', 'random-challenge-string'],
  
  // Respuesta de recuento (NIP-45)
  COUNT: ['COUNT', 'count-id', {count: 42}]
};
```

### Documento de información del relé (NIP-11)

Tu relé DEBE servir un documento JSON en `/.well-known/nostr.json`:

```javascript
// Ejemplo de documento NIP-11
{
  "name": "My Production Relay",
  "description": "A high-performance Nostr relay",
  "pubkey": "relay-admin-pubkey-hex",
  "contact": "admin@example.com",
  "supported_nips": [1, 2, 9, 11, 12, 13, 15, 16, 20, 22, 33, 40, 42, 45, 50],
  "software": "https://github.com/myrelay/nostr-relay",
  "version": "1.2.3",
  "limitation": {
    "max_message_length": 65536,
    "max_subscriptions": 20,
    "max_filters": 10,
    "max_limit": 5000,
    "max_subid_length": 64,
    "max_event_tags": 2000,
    "max_content_length": 65536,
    "min_pow_difficulty": 0,
    "auth_required": false,
    "payment_required": true,
    "restricted_writes": false
  },
  "retention": [
    {
      "kinds": [0, 3, 10000, 10001, 10002],
      "time": null  // Conservar eventos reemplazables para siempre
    },
    {
      "kinds": [1, 7],
      "time": 3600  // Conservar eventos regulares durante 1 hora
    }
  ],
  "relay_countries": ["US", "CA"],
  "language_tags": ["en", "en-US"],
  "tags": ["bitcoin", "lightning", "freedom"],
  "posting_policy": "https://example.com/policy",
  "payments_url": "https://example.com/payments",
  "fees": {
    "admission": [{
      "amount": 5000000,
      "unit": "msats",
      "period": 2592000  // 30 días
    }],
    "subscription": [{
      "amount": 1000000,
      "unit": "msats",
      "period": 2592000
    }],
    "publication": [{
      "kinds": [4],
      "amount": 100,
      "unit": "msats"
    }]
  }
}
```

### Manejo de kinds de eventos

```javascript
// Política de almacenamiento del relé según rangos de kind (NIP-01)
class EventKindHandler {
  shouldStore(event) {
    const kind = event.kind;
    
    // Eventos regulares (almacenados de forma permanente)
    if ((kind >= 1 && kind < 10000) || 
        (kind >= 4 && kind < 45) || 
        kind === 1 || kind === 2) {
      return {
        store: true,
        strategy: 'permanent'
      };
    }
    
    // Eventos reemplazables (conservar solo el más reciente)
    if ((kind >= 10000 && kind < 20000) || 
        kind === 0 || kind === 3) {
      return {
        store: true,
        strategy: 'replaceable',
        replaceKey: event.pubkey
      };
    }
    
    // Eventos efímeros (nunca almacenar)
    if (kind >= 20000 && kind < 30000) {
      return {
        store: false,
        strategy: 'ephemeral'
      };
    }
    
    // Reemplazables parametrizados (conservar el más reciente por etiqueta d)
    if (kind >= 30000 && kind < 40000) {
      const dTag = event.tags.find(t => t[0] === 'd')?.[1] || '';
      return {
        store: true,
        strategy: 'parameterized-replaceable',
        replaceKey: `${event.pubkey}:${kind}:${dTag}`
      };
    }
    
    return { store: true, strategy: 'permanent' };
  }
  
  async handleEvent(event, db) {
    const policy = this.shouldStore(event);
    
    if (!policy.store) {
      // Solo difundir a las suscripciones activas
      return { stored: false, broadcasted: true };
    }
    
    switch (policy.strategy) {
      case 'replaceable':
        // Eliminar eventos más antiguos del mismo autor con el mismo kind
        await db.query(
          'DELETE FROM events WHERE pubkey = $1 AND kind = $2',
          [event.pubkey, event.kind]
        );
        break;
        
      case 'parameterized-replaceable':
        // Eliminar eventos más antiguos con el mismo pubkey:kind:d-tag
        const dTag = event.tags.find(t => t[0] === 'd')?.[1] || '';
        await db.query(
          'DELETE FROM events WHERE pubkey = $1 AND kind = $2 AND d_tag = $3',
          [event.pubkey, event.kind, dTag]
        );
        break;
    }
    
    // Almacenar el nuevo evento
    await db.storeEvent(event);
    return { stored: true, broadcasted: true };
  }
}
```

### Flujo de autenticación (NIP-42)

```javascript
// Implementación de AUTH en el lado del relé
class RelayAuth {
  constructor() {
    this.challenges = new Map();
    this.authenticatedClients = new Map();
  }
  
  // Enviar desafío AUTH al cliente
  sendChallenge(ws, clientId) {
    const challenge = crypto.randomBytes(32).toString('hex');
    this.challenges.set(clientId, {
      challenge,
      timestamp: Date.now()
    });
    
    ws.send(JSON.stringify(['AUTH', challenge]));
    
    // El desafío expira en 5 minutos
    setTimeout(() => {
      this.challenges.delete(clientId);
    }, 300000);
  }
  
  // Verificar la respuesta AUTH
  async verifyAuth(event, clientId) {
    // Validar el kind del evento
    if (event.kind !== 22242) {
      return { valid: false, reason: 'invalid kind' };
    }
    
    // Comprobar la etiqueta challenge
    const challengeTag = event.tags.find(t => t[0] === 'challenge');
    if (!challengeTag) {
      return { valid: false, reason: 'missing challenge' };
    }
    
    // Verificar que el desafío coincida
    const stored = this.challenges.get(clientId);
    if (!stored || stored.challenge !== challengeTag[1]) {
      return { valid: false, reason: 'invalid challenge' };
    }
    
    // Comprobar la etiqueta relay
    const relayTag = event.tags.find(t => t[0] === 'relay');
    if (!relayTag || !this.isMyRelay(relayTag[1])) {
      return { valid: false, reason: 'wrong relay' };
    }
    
    // Comprobar la marca de tiempo (dentro de 10 minutos)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(event.created_at - now) > 600) {
      return { valid: false, reason: 'timestamp out of range' };
    }
    
    // Verificar la firma
    if (!await this.verifySignature(event)) {
      return { valid: false, reason: 'invalid signature' };
    }
    
    // Autenticación exitosa
    this.authenticatedClients.set(clientId, {
      pubkey: event.pubkey,
      authenticatedAt: Date.now()
    });
    
    this.challenges.delete(clientId);
    
    return { valid: true, pubkey: event.pubkey };
  }
  
  isAuthenticated(clientId) {
    return this.authenticatedClients.has(clientId);
  }
  
  getAuthenticatedPubkey(clientId) {
    return this.authenticatedClients.get(clientId)?.pubkey;
  }
}
```

### Validación de filtros (NIP-01)

```javascript
// Validación exhaustiva de filtros para el relé
class FilterValidator {
  constructor(config) {
    this.config = {
      maxFilterIds: 1000,
      maxFilterAuthors: 1000,
      maxFilterKinds: 20,
      maxFilterTags: 100,
      maxLimit: 5000,
      ...config
    };
  }
  
  validate(filter) {
    const errors = [];
    
    // Validar el arreglo ids
    if (filter.ids) {
      if (!Array.isArray(filter.ids)) {
        errors.push('ids must be an array');
      } else if (filter.ids.length > this.config.maxFilterIds) {
        errors.push(`too many ids (max ${this.config.maxFilterIds})`);
      } else if (!filter.ids.every(id => /^[0-9a-f]{64}$/i.test(id))) {
        errors.push('invalid id format (must be 64-char hex)');
      }
    }
    
    // Validar el arreglo authors
    if (filter.authors) {
      if (!Array.isArray(filter.authors)) {
        errors.push('authors must be an array');
      } else if (filter.authors.length > this.config.maxFilterAuthors) {
        errors.push(`too many authors (max ${this.config.maxFilterAuthors})`);
      } else if (!filter.authors.every(pk => /^[0-9a-f]{64}$/i.test(pk))) {
        errors.push('invalid pubkey format');
      }
    }
    
    // Validar el arreglo kinds
    if (filter.kinds) {
      if (!Array.isArray(filter.kinds)) {
        errors.push('kinds must be an array');
      } else if (filter.kinds.length > this.config.maxFilterKinds) {
        errors.push(`too many kinds (max ${this.config.maxFilterKinds})`);
      } else if (!filter.kinds.every(k => Number.isInteger(k) && k >= 0 && k <= 65535)) {
        errors.push('invalid kind (must be 0-65535)');
      }
    }
    
    // Validar filtros de etiquetas (#e, #p, etc.)
    for (const [key, values] of Object.entries(filter)) {
      if (key.startsWith('#')) {
        const tagName = key.slice(1);
        if (!/^[a-zA-Z]$/.test(tagName)) {
          errors.push(`invalid tag filter: ${key}`);
        }
        if (!Array.isArray(values)) {
          errors.push(`${key} must be an array`);
        }
        if (values.length > this.config.maxFilterTags) {
          errors.push(`too many ${key} values (max ${this.config.maxFilterTags})`);
        }
      }
    }
    
    // Validar marcas de tiempo
    if (filter.since !== undefined && !Number.isInteger(filter.since)) {
      errors.push('since must be an integer');
    }
    if (filter.until !== undefined && !Number.isInteger(filter.until)) {
      errors.push('until must be an integer');
    }
    if (filter.since && filter.until && filter.since > filter.until) {
      errors.push('since must be <= until');
    }
    
    // Validar limit
    if (filter.limit !== undefined) {
      if (!Number.isInteger(filter.limit) || filter.limit < 0) {
        errors.push('limit must be a positive integer');
      }
      if (filter.limit > this.config.maxLimit) {
        errors.push(`limit too high (max ${this.config.maxLimit})`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

## 7.1 Fundamentos de la arquitectura de relés

### Responsabilidades del relé

Un relé Nostr tiene tres responsabilidades centrales:

1. **Aceptar eventos** — Recibir y validar eventos de los clientes
2. **Almacenar eventos** — Persistir eventos según las políticas de almacenamiento
3. **Servir eventos** — Responder a los filtros de suscripción con los eventos coincidentes

```mermaid
graph TB
    C1[Cliente 1] -->|Publicar evento| R[Relé]
    C2[Cliente 2] -->|Suscribirse con filtro| R
    C3[Cliente 3] -->|Publicar evento| R
    
    R -->|Validar| V[Validador]
    V -->|Almacenar| S[Capa de almacenamiento]
    S -->|Consultar| Q[Motor de consultas]
    Q -->|Transmitir eventos| C2
    
    style R fill:#667eea,stroke:#fff,color:#fff
    style V fill:#f093fb,stroke:#fff,color:#fff
    style S fill:#4facfe,stroke:#fff,color:#fff
    style Q fill:#43e97b,stroke:#fff,color:#fff
```

### Capas de la arquitectura

```javascript
// Arquitectura de alto nivel del relé
class NostrRelay {
  constructor(config) {
    // Servidor WebSocket para conexiones de clientes
    this.wsServer = new WebSocketServer(config.port);
    
    // Validación y procesamiento de eventos
    this.validator = new EventValidator();
    this.processor = new EventProcessor();
    
    // Backend de almacenamiento
    this.storage = new StorageEngine(config.database);
    
    // Gestión de consultas y suscripciones
    this.subscriptionManager = new SubscriptionManager();
    
    // Limitación de tasa y prevención de spam
    this.rateLimiter = new RateLimiter(config.limits);
    
    // Monitoreo y métricas
    this.metrics = new MetricsCollector();
  }
  
  async start() {
    await this.storage.connect();
    await this.wsServer.listen();
    console.log(`Relay started on port ${this.config.port}`);
  }
}
```

## 7.2 Diseño de la capa de almacenamiento

### Selección de base de datos

Distintos backends de almacenamiento para distintas necesidades:

| Base de datos | Ideal para | Ventajas | Desventajas |
|---------------|------------|----------|-------------|
| PostgreSQL | Uso general, consultas complejas | ACID, maduro, rico en funciones | Consume muchos recursos |
| SQLite | Relés pequeños, embebido | Simple, rápido, portable | Limitación de un solo escritor |
| MongoDB | Almacenamiento de documentos, flexibilidad | Flexibilidad de esquema, escalado horizontal | Sin transacciones ACID |
| LevelDB | Alto rendimiento, clave-valor | Muy rápido, bajo overhead | Capacidades de consulta limitadas |
| Redis | Caché, suscripciones en tiempo real | Extremadamente rápido, pub/sub | Solo en memoria (costoso) |

### Diseño de esquema optimizado

Ejemplo de PostgreSQL con indexación eficiente:

```sql
-- Tabla de eventos optimizada para consultas Nostr
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    pubkey TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    kind INTEGER NOT NULL,
    tags JSONB,
    content TEXT,
    sig TEXT NOT NULL,
    
    -- Columnas calculadas para filtros comunes
    e_tags TEXT[] GENERATED ALWAYS AS (
        array(SELECT jsonb_array_elements_text(tags) 
              FROM jsonb_array_elements(tags) 
              WHERE jsonb_array_element(tags, 0) = '"e"')
    ) STORED,
    
    p_tags TEXT[] GENERATED ALWAYS AS (
        array(SELECT jsonb_array_elements_text(tags) 
              FROM jsonb_array_elements(tags) 
              WHERE jsonb_array_element(tags, 0) = '"p"')
    ) STORED,
    
    t_tags TEXT[] GENERATED ALWAYS AS (
        array(SELECT jsonb_array_elements_text(tags) 
              FROM jsonb_array_elements(tags) 
              WHERE jsonb_array_element(tags, 0) = '"t"')
    ) STORED
);

-- Índices críticos para el rendimiento
CREATE INDEX idx_events_pubkey ON events(pubkey);
CREATE INDEX idx_events_kind ON events(kind);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_pubkey_kind ON events(pubkey, kind);

-- Índices específicos de etiquetas usando columnas generadas
CREATE INDEX idx_events_e_tags ON events USING GIN(e_tags);
CREATE INDEX idx_events_p_tags ON events USING GIN(p_tags);
CREATE INDEX idx_events_t_tags ON events USING GIN(t_tags);

-- Índices compuestos para combinaciones de filtros habituales
CREATE INDEX idx_events_kind_created ON events(kind, created_at DESC);
CREATE INDEX idx_events_pubkey_created ON events(pubkey, created_at DESC);

-- Índices parciales para eventos reemplazables
CREATE INDEX idx_replaceable_events ON events(pubkey, kind) 
    WHERE kind >= 10000 AND kind < 20000;

-- Índice para eventos reemplazables parametrizados
CREATE INDEX idx_param_replaceable ON events(pubkey, kind, (tags->>'d'))
    WHERE kind >= 30000 AND kind < 40000;
```

### Políticas de almacenamiento

```javascript
class StoragePolicy {
  constructor(config) {
    this.maxEventAge = config.maxEventAge || 365 * 24 * 60 * 60; // 1 año
    this.maxEventsPerPubkey = config.maxEventsPerPubkey || 10000;
    this.retentionByKind = config.retentionByKind || {};
  }
  
  shouldStore(event) {
    // Los eventos efímeros (20000-29999) nunca se almacenan
    if (event.kind >= 20000 && event.kind < 30000) {
      return false;
    }
    
    // Comprobar la antigüedad del evento
    const age = Date.now() / 1000 - event.created_at;
    if (age > this.maxEventAge) {
      return false;
    }
    
    // Comprobar retención específica por kind
    const kindRetention = this.retentionByKind[event.kind];
    if (kindRetention && age > kindRetention) {
      return false;
    }
    
    return true;
  }
  
  async enforceReplaceableEvents(event, storage) {
    // Gestionar eventos reemplazables (10000-19999)
    if (event.kind >= 10000 && event.kind < 20000) {
      await storage.deleteOlderEvents({
        pubkey: event.pubkey,
        kind: event.kind,
        created_at: { $lt: event.created_at }
      });
    }
    
    // Gestionar eventos reemplazables parametrizados (30000-39999)
    if (event.kind >= 30000 && event.kind < 40000) {
      const dTag = event.tags.find(t => t[0] === 'd')?.[1];
      if (dTag) {
        await storage.deleteOlderEvents({
          pubkey: event.pubkey,
          kind: event.kind,
          'd_tag': dTag,
          created_at: { $lt: event.created_at }
        });
      }
    }
  }
}
```

## 7.3 Validación y procesamiento de eventos

### Validador exhaustivo de eventos

```javascript
class ProductionEventValidator {
  constructor(config = {}) {
    this.maxContentLength = config.maxContentLength || 100000; // 100KB
    this.maxTagsCount = config.maxTagsCount || 2000;
    this.maxTagLength = config.maxTagLength || 1000;
    this.allowedKinds = config.allowedKinds || null; // null = todos los kinds
    this.blacklistedPubkeys = new Set(config.blacklistedPubkeys || []);
  }
  
  async validate(event) {
    const errors = [];
    
    // 1. Comprobar campos obligatorios
    if (!event.id || !event.pubkey || !event.created_at || 
        event.kind === undefined || !event.tags || !event.content || !event.sig) {
      errors.push('Missing required fields');
      return { valid: false, errors };
    }
    
    // 2. Validar formatos de los campos
    if (!/^[0-9a-f]{64}$/.test(event.id)) {
      errors.push('Invalid event ID format');
    }
    
    if (!/^[0-9a-f]{64}$/.test(event.pubkey)) {
      errors.push('Invalid pubkey format');
    }
    
    if (!/^[0-9a-f]{128}$/.test(event.sig)) {
      errors.push('Invalid signature format');
    }
    
    // 3. Comprobar lista negra
    if (this.blacklistedPubkeys.has(event.pubkey)) {
      errors.push('Pubkey is blacklisted');
      return { valid: false, errors };
    }
    
    // 4. Validar marca de tiempo
    const now = Math.floor(Date.now() / 1000);
    if (event.created_at > now + 900) { // tolerancia de 15 min en el futuro
      errors.push('Timestamp too far in future');
    }
    
    if (event.created_at < now - (365 * 24 * 60 * 60)) { // 1 año en el pasado
      errors.push('Timestamp too far in past');
    }
    
    // 5. Validar kind
    if (!Number.isInteger(event.kind) || event.kind < 0) {
      errors.push('Invalid kind');
    }
    
    if (this.allowedKinds && !this.allowedKinds.includes(event.kind)) {
      errors.push(`Kind ${event.kind} not allowed on this relay`);
    }
    
    // 6. Validar longitud del contenido
    if (event.content.length > this.maxContentLength) {
      errors.push(`Content exceeds maximum length of ${this.maxContentLength}`);
    }
    
    // 7. Validar etiquetas
    if (!Array.isArray(event.tags)) {
      errors.push('Tags must be an array');
    } else {
      if (event.tags.length > this.maxTagsCount) {
        errors.push(`Too many tags (max ${this.maxTagsCount})`);
      }
      
      for (const tag of event.tags) {
        if (!Array.isArray(tag)) {
          errors.push('Each tag must be an array');
          break;
        }
        
        if (tag.length === 0) {
          errors.push('Tag cannot be empty');
          break;
        }
        
        for (const item of tag) {
          if (typeof item !== 'string') {
            errors.push('Tag items must be strings');
            break;
          }
          
          if (item.length > this.maxTagLength) {
            errors.push(`Tag item exceeds maximum length of ${this.maxTagLength}`);
            break;
          }
        }
      }
    }
    
    // 8. Verificar el ID del evento
    const calculatedId = this.calculateEventId(event);
    if (calculatedId !== event.id) {
      errors.push('Event ID does not match content');
    }
    
    // 9. Verificar la firma
    const signatureValid = await this.verifySignature(event);
    if (!signatureValid) {
      errors.push('Invalid signature');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  calculateEventId(event) {
    const { sha256 } = require('@noble/hashes/sha256');
    const { bytesToHex } = require('@noble/hashes/utils');
    
    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);
    
    const hash = sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
  }
  
  async verifySignature(event) {
    const { schnorr } = require('@noble/curves/secp256k1');
    
    try {
      return schnorr.verify(event.sig, event.id, event.pubkey);
    } catch {
      return false;
    }
  }
}
```

## 7.4 Limitación de tasa y prevención de spam

### Limitación de tasa en múltiples capas

```javascript
class AdvancedRateLimiter {
  constructor(redis, config) {
    this.redis = redis;
    this.config = {
      // Límites por IP
      ip: {
        connections: { limit: 10, window: 60 }, // 10 conexiones por minuto
        events: { limit: 100, window: 60 },     // 100 eventos por minuto
        subscriptions: { limit: 20, window: 60 } // 20 suscripciones por minuto
      },
      // Límites por pubkey
      pubkey: {
        events: { limit: 1000, window: 3600 },    // 1000 eventos por hora
        kindLimits: {
          1: { limit: 100, window: 3600 },        // 100 notas por hora
          4: { limit: 500, window: 3600 },        // 500 DMs por hora
          7: { limit: 2000, window: 3600 }        // 2000 reacciones por hora
        }
      },
      // Límites globales
      global: {
        events: { limit: 100000, window: 60 },    // 100k eventos por minuto a nivel global
        bandwidth: { limit: 1000000000, window: 60 } // 1GB por minuto
      },
      ...config
    };
  }
  
  async checkLimit(type, identifier, subtype = null) {
    const config = subtype 
      ? this.config[type][subtype]
      : this.config[type];
    
    if (!config) return { allowed: true };
    
    const key = `ratelimit:${type}:${identifier}:${subtype || 'default'}`;
    const window = config.window;
    const limit = config.limit;
    
    // Usar Redis INCR con caducidad para una limitación de tasa eficiente
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    
    if (current > limit) {
      const ttl = await this.redis.ttl(key);
      return {
        allowed: false,
        limit,
        current,
        resetIn: ttl
      };
    }
    
    return {
      allowed: true,
      limit,
      remaining: limit - current
    };
  }
  
  async checkIPLimit(ip, type) {
    return this.checkLimit('ip', ip, type);
  }
  
  async checkPubkeyLimit(pubkey, kind = null) {
    // Comprobar el límite general de la pubkey
    const general = await this.checkLimit('pubkey', pubkey, 'events');
    if (!general.allowed) return general;
    
    // Comprobar el límite específico del kind si aplica
    if (kind !== null && this.config.pubkey.kindLimits[kind]) {
      return this.checkLimit('pubkey', pubkey, `kind_${kind}`);
    }
    
    return general;
  }
  
  async checkGlobalLimit(type) {
    return this.checkLimit('global', 'all', type);
  }
}
```

### Detección de spam

```javascript
class SpamDetector {
  constructor() {
    this.suspiciousPatterns = [
      /\b(buy|sell|crypto|investment|profit)\b.*\b(telegram|whatsapp|dm)\b/i,
      /\b(click here|limited time|act now|don't miss)\b/i,
      /(?:http[s]?:\/\/){3,}/i, // Múltiples URLs
    ];
    
    this.contentHashCache = new Map(); // Detectar contenido duplicado
  }
  
  async analyzeEvent(event) {
    const flags = [];
    const score = 0;
    
    // 1. Buscar patrones sospechosos
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(event.content)) {
        flags.push('suspicious_content_pattern');
        score += 10;
        break;
      }
    }
    
    // 2. Comprobar URLs excesivas
    const urlCount = (event.content.match(/https?:\/\//g) || []).length;
    if (urlCount > 5) {
      flags.push('excessive_urls');
      score += 5 * (urlCount - 5);
    }
    
    // 3. Comprobar duplicación de contenido
    const contentHash = this.hashContent(event.content);
    const recentSimilar = this.contentHashCache.get(event.pubkey) || [];
    
    if (recentSimilar.includes(contentHash)) {
      flags.push('duplicate_content');
      score += 20;
    }
    
    // Actualizar caché
    recentSimilar.push(contentHash);
    if (recentSimilar.length > 100) recentSimilar.shift();
    this.contentHashCache.set(event.pubkey, recentSimilar);
    
    // 4. Comprobar spam de menciones
    const mentions = event.tags.filter(t => t[0] === 'p').length;
    if (mentions > 20) {
      flags.push('excessive_mentions');
      score += mentions - 20;
    }
    
    // 5. Comprobar spam de hashtags
    const hashtags = event.tags.filter(t => t[0] === 't').length;
    if (hashtags > 10) {
      flags.push('excessive_hashtags');
      score += hashtags - 10;
    }
    
    // 6. Comprobar la relación entre longitud del contenido y menciones
    if (mentions > 5 && event.content.length < 100) {
      flags.push('low_content_high_mentions');
      score += 15;
    }
    
    return {
      isSpam: score > 30,
      score,
      flags
    };
  }
  
  hashContent(content) {
    // Hash simple para detección de duplicados
    const normalized = content.toLowerCase().replace(/\s+/g, ' ').trim();
    return normalized.substring(0, 100); // Usar los primeros 100 caracteres
  }
}
```

## 7.5 Optimización de consultas

### Procesamiento eficiente de filtros

```javascript
class OptimizedQueryEngine {
  constructor(storage) {
    this.storage = storage;
  }
  
  async processFilter(filter) {
    // Construir consulta optimizada según la complejidad del filtro
    const query = this.buildQuery(filter);
    
    // Ejecutar con la estrategia adecuada
    if (this.isSimpleQuery(filter)) {
      return this.executeSimpleQuery(query, filter);
    } else {
      return this.executeComplexQuery(query, filter);
    }
  }
  
  buildQuery(filter) {
    const conditions = [];
    const params = [];
    
    // Filtro de IDs (el más específico)
    if (filter.ids && filter.ids.length > 0) {
      conditions.push(`id = ANY($${params.length + 1})`);
      params.push(filter.ids);
    }
    
    // Filtro de autores
    if (filter.authors && filter.authors.length > 0) {
      conditions.push(`pubkey = ANY($${params.length + 1})`);
      params.push(filter.authors);
    }
    
    // Filtro de kinds
    if (filter.kinds && filter.kinds.length > 0) {
      conditions.push(`kind = ANY($${params.length + 1})`);
      params.push(filter.kinds);
    }
    
    // Filtros de etiquetas (#e, #p, #t, etc.)
    Object.keys(filter).forEach(key => {
      if (key.startsWith('#')) {
        const tagName = key.substring(1);
        const values = filter[key];
        
        if (tagName === 'e') {
          conditions.push(`e_tags && $${params.length + 1}`);
        } else if (tagName === 'p') {
          conditions.push(`p_tags && $${params.length + 1}`);
        } else if (tagName === 't') {
          conditions.push(`t_tags && $${params.length + 1}`);
        } else {
          // Búsqueda genérica de etiquetas (más lenta)
          conditions.push(`
            EXISTS (
              SELECT 1 FROM jsonb_array_elements(tags) AS tag
              WHERE tag->0 = $${params.length + 1}
              AND tag->1 = ANY($${params.length + 2})
            )
          `);
          params.push(JSON.stringify(tagName), values);
          return;
        }
        
        params.push(values);
      }
    });
    
    // Filtros de rango temporal
    if (filter.since) {
      conditions.push(`created_at >= $${params.length + 1}`);
      params.push(filter.since);
    }
    
    if (filter.until) {
      conditions.push(`created_at <= $${params.length + 1}`);
      params.push(filter.until);
    }
    
    // Construir la consulta final
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    
    const limit = filter.limit || 500;
    
    const sql = `
      SELECT * FROM events
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return { sql, params };
  }
  
  isSimpleQuery(filter) {
    // Las consultas simples pueden usar búsquedas indexadas
    const hasIds = filter.ids && filter.ids.length > 0;
    const hasSpecificAuthors = filter.authors && filter.authors.length < 10;
    const hasIndexedTags = filter['#e'] || filter['#p'] || filter['#t'];
    
    return hasIds || (hasSpecificAuthors && !hasIndexedTags);
  }
  
  async executeSimpleQuery(query, filter) {
    const result = await this.storage.query(query.sql, query.params);
    return result.rows;
  }
  
  async executeComplexQuery(query, filter) {
    // En consultas complejas, usar paginación basada en cursor
    const result = await this.storage.query(query.sql, query.params);
    return result.rows;
  }
}
```

## 7.6 Gestión de conexiones WebSocket

### Manejador WebSocket de producción

```javascript
const WebSocket = require('ws');

class RelayWebSocketServer {
  constructor(config) {
    this.config = config;
    this.connections = new Map();
    this.subscriptions = new Map();
    
    this.wss = new WebSocket.Server({
      port: config.port,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      },
      maxPayload: 1024 * 1024 // tamaño máximo de mensaje: 1MB
    });
    
    this.setupConnectionHandling();
  }
  
  setupConnectionHandling() {
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      
      const clientInfo = {
        id: clientId,
        ip: clientIp,
        ws,
        subscriptions: new Set(),
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        messageCount: 0,
        eventCount: 0
      };
      
      this.connections.set(clientId, clientInfo);
      
      console.log(`Client connected: ${clientId} from ${clientIp}`);
      
      // Configurar ping/pong para la salud de la conexión
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });
      
      // Gestionar mensajes entrantes
      ws.on('message', async (data) => {
        await this.handleMessage(clientId, data);
      });
      
      // Gestionar desconexión
      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });
      
      // Gestionar errores
      ws.on('error', (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
        this.handleDisconnect(clientId);
      });
    });
    
    // Iniciar monitoreo de salud de las conexiones
    this.startHealthCheck();
  }
  
  async handleMessage(clientId, data) {
    const clientInfo = this.connections.get(clientId);
    if (!clientInfo) return;
    
    clientInfo.lastActivity = Date.now();
    clientInfo.messageCount++;
    
    try {
      const message = JSON.parse(data);
      const [type, ...args] = message;
      
      switch (type) {
        case 'EVENT':
          await this.handleEvent(clientInfo, args[0]);
          break;
          
        case 'REQ':
          await this.handleSubscription(clientInfo, args[0], ...args.slice(1));
          break;
          
        case 'CLOSE':
          await this.handleCloseSubscription(clientInfo, args[0]);
          break;
          
        case 'AUTH':
          await this.handleAuth(clientInfo, args[0]);
          break;
          
        default:
          this.sendNotice(clientInfo.ws, `Unknown message type: ${type}`);
      }
    } catch (error) {
      console.error(`Error handling message from ${clientId}:`, error);
      this.sendNotice(clientInfo.ws, 'Invalid message format');
    }
  }
  
  async handleEvent(clientInfo, event) {
    // Comprobar limitación de tasa
    const rateLimit = await this.rateLimiter.checkIPLimit(clientInfo.ip, 'events');
    if (!rateLimit.allowed) {
      this.sendNotice(clientInfo.ws, `Rate limit exceeded. Try again in ${rateLimit.resetIn}s`);
      return;
    }
    
    // Validar evento
    const validation = await this.validator.validate(event);
    if (!validation.valid) {
      this.sendResponse(clientInfo.ws, ['OK', event.id, false, `Invalid: ${validation.errors[0]}`]);
      return;
    }
    
    // Comprobar spam
    const spamCheck = await this.spamDetector.analyzeEvent(event);
    if (spamCheck.isSpam) {
      this.sendResponse(clientInfo.ws, ['OK', event.id, false, 'Rejected: spam detected']);
      return;
    }
    
    // Almacenar evento
    try {
      await this.storage.saveEvent(event);
      this.sendResponse(clientInfo.ws, ['OK', event.id, true, '']);
      
      // Difundir a los suscriptores
      await this.broadcastEvent(event);
      
      clientInfo.eventCount++;
    } catch (error) {
      console.error('Error saving event:', error);
      this.sendResponse(clientInfo.ws, ['OK', event.id, false, 'Error: ' + error.message]);
    }
  }
  
  async handleSubscription(clientInfo, subscriptionId, ...filters) {
    // Comprobar límite de suscripciones
    if (clientInfo.subscriptions.size >= 20) {
      this.sendNotice(clientInfo.ws, 'Too many subscriptions');
      return;
    }
    
    // Almacenar suscripción
    const subscription = {
      id: subscriptionId,
      clientId: clientInfo.id,
      filters,
      createdAt: Date.now()
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    clientInfo.subscriptions.add(subscriptionId);
    
    // Consultar y enviar eventos existentes
    for (const filter of filters) {
      const events = await this.queryEngine.processFilter(filter);
      
      for (const event of events) {
        this.sendEvent(clientInfo.ws, subscriptionId, event);
      }
    }
    
    // Enviar EOSE
    this.sendResponse(clientInfo.ws, ['EOSE', subscriptionId]);
  }
  
  async handleCloseSubscription(clientInfo, subscriptionId) {
    this.subscriptions.delete(subscriptionId);
    clientInfo.subscriptions.delete(subscriptionId);
  }
  
  async broadcastEvent(event) {
    // Encontrar suscripciones coincidentes
    for (const [subId, subscription] of this.subscriptions) {
      const matches = subscription.filters.some(filter => 
        this.eventMatchesFilter(event, filter)
      );
      
      if (matches) {
        const clientInfo = this.connections.get(subscription.clientId);
        if (clientInfo && clientInfo.ws.readyState === WebSocket.OPEN) {
          this.sendEvent(clientInfo.ws, subId, event);
        }
      }
    }
  }
  
  eventMatchesFilter(event, filter) {
    if (filter.ids && !filter.ids.includes(event.id)) return false;
    if (filter.authors && !filter.authors.includes(event.pubkey)) return false;
    if (filter.kinds && !filter.kinds.includes(event.kind)) return false;
    if (filter.since && event.created_at < filter.since) return false;
    if (filter.until && event.created_at > filter.until) return false;
    
    // Comprobar filtros de etiquetas
    for (const key in filter) {
      if (key.startsWith('#')) {
        const tagName = key.substring(1);
        const values = filter[key];
        const hasMatch = event.tags.some(tag => 
          tag[0] === tagName && values.includes(tag[1])
        );
        if (!hasMatch) return false;
      }
    }
    
    return true;
  }
  
  handleDisconnect(clientId) {
    const clientInfo = this.connections.get(clientId);
    if (!clientInfo) return;
    
    // Limpiar suscripciones
    for (const subId of clientInfo.subscriptions) {
      this.subscriptions.delete(subId);
    }
    
    this.connections.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  }
  
  startHealthCheck() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Cada 30 segundos
    
    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }
  
  sendEvent(ws, subscriptionId, event) {
    this.sendResponse(ws, ['EVENT', subscriptionId, event]);
  }
  
  sendNotice(ws, message) {
    this.sendResponse(ws, ['NOTICE', message]);
  }
  
  sendResponse(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  
  generateClientId() {
    return Math.random().toString(36).substring(2, 15);
  }
}
```

## 7.7 Monitoreo y observabilidad

### Recolección de métricas

```javascript
class RelayMetrics {
  constructor(prometheus) {
    this.prometheus = prometheus;
    
    // Definir métricas
    this.metrics = {
      // Métricas de conexión
      activeConnections: new prometheus.Gauge({
        name: 'nostr_relay_active_connections',
        help: 'Number of active WebSocket connections'
      }),
      
      totalConnections: new prometheus.Counter({
        name: 'nostr_relay_total_connections',
        help: 'Total number of connections since start'
      }),
      
      // Métricas de eventos
      eventsReceived: new prometheus.Counter({
        name: 'nostr_relay_events_received_total',
        help: 'Total events received',
        labelNames: ['kind']
      }),
      
      eventsStored: new prometheus.Counter({
        name: 'nostr_relay_events_stored_total',
        help: 'Total events stored',
        labelNames: ['kind']
      }),
      
      eventsRejected: new prometheus.Counter({
        name: 'nostr_relay_events_rejected_total',
        help: 'Total events rejected',
        labelNames: ['reason']
      }),
      
      // Métricas de consultas
      subscriptions: new prometheus.Gauge({
        name: 'nostr_relay_active_subscriptions',
        help: 'Number of active subscriptions'
      }),
      
      queryDuration: new prometheus.Histogram({
        name: 'nostr_relay_query_duration_seconds',
        help: 'Query execution time',
        buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
      }),
      
      // Métricas de almacenamiento
      storageSize: new prometheus.Gauge({
        name: 'nostr_relay_storage_bytes',
        help: 'Total storage used in bytes'
      }),
      
      eventCount: new prometheus.Gauge({
        name: 'nostr_relay_event_count',
        help: 'Total number of events stored'
      }),
      
      // Métricas de rendimiento
      cpuUsage: new prometheus.Gauge({
        name: 'nostr_relay_cpu_usage_percent',
        help: 'CPU usage percentage'
      }),
      
      memoryUsage: new prometheus.Gauge({
        name: 'nostr_relay_memory_usage_bytes',
        help: 'Memory usage in bytes'
      }),
      
      // Métricas de limitación de tasa
      rateLimitHits: new prometheus.Counter({
        name: 'nostr_relay_rate_limit_hits_total',
        help: 'Number of rate limit violations',
        labelNames: ['type']
      })
    };
    
    // Iniciar recolección
    this.startCollection();
  }
  
  startCollection() {
    // Recolectar métricas del sistema cada 10 segundos
    setInterval(() => {
      const usage = process.cpuUsage();
      const memUsage = process.memoryUsage();
      
      this.metrics.cpuUsage.set(
        (usage.user + usage.system) / 1000000 // Convertir a segundos
      );
      
      this.metrics.memoryUsage.set(memUsage.heapUsed);
    }, 10000);
  }
  
  recordEvent(kind, stored = true) {
    this.metrics.eventsReceived.inc({ kind: kind.toString() });
    if (stored) {
      this.metrics.eventsStored.inc({ kind: kind.toString() });
    }
  }
  
  recordRejection(reason) {
    this.metrics.eventsRejected.inc({ reason });
  }
  
  recordQuery(duration) {
    this.metrics.queryDuration.observe(duration);
  }
  
  recordRateLimitHit(type) {
    this.metrics.rateLimitHits.inc({ type });
  }
}
```

## 7.8 Despliegue e infraestructura

### Despliegue con Docker

```dockerfile
# Dockerfile para un relé de producción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de paquetes
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar si es necesario
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Crear usuario no root
RUN addgroup -g 1001 -S nostr && \
    adduser -S nostr -u 1001

# Cambiar al usuario no root
USER nostr

# Exponer puerto
EXPOSE 8080

# Comprobación de salud
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Arrancar el relé
CMD ["node", "dist/index.js"]
```

### Stack de Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  relay:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://nostr:password@postgres:5432/nostrdb
      - REDIS_URL=redis://redis:6379
      - MAX_CONNECTIONS=1000
      - RATE_LIMIT_ENABLED=true
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - nostr-network
    volumes:
      - ./config:/app/config:ro
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nostrdb
      - POSTGRES_USER=nostr
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - nostr-network
    restart: unless-stopped
  
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - nostr-network
    restart: unless-stopped
  
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - nostr-network
    restart: unless-stopped
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-dashboards:/etc/grafana/provisioning/dashboards
    networks:
      - nostr-network
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - relay
    networks:
      - nostr-network
    restart: unless-stopped

networks:
  nostr-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  prometheus-data:
  grafana-data:
```

### Configuración de Nginx

```nginx
# nginx.conf
events {
    worker_connections 4096;
}

http {
    upstream relay {
        server relay:8080;
    }
    
    # Limitación de tasa
    limit_req_zone $binary_remote_addr zone=relay_limit:10m rate=100r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
    server {
        listen 80;
        server_name relay.example.com;
        
        # Redirigir a HTTPS
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name relay.example.com;
        
        # Configuración SSL
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        
        # Cabeceras de seguridad
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        
        # Limitación de tasa
        limit_req zone=relay_limit burst=200 nodelay;
        limit_conn conn_limit 20;
        
        # Proxy de WebSocket
        location / {
            proxy_pass http://relay;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Tiempos de espera
            proxy_connect_timeout 7d;
            proxy_send_timeout 7d;
            proxy_read_timeout 7d;
        }
        
        # Endpoint de comprobación de salud
        location /health {
            proxy_pass http://relay/health;
            access_log off;
        }
        
        # Endpoint de métricas (restringido)
        location /metrics {
            proxy_pass http://relay/metrics;
            allow 10.0.0.0/8;  # Solo red interna
            deny all;
        }
    }
}
```

## 7.9 Endurecimiento de la seguridad

### Mejores prácticas de seguridad

```javascript
class RelaySecurityManager {
  constructor(config) {
    this.config = config;
    this.bannedIPs = new Set();
    this.bannedPubkeys = new Set();
    this.suspiciousActivity = new Map();
  }
  
  // Detección de amenazas basada en IP
  async checkIPThreat(ip) {
    if (this.bannedIPs.has(ip)) {
      return { threat: true, reason: 'IP banned' };
    }
    
    const activity = this.suspiciousActivity.get(ip) || {
      violations: 0,
      lastViolation: 0
    };
    
    // Auto-bloqueo tras 10 infracciones en 1 hora
    if (activity.violations >= 10) {
      const hourAgo = Date.now() - 3600000;
      if (activity.lastViolation > hourAgo) {
        this.bannedIPs.add(ip);
        return { threat: true, reason: 'Too many violations' };
      }
    }
    
    return { threat: false };
  }
  
  // Filtrado de contenido
  filterContent(event) {
    const filters = [
      // Filtrar contenido explícito (ejemplo básico)
      /\b(explicit|harmful|pattern)\b/i,
      
      // Filtrar intentos de phishing
      /password|private.?key|nsec1/i,
      
      // Filtrar uso excesivo de mayúsculas
      /[A-Z\s]{50,}/
    ];
    
    for (const filter of filters) {
      if (filter.test(event.content)) {
        return {
          allowed: false,
          reason: 'Content policy violation'
        };
      }
    }
    
    return { allowed: true };
  }
  
  // Protección contra DDoS
  detectDDoS(metrics) {
    const threshold = {
      connectionsPerSecond: 100,
      eventsPerSecond: 1000,
      failedAuthPerSecond: 50
    };
    
    if (metrics.connectionsPerSecond > threshold.connectionsPerSecond ||
        metrics.eventsPerSecond > threshold.eventsPerSecond ||
        metrics.failedAuthPerSecond > threshold.failedAuthPerSecond) {
      
      return {
        attack: true,
        type: 'DDoS',
        action: 'enable_mitigation'
      };
    }
    
    return { attack: false };
  }
}
```

## 7.10 Ejercicios prácticos

### Ejercicio 1: Desplegar un relé básico
Configura y despliega un relé mínimo:
1. Instala las dependencias (Node.js, PostgreSQL)
2. Configura el esquema de la base de datos
3. Implementa el manejo básico de WebSocket
4. Prueba con clientes Nostr

### Ejercicio 2: Añadir limitación de tasa
Implementa limitación de tasa:
1. Configura Redis para la limitación de tasa
2. Añade límites por IP
3. Añade límites por pubkey
4. Prueba con herramientas de carga

### Ejercicio 3: Optimizar consultas
Mejora el rendimiento de las consultas:
1. Analiza las consultas lentas
2. Añade los índices adecuados
3. Implementa caché de resultados de consulta
4. Mide las mejoras de rendimiento

### Ejercicio 4: Configurar el monitoreo
Implementa observabilidad:
1. Añade métricas de Prometheus
2. Crea paneles de Grafana
3. Configura alertas para métricas críticas
4. Monitorea el tráfico de producción

### Ejercicio 5: Implementar detección de spam
Construye prevención de spam:
1. Crea reglas de análisis de contenido
2. Implementa detección de duplicados
3. Añade comprobación de reputación de IP
4. Prueba con muestras de spam

## 📝 Cuestionario del Módulo 7

1. **¿Cuáles son las tres responsabilidades centrales de un relé Nostr?**
   <details>
   <summary>Respuesta</summary>
   Aceptar eventos de los clientes, almacenar eventos según la política y servir los eventos que coincidan con los filtros de suscripción.
   </details>

2. **¿Por qué los eventos reemplazables se tratan de forma distinta en el almacenamiento?**
   <details>
   <summary>Respuesta</summary>
   Los eventos reemplazables (kinds 10000-19999) solo deben conservar el evento más reciente por combinación pubkey+kind, de modo que los eventos más antiguos deben eliminarse cuando llegan otros más nuevos para evitar el inflado del almacenamiento.
   </details>

3. **¿Cuál es el propósito de limitar la tasa en múltiples capas (IP, pubkey, global)?**
   <details>
   <summary>Respuesta</summary>
   La limitación de tasa en múltiples capas previene el abuso a distintos niveles: los límites por IP detienen ataques DDoS, los límites por pubkey evitan el spam de usuarios individuales y los límites globales protegen la capacidad total del relé.
   </details>

4. **¿Por qué usar índices en las columnas de etiquetas (e_tags, p_tags, t_tags)?**
   <details>
   <summary>Respuesta</summary>
   Los filtros de etiquetas son extremadamente comunes en las consultas Nostr (#e, #p, #t). Los índices basados en arreglos con GIN o similares permiten búsquedas rápidas sin escanear toda la tabla de eventos.
   </details>

5. **¿Cuál es la diferencia entre las estrategias de ejecución de consultas simples y complejas?**
   <details>
   <summary>Respuesta</summary>
   Las consultas simples usan búsquedas indexadas específicas (por ID, autor o kind), mientras que las consultas complejas con múltiples filtros de etiquetas pueden requerir planes de ejecución más sofisticados, posiblemente con paginación basada en cursor para gestionar conjuntos de resultados grandes.
   </details>

## 🎯 Punto de control del Módulo 7

Antes de pasar al Módulo 8, asegúrate de haber:

- [ ] Desplegado un relé funcional con soporte WebSocket
- [ ] Implementado almacenamiento en base de datos con índices adecuados
- [ ] Añadido limitación de tasa y detección de spam
- [ ] Configurado recolección de monitoreo y métricas
- [ ] Configurado medidas de seguridad adecuadas
- [ ] Probado el relé bajo carga
- [ ] Implementado procedimientos de copia de seguridad y recuperación
- [ ] Documentado las operaciones del relé

## 📚 Recursos adicionales

- [Guía de implementación de relés (GitHub)](https://github.com/nostr-protocol/nostr)
- [NIP-01: Protocolo básico](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-11: Documento de información del relé](https://github.com/nostr-protocol/nips/blob/master/11.md)
- [NIP-42: Autenticación](https://github.com/nostr-protocol/nips/blob/master/42.md)
- [strfry Relay](https://github.com/hoytech/strfry) - Relé C++ de alto rendimiento
- [nostream](https://github.com/Cameri/nostream) - Implementación de relé en TypeScript
- [Ajuste de rendimiento de PostgreSQL](https://www.postgresql.org/docs/current/performance-tips.html)

## 💬 Discusión de la comunidad

Únete a nuestro Discord para hablar del Módulo 7:
- Comparte la configuración de tu relé
- Obtén ayuda con problemas de despliegue
- Debate estrategias de escalado
- Colabora en mejoras del relé

---

!!! success "¡Felicidades!"
    Has aprendido a construir y operar relés Nostr de grado de producción. Comprendes la arquitectura, la optimización, la seguridad y el monitoreo. ¡Listo para el Módulo 8: Escalado y Rendimiento!

[Continuar al Módulo 8: Escalado y Rendimiento →](module-08-scaling-performance.md)
