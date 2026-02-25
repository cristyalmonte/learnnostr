# Módulo 4: Relés y Arquitectura

!!! info "Visión General del Módulo"
    **Duración**: 4-5 horas  
    **Nivel**: Intermedio  
    **Prerrequisitos**: Módulos 1-3 completados  
    **Objetivo**: Entender cómo funcionan los relés y cómo conectarse a ellos

## 📋 Objetivos de Aprendizaje

- ✅ Conectarse a relés vía WebSocket
- ✅ Publicar eventos a relés
- ✅ Suscribirse y filtrar eventos
- ✅ Manejar múltiples relés
- ✅ Implementar estrategias de failover

## 🔌 Conectarse a Relés

```javascript
import { relayInit } from 'nostr-tools'

// Conectar a un relé
const relay = relayInit('wss://relay.damus.io')

relay.on('connect', () => {
  console.log(`Conectado a ${relay.url}`)
})

relay.on('error', () => {
  console.log(`Error conectando a ${relay.url}`)
})

await relay.connect()
```

## 📤 Publicar Eventos

```javascript
// Publicar evento
const event = finishEvent({
  kind: 1,
  content: '¡Hola desde el relé!',
  tags: [],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)

let pub = relay.publish(event)

pub.on('ok', () => {
  console.log('¡Evento publicado exitosamente!')
})

pub.on('failed', (reason) => {
  console.log(`Error al publicar: ${reason}`)
})
```

## 📥 Suscribirse a Eventos

```javascript
// Suscribirse a eventos
const sub = relay.sub([
  {
    kinds: [1],
    authors: [publicKey],
    limit: 10
  }
])

sub.on('event', (event) => {
  console.log('Nuevo evento:', event)
})

sub.on('eose', () => {
  console.log('Fin del flujo de eventos almacenados')
})

// Cerrar suscripción cuando termines
sub.unsub()
```

## 🎯 Filtros de Suscripción

```javascript
// Filtrar por tipo de evento
{ kinds: [1, 6, 7] }

// Filtrar por autor
{ authors: [pubkey1, pubkey2] }

// Filtrar por rango de tiempo
{ since: timestamp, until: timestamp }

// Filtrar por etiquetas
{ '#e': [eventId], '#p': [pubkey] }

// Combinar filtros
{
  kinds: [1],
  authors: [pubkey],
  since: Math.floor(Date.now() / 1000) - 86400,
  limit: 50
}
```

## 🌐 Gestión de Múltiples Relés

```javascript
class RelayPool {
  constructor(relayUrls) {
    this.relays = relayUrls.map(url => relayInit(url))
  }

  async connectAll() {
    await Promise.all(this.relays.map(r => r.connect()))
  }

  publishToAll(event) {
    this.relays.forEach(relay => {
      relay.publish(event)
    })
  }

  subscribeAll(filters) {
    this.relays.forEach(relay => {
      relay.sub(filters)
    })
  }
}
```

## 📝 Cuestionario

1. **¿Por qué usar múltiples relés?**
   <details>
   <summary>Respuesta</summary>
   Para redundancia, resistencia a censura y mejor alcance. Si un relé cae o te censura, tus eventos siguen disponibles en otros.
   </details>

## 🎯 Evaluación del Módulo 4

- [ ] Conectarse a relés via WebSocket
- [ ] Publicar eventos exitosamente
- [ ] Crear suscripciones con filtros
- [ ] Gestionar pool de múltiples relés

---

[Continuar al Módulo 5: Construyendo Tu Cliente →](module-05-building-client.md)
