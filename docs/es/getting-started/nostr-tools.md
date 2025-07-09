# Herramientas de Desarrollo e Infraestructura

!!! info "Objetivos de Aprendizaje"
    Al final de esta lección, entenderás:
    
    - Herramientas de desarrollo esenciales para implementación del protocolo Nostr
    - Utilidades de línea de comandos para análisis de red y depuración
    - Librerías y frameworks de programación para diferentes lenguajes
    - Herramientas de monitoreo de infraestructura y gestión de relés

## Descripción General del Ecosistema de Desarrollo

El ecosistema de desarrollo de Nostr consiste en múltiples categorías de herramientas diseñadas para diferentes aspectos de la implementación del protocolo, desde desarrollo de clientes hasta gestión de infraestructura de red. Entender estas herramientas habilita flujos de trabajo de desarrollo eficientes e implementación robusta de sistemas.

## Librerías de Implementación del Protocolo

### Ecosistema JavaScript/TypeScript

#### nostr-tools
**Características Principales:**
- Implementación central del protocolo con creación, validación y firma de eventos
- Gestión de comunicación WebSocket con relés
- Utilidades de generación y gestión de llaves criptográficas
- Soporte de implementación NIP para extensiones del protocolo

**Instalación y Uso Básico:**
```bash
npm install nostr-tools
```

```javascript
import { generatePrivateKey, getPublicKey, finishEvent, relayInit } from 'nostr-tools'

// Generación y gestión de llaves
const privateKey = generatePrivateKey()
const publicKey = getPublicKey(privateKey)

// Creación y firma de eventos
const event = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [["t", "nostr"], ["t", "desarrollo"]],
  content: 'Ejemplo de implementación del protocolo'
}, privateKey)

// Comunicación con relés
const relay = relayInit('wss://relay.damus.io')
await relay.connect()
relay.publish(event)
```

#### NDK (Nostr Development Kit)
**Características Avanzadas:**
- Framework de alto nivel para aplicaciones Nostr
- Gestión automática de caché y almacenamiento
- Descubrimiento y balanceado de carga de relés
- Soporte integrado para múltiples NIPs

**Ejemplo de Implementación:**
```javascript
import NDK from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io', 'wss://nos.lol']
})

await ndk.connect()
const user = ndk.getUser({ npub: 'npub1...' })
const events = await user.fetchEvents()
```

### Ecosistema Python

#### python-nostr
**Capacidades Centrales:**
- Implementación completa del protocolo en Python
- Integración con librerías criptográficas estándar
- Soporte para aplicaciones tanto síncronas como asíncronas
- Herramientas de análisis y procesamiento de eventos

**Instalación y Configuración:**
```bash
pip install nostr
```

```python
from nostr.key import PrivateKey
from nostr.event import Event
from nostr.relay_manager import RelayManager
import time

# Gestión de identidad
private_key = PrivateKey()
public_key = private_key.public_key

# Creación de eventos
event = Event(
    kind=1,
    content="Implementación en Python",
    created_at=int(time.time()),
    tags=[["t", "python"], ["t", "nostr"]]
)
private_key.sign_event(event)

# Publicación de eventos
relay_manager = RelayManager()
relay_manager.add_relay("wss://relay.damus.io")
relay_manager.publish_event(event)
```

### Ecosistema Rust

#### nostr-sdk
**Características de Rendimiento:**
- Implementación de alto rendimiento en Rust
- Bindings para múltiples lenguajes (Python, JavaScript, Kotlin)
- Gestión avanzada de memoria y concurrencia
- Soporte completo para todas las especificaciones NIP

**Ejemplo de Uso:**
```rust
use nostr_sdk::prelude::*;

#[tokio::main]
async fn main() -> Result<()> {
    let keys = Keys::generate();
    let client = Client::new(&keys);
    
    client.add_relay("wss://relay.damus.io", None).await?;
    client.connect().await;
    
    let event = EventBuilder::new_text_note("¡Hola desde Rust!", &[])
        .to_event(&keys)?;
    
    client.send_event(event).await?;
    Ok(())
}
```

## Herramientas de Línea de Comandos

### nostril
**Funcionalidad de CLI:**
- Creación rápida de eventos desde terminal
- Integración con scripts de shell para automatización
- Soporte para múltiples tipos de eventos
- Utilidades de firma y verificación

**Comandos Esenciales:**
```bash
# Instalar nostril
cargo install nostril

# Crear evento de texto simple
nostril --content "Mensaje desde CLI" --tag t nostr

# Generar par de llaves
nostril --generate-keys

# Publicar evento a relé específico
nostril --relay wss://relay.damus.io --content "Publicación automatizada"
```

### nak
**Capacidades de Red:**
- Herramienta completa de análisis de red Nostr
- Consulta y filtrado de eventos avanzado
- Monitoreo de relés y análisis de rendimiento
- Utilidades de depuración del protocolo

**Operaciones Comunes:**
```bash
# Instalar nak
go install github.com/fiatjaf/nak@latest

# Consultar eventos recientes
nak req -k 1 --limit 10 wss://relay.damus.io

# Monitorear actividad de relé en tiempo real
nak stream wss://relay.damus.io

# Verificar información del relé
nak relay-info wss://relay.damus.io
```

## Infraestructura de Desarrollo

### Relés de Desarrollo Local

#### strfry
**Características del Relé:**
- Implementación de relé de alto rendimiento en C++
- Base de datos LMDB para almacenamiento eficiente
- Configuración flexible de políticas
- Herramientas de monitoreo integradas

**Configuración de Desarrollo:**
```bash
# Instalar strfry
git clone https://github.com/hoytech/strfry
cd strfry && make

# Configuración básica
echo 'relay { port = 7777 }' > strfry.conf

# Ejecutar relé local
./strfry relay
```

#### relay-web
**Relé Basado en Web:**
- Implementación ligera en Node.js
- Interfaz web para administración
- Configuración simplificada para desarrollo
- Soporte para múltiples bases de datos

**Configuración Rápida:**
```bash
npm install -g nostr-relay-web
nostr-relay-web --port 8080 --db ./nostr.db
```

### Herramientas de Monitoreo

#### Relay Monitor
**Capacidades de Monitoreo:**
- Métricas de salud de relés en tiempo real
- Análisis de latencia y disponibilidad
- Alertas automáticas para problemas
- Dashboards de rendimiento histórico

#### Network Explorer
**Análisis de Red:**
- Visualización de topología de red
- Análisis de flujo de eventos
- Métricas de conectividad entre relés
- Herramientas de detección de anomalías

## Entornos de Desarrollo Integrados

### Extensiones de VS Code

#### Nostr Development Suite
**Características de IDE:**
- Resaltado de sintaxis para eventos JSON
- Plantillas de código para tipos de eventos comunes
- Integración con herramientas de línea de comandos
- Depurador para aplicaciones Nostr

**Instalación:**
```bash
code --install-extension nostr-dev.nostr-development-suite
```

### Herramientas de Testing

#### nostr-test-framework
**Capacidades de Testing:**
- Framework de testing automatizado para implementaciones
- Casos de prueba para compatibilidad con NIPs
- Testing de rendimiento y carga
- Validación de conformidad del protocolo

**Ejemplo de Test:**
```javascript
import { NostrTestSuite } from 'nostr-test-framework'

const suite = new NostrTestSuite()

suite.test('event-creation', async () => {
  const event = await createTestEvent()
  suite.assertValidEvent(event)
  suite.assertCorrectSignature(event)
})

await suite.run()
```

## Herramientas de Despliegue y DevOps

### Docker Containers

#### Configuración Containerizada
```dockerfile
# Dockerfile para relé Nostr
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8080

CMD ["npm", "start"]
```

#### Docker Compose para Stack Completo
```yaml
version: '3.8'
services:
  relay:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_PATH=/data/nostr.db
    volumes:
      - ./data:/data
  
  monitor:
    image: nostr-monitor:latest
    ports:
      - "3000:3000"
    depends_on:
      - relay
```

### Herramientas de CI/CD

#### GitHub Actions para Nostr
```yaml
name: Nostr CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm test
      - run: npm run nostr-compliance-test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          docker build -t nostr-app .
          docker push registry/nostr-app
```

## Mejores Prácticas de Desarrollo

### Configuración del Entorno
- Usar variables de entorno para configuración de relés
- Implementar logging estructurado para depuración
- Configurar herramientas de monitoreo desde el inicio
- Mantener separación entre entornos de desarrollo/producción

### Patrones de Código
- Implementar manejo robusto de errores para comunicación con relés
- Usar pools de conexión para mejor rendimiento
- Implementar reintentos exponenciales para fallos de red
- Validar eventos tanto en cliente como en servidor

### Seguridad
- Nunca hard-codear llaves privadas en el código
- Usar almacenamiento seguro para material criptográfico
- Implementar rate limiting para prevenir spam
- Validar entrada del usuario antes de crear eventos

## Siguientes Pasos

Dominar estas herramientas de desarrollo te prepara para construir aplicaciones Nostr robustas y escalables. La combinación de librerías apropiadas, herramientas de CLI y infraestructura de monitoreo crea una base sólida para el desarrollo del protocolo.

<div class="next-lesson">
  <a href="../relay-setup/" class="btn btn-primary">
    Configuración y Gestión de Relés →
  </a>
</div>

---

## Verificación de Herramientas

!!! question "Evaluación de Competencia en Herramientas"
    
    1. ¿Cuáles son las ventajas de usar NDK sobre nostr-tools para desarrollo de aplicaciones?
    2. ¿Cómo proporcionan las herramientas CLI como nak y nostril valor para desarrolladores?
    3. ¿Qué consideraciones son importantes al configurar un relé de desarrollo local?
    4. ¿Cómo contribuyen las herramientas de monitoreo a la confiabilidad de aplicaciones Nostr?
    
    ??? success "Análisis de Herramientas"
        1. **NDK proporciona** abstracción de alto nivel, gestión automática de caché, y balanceado de carga de relés, mientras que **nostr-tools ofrece** control de bajo nivel y implementación directa del protocolo
        2. **Las herramientas CLI** habilitan automatización, scripts de testing, análisis de red, y flujos de trabajo de depuración que serían tediosos de implementar manualmente
        3. **Configuración local** requiere consideración de políticas de almacenamiento, configuración de red, requisitos de rendimiento, y herramientas de monitoreo
        4. **Herramientas de monitoreo** proporcionan visibilidad en tiempo real del rendimiento del sistema, detección temprana de problemas, y métricas para optimización

---