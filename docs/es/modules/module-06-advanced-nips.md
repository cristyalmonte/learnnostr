# Módulo 6: NIPs Avanzados

!!! info "Visión General del Módulo"
    **Duración**: 5-6 horas  
    **Nivel**: Avanzado  
    **Prerrequisitos**: Módulos 1-5 completados  
    **Objetivo**: Implementar NIPs avanzados para funcionalidad extendida

## 📋 Objetivos de Aprendizaje

- ✅ Implementar NIP-04 (mensajes cifrados)
- ✅ Usar NIP-05 (verificación de identificadores)
- ✅ Implementar NIP-57 (Zaps/Lightning)
- ✅ Trabajar con NIP-23 (artículos de formato largo)
- ✅ Usar NIP-51 (listas)

## 🔐 NIP-04: Mensajes Directos Cifrados

```javascript
import { nip04 } from 'nostr-tools'

// Cifrar mensaje
async function sendDM(recipientPubkey, message, senderPrivkey) {
  const encrypted = await nip04.encrypt(senderPrivkey, recipientPubkey, message)
  
  const dmEvent = finishEvent({
    kind: 4,
    content: encrypted,
    tags: [['p', recipientPubkey]],
    created_at: Math.floor(Date.now() / 1000)
  }, senderPrivkey)
  
  return dmEvent
}

// Descifrar mensaje
async function receiveDM(event, recipientPrivkey) {
  const senderPubkey = event.pubkey
  const decrypted = await nip04.decrypt(recipientPrivkey, senderPubkey, event.content)
  return decrypted
}
```

## ✅ NIP-05: Verificación de Identificadores

```javascript
import { nip05 } from 'nostr-tools'

// Verificar identificador
async function verifyNIP05(nip05Address, pubkey) {
  try {
    const profile = await nip05.queryProfile(nip05Address)
    return profile.pubkey === pubkey
  } catch {
    return false
  }
}

// Ejemplo de uso
const isVerified = await verifyNIP05('alice@example.com', publicKey)
console.log(isVerified ? '✅ Verificado' : '❌ No verificado')
```

## ⚡ NIP-57: Zaps (Propinas Lightning)

```javascript
// Crear solicitud de Zap
function createZapRequest(recipientPubkey, amount, comment) {
  return finishEvent({
    kind: 9734,
    content: comment,
    tags: [
      ['p', recipientPubkey],
      ['amount', amount.toString()],
      ['relays', 'wss://relay.damus.io']
    ],
    created_at: Math.floor(Date.now() / 1000)
  }, privateKey)
}
```

## 📄 NIP-23: Artículos de Formato Largo

```javascript
// Crear artículo
const article = finishEvent({
  kind: 30023,
  content: `# Mi Artículo
  
Este es mi primer artículo en Nostr...`,
  tags: [
    ['d', 'mi-primer-articulo'],
    ['title', 'Mi Primer Artículo'],
    ['published_at', Math.floor(Date.now() / 1000).toString()],
    ['t', 'tutorial'],
    ['t', 'nostr']
  ],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)
```

## 📋 NIP-51: Listas

```javascript
// Lista de favoritos
const bookmarks = finishEvent({
  kind: 30001,
  content: '',
  tags: [
    ['d', 'bookmarks'],
    ['e', eventId1, 'wss://relay.damus.io'],
    ['e', eventId2, 'wss://nos.lol'],
    ['a', '30023:pubkey:article-id']
  ],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)

// Lista de silenciados
const mutelist = finishEvent({
  kind: 10000,
  content: '',
  tags: [
    ['p', pubkeyToMute1],
    ['p', pubkeyToMute2]
  ],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)
```

## 🎯 Ejercicios Prácticos

1. **Implementar mensajes cifrados**
2. **Agregar verificación NIP-05**
3. **Crear sistema de favoritos**
4. **Construir editor de artículos**

## 🎯 Evaluación del Módulo 6

- [ ] Mensajes directos cifrados funcionando
- [ ] Verificación NIP-05 implementada
- [ ] Sistema de listas funcional
- [ ] Soporte para artículos largos

---

[Continuar al Módulo 7: Relés en Producción →](module-07-production-relays.md)
