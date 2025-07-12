# Eventos y Mensajes en Nostr

!!! info "Objetivos de Aprendizaje"
    Después de esta lección, entenderás:
    
    - Cómo todo en Nostr está estructurado como eventos
    - Diferentes tipos de eventos y sus propósitos
    - Estructura de eventos y campos requeridos
    - Cómo se firman y verifican los eventos
    - Tipos de eventos comunes y sus casos de uso

## Entendiendo los Eventos

En Nostr, **todo es un evento**. Ya sea que publiques una nota de texto, actualices tu perfil, reacciones a una publicación, o envíes un mensaje directo - todo está estructurado como eventos.

Este enfoque unificado proporciona varios beneficios:

- **Consistencia**: Todos los datos siguen la misma estructura
- **Extensibilidad**: Nuevas características pueden agregarse como nuevos tipos de eventos
- **Simplicidad**: Un formato para gobernarlos a todos
- **Interoperabilidad**: Todos los clientes entienden la misma estructura básica

## Estructura de Eventos

Cada evento Nostr es un objeto JSON con campos requeridos específicos:

```json
{
  "id": "hash-id-evento",
  "pubkey": "llave-publica-autor", 
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "¡Hola Nostr!",
  "sig": "firma-criptografica"
}
```

Desglosemos cada campo:

### Campos Requeridos

#### **`id`** (ID del Evento)
- Hash SHA-256 de 32 bytes de los datos serializados del evento
- Sirve como el identificador único para el evento
- Calculado desde otros campos (no arbitrario)

```javascript
// El ID es el SHA-256 de estos datos serializados:
[
  0,                    // Reservado
  pubkey,              // Llave pública del autor
  created_at,          // Timestamp
  kind,                // Tipo de evento
  tags,                // Array de etiquetas
  content              // Contenido del evento
]
```

#### **`pubkey`** (Autor)
- Llave pública de 32 bytes del creador del evento
- Identifica quién creó el evento
- Usada para verificar la firma

#### **`created_at`** (Timestamp)
- Timestamp Unix en segundos
- Cuándo fue creado el evento
- Usado para ordenamiento cronológico

#### **`kind`** (Tipo de Evento)
- Entero que define el tipo de evento
- Determina cómo los clientes deben interpretar el evento
- Estandarizado en varios NIPs

#### **`tags`** (Metadatos)
- Array de arrays conteniendo metadatos
- Usado para referencias, menciones, hashtags, etc.
- Cada etiqueta es un array de strings

#### **`content`** (Contenido del Mensaje)
- El contenido principal del evento
- Puede ser texto, JSON, o vacío dependiendo del kind
- A menudo contiene el mensaje visible para el usuario

#### **`sig`** (Firma)
- Firma Schnorr de 64 bytes
- Prueba que el evento fue creado por el propietario de la pubkey
- Previene manipulación

## Tipos de Eventos (Kinds)

Los tipos de eventos determinan cómo debe interpretarse el evento:

### Eventos de Texto

#### **Kind 1: Nota de Texto**
El tipo de evento más común - como un tweet:

```json
{
  "kind": 1,
  "content": "¡Acabo de aprender sobre Nostr! Esta red social descentralizada es increíble 🚀",
  "tags": [
    ["t", "nostr"],
    ["t", "descentralizado"]
  ]
}
```

#### **Kind 0: Metadatos de Usuario**
Información de perfil:

```json
{
  "kind": 0,
  "content": "{\"name\":\"Alicia\",\"about\":\"Entusiasta de Nostr\",\"picture\":\"https://example.com/avatar.jpg\"}"
}
```

### Eventos Sociales

#### **Kind 7: Reacción**
Likes, corazones y otras reacciones:

```json
{
  "kind": 7,
  "content": "🤙",
  "tags": [
    ["e", "id-nota-reaccionada"],
    ["p", "autor-nota-original"]
  ]
}
```

#### **Kind 6: Repost**
Compartir la nota de otra persona:

```json
{
  "kind": 6,
  "content": "",
  "tags": [
    ["e", "id-evento-reposteado"],
    ["p", "pubkey-autor-original"]
  ]
}
```

### Eventos de Comunicación

#### **Kind 4: Mensaje Directo Encriptado**
Mensajes privados entre usuarios:

```json
{
  "kind": 4,
  "content": "contenido-mensaje-encriptado",
  "tags": [
    ["p", "pubkey-destinatario"]
  ]
}
```

#### **Kind 42: Mensaje de Canal**
Mensajes de salas de chat públicas:

```json
{
  "kind": 42,
  "content": "¡Hola a todos en este canal!",
  "tags": [
    ["e", "id-evento-creacion-canal", "", "root"]
  ]
}
```

### Eventos de Gestión

#### **Kind 3: Lista de Contactos**
A quién sigues:

```json
{
  "kind": 3,
  "content": "",
  "tags": [
    ["p", "pubkey1", "url-rele", "apodo"],
    ["p", "pubkey2", "url-rele", "alicia"]
  ]
}
```

#### **Kind 5: Eliminación de Evento**
Solicitud para eliminar tus propios eventos:

```json
{
  "kind": 5,
  "content": "Eliminando esta publicación",
  "tags": [
    ["e", "id-evento-a-eliminar"],
    ["k", "1"]
  ]
}
```

### Eventos Avanzados

#### **Kind 30023: Contenido de Formato Largo**
Artículos y posts de blog:

```json
{
  "kind": 30023,
  "content": "# Mi Artículo\n\nEste es un artículo de formato largo...",
  "tags": [
    ["d", "slug-mi-articulo"],
    ["title", "Mi Artículo Increíble"],
    ["summary", "Un resumen breve"],
    ["published_at", "1234567890"]
  ]
}
```

#### **Kind 9735: Zap**
Pagos Lightning:

```json
{
  "kind": 9735,
  "content": "",
  "tags": [
    ["bolt11", "factura-lightning"],
    ["description", "evento-solicitud-zap"],
    ["p", "pubkey-destinatario"]
  ]
}
```

## Sistema de Etiquetas

Las etiquetas proporcionan metadatos estructurados para eventos:

### Tipos de Etiquetas Comunes

#### **Etiquetas "e"** - Referencias de Eventos
Referencian otros eventos:

```json
["e", "id-evento", "url-rele", "marcador", "pubkey"]
```

- `id-evento`: El evento siendo referenciado
- `url-rele`: Dónde encontrar el evento (opcional)
- `marcador`: "root", "reply", o "mention" (opcional)
- `pubkey`: Autor del evento referenciado (opcional)

#### **Etiquetas "p"** - Referencias de Pubkey
Referencian usuarios:

```json
["p", "pubkey", "url-rele", "apodo"]
```

#### **Etiquetas "t"** - Temas/Hashtags
Categorizan contenido:

```json
["t", "nostr"]
["t", "bitcoin"]
```

#### **Etiquetas "d"** - Identificadores
Para eventos reemplazables:

```json
["d", "identificador-unico"]
```

### Etiquetas Avanzadas

```json
// Advertencia de contenido
["content-warning", "razón"]

// Expiración
["expiration", "timestamp-unix"]

// Línea de asunto
["subject", "Asunto tipo email"]

// Ubicación geográfica
["g", "geohash"]
```

## Proceso de Creación de Eventos

### 1. Construir Objeto de Evento

```javascript
const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["t", "nostr"],
    ["p", "alguna-pubkey"]
  ],
  content: "¡Hola Nostr!"
}
```

### 2. Agregar Pubkey

```javascript
event.pubkey = getPublicKey(privateKey)
```

### 3. Calcular ID

```javascript
import { getEventHash } from 'nostr-tools'

event.id = getEventHash(event)
```

### 4. Firmar Evento

```javascript
import { signEvent } from 'nostr-tools'

event.sig = signEvent(event, privateKey)
```

### 5. Publicar a Relés

```javascript
relays.forEach(relay => {
  relay.publish(event)
})
```

## Verificación de Eventos

Al recibir eventos, los clientes deben verificarlos:

### 1. Verificar ID

```javascript
import { getEventHash } from 'nostr-tools'

const calculatedId = getEventHash(event)
if (calculatedId !== event.id) {
  throw new Error('ID de evento inválido')
}
```

### 2. Verificar Firma

```javascript
import { verifySignature } from 'nostr-tools'

const isValid = verifySignature(event)
if (!isValid) {
  throw new Error('Firma inválida')
}
```

### 3. Verificar Timestamp

```javascript
const now = Math.floor(Date.now() / 1000)
const age = now - event.created_at

// Rechazar eventos muy futuros
if (event.created_at > now + 60) {
  throw new Error('Evento del futuro')
}

// Opcionalmente rechazar eventos muy antiguos
if (age > 86400 * 30) { // 30 días
  console.warn('Evento muy antiguo')
}
```

## Serialización de Eventos

Los eventos deben serializarse consistentemente para el cálculo del ID:

```javascript
// Serialización para cálculo de ID
const serialized = JSON.stringify([
  0,
  event.pubkey,
  event.created_at,
  event.kind,
  event.tags,
  event.content
])

// Sin espacios en blanco, escape específico de caracteres
const id = sha256(utf8Encode(serialized))
```

### Reglas de Escape de Caracteres

Caracteres específicos deben escaparse en el contenido:

- Salto de línea (`0x0A`) → `\n`
- Comilla doble (`0x22`) → `\"`
- Barra invertida (`0x5C`) → `\\`
- Retorno de carro (`0x0D`) → `\r`
- Tab (`0x09`) → `\t`
- Backspace (`0x08`) → `\b`
- Form feed (`0x0C`) → `\f`

## Relaciones de Eventos

Los eventos pueden referenciarse entre sí para crear estructuras complejas:

### Hilos (Respuestas)

```json
{
  "kind": 1,
  "content": "Esta es una respuesta",
  "tags": [
    ["e", "id-evento-raiz", "", "root"],
    ["e", "id-evento-padre", "", "reply"],
    ["p", "pubkey-autor-original"],
    ["p", "pubkey-autor-padre"]
  ]
}
```

### Menciones

```json
{
  "kind": 1,
  "content": "Oye #[0], ¡mira esto!",
  "tags": [
    ["p", "pubkey-usuario-mencionado"]
  ]
}
```

### Citas

```json
{
  "kind": 1,
  "content": "Esto es interesante: nostr:note1abc...",
  "tags": [
    ["q", "id-evento-citado"]
  ]
}
```

## Eventos Reemplazables

Algunos eventos pueden ser reemplazados por versiones más nuevas:

### Reemplazable Regular (10000-19999)
Solo se mantiene el evento más reciente para cada `kind` + `pubkey`:

```json
{
  "kind": 10000,
  "content": "Mi lista de silenciados",
  "tags": [
    ["p", "pubkey-silenciado-1"],
    ["p", "pubkey-silenciado-2"]
  ]
}
```

### Reemplazable Parametrizado (30000-39999)
Último evento para cada `kind` + `pubkey` + etiqueta `d`:

```json
{
  "kind": 30023,
  "tags": [
    ["d", "slug-mi-articulo"],
    ["title", "Mi Artículo"]
  ],
  "content": "Contenido del artículo..."
}
```

## Reglas de Validación de Eventos

### Validaciones Requeridas

- `id` coincide con SHA-256 del evento serializado
- `sig` es una firma Schnorr válida
- `pubkey` es hex válido de 32 bytes
- `created_at` es un timestamp razonable
- `kind` es un entero válido
- `tags` es array de arrays de strings

### Validaciones Opcionales

- Límites de longitud de contenido
- Límites de conteo de etiquetas
- Frescura de timestamp
- Requisitos de prueba de trabajo
- Filtrado de contenido

## Trabajando con Eventos en Código

### Creando una Nota de Texto

```javascript
import { finishEvent } from 'nostr-tools'

const event = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["t", "hola"],
    ["t", "nostr"]
  ],
  content: "¡Hola mundo Nostr! 👋"
}, privateKey)

console.log('Evento creado:', event)
```

### Creando una Respuesta

```javascript
const replyEvent = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["e", originalEvent.id, "", "root"],
    ["p", originalEvent.pubkey]
  ],
  content: "¡Gran publicación! Gracias por compartir."
}, privateKey)
```

### Creando una Reacción

```javascript
const reaction = finishEvent({
  kind: 7,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ["e", noteEvent.id],
    ["p", noteEvent.pubkey],
    ["k", "1"] // kind del evento al que se reacciona
  ],
  content: "🤙"
}, privateKey)
```

## Mejores Prácticas

### Para Creación de Eventos

!!! success "Haz Esto"
    - Siempre establece timestamps `created_at` razonables
    - Incluye etiquetas `p` relevantes para notificaciones
    - Usa formatos de etiquetas estándar
    - Mantén el tamaño del contenido razonable
    - Incluye referencias de eventos apropiadas en respuestas

!!! danger "Evita Esto"
    - Crear eventos con timestamps futuros
    - Omitir etiquetas `p` requeridas en respuestas
    - Usar formatos de etiquetas no estándar
    - Crear ruido excesivo de etiquetas
    - Olvidar manejar caracteres especiales

### Para Procesamiento de Eventos

- Siempre verifica firmas antes de confiar en eventos
- Implementa verificaciones razonables de timestamp
- Maneja campos faltantes o malformados graciosamente
- Cachea resultados de verificación para rendimiento
- Limita la velocidad de procesamiento de eventos para prevenir spam

## Patrones Comunes

### Creación de Hilos

```javascript
// Publicación raíz
const rootPost = finishEvent({
  kind: 1,
  content: "Iniciando un nuevo hilo sobre eventos Nostr...",
  // ...
}, privateKey)

// Respuesta a la raíz
const reply = finishEvent({
  kind: 1,
  content: "Primer punto: los eventos son la estructura de datos central",
  tags: [
    ["e", rootPost.id, "", "root"],
    ["p", rootPost.pubkey]
  ]
  // ...
}, privateKey)
```

### Descubrimiento de Contenido

```javascript
// Suscribirse a hashtag
const sub = relay.sub([{
  kinds: [1],
  "#t": ["nostr"]
}])

// Suscribirse a menciones
const mentionSub = relay.sub([{
  kinds: [1],
  "#p": [myPubkey]
}])
```

### Actualizaciones de Eventos

```javascript
// Evento reemplazable (perfil)
const profile = finishEvent({
  kind: 0,
  content: JSON.stringify({
    name: "Alicia",
    about: "Desarrolladora Nostr",
    picture: "https://example.com/avatar.jpg"
  })
  // ...
}, privateKey)
```

## Próximos Pasos

Entender los eventos es crucial para construir aplicaciones Nostr. A continuación, explora:

- [Relés y Comunicación](../relays/) - Cómo los eventos viajan a través de la red
- [NIPs](../nips/) - Especificaciones para diferentes tipos de eventos
- [Construyendo Aplicaciones](../../tutorials/) - Juntando todo

!!! tip "Ejercicio de Práctica"
    Trata de crear diferentes tipos de eventos usando los ejemplos anteriores. Comienza con notas de texto simples y gradualmente explora tipos de eventos más complejos como respuestas y reacciones.
