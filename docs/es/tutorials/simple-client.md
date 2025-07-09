# Construir un Cliente Simple

Esta página está siendo traducida al español.

**Página original en inglés:** [Build a Simple Client](/en/tutorials/simple-client/)

---

## Objetivo del Tutorial

Aprenderás a construir un cliente Nostr básico desde cero usando JavaScript y HTML.

### Lo Que Construiremos
- Generador de llaves
- Creación de eventos
- Conexión a relés
- Publicación de notas
- Visualización de eventos

### Requisitos Previos
- Conocimiento básico de JavaScript
- Comprensión de HTML/CSS
- Conceptos básicos de Nostr

### Estructura del Proyecto
```
simple-nostr-client/
├── index.html
├── style.css
├── script.js
└── nostr-tools.js
```

### Paso 1: Configuración Inicial
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Cliente Nostr</title>
    <script src="https://unpkg.com/nostr-tools/lib/nostr.bundle.js"></script>
</head>
<body>
    <div id="app">
        <h1>Cliente Nostr Simple</h1>
        <!-- Contenido aquí -->
    </div>
</body>
</html>
```

### Paso 2: Generar Llaves
```javascript
// Generar par de llaves
const privateKey = NostrTools.generatePrivateKey()
const publicKey = NostrTools.getPublicKey(privateKey)

console.log('Llave privada:', privateKey)
console.log('Llave pública:', publicKey)
```

### Paso 3: Crear Eventos
```javascript
function createNote(content) {
    const event = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: content,
        pubkey: publicKey
    }
    
    event.id = NostrTools.getEventHash(event)
    event.sig = NostrTools.signEvent(event, privateKey)
    
    return event
}
```

### Siguiente: Conectar a Relés
En los siguientes pasos aprenderás a:
- Conectarte a relés WebSocket
- Publicar eventos a la red
- Suscribirte a eventos de otros
- Crear una interfaz de usuario completa

---

*Esta traducción está en progreso. Visita la versión en inglés para el tutorial completo con código.*
