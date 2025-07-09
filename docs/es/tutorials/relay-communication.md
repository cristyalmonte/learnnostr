# Comunicación con Relés

Esta página está siendo traducida al español.

**Página original en inglés:** [Relay Communication](/en/tutorials/relay-communication/)

---

## Objetivo del Tutorial

Aprenderás cómo comunicarte con relés Nostr usando WebSockets y el protocolo estándar.

### Conceptos Clave
- Protocolo WebSocket
- Mensajes de relé estándar
- Suscripciones y filtros
- Manejo de conexiones

### Tipos de Mensajes

#### EVENT - Publicar Evento
```javascript
const eventMessage = ["EVENT", event]
relay.send(JSON.stringify(eventMessage))
```

#### REQ - Solicitar Eventos
```javascript
const reqMessage = ["REQ", "subscription-id", filter]
relay.send(JSON.stringify(reqMessage))
```

#### CLOSE - Cerrar Suscripción
```javascript
const closeMessage = ["CLOSE", "subscription-id"]
relay.send(JSON.stringify(closeMessage))
```

### Conexión Básica a Relé
```javascript
const relay = new WebSocket('wss://relay.damus.io')

relay.onopen = () => {
    console.log('Conectado al relé')
    // Suscribirse a eventos
}

relay.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log('Mensaje recibido:', message)
}

relay.onclose = () => {
    console.log('Conexión cerrada')
}
```

### Filtros de Eventos
```javascript
const filter = {
    authors: [publicKey],    // Solo mis eventos
    kinds: [1],             // Solo notas de texto
    limit: 10,              // Máximo 10 eventos
    since: Math.floor(Date.now() / 1000) - 3600  // Última hora
}
```

### Gestión de Múltiples Relés
```javascript
const relays = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.nostr.band'
]

relays.forEach(url => {
    const relay = new WebSocket(url)
    // Configurar eventos para cada relé
})
```

---

*Esta traducción está en progreso. Visita la versión en inglés para el tutorial completo.*
