# Módulo 9: Seguridad y Privacidad en Nostr

!!! info "Descripción General del Módulo"
    **Duración**: 8-10 horas  
    **Nivel**: Avanzado  
    **Prerequisitos**: Módulos 1-8 completados  
    **Objetivo**: Implementar medidas completas de seguridad y privacidad para aplicaciones Nostr

## 📋 Objetivos de Aprendizaje

Al final de este módulo, podrás:

- ✅ Implementar cifrado de extremo a extremo usando NIP-44
- ✅ Gestión y almacenamiento seguro de claves privadas (NIP-49)
- ✅ Construir sistemas de mensajería directa privada (NIP-17)
- ✅ Implementar autenticación y autorización (NIP-42, NIP-98)
- ✅ Comprender y prevenir vectores de ataque comunes
- ✅ Implementar medidas anti-spam con prueba de trabajo (NIP-13)
- ✅ Flujos de trabajo de firma remota segura (NIP-46)
- ✅ Construir aplicaciones que preserven la privacidad

## 🔒 Principios Básicos de Seguridad en Nostr

### El Modelo de Seguridad

La seguridad de Nostr se basa en varios principios clave:

1. **Identidad Criptográfica**: Cada usuario está identificado por una clave pública
2. **Integridad de Mensajes**: Todos los eventos están firmados con claves privadas
3. **Sin Autoridad Central**: La seguridad no depende de servidores confiables
4. **Público por Defecto**: La mayoría del contenido está diseñado para ser público
5. **Privacidad Opcional**: Las características de privacidad deben implementarse explícitamente

### Modelo de Amenazas

Comprender contra qué protege Nostr (y contra qué no):

| Amenaza | Protegido | Notas |
|---------|-----------|-------|
| Manipulación de mensajes | ✅ Sí | Las firmas previenen modificaciones |
| Suplantación de identidad | ✅ Sí | Firmas criptográficas |
| Censura | ✅ Parcial | Múltiples relays proporcionan redundancia |
| Filtración de metadatos | ❌ No | Created_at, pubkeys son visibles |
| Análisis de red | ❌ Limitado | Las conexiones a relays pueden monitorearse |
| Privacidad de contenido | ❌ No | Sin cifrado, el contenido es público |
| Compromiso de claves | ❌ No | Las claves comprometidas no pueden recuperarse |

## 🔐 Cifrado en Nostr

### NIP-04 vs NIP-44: Comprendiendo la Evolución

#### NIP-04 (Obsoleto)

El estándar de cifrado original tenía varios fallos de seguridad:

```javascript
// NIP-04 (NO USAR - mostrado con fines educativos)
import * as secp from '@noble/secp256k1';
import crypto from 'crypto';

// OBSOLETO: Vulnerabilidades de seguridad
function nip04Encrypt(privkey, pubkey, text) {
  const key = secp.getSharedSecret(privkey, '02' + pubkey);
  const normalizedKey = key.slice(1, 33); // Solo coordenada X
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', normalizedKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return encrypted + '?iv=' + iv.toString('base64');
}
```

**Por qué NIP-04 está obsoleto:**
- Sin autenticación (vulnerable a manipulación)
- Posibles ataques de oráculo de relleno
- Generación débil de IV en algunas implementaciones
- Sin secreto directo (forward secrecy)
- Filtración de metadatos

#### NIP-44: Estándar de Cifrado Moderno

NIP-44 es el estándar actual usando XChaCha20-Poly1305:

```javascript
import { nip44 } from 'nostr-tools';
import { getPublicKey, generateSecretKey } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';

class SecureMessaging {
  constructor(privateKey) {
    this.privateKey = privateKey;
    this.publicKey = getPublicKey(privateKey);
  }

  // Cifrar un mensaje a un destinatario
  encrypt(recipientPubkey, plaintext) {
    try {
      // Generar clave de conversación (basada en HKDF)
      const conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(this.privateKey),
        recipientPubkey
      );
      
      // Cifrar con XChaCha20-Poly1305
      const ciphertext = nip44.v2.encrypt(
        plaintext,
        conversationKey
      );
      
      return ciphertext;
    } catch (error) {
      console.error('Cifrado falló:', error);
      throw new Error('Fallo al cifrar mensaje');
    }
  }

  // Descifrar un mensaje de un remitente
  decrypt(senderPubkey, ciphertext) {
    try {
      const conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(this.privateKey),
        senderPubkey
      );
      
      const plaintext = nip44.v2.decrypt(
        ciphertext,
        conversationKey
      );
      
      return plaintext;
    } catch (error) {
      console.error('Descifrado falló:', error);
      throw new Error('Fallo al descifrar mensaje');
    }
  }
}

// Uso
const alice = new SecureMessaging(generateSecretKey());
const bob = new SecureMessaging(generateSecretKey());

const encrypted = alice.encrypt(bob.publicKey, "Mensaje secreto");
const decrypted = bob.decrypt(alice.publicKey, encrypted);

console.log('Descifrado:', decrypted); // "Mensaje secreto"
```

### Características de Seguridad de NIP-44

1. **Cifrado Autenticado**: ChaCha20-Poly1305 proporciona tanto confidencialidad como autenticidad
2. **Claves de Conversación**: Derivadas usando HKDF para separación adecuada de claves
3. **Nonces Aleatorios**: Nonces de 24 bytes previenen ataques de repetición
4. **Relleno**: Filtra menos información sobre la longitud del mensaje
5. **Sin Cifrado Maleable**: No se puede modificar el texto cifrado sin detección

## 💬 Mensajes Directos Privados (NIP-17)

NIP-17 proporciona ocultación de metadatos para mensajes directos usando gift wrapping:

```javascript
import { nip44, getPublicKey, generateSecretKey, finalizeEvent } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';

class PrivateMessaging {
  // Crear un "rumor" (evento sin firmar)
  createRumor(senderPubkey, recipientPubkey, content) {
    return {
      pubkey: senderPubkey,
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800), // Tiempo aleatorio dentro de 2 días
      kind: 14, // Mensaje directo privado
      tags: [['p', recipientPubkey]],
      content: content,
    };
  }

  // Sellar el rumor (firmar y cifrar)
  sealRumor(rumor, senderPrivkey, recipientPubkey) {
    // Firmar el rumor
    const signedRumor = finalizeEvent(rumor, senderPrivkey);
    
    // Cifrar el rumor firmado
    const conversationKey = nip44.v2.utils.getConversationKey(
      bytesToHex(senderPrivkey),
      recipientPubkey
    );
    
    const sealContent = nip44.v2.encrypt(
      JSON.stringify(signedRumor),
      conversationKey
    );

    // Crear evento sellado
    return {
      pubkey: getPublicKey(senderPrivkey),
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800),
      kind: 13, // Sello
      tags: [],
      content: sealContent,
    };
  }

  // Envolver el sello como regalo (capa final)
  giftWrap(seal, senderPrivkey, recipientPubkey) {
    // Generar clave efímera para gift wrap
    const ephemeralKey = generateSecretKey();
    const ephemeralPubkey = getPublicKey(ephemeralKey);
    
    // Cifrar sello con clave efímera
    const conversationKey = nip44.v2.utils.getConversationKey(
      bytesToHex(ephemeralKey),
      recipientPubkey
    );
    
    const signedSeal = finalizeEvent(seal, senderPrivkey);
    const giftWrapContent = nip44.v2.encrypt(
      JSON.stringify(signedSeal),
      conversationKey
    );

    // Crear evento gift wrap
    const giftWrapEvent = {
      pubkey: ephemeralPubkey,
      created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800),
      kind: 1059, // Gift wrap
      tags: [['p', recipientPubkey]],
      content: giftWrapContent,
    };

    return finalizeEvent(giftWrapEvent, ephemeralKey);
  }

  // Enviar DM privado
  async sendPrivateDM(relay, senderPrivkey, recipientPubkey, message) {
    const senderPubkey = getPublicKey(senderPrivkey);
    
    // Crear rumor
    const rumor = this.createRumor(senderPubkey, recipientPubkey, message);
    
    // Sellarlo
    const seal = this.sealRumor(rumor, senderPrivkey, recipientPubkey);
    
    // Envolverlo como regalo
    const giftWrap = this.giftWrap(seal, senderPrivkey, recipientPubkey);
    
    // Publicar al relay
    await relay.publish(giftWrap);
    
    return giftWrap;
  }

  // Desenvolver y descifrar DM recibido
  unwrapGiftWrap(giftWrapEvent, recipientPrivkey) {
    try {
      // Descifrar gift wrap para obtener sello
      const conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(recipientPrivkey),
        giftWrapEvent.pubkey
      );
      
      const sealJson = nip44.v2.decrypt(giftWrapEvent.content, conversationKey);
      const seal = JSON.parse(sealJson);
      
      // Descifrar sello para obtener rumor
      const rumorConversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(recipientPrivkey),
        seal.pubkey
      );
      
      const rumorJson = nip44.v2.decrypt(seal.content, rumorConversationKey);
      const rumor = JSON.parse(rumorJson);
      
      return rumor;
    } catch (error) {
      console.error('Fallo al desenvolver regalo:', error);
      return null;
    }
  }
}
```

### ¿Por Qué Gift Wrapping?

El gift wrapping proporciona varios beneficios de privacidad:

1. **Anonimato del Remitente**: Las claves efímeras ocultan la identidad del remitente de los relays
2. **Privacidad del Destinatario**: Solo el destinatario puede descifrar
3. **Protección de Metadatos**: Marcas de tiempo aleatorias ocultan cuándo se enviaron realmente los mensajes
4. **Privacidad del Relay**: Los relays no pueden ver el contenido o remitente verdadero
5. **Negabilidad**: Los mensajes no pueden probarse que son del remitente

## 🔑 Seguridad de Claves Privadas

### NIP-49: Cifrado de Claves Privadas

Nunca almacenes claves privadas en texto plano. Usa NIP-49 para almacenamiento cifrado:

```javascript
import { nip49 } from 'nostr-tools';
import { generateSecretKey } from 'nostr-tools';

class KeyManagement {
  // Cifrar clave privada con contraseña
  encryptPrivateKey(privateKey, password, logN = 16) {
    try {
      // logN determina dificultad computacional
      // 16 = 64 MiB, ~100ms en computadora rápida
      // 18 = 256 MiB
      // 20 = 1 GiB, ~2 segundos
      
      const encrypted = nip49.encrypt(
        privateKey,
        password,
        logN,
        0x02 // Byte de seguridad de clave: 0x02 = seguridad desconocida
      );
      
      return encrypted; // Devuelve string ncryptsec1...
    } catch (error) {
      console.error('Cifrado falló:', error);
      throw error;
    }
  }

  // Descifrar clave privada con contraseña
  decryptPrivateKey(ncryptsec, password) {
    try {
      const privateKey = nip49.decrypt(ncryptsec, password);
      return privateKey;
    } catch (error) {
      console.error('Descifrado falló:', error);
      throw new Error('Contraseña inválida o clave corrupta');
    }
  }

  // Generación segura y almacenamiento de clave
  async generateAndStoreKey(password) {
    const privateKey = generateSecretKey();
    const encrypted = this.encryptPrivateKey(privateKey, password);
    
    // Almacenar clave cifrada de forma segura
    localStorage.setItem('nostr_encrypted_key', encrypted);
    
    // NUNCA almacenar clave en texto plano
    // Limpiar de memoria
    privateKey.fill(0);
    
    return encrypted;
  }

  // Cargar y descifrar clave
  async loadKey(password) {
    const encrypted = localStorage.getItem('nostr_encrypted_key');
    if (!encrypted) {
      throw new Error('No se encontró clave almacenada');
    }
    
    const privateKey = this.decryptPrivateKey(encrypted, password);
    return privateKey;
  }
}

// Uso
const keyMgmt = new KeyManagement();

// Configuración inicial
const encrypted = await keyMgmt.generateAndStoreKey('contraseña-fuerte-123');
console.log('Clave cifrada:', encrypted);

// Más tarde, cargar la clave
const privateKey = await keyMgmt.loadKey('contraseña-fuerte-123');
```

### Mejores Prácticas de Almacenamiento de Claves

```javascript
class SecureKeyStorage {
  // Diferentes estrategias para diferentes plataformas

  // Navegador: Usar IndexedDB con cifrado
  async storeBrowser(encryptedKey, keyName = 'default') {
    const db = await this.openDB();
    const tx = db.transaction('keys', 'readwrite');
    await tx.objectStore('keys').put({
      name: keyName,
      encrypted: encryptedKey,
      created: Date.now()
    });
  }

  // Móvil: Usar keychain/keystore seguro
  async storeMobile(encryptedKey) {
    if (typeof window !== 'undefined' && window.SecureStorage) {
      // Ejemplo de React Native Secure Storage
      await window.SecureStorage.setItem('nostr_key', encryptedKey);
    }
  }

  // Escritorio: Usar keychain del SO
  async storeDesktop(encryptedKey) {
    // Ejemplo de Electron
    if (typeof require !== 'undefined') {
      const keytar = require('keytar');
      await keytar.setPassword('nostr-app', 'default-key', encryptedKey);
    }
  }

  // Integración con hardware wallet
  async useHardwareWallet() {
    // Para máxima seguridad, usar dispositivos de firma hardware
    // Esto se integraría con NIP-46 para firma remota
    return {
      signEvent: async (event) => {
        // Enviar a dispositivo hardware para firma
        // El dispositivo nunca expone la clave privada
      }
    };
  }
}
```

## 🛡️ Autenticación y Autorización

### NIP-42: Autenticación de Relay

Los relays pueden requerir autenticación antes de permitir acceso:

```javascript
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';

class RelayAuth {
  async authenticate(relay, privateKey) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Tiempo de espera de autenticación agotado'));
      }, 10000);

      relay.on('auth', async (challenge) => {
        clearTimeout(timeout);
        
        // Crear evento de autenticación
        const authEvent = {
          kind: 22242,
          created_at: Math.floor(Date.now() / 1000),
          tags: [
            ['relay', relay.url],
            ['challenge', challenge]
          ],
          content: ''
        };

        const signedAuth = finalizeEvent(authEvent, privateKey);
        
        // Enviar respuesta AUTH
        relay.auth(signedAuth);
        
        resolve();
      });
    });
  }

  async connectWithAuth(relayUrl, privateKey) {
    const relay = await Relay.connect(relayUrl);
    
    try {
      await this.authenticate(relay, privateKey);
      console.log('Autenticado exitosamente');
      return relay;
    } catch (error) {
      console.error('Autenticación falló:', error);
      relay.close();
      throw error;
    }
  }
}

// Uso
const auth = new RelayAuth();
const relay = await auth.connectWithAuth(
  'wss://private-relay.example.com',
  myPrivateKey
);
```

### NIP-98: Autenticación HTTP

Para APIs HTTP que necesitan autenticación basada en Nostr:

```javascript
import { finalizeEvent, getPublicKey } from 'nostr-tools';

class HTTPAuth {
  // Crear encabezado de autorización
  async createAuthHeader(method, url, privateKey, payload = null) {
    const event = {
      kind: 27235,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['u', url],
        ['method', method]
      ],
      content: ''
    };

    // Agregar hash de payload si está presente
    if (payload) {
      const hash = await this.sha256(payload);
      event.tags.push(['payload', hash]);
    }

    const signedEvent = finalizeEvent(event, privateKey);
    const base64Event = btoa(JSON.stringify(signedEvent));
    
    return `Nostr ${base64Event}`;
  }

  async sha256(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Hacer solicitud autenticada
  async authenticatedFetch(url, method, privateKey, body = null) {
    const authHeader = await this.createAuthHeader(method, url, privateKey, body);
    
    const options = {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = body;
    }

    const response = await fetch(url, options);
    
    if (response.status === 401) {
      throw new Error('Autenticación falló');
    }

    return response;
  }
}

// Uso
const httpAuth = new HTTPAuth();
const response = await httpAuth.authenticatedFetch(
  'https://api.example.com/upload',
  'POST',
  myPrivateKey,
  JSON.stringify({ file: 'data' })
);
```

## 🚫 Prevención de Spam y Abuso

### NIP-13: Prueba de Trabajo

Implementar PoW para hacer el spam económicamente costoso:

```javascript
import { getEventHash } from 'nostr-tools';

class ProofOfWork {
  // Minar evento para cumplir objetivo de dificultad
  async mineEvent(event, targetDifficulty) {
    let nonce = 0;
    const maxIterations = 1000000;
    
    while (nonce < maxIterations) {
      // Agregar etiqueta nonce
      const eventWithNonce = {
        ...event,
        tags: [
          ...event.tags.filter(t => t[0] !== 'nonce'),
          ['nonce', nonce.toString(), targetDifficulty.toString()]
        ]
      };

      // Calcular hash
      const id = getEventHash(eventWithNonce);
      
      // Verificar si cumple dificultad
      const difficulty = this.countLeadingZeroBits(id);
      
      if (difficulty >= targetDifficulty) {
        return eventWithNonce;
      }

      nonce++;
    }

    throw new Error(`No se pudo encontrar nonce válido después de ${maxIterations} intentos`);
  }

  // Contar bits cero principales en cadena hexadecimal
  countLeadingZeroBits(hex) {
    let count = 0;
    
    for (let i = 0; i < hex.length; i++) {
      const nibble = parseInt(hex[i], 16);
      
      if (nibble === 0) {
        count += 4;
      } else {
        // Contar ceros principales en este nibble
        count += Math.clz32(nibble) - 28;
        break;
      }
    }

    return count;
  }

  // Verificar PoW
  verifyPoW(event, requiredDifficulty) {
    const nonceTag = event.tags.find(t => t[0] === 'nonce');
    
    if (!nonceTag) {
      return false;
    }

    const claimedDifficulty = parseInt(nonceTag[2]);
    
    if (claimedDifficulty < requiredDifficulty) {
      return false;
    }

    const difficulty = this.countLeadingZeroBits(event.id);
    return difficulty >= requiredDifficulty;
  }
}

// Uso
const pow = new ProofOfWork();

const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: "Esta nota tiene prueba de trabajo",
  pubkey: myPubkey
};

// Minar con dificultad 20 (~1 segundo en CPU moderno)
const minedEvent = await pow.mineEvent(event, 20);
console.log('Evento minado:', minedEvent);

// Verificar
const isValid = pow.verifyPoW(minedEvent, 20);
console.log('PoW válido:', isValid);
```

### Limitación de Velocidad y Control de Acceso

```javascript
class SecurityMiddleware {
  constructor() {
    this.rateLimits = new Map();
    this.blacklist = new Set();
  }

  // Limitación de velocidad por pubkey
  checkRateLimit(pubkey, maxPerMinute = 10) {
    const now = Date.now();
    const key = `${pubkey}:${Math.floor(now / 60000)}`;
    
    const count = this.rateLimits.get(key) || 0;
    
    if (count >= maxPerMinute) {
      return {
        allowed: false,
        reason: 'rate-limited: calma ahí jefe'
      };
    }

    this.rateLimits.set(key, count + 1);
    
    // Limpiar entradas antiguas
    this.cleanupRateLimits();
    
    return { allowed: true };
  }

  cleanupRateLimits() {
    const now = Date.now();
    const cutoff = now - 120000; // Hace 2 minutos
    
    for (const [key, _] of this.rateLimits) {
      const timestamp = parseInt(key.split(':')[1]) * 60000;
      if (timestamp < cutoff) {
        this.rateLimits.delete(key);
      }
    }
  }

  // Filtrado de contenido
  checkContent(event) {
    const content = event.content.toLowerCase();
    
    // Verificar patrones de spam
    const spamPatterns = [
      /\b(viagra|cialis|casino)\b/i,
      /(https?:\/\/[^\s]+){5,}/, // Múltiples URLs
      /(.)\1{10,}/ // Caracteres repetidos
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(content)) {
        return {
          allowed: false,
          reason: 'invalid: el contenido parece ser spam'
        };
      }
    }

    return { allowed: true };
  }

  // Verificar firma de evento
  verifySignature(event) {
    try {
      // Verificar que la firma del evento coincida
      const hash = getEventHash(event);
      
      if (hash !== event.id) {
        return {
          allowed: false,
          reason: 'invalid: id no coincide con hash'
        };
      }

      // Verificar firma
      const isValid = verifySignature(event);
      
      if (!isValid) {
        return {
          allowed: false,
          reason: 'invalid: verificación de firma falló'
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: 'invalid: error de verificación de firma'
      };
    }
  }

  // Verificar evento contra todas las reglas de seguridad
  async checkEvent(event) {
    // 1. Verificar firma
    const sigCheck = this.verifySignature(event);
    if (!sigCheck.allowed) return sigCheck;

    // 2. Verificar lista negra
    if (this.blacklist.has(event.pubkey)) {
      return {
        allowed: false,
        reason: 'blocked: pubkey está baneado'
      };
    }

    // 3. Limitación de velocidad
    const rateCheck = this.checkRateLimit(event.pubkey);
    if (!rateCheck.allowed) return rateCheck;

    // 4. Filtrado de contenido
    const contentCheck = this.checkContent(event);
    if (!contentCheck.allowed) return contentCheck;

    // 5. Verificación de PoW (si es requerido)
    if (this.powRequired) {
      const pow = new ProofOfWork();
      if (!pow.verifyPoW(event, this.powRequired)) {
        return {
          allowed: false,
          reason: `pow: dificultad ${this.powRequired} requerida`
        };
      }
    }

    return { allowed: true };
  }
}
```

## 🎭 Firma Remota (NIP-46)

Nostr Connect permite a las aplicaciones solicitar firmas sin acceder a claves privadas:

```javascript
import { finalizeEvent, nip04, getPublicKey } from 'nostr-tools';

class NostrConnect {
  constructor(bunkerUrl) {
    this.bunkerUrl = bunkerUrl;
    this.clientSecret = generateSecretKey();
    this.clientPubkey = getPublicKey(this.clientSecret);
    this.remotePubkey = null;
    this.relay = null;
  }

  // Analizar URL del bunker
  parseBunkerUrl(url) {
    // bunker://<remote-signer-pubkey>?relay=<relay-url>&secret=<secret>
    const parsed = new URL(url);
    return {
      remotePubkey: parsed.hostname,
      relay: parsed.searchParams.get('relay'),
      secret: parsed.searchParams.get('secret')
    };
  }

  // Conectar a firmante remoto
  async connect() {
    const { remotePubkey, relay: relayUrl, secret } = this.parseBunkerUrl(this.bunkerUrl);
    
    this.remotePubkey = remotePubkey;
    this.relay = await Relay.connect(relayUrl);

    // Enviar solicitud de conexión
    const request = {
      id: this.generateId(),
      method: 'connect',
      params: [this.clientPubkey, secret]
    };

    const response = await this.sendRequest(request);
    
    if (response.result !== 'ack') {
      throw new Error('Conexión rechazada');
    }

    // Obtener clave pública del usuario
    const pubkeyResponse = await this.sendRequest({
      id: this.generateId(),
      method: 'get_public_key',
      params: []
    });

    this.userPubkey = pubkeyResponse.result;
    return this.userPubkey;
  }

  // Enviar solicitud cifrada
  async sendRequest(request) {
    const encrypted = await nip04.encrypt(
      this.clientSecret,
      this.remotePubkey,
      JSON.stringify(request)
    );

    const event = {
      kind: 24133,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', this.remotePubkey]],
      content: encrypted,
      pubkey: this.clientPubkey
    };

    const signed = finalizeEvent(event, this.clientSecret);
    await this.relay.publish(signed);

    // Esperar respuesta
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Tiempo de espera de solicitud agotado'));
      }, 30000);

      const sub = this.relay.subscribe([{
        kinds: [24133],
        '#p': [this.clientPubkey],
        authors: [this.remotePubkey]
      }]);

      sub.on('event', async (event) => {
        const decrypted = await nip04.decrypt(
          this.clientSecret,
          this.remotePubkey,
          event.content
        );
        
        const response = JSON.parse(decrypted);
        
        if (response.id === request.id) {
          clearTimeout(timeout);
          sub.unsub();
          resolve(response);
        }
      });
    });
  }

  // Firmar evento remotamente
  async signEvent(unsignedEvent) {
    const response = await this.sendRequest({
      id: this.generateId(),
      method: 'sign_event',
      params: [JSON.stringify(unsignedEvent)]
    });

    return JSON.parse(response.result);
  }

  generateId() {
    return Math.random().toString(36).substring(7);
  }
}

// Uso
const bunker = new NostrConnect('bunker://abc...?relay=wss://relay.com&secret=xyz');
await bunker.connect();

const unsignedEvent = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: '¡Firmado remotamente!'
};

const signedEvent = await bunker.signEvent(unsignedEvent);
```

## 🔒 Lista de Verificación de Seguridad Completa

### Seguridad de Aplicaciones

```markdown
## Lista de Verificación de Seguridad de Aplicaciones Cliente

### Gestión de Claves
- [ ] Nunca registrar o mostrar claves privadas
- [ ] Usar NIP-49 para cifrado de claves al almacenar
- [ ] Implementar derivación segura de claves (NIP-06)
- [ ] Ofrecer soporte para hardware wallet (NIP-46)
- [ ] Poner a cero material de claves después del uso
- [ ] Usar generación de números aleatorios seguros

### Cifrado
- [ ] Usar NIP-44 para todo cifrado nuevo (nunca NIP-04)
- [ ] Implementar gift wrapping para DMs (NIP-17)
- [ ] Verificar cifrado antes de enviar datos sensibles
- [ ] Manejar errores de descifrado elegantemente
- [ ] Limpiar contenido descifrado de memoria cuando termine

### Autenticación
- [ ] Implementar NIP-42 para autenticación de relay
- [ ] Usar NIP-98 para autenticación de API HTTP
- [ ] Validar todos los eventos entrantes
- [ ] Verificar firmas antes de procesar
- [ ] Verificar marcas de tiempo de eventos para razonabilidad

### Seguridad de Red
- [ ] Usar WSS (WebSocket Secure) para conexiones de relay
- [ ] Implementar tiempos de espera de conexión
- [ ] Validar URLs de relay antes de conectar
- [ ] Manejar errores de conexión elegantemente
- [ ] Implementar retroceso exponencial para reconexión

### Seguridad de Contenido
- [ ] Sanitizar toda entrada de usuario
- [ ] Validar contenido de evento antes de mostrar
- [ ] Implementar opciones de filtrado de contenido
- [ ] Verificar enlaces maliciosos
- [ ] Escapar HTML en contenido de usuario

### Privacidad
- [ ] Aleatorizar marcas de tiempo para mensajes privados (NIP-17)
- [ ] Usar múltiples relays para reducir filtración de metadatos
- [ ] Implementar caché local para reducir consultas a relay
- [ ] Ofrecer soporte para Tor/proxy
- [ ] Minimizar metadatos innecesarios

### Anti-Spam
- [ ] Implementar limitación de velocidad
- [ ] Soportar requisitos de PoW (NIP-13)
- [ ] Ofrecer filtrado de contenido
- [ ] Implementar funcionalidad de silenciar/bloquear
- [ ] Soportar moderación basada en relay
```

### Seguridad de Relay

```markdown
## Lista de Verificación de Seguridad de Relay

### Control de Acceso
- [ ] Implementar autenticación NIP-42
- [ ] Soportar limitación de velocidad basada en IP
- [ ] Implementar limitación de velocidad basada en pubkey
- [ ] Soportar lista negra/lista blanca
- [ ] Implementar requisitos de PoW (NIP-13)

### Protección de Datos
- [ ] Usar TLS/SSL para todas las conexiones
- [ ] Cifrar base de datos en reposo
- [ ] Implementar procedimientos de respaldo
- [ ] Eliminación segura para contenido privado (NIP-70)
- [ ] Manejar etiquetas de expiración (NIP-40)

### Monitoreo
- [ ] Registrar intentos de autenticación
- [ ] Monitorear patrones de abuso
- [ ] Rastrear uso de recursos por cliente
- [ ] Implementar alertas para anomalías
- [ ] Auditorías de seguridad regulares

### Operaciones
- [ ] Mantener software actualizado
- [ ] Usar configuración segura
- [ ] Implementar CORS apropiadamente
- [ ] Manejar errores de forma segura
- [ ] Respaldos regulares
```

## 🚨 Vectores de Ataque Comunes

### 1. Compromiso de Clave Privada

**Ataque**: El atacante obtiene la clave privada del usuario

**Prevención**:
- Nunca almacenar claves en texto plano
- Usar cifrado NIP-49
- Soportar hardware wallets
- Implementar rotación de claves (aún no estandarizado)

**Mitigación**:
- Transmitir evento de compromiso de clave (kind 62)
- Educar a usuarios sobre higiene de claves
- Monitorear actividad sospechosa

### 2. Espionaje de Relay

**Ataque**: Relay malicioso recopila metadatos

**Prevención**:
- Usar gift wrapping (NIP-17) para contenido privado
- Aleatorizar marcas de tiempo
- Usar múltiples relays
- Considerar Tor para comunicaciones sensibles

### 3. Hombre en el Medio

**Ataque**: Atacante intercepta conexiones de relay

**Prevención**:
- Siempre usar WSS (WebSockets seguros)
- Verificar firmas de eventos
- Fijar certificados de relay (avanzado)

### 4. Spam y DoS

**Ataque**: Inundar relay con eventos

**Prevención**:
- Implementar requisitos de PoW (NIP-13)
- Limitación de velocidad
- Filtrado de contenido
- Requisitos de autenticación

### 5. Ingeniería Social

**Ataque**: Engañar a usuarios para revelar claves

**Prevención**:
- Educación de usuario
- Advertencias de seguridad claras
- Nunca pedir claves en la aplicación
- Detección de phishing

## 📚 Ejercicios Prácticos

### Ejercicio 1: Almacenamiento Seguro de Claves

Construye un sistema de gestión de claves que:
1. Genere claves de forma segura
2. Cifre con NIP-49
3. Almacene en IndexedDB del navegador
4. Soporte exportación de claves
5. Implemente requisitos de contraseña

### Ejercicio 2: Mensajería Privada

Crea una aplicación de mensajería privada:
1. Implemente cifrado NIP-44
2. Use gift wrapping (NIP-17)
3. Soporte múltiples destinatarios
4. Maneje rotación de claves
5. Implemente recibos de lectura de forma segura

### Ejercicio 3: Relay Seguro

Construye un relay con:
1. Autenticación NIP-42
2. Limitación de velocidad
3. Requisitos de PoW
4. Filtrado de contenido
5. Reporte de abuso

### Ejercicio 4: Herramienta de Auditoría de Seguridad

Crea una herramienta que:
1. Escanee eventos en busca de problemas de seguridad
2. Verifique implementaciones de cifrado
3. Valide firmas
4. Pruebe seguridad de relay
5. Genere informes de seguridad

## 🔗 Recursos Adicionales

- [Informe de Auditoría NIP-44](https://cure53.de/audit-report_nip44-implementations.pdf)
- [Especificación NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md)
- [Mejores Prácticas de Seguridad de Nostr](https://github.com/nostr-protocol/nips/blob/master/SECURITY.md)
- [Hoja de Trucos de Almacenamiento Criptográfico OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

## 📝 Resumen

En este módulo, aprendiste:

- ✅ Cifrado moderno con NIP-44
- ✅ Mensajería privada con gift wrapping (NIP-17)
- ✅ Almacenamiento seguro de claves con NIP-49
- ✅ Mecanismos de autenticación (NIP-42, NIP-98)
- ✅ Técnicas anti-spam (NIP-13)
- ✅ Firma remota con NIP-46
- ✅ Vectores de ataque comunes y mitigaciones
- ✅ Mejores prácticas de seguridad para aplicaciones Nostr

La seguridad y privacidad en Nostr requieren atención cuidadosa a detalles criptográficos e implementación adecuada de NIPs. Mantente siempre actualizado con las últimas recomendaciones de seguridad y audita tu código regularmente.

## Próximos Pasos

- Revisa [Llaves sin cuentas en la nube](../getting-started/keys-without-accounts.md) y la [guía de campo](../getting-started/high-risk-users.md)
- Construye una aplicación segura usando estos principios
- Contribuye a la investigación de seguridad de Nostr
- Mantente actualizado sobre nuevos NIPs de seguridad

---

[← Módulo Anterior](module-08-scaling-performance.md) | [Índice de Módulos](index.md)
