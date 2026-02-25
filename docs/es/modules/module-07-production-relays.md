# Módulo 7: Relés en Producción

!!! info "Visión General del Módulo"
    **Duración**: 6-8 horas  
    **Nivel**: Avanzado  
    **Prerrequisitos**: Módulos 1-6 completados  
    **Objetivo**: Desplegar y operar relés Nostr en producción

## 📋 Objetivos de Aprendizaje

- ✅ Configurar un relé Nostr
- ✅ Implementar almacenamiento en base de datos
- ✅ Agregar autenticación y rate limiting
- ✅ Monitorear rendimiento
- ✅ Optimizar para escala

## 🚀 Implementaciones de Relés

### Opciones Populares

1. **nostr-rs-relay** (Rust)
   - Alto rendimiento
   - Bajo uso de recursos
   - Configuración flexible

2. **strfry** (C++)
   - Extremadamente rápido
   - Diseño minimalista
   - Ideal para alto tráfico

3. **nostream** (TypeScript)
   - Fácil de configurar
   - Buena documentación
   - Basado en Node.js

## ⚙️ Configurar nostr-rs-relay

```bash
# Instalar
git clone https://github.com/scsibug/nostr-rs-relay
cd nostr-rs-relay

# Configurar
cp config.toml.example config.toml
nano config.toml

# Compilar y ejecutar
cargo build --release
./target/release/nostr-rs-relay
```

### Configuración Básica

```toml
[info]
relay_url = "wss://relay.example.com"
name = "Mi Relé Nostr"
description = "Un relé comunitario"
pubkey = "tu_clave_pública_hex"

[database]
data_directory = "./db"

[network]
port = 8080
address = "0.0.0.0"

[limits]
max_event_bytes = 65536
max_ws_message_bytes = 131072
max_ws_frame_bytes = 131072
messages_per_sec = 10
```

## 💾 Base de Datos

### PostgreSQL para Almacenamiento

```sql
-- Crear tabla de eventos
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  pubkey TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  kind INTEGER NOT NULL,
  tags JSONB,
  content TEXT,
  sig TEXT NOT NULL
);

-- Índices para rendimiento
CREATE INDEX idx_pubkey ON events(pubkey);
CREATE INDEX idx_kind ON events(kind);
CREATE INDEX idx_created_at ON events(created_at DESC);
CREATE INDEX idx_tags ON events USING gin(tags);
```

## 🔐 Autenticación (NIP-42)

```javascript
// Implementar autenticación de relé
class AuthenticatedRelay {
  async handleAuth(ws, event) {
    // Verificar desafío firmado
    if (verifySignature(event)) {
      ws.authenticated = true
      ws.pubkey = event.pubkey
    }
  }

  requireAuth(ws) {
    if (!ws.authenticated) {
      ws.send(JSON.stringify([
        'AUTH',
        'Por favor autentícate para continuar'
      ]))
      return false
    }
    return true
  }
}
```

## 🛡️ Rate Limiting

```javascript
class RateLimiter {
  constructor(maxPerMinute = 60) {
    this.requests = new Map()
    this.maxPerMinute = maxPerMinute
  }

  check(clientId) {
    const now = Date.now()
    const requests = this.requests.get(clientId) || []
    
    // Limpiar solicitudes antiguas
    const recent = requests.filter(t => now - t < 60000)
    
    if (recent.length >= this.maxPerMinute) {
      return false // Rate limited
    }
    
    recent.push(now)
    this.requests.set(clientId, recent)
    return true
  }
}
```

## 📊 Monitoreo

```javascript
class RelayMetrics {
  constructor() {
    this.stats = {
      events_received: 0,
      events_stored: 0,
      subscriptions_active: 0,
      clients_connected: 0
    }
  }

  recordEvent() {
    this.stats.events_received++
  }

  getStats() {
    return {
      ...this.stats,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  }
}
```

## 🎯 Ejercicios Prácticos

1. **Desplegar relé en VPS**
2. **Configurar base de datos**
3. **Implementar rate limiting**
4. **Agregar monitoreo básico**

## 🎯 Evaluación del Módulo 7

- [ ] Relé desplegado y corriendo
- [ ] Base de datos configurada
- [ ] Autenticación funcionando
- [ ] Métricas siendo recolectadas

---

[Continuar al Módulo 8: Escalado y Rendimiento →](module-08-scaling-performance.md)
