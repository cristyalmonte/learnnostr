# Módulo 2: Claves e Identidad

!!! info "Visión General del Módulo"
    **Duración**: 3-4 horas  
    **Nivel**: Principiante  
    **Prerrequisitos**: Módulo 1 completado  
    **Objetivo**: Dominar la gestión de claves criptográficas y la identidad en Nostr

## 📋 Objetivos de Aprendizaje

Al final de este módulo, podrás:

- ✅ Generar pares de claves públicas/privadas
- ✅ Entender diferentes formatos de claves (hex, bech32)
- ✅ Implementar almacenamiento seguro de claves
- ✅ Usar extensiones de firma (NIP-07)
- ✅ Gestionar múltiples identidades

## 🔐 Criptografía de Curva Elíptica

Nostr usa **secp256k1** (la misma curva que Bitcoin) para:

- Generar pares de claves
- Firmar eventos
- Verificar firmas

### Generación de Claves

```javascript
import { generatePrivateKey, getPublicKey } from 'nostr-tools'

// Generar clave privada (32 bytes aleatorios)
const privateKey = generatePrivateKey()

// Derivar clave pública de la privada
const publicKey = getPublicKey(privateKey)

console.log('Privada:', privateKey)
console.log('Pública:', publicKey)
```

## 🏷️ Formatos de Claves

### Formato Hexadecimal (Predeterminado)

```javascript
// Clave privada (64 caracteres hex)
const privHex = "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d"

// Clave pública (64 caracteres hex)
const pubHex = "7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e"
```

### Formato Bech32 (Amigable)

Nostr usa codificación bech32 con prefijos:

- `npub1...` - Clave pública (para compartir)
- `nsec1...` - Clave privada (mantener secreta)

```javascript
import { nip19 } from 'nostr-tools'

// Codificar a bech32
const npub = nip19.npubEncode(publicKey)
const nsec = nip19.nsecEncode(privateKey)

console.log('npub:', npub)
// npub1qyt8wn3lfkej38...

console.log('nsec:', nsec)
// nsec1xxx... ⚠️ NUNCA COMPARTIR

// Decodificar de bech32
const { type, data } = nip19.decode(npub)
console.log(type) // 'npub'
console.log(data) // clave pública hex
```

## 🔒 Almacenamiento Seguro de Claves

### ❌ NUNCA Hagas Esto

```javascript
// ¡NO almacenes claves privadas en texto plano!
localStorage.setItem('privateKey', nsec)

// ¡NO las envíes por correo/chat!
sendEmail(nsec)

// ¡NO las guardes en GitHub!
const PRIVATE_KEY = "nsec1..."
```

### ✅ Mejores Prácticas

**1. Usar Extensiones de Navegador (NIP-07)**

```javascript
// El usuario mantiene claves en extensión segura
if (window.nostr) {
  const pubkey = await window.nostr.getPublicKey()
  const signedEvent = await window.nostr.signEvent(event)
}
```

**2. Gestores de Claves de Hardware**

- Usar dispositivos de firma dedicados
- Mantener claves fuera de línea
- Requiere confirmación física

**3. Cifrado de Aplicación**

```javascript
// Cifrar antes de almacenar
import { encrypt, decrypt } from 'crypto-library'

const encrypted = encrypt(privateKey, userPassword)
localStorage.setItem('encryptedKey', encrypted)

// Descifrar cuando sea necesario
const privateKey = decrypt(encrypted, userPassword)
```

## 🌐 NIP-07: Extensión de Firma de Ventana

### Extensiones Populares

- **[nos2x](https://github.com/fiatjaf/nos2x)** - Chrome/Firefox
- **[Alby](https://getalby.com/)** - Chrome/Firefox (con funciones Lightning)
- **[Flamingo](https://www.flamingo.me/)** - Chrome

### Integración

```javascript
class NostrClient {
  async init() {
    // Verificar disponibilidad de extensión
    if (!window.nostr) {
      alert('¡Por favor instala una extensión Nostr!')
      return
    }

    try {
      // Obtener clave pública
      this.pubkey = await window.nostr.getPublicKey()
      console.log('Conectado:', this.pubkey)
    } catch (error) {
      console.error('Usuario rechazó acceso:', error)
    }
  }

  async publishNote(content) {
    // Crear evento sin firmar
    const event = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: content,
      pubkey: this.pubkey
    }

    try {
      // Extensión firma el evento
      const signedEvent = await window.nostr.signEvent(event)
      
      // Publicar a relés
      await this.publishToRelays(signedEvent)
    } catch (error) {
      console.error('Firma rechazada:', error)
    }
  }
}
```

## 👥 Gestión de Múltiples Identidades

### Casos de Uso

- **Identidad Personal**: Para uso diario
- **Identidad Profesional**: Para trabajo/negocios
- **Identidad Anónima**: Para privacidad
- **Identidad de Bot**: Para automatización

### Implementación

```javascript
class IdentityManager {
  constructor() {
    this.identities = []
    this.activeIdentity = null
  }

  addIdentity(name, privateKey) {
    this.identities.push({
      name,
      privateKey,
      publicKey: getPublicKey(privateKey)
    })
  }

  switchIdentity(name) {
    this.activeIdentity = this.identities.find(i => i.name === name)
  }

  async signAs(name, event) {
    const identity = this.identities.find(i => i.name === name)
    return finishEvent(event, identity.privateKey)
  }
}

// Uso
const manager = new IdentityManager()
manager.addIdentity('personal', privateKey1)
manager.addIdentity('trabajo', privateKey2)

// Publicar como 'personal'
await manager.signAs('personal', noteEvent)
```

## 🔄 Rotación y Recuperación de Claves

### Rotación de Claves

Nostr NO soporta rotación de claves nativa:
- Tu clave pública ES tu identidad
- No puedes cambiarla sin perder seguidores/historia
- Planifica backup cuidadoso desde el principio

### Estrategias de Backup

```javascript
// 1. Frase mnemónica (como Bitcoin)
import { generateMnemonic, mnemonicToPrivateKey } from 'nostr-mnemonic'

const mnemonic = generateMnemonic()
// "witch collapse practice feed shame open despair creek road again ice least"

const privateKey = mnemonicToPrivateKey(mnemonic)

// 2. Múltiples backups
const backups = [
  '1. Guardar en gestor de contraseñas',
  '2. Escribir en papel (almacenar seguro)',
  '3. Dividir usando Shamir Secret Sharing',
  '4. Almacenamiento cifrado en nube'
]
```

## 🎯 Ejercicio Práctico

### Ejercicio 1: Generador de Claves

Crea una herramienta simple de generación de claves:

```javascript
function generateNostrIdentity() {
  const privateKey = generatePrivateKey()
  const publicKey = getPublicKey(privateKey)
  
  return {
    privateKey: {
      hex: privateKey,
      nsec: nip19.nsecEncode(privateKey)
    },
    publicKey: {
      hex: publicKey,
      npub: nip19.npubEncode(publicKey)
    }
  }
}

// Probar
const identity = generateNostrIdentity()
console.log(identity)
```

### Ejercicio 2: Integración NIP-07

Construye un botón de "Conectar con Nostr":

```html
<button id="connect">Conectar Billetera Nostr</button>
<div id="profile" style="display:none">
  <p>Conectado: <span id="npub"></span></p>
</div>

<script type="module">
import { nip19 } from 'nostr-tools'

document.getElementById('connect').onclick = async () => {
  if (!window.nostr) {
    alert('Instala extensión Nostr primero')
    return
  }
  
  try {
    const pubkey = await window.nostr.getPublicKey()
    const npub = nip19.npubEncode(pubkey)
    
    document.getElementById('npub').textContent = npub
    document.getElementById('profile').style.display = 'block'
  } catch (e) {
    alert('Conexión rechazada')
  }
}
</script>
```

## 📝 Cuestionario del Módulo 2

1. **¿Cuál es la diferencia entre npub y nsec?**
   <details>
   <summary>Respuesta</summary>
   npub es tu clave PÚBLICA (seguro compartir), nsec es tu clave PRIVADA (mantener secreta). npub es como nombre de usuario, nsec es como contraseña.
   </details>

2. **¿Por qué usar NIP-07 en lugar de almacenar claves directamente?**
   <details>
   <summary>Respuesta</summary>
   NIP-07 mantiene las claves en una extensión segura del navegador. Las aplicaciones web nunca ven tu clave privada, solo solicitan firmas. Más seguro que almacenar claves en aplicaciones web.
   </details>

3. **¿Puedes cambiar tu clave pública en Nostr?**
   <details>
   <summary>Respuesta</summary>
   No. Tu clave pública ES tu identidad. Cambiarla significa crear una nueva identidad y perder toda historia/seguidores. ¡Haz backup!
   </details>

## 🎯 Evaluación del Módulo 2

- [ ] Generar pares de claves programáticamente
- [ ] Convertir entre formatos hex y bech32
- [ ] Integrar extensión de firma NIP-07
- [ ] Entender mejores prácticas de almacenamiento
- [ ] Gestionar múltiples identidades

---

!!! success "¡Bien Hecho!"
    ¡Dominas la gestión de claves de Nostr! Ahora estás listo para eventos y mensajes.

[Continuar al Módulo 3: Eventos y Mensajes →](module-03-events-messages.md)
