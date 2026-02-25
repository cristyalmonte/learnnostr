# Módulo 5: Construyendo Tu Cliente

!!! info "Visión General del Módulo"
    **Duración**: 6-8 horas  
    **Nivel**: Intermedio-Avanzado  
    **Prerrequisitos**: Módulos 1-4 completados  
    **Objetivo**: Construir un cliente Nostr completo y funcional

## 📋 Objetivos de Aprendizaje

- ✅ Diseñar arquitectura de cliente
- ✅ Implementar gestión de estado
- ✅ Crear interfaz de usuario
- ✅ Optimizar rendimiento
- ✅ Manejar caché local

## 🏗️ Arquitectura del Cliente

```javascript
class NostrClient {
  constructor() {
    this.relayPool = new RelayPool()
    this.eventCache = new Map()
    this.subscriptions = new Map()
    this.userProfile = null
  }

  async init() {
    await this.relayPool.connectAll()
    await this.loadUserProfile()
    this.subscribeToFeed()
  }

  async publishNote(content) {
    const event = finishEvent({
      kind: 1,
      content,
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    }, this.privateKey)

    await this.relayPool.publishToAll(event)
  }

  subscribeToFeed() {
    const sub = this.relayPool.subscribe([{
      kinds: [1],
      limit: 50
    }])

    sub.on('event', (event) => {
      this.handleNewEvent(event)
    })
  }
}
```

## 🎨 Componentes UI

### Feed de Eventos

```javascript
class EventFeed {
  constructor(container) {
    this.container = container
    this.events = []
  }

  addEvent(event) {
    this.events.unshift(event)
    this.render()
  }

  render() {
    this.container.innerHTML = this.events
      .map(e => this.renderEvent(e))
      .join('')
  }

  renderEvent(event) {
    return `
      <div class="event">
        <div class="author">${event.pubkey.slice(0, 8)}</div>
        <div class="content">${event.content}</div>
        <div class="time">${new Date(event.created_at * 1000).toLocaleString()}</div>
      </div>
    `
  }
}
```

## 💾 Caché y Estado

```javascript
class EventCache {
  constructor() {
    this.events = new Map()
    this.profiles = new Map()
  }

  addEvent(event) {
    this.events.set(event.id, event)
  }

  getEvent(id) {
    return this.events.get(id)
  }

  addProfile(pubkey, profile) {
    this.profiles.set(pubkey, profile)
  }

  getProfile(pubkey) {
    return this.profiles.get(pubkey)
  }
}
```

## 🎯 Ejercicios Prácticos

1. **Crear componente de feed**
2. **Implementar sistema de caché**
3. **Agregar perfil de usuario**
4. **Construir formulario de composición**

## 🎯 Evaluación del Módulo 5

- [ ] Cliente completo funcional
- [ ] Gestión de estado implementada
- [ ] UI responsiva
- [ ] Caché optimizado

---

[Continuar al Módulo 6: NIPs Avanzados →](module-06-advanced-nips.md)
