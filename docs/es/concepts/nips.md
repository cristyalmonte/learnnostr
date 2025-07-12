# Entendiendo NIPs (Posibilidades de Implementación de Nostr)

!!! info "Objetivos de Aprendizaje"
    Después de esta lección, entenderás:
    
    - Qué son los NIPs y por qué son esenciales
    - Cómo los NIPs permiten interoperabilidad e innovación
    - NIPs centrales que toda implementación debería soportar
    - El proceso de desarrollo y adopción de NIPs
    - Cómo leer e implementar NIPs

Los NIPs son la columna vertebral de la extensibilidad y estandarización de Nostr. Definen cómo funcionan las diferentes partes del protocolo y permiten interoperabilidad entre clientes y relés.

## ¿Qué son los NIPs?

**NIP** significa **Posibilidad de Implementación de Nostr** (Nostr Implementation Possibility). Los NIPs son especificaciones técnicas que describen:

- Características y extensiones del protocolo
- Formatos y estructuras de eventos
- Comportamientos de clientes y relés
- Estándares criptográficos
- Patrones de comunicación

Piensa en los NIPs como las "reglas del juego" que todas las aplicaciones Nostr siguen para asegurar que puedan trabajar juntas sin problemas.

## Por Qué Importan los NIPs

### 🔗 **Interoperabilidad**
Los NIPs aseguran que una nota publicada desde Damus pueda leerse en Amethyst, Iris, o cualquier otro cliente Nostr.

### 🚀 **Innovación**
Nuevas características pueden proponerse, probarse y estandarizarse a través del proceso NIP.

### 📋 **Estandarización**
Patrones comunes y mejores prácticas se documentan para desarrolladores.

### 🔄 **Evolución**
El protocolo puede evolucionar mientras mantiene compatibilidad hacia atrás.

## NIPs Centrales (Esenciales)

Estos NIPs forman la fundación de Nostr y deberían implementarse por todos los clientes:

### **NIP-01: Descripción del Flujo Básico del Protocolo**
La fundación de Nostr - define eventos, firmas y comunicación básica.

**Conceptos clave:**
- Estructura y serialización de eventos
- Firmas digitales usando Schnorr
- Patrones básicos de comunicación con relés
- Tipos de eventos y sus significados

```json
{
  "id": "id-evento",
  "pubkey": "pubkey-autor",
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "¡Hola Nostr!",
  "sig": "firma"
}
```

### **NIP-02: Lista de Seguidos**
Define cómo los usuarios se siguen entre sí y gestionan listas de contactos.

```json
{
  "kind": 3,
  "tags": [
    ["p", "pubkey1", "url-relé", "alicia"],
    ["p", "pubkey2", "url-relé", "bob"]
  ],
  "content": ""
}
```

**Casos de uso:**
- Construir gráficos sociales
- Gestión de contactos
- Recomendaciones de relés
- Sistemas de apodos (petname)

### **NIP-19: entidades codificadas en bech32**
Identificadores legibles para humanos para entidades Nostr.

```
npub1... (llaves públicas)
nsec1... (llaves privadas)  
note1... (IDs de notas)
nprofile1... (perfiles con pistas de relé)
nevent1... (eventos con pistas de relé)
naddr1... (direcciones para eventos reemplazables)
nrelay1... (URLs de relés)
```

## NIPs de Comunicación

### **NIP-04: Mensaje Directo Encriptado** (Deprecado)
⚠️ **Nota: Deprecado en favor de NIP-17**

Permite mensajería privada entre usuarios usando secretos compartidos.

```json
{
  "kind": 4,
  "tags": [["p", "pubkey-destinatario"]],
  "content": "contenido-mensaje-encriptado?iv=vector-inicializacion"
}
```

### **NIP-17: Mensajes Directos Privados** (Estándar Actual)
Mensajería encriptada moderna con seguridad mejorada.

**Mejoras clave:**
- Patrón gift wrap para protección de metadatos
- Mejor secreto hacia adelante
- Reducida filtración de metadatos

### **NIP-10: Notas de Texto e Hilos**
Estandariza cómo referenciar otras notas y crear hilos.

```json
{
  "kind": 1,
  "tags": [
    ["e", "id-evento-raíz", "", "root"],
    ["e", "id-respuesta-a", "", "reply"],
    ["p", "pubkey-mencionado"]
  ],
  "content": "Esta es una respuesta"
}
```

**Marcadores de etiquetas:**
- `root`: Apunta a la raíz del hilo
- `reply`: Apunta al padre directo
- `mention`: Referencias sin semántica de respuesta

## Identidad y Verificación

### **NIP-05: Mapeo de llaves Nostr a identificadores de internet basados en DNS**
Vincula identidades Nostr a nombres de dominio para verificación.

**Proceso:**
1. Usuario establece campo `nip05` en perfil: `"alicia@example.com"`
2. Cliente obtiene `https://example.com/.well-known/nostr.json?name=alicia`
3. Verifica que pubkey coincida

```json
{
  "names": {
    "alicia": "npub1..."
  },
  "relays": {
    "npub1...": ["wss://relay.example.com"]
  }
}
```

### **NIP-39: Identidades Externas en Perfiles**
Vincular plataformas externas a perfiles Nostr.

```json
{
  "kind": 0,
  "content": "{\"name\":\"Alicia\"}",
  "tags": [
    ["i", "github:alicia", "https://github.com/alicia"],
    ["i", "twitter:alicia_crypto", "https://twitter.com/alicia_crypto"]
  ]
}
```

## Tipos de Contenido

### **NIP-23: Contenido de Formato Largo**
Permite publicar artículos y contenido de formato largo.

```json
{
  "kind": 30023,
  "tags": [
    ["d", "slug-articulo"],
    ["title", "Título de Mi Artículo"],
    ["summary", "Resumen del artículo"],
    ["published_at", "1234567890"]
  ],
  "content": "# Contenido del Artículo\n\nEste es un artículo largo..."
}
```

### **NIP-25: Reacciones**
Estandariza reacciones (likes, corazones, etc.) a eventos.

```json
{
  "kind": 7,
  "tags": [
    ["e", "id-evento-reaccionado"],
    ["p", "autor-evento-reaccionado"],
    ["k", "1"]
  ],
  "content": "🤙"
}
```

### **NIP-18: Reposts**
Dos tipos de reposts:

**Repost Genérico (Kind 6):**
```json
{
  "kind": 6,
  "tags": [["e", "id-evento-reposteado"]],
  "content": ""
}
```

**Quote Repost (Kind 1):**
```json
{
  "kind": 1,
  "tags": [["q", "id-evento-citado"]],
  "content": "Esto es interesante: nostr:note1..."
}
```

## Integración Lightning

### **NIP-57: Lightning Zaps**
Permite pagos Bitcoin Lightning (zaps) en Nostr.

**Solicitud de Zap (Kind 9734):**
```json
{
  "kind": 9734,
  "tags": [
    ["p", "pubkey-destinatario"],
    ["amount", "21000"],
    ["relays", "wss://relay1.com", "wss://relay2.com"]
  ],
  "content": "¡Gran post! ⚡"
}
```

**Recibo de Zap (Kind 9735):**
```json
{
  "kind": 9735,
  "tags": [
    ["bolt11", "factura-lightning"],
    ["description", "evento-solicitud-zap"],
    ["p", "pubkey-destinatario"]
  ]
}
```

### **NIP-47: Wallet Connect**
Permite control remoto de billetera para pagos Lightning.

**Comandos soportados:**
- `pay_invoice`
- `pay_keysend`
- `make_invoice`
- `lookup_invoice`
- `get_balance`
- `get_info`

## Operaciones de Relés

### **NIP-11: Documento de Información de Relé**
Los relés proporcionan metadatos sobre sus capacidades.

```json
{
  "name": "Mi Relé",
  "description": "Un relé Nostr",
  "pubkey": "pubkey-relé",
  "contact": "admin@relay.com",
  "supported_nips": [1, 2, 9, 11, 15, 16, 20, 22],
  "software": "strfry",
  "version": "0.9.6",
  "limitation": {
    "max_message_length": 16384,
    "max_subscriptions": 300,
    "max_limit": 5000,
    "auth_required": false,
    "payment_required": false
  }
}
```

### **NIP-42: Autenticación de clientes a relés**
Permite conexiones autenticadas a relés.

**Flujo de autenticación:**
1. Relé envía desafío AUTH
2. Cliente firma desafío con llave privada
3. Relé verifica firma
4. Sesión autenticada establecida

### **NIP-50: Capacidad de Búsqueda**
Estandariza funcionalidad de búsqueda entre relés.

```json
{
  "kinds": [1],
  "search": "protocolo nostr",
  "limit": 20
}
```

## Características Avanzadas

### **NIP-26: Firma de Eventos Delegada** (No Recomendado)
⚠️ **Nota: Agrega complejidad por poco beneficio**

Permite delegación de autoridad de firma a otras llaves.

### **NIP-44: Cargas Útiles Encriptadas (Versionadas)**
Estándar de encriptación mejorado para datos sensibles.

**Características Versión 2:**
- Encriptación ChaCha20-Poly1305
- Autenticación HMAC
- Formato versionado para actualizaciones

### **NIP-59: Gift Wrap**
Patrón de encriptación avanzado para máxima privacidad.

**Capas:**
1. **Rumor**: El contenido real del evento
2. **Sello**: Rumor encriptado con metadatos
3. **Gift Wrap**: Evento público conteniendo el sello

### **NIP-65: Metadatos de Lista de Relés**
Los usuarios publican sus relés preferidos.

```json
{
  "kind": 10002,
  "tags": [
    ["r", "wss://relay1.com"],
    ["r", "wss://relay2.com", "write"],
    ["r", "wss://relay3.com", "read"]
  ]
}
```

## Aplicaciones Especializadas

### **NIP-15: Mercado Nostr**
Comercio electrónico en Nostr.

**Listado de producto (Kind 30017):**
```json
{
  "kind": 30017,
  "tags": [
    ["d", "id-producto"],
    ["title", "Nombre del Producto"],
    ["price", "100", "USD"],
    ["location", "Ciudad de México, MX"]
  ],
  "content": "{\"name\":\"Producto\",\"description\":\"...\"}"
}
```

### **NIP-52: Eventos de Calendario**
Planificación de eventos y programación.

**Evento basado en tiempo (Kind 31923):**
```json
{
  "kind": 31923,
  "tags": [
    ["d", "id-evento"],
    ["title", "Meetup Nostr"],
    ["start", "1234567890"],
    ["end", "1234571490"],
    ["location", "Ciudad de México"]
  ]
}
```

### **NIP-53: Actividades en Vivo**
Streaming en tiempo real y eventos en vivo.

**Evento en vivo (Kind 30311):**
```json
{
  "kind": 30311,
  "tags": [
    ["d", "id-stream"],
    ["title", "Sesión de Codificación en Vivo"],
    ["streaming", "https://stream.example.com"],
    ["status", "live"]
  ]
}
```

## Desarrollo y Gestión

### **NIP-34: cosas de git**
Gestión de repositorios Git en Nostr.

**Anuncio de repositorio (Kind 30617):**
```json
{
  "kind": 30617,
  "tags": [
    ["d", "id-repo"],
    ["name", "mi-proyecto"],
    ["clone", "https://github.com/usuario/repo"],
    ["web", "https://github.com/usuario/repo"]
  ]
}
```

### **NIP-90: Máquinas Expendedoras de Datos**
Servicios de computación descentralizados.

**Solicitud de trabajo (Kind 5000-5999):**
```json
{
  "kind": 5000,
  "tags": [
    ["i", "datos-entrada"],
    ["output", "text/plain"],
    ["relays", "wss://relay.com"]
  ],
  "content": "Por favor analiza estos datos"
}
```

## Referencia Completa de NIPs

Basado en el documento del protocolo, aquí están todos los NIPs actuales:

### Protocolo Central
- **NIP-01**: Descripción del flujo básico del protocolo
- **NIP-02**: Lista de seguidos
- **NIP-03**: Atestaciones OpenTimestamps para eventos
- **NIP-04**: Mensaje directo encriptado (deprecado)
- **NIP-05**: Mapeo de llaves Nostr a identificadores basados en DNS
- **NIP-06**: Derivación básica de llaves desde frase semilla mnemónica
- **NIP-07**: Capacidad window.nostr para navegadores web
- **NIP-08**: Manejo de menciones (deprecado)
- **NIP-09**: Solicitud de eliminación de evento
- **NIP-10**: Notas de texto e hilos
- **NIP-11**: Documento de información de relé
- **NIP-13**: Prueba de trabajo
- **NIP-14**: Etiqueta de asunto en eventos de texto
- **NIP-15**: Mercado Nostr

### Comunicación y Social
- **NIP-17**: Mensajes directos privados
- **NIP-18**: Reposts
- **NIP-19**: Entidades codificadas en bech32
- **NIP-21**: Esquema URI nostr:
- **NIP-22**: Comentario
- **NIP-23**: Contenido de formato largo
- **NIP-24**: Campos de metadatos extra y etiquetas
- **NIP-25**: Reacciones
- **NIP-26**: Firma de eventos delegada (no recomendado)
- **NIP-27**: Referencias de notas de texto
- **NIP-28**: Chat público

### Características Avanzadas
- **NIP-29**: Grupos basados en relés
- **NIP-30**: Emoji personalizado
- **NIP-31**: Manejo de eventos desconocidos
- **NIP-32**: Etiquetado
- **NIP-34**: Cosas de git
- **NIP-35**: Torrents
- **NIP-36**: Contenido sensible
- **NIP-37**: Eventos borrador
- **NIP-38**: Estados de usuario
- **NIP-39**: Identidades externas en perfiles
- **NIP-40**: Timestamp de expiración

### Autenticación y Seguridad
- **NIP-42**: Autenticación de clientes a relés
- **NIP-44**: Cargas útiles encriptadas (versionadas)
- **NIP-45**: Conteo de resultados
- **NIP-46**: Firma remota Nostr
- **NIP-47**: Nostr Wallet Connect
- **NIP-48**: Etiquetas proxy
- **NIP-49**: Encriptación de llave privada

### Descubrimiento y Búsqueda
- **NIP-50**: Capacidad de búsqueda
- **NIP-51**: Listas
- **NIP-52**: Eventos de calendario
- **NIP-53**: Actividades en vivo
- **NIP-54**: Wiki
- **NIP-55**: Aplicación firmadora Android
- **NIP-56**: Reportes
- **NIP-57**: Lightning Zaps
- **NIP-58**: Insignias
- **NIP-59**: Gift Wrap

### Aplicaciones Especializadas
- **NIP-60**: Billetera Cashu
- **NIP-61**: Nutzaps
- **NIP-62**: Solicitud de desvanecimiento
- **NIP-64**: Ajedrez (PGN)
- **NIP-65**: Metadatos de lista de relés
- **NIP-66**: Descubrimiento de relés y monitoreo de vitalidad
- **NIP-68**: Feeds de imágenes primero
- **NIP-69**: Eventos de orden peer-to-peer
- **NIP-70**: Eventos protegidos
- **NIP-71**: Eventos de video
- **NIP-72**: Comunidades moderadas
- **NIP-73**: IDs de contenido externo
- **NIP-75**: Objetivos de zap
- **NIP-77**: Sincronización Negentropy
- **NIP-78**: Datos específicos de aplicación
- **NIP-7D**: Hilos
- **NIP-84**: Destacados

### Infraestructura y Herramientas
- **NIP-86**: API de gestión de relés
- **NIP-88**: Encuestas
- **NIP-89**: Manejadores de aplicación recomendados
- **NIP-90**: Máquinas expendedoras de datos
- **NIP-92**: Archivos adjuntos multimedia
- **NIP-94**: Metadatos de archivos
- **NIP-96**: Integración de almacenamiento de archivos HTTP
- **NIP-98**: Autenticación HTTP
- **NIP-99**: Listados clasificados

## Estado y Desarrollo de NIPs

### Niveles de Estado

- **Borrador**: En desarrollo activo, sujeto a cambios
- **Propuesto**: Especificación estable, lista para implementación
- **Final**: Ampliamente implementado y estable
- **Deprecado**: Ya no recomendado

### Proceso de Desarrollo

1. **Propuesta**: Identificar necesidad y escribir especificación inicial
2. **Discusión**: Revisión y retroalimentación de la comunidad
3. **Implementación**: Prototipo y prueba
4. **Adopción**: Múltiples implementaciones y uso
5. **Finalización**: La especificación se estabiliza

### Contribuyendo a NIPs

**Cómo contribuir:**
- Únete a discusiones en GitHub y Telegram
- Propón mejoras a NIPs existentes
- Envía nuevos NIPs para funcionalidad faltante
- Implementa y prueba especificaciones propuestas
- Proporciona retroalimentación sobre NIPs borrador

**Guías para escribir NIPs:**
- Sé específico y sin ambigüedades
- Incluye ejemplos y casos de prueba
- Considera implicaciones de seguridad
- Asegura compatibilidad hacia atrás cuando sea posible
- Sigue convenciones de formato existentes

## Estrategia de Implementación

### Para Desarrolladores de Clientes

**Cliente mínimo viable:**
- NIP-01 (Protocolo básico)
- NIP-02 (Listas de contactos)
- NIP-19 (Codificación Bech32)
- NIP-25 (Reacciones)

**Cliente mejorado:**
- NIP-10 (Referencias de notas de texto)
- NIP-17 (Mensajes privados)
- NIP-23 (Contenido de formato largo)
- NIP-57 (Lightning zaps)

**Cliente avanzado:**
- NIP-42 (Autenticación de relé)
- NIP-50 (Búsqueda)
- NIP-65 (Listas de relés)
- NIPs específicos de aplicación

### Para Operadores de Relés

**Relé básico:**
- NIP-01 (Protocolo básico)
- NIP-11 (Información de relé)
- NIP-20 (Resultados de comandos)

**Relé mejorado:**
- NIP-42 (Autenticación)
- NIP-50 (Búsqueda)
- NIP-65 (Metadatos de relé)

## Probando Compatibilidad de NIPs

### Pruebas de Cliente
```javascript
// Verificar qué NIPs soporta un cliente
const nipsSuportados = cliente.getNIPsSuportados()
console.log('NIPs soportados:', nipsSuportados)

// Probar funcionalidad específica
if (nipsSuportados.includes(57)) {
  // Cliente soporta zaps
  habilitarCaracteristicasZap()
}
```

### Pruebas de Relé
```bash
# Consultar información de relé
curl -H "Accept: application/nostr+json" https://relay.example.com

# Verificar NIPs soportados
{
  "supported_nips": [1, 2, 9, 11, 15, 16, 20, 22, 33, 40]
}
```

## Ejemplos Prácticos de Implementación

### Implementando NIP-25 (Reacciones)

```javascript
class ManejadorReacciones {
  constructor(cliente) {
    this.cliente = cliente
  }
  
  async reaccionar(evento, emoji = '+') {
    const reaccion = finishEvent({
      kind: 7,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['e', evento.id],
        ['p', evento.pubkey],
        ['k', evento.kind.toString()]
      ],
      content: emoji
    }, this.cliente.privateKey)
    
    return this.cliente.publicar(reaccion)
  }
  
  async obtenerReacciones(eventoId) {
    const filtro = {
      kinds: [7],
      '#e': [eventoId]
    }
    
    const reacciones = await this.cliente.obtenerEventos(filtro)
    return this.procesarReacciones(reacciones)
  }
  
  procesarReacciones(reacciones) {
    const conteos = {}
    
    for (const reaccion of reacciones) {
      const emoji = reaccion.content || '+'
      conteos[emoji] = (conteos[emoji] || 0) + 1
    }
    
    return conteos
  }
}

// Uso
const manejador = new ManejadorReacciones(miCliente)
await manejador.reaccionar(evento, '🚀')
const reacciones = await manejador.obtenerReacciones(evento.id)
console.log('Reacciones:', reacciones) // { '🚀': 5, '+': 12 }
```

### Implementando NIP-50 (Búsqueda)

```javascript
class BuscadorEventos {
  constructor(relés) {
    this.relés = relés
  }
  
  async buscar(consulta, opciones = {}) {
    const filtro = {
      search: consulta,
      kinds: opciones.kinds || [1],
      limit: opciones.limit || 20,
      since: opciones.since,
      until: opciones.until
    }
    
    const resultados = []
    
    for (const relé of this.relés) {
      try {
        const eventos = await relé.obtenerEventos([filtro])
        resultados.push(...eventos)
      } catch (error) {
        console.warn(`Búsqueda falló en ${relé.url}:`, error)
      }
    }
    
    // Deduplicar por ID
    const eventosUnicos = new Map()
    for (const evento of resultados) {
      eventosUnicos.set(evento.id, evento)
    }
    
    return Array.from(eventosUnicos.values())
      .sort((a, b) => b.created_at - a.created_at)
  }
}

// Uso
const buscador = new BuscadorEventos(misRelés)
const resultados = await buscador.buscar('bitcoin', {
  kinds: [1, 30023], // notas y artículos
  limit: 50
})
```

### Implementando NIP-65 (Lista de Relés)

```javascript
class GestorListaRelés {
  constructor(cliente) {
    this.cliente = cliente
  }
  
  async publicarListaRelés(relés) {
    const tags = relés.map(relé => {
      const tag = ['r', relé.url]
      if (relé.tipo && relé.tipo !== 'read-write') {
        tag.push(relé.tipo) // 'read' o 'write'
      }
      return tag
    })
    
    const evento = finishEvent({
      kind: 10002,
      created_at: Math.floor(Date.now() / 1000),
      tags: tags,
      content: ''
    }, this.cliente.privateKey)
    
    return this.cliente.publicar(evento)
  }
  
  async obtenerListaRelés(pubkey) {
    const filtro = {
      kinds: [10002],
      authors: [pubkey],
      limit: 1
    }
    
    const eventos = await this.cliente.obtenerEventos(filtro)
    if (eventos.length === 0) return []
    
    const evento = eventos[0]
    return evento.tags
      .filter(tag => tag[0] === 'r')
      .map(tag => ({
        url: tag[1],
        tipo: tag[2] || 'read-write'
      }))
  }
}

// Uso
const gestor = new GestorListaRelés(miCliente)

// Publicar mi lista de relés
await gestor.publicarListaRelés([
  { url: 'wss://relay.damus.io', tipo: 'read-write' },
  { url: 'wss://nos.lol', tipo: 'read' },
  { url: 'wss://relay.snort.social', tipo: 'write' }
])

// Obtener lista de relés de alguien más
const relésDeOtro = await gestor.obtenerListaRelés(otroPubkey)
```

## Recursos

- **Repositorio NIPs**: [github.com/nostr-protocol/nips](https://github.com/nostr-protocol/nips)
- **Discusión NIPs**: [Telegram](https://t.me/nostr_protocol)
- **Ejemplos de Implementación**: [github.com/nostr-protocol/nostr](https://github.com/nostr-protocol/nostr)
- **Rastreador de Estado NIPs**: [nips.nostr.com](https://nips.nostr.com)

!!! info "Mantente Actualizado"
    Los NIPs están evolucionando constantemente. Sigue el repositorio GitHub y únete a discusiones comunitarias para mantenerte informado sobre nuevos desarrollos y propuestas.

!!! tip "Estrategia de Implementación"
    Comienza con NIPs centrales (1, 2, 19) y gradualmente agrega características más avanzadas. Enfócate en interoperabilidad y experiencia de usuario sobre completitud de características.

## Próximos Pasos

Ahora que entiendes los NIPs, explora:

- [Relés y Comunicación](../relays/) - Cómo funcionan los NIPs en la práctica
- [Construyendo Aplicaciones](../../tutorials/) - Implementando NIPs en código
- [Características Avanzadas](../advanced/) - NIPs especializados para tu caso de uso

---

<div class="next-lesson">
  <a href="../relays/" class="btn btn-primary">
    Entendiendo Relés →
  </a>
</div>

## Quiz de Comprensión

!!! question "Prueba Tu Entendimiento"
    
    1. ¿Qué significa NIP y por qué son importantes para Nostr?
    2. ¿Cuáles son los tres NIPs más esenciales que todo cliente debería implementar?
    3. ¿Cuál es la diferencia entre NIP-04 y NIP-17?
    4. ¿Cómo permite NIP-57 los pagos en Nostr?
    
    ??? success "Respuestas"
        1. NIP significa "Posibilidad de Implementación de Nostr" - son especificaciones técnicas que aseguran interoperabilidad e innovación en el protocolo
        2. NIP-01 (protocolo básico), NIP-02 (listas de contactos), y NIP-19 (codificación bech32)
        3. NIP-04 está deprecado y tenía problemas de seguridad; NIP-17 es el estándar actual con mejor encriptación y protección de metadatos
        4. NIP-57 integra Lightning Network permitiendo micropagos (zaps) a través de facturas Lightning vinculadas a eventos Nostr