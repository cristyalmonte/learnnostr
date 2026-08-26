# Llaves sin cuentas en la nube

!!! info "Objetivos de aprendizaje"
    Al terminar podrás:

    - Explicar por qué Nostr no tiene **usuario, teléfono ni restablecer contraseña**
    - Distinguir `nsec` de `npub` y dejar el secreto **fuera de sitios web y respaldos en la nube**
    - Usar un **firmante** para que un cliente web nunca tenga la llave ([NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md), [NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md))
    - Mantener **compartimentos**: llaves distintas para trabajo público y publicación sensible

    Fondo de protocolo (opcional): [Llaves](../concepts/keys.md) · [Módulo 2](../modules/module-02-keys-identity.md)

---

## La cuenta es un número que tú sostienes

La identidad Nostr es un par de llaves [secp256k1](https://bips.xyz/340), la misma curva que Bitcoin.

- La **llave secreta** firma eventos. Quien la tenga **es** tú.
- La **llave pública** es la dirección que otros siguen. No se puede volver al secreto con un ataque práctico.

No hay una base de datos de cuentas de una empresa. Los relés guardan **eventos firmados**, no inicios de sesión. Por eso un dictador, una tienda de apps o una red social no pueden “borrar tu cuenta” en todo el mundo — y por eso **nadie puede restaurarla** si pierdes el secreto.

### Lo que verás en un cliente

[NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) codifica llaves para humanos. Estos prefijos son **solo para mostrar**. En el protocolo, los eventos usan hex de 32 bytes.

| Ves | Significa | ¿Seguro compartir? |
|-----|-----------|-------------------|
| `npub1…` | Llave pública | Sí |
| `nsec1…` | Llave secreta | **No** |
| `note1…` | Id de evento | Sí (la nota ya es pública) |
| hex, 64 caracteres | Las mismas llaves/ids sin prefijo | Secreto si viene de un `nsec` |

Si una cadena empieza con `nsec`, trátala como una semilla de billetera cargada. Capturas, “mensajes guardados” y fotos de iCloud/Google de esa captura son **copias en la nube de la cuenta**.

---

## Genera en local — nunca en el formulario de otro

!!! success "Haz esto"
    Genera la llave **en el cliente o firmante que la va a usar**, en el dispositivo que la va a usar. Escribe el `nsec` en papel. Prueba restaurar.

!!! danger "No hagas esto"
    - Pegar `nsec` en Coracle, Snort u otro sitio
    - Generar una llave en una página cualquiera y confiar en que no guardó copia
    - Guardar `nsec` en Gmail, iCloud Keychain sincronizado a un teléfono incautado, o un gestor de contraseñas a tu nombre legal **si esta identidad debe quedar sin nombre**
    - Reusar una llave desde la que ya publicaste con tu nombre real

### Práctica: demuestra que tienes la llave (sin sitio web)

Esto usa [nak](https://github.com/fiatjaf/nak), una herramienta de línea de comandos. Usa una llave **desechable** — no la identidad que vas a conservar.

```bash
# Genera una llave de práctica. Imprime nsec / npub.
nak key generate
```

Puedes convertir formatos sin hablar con un relé:

```bash
# npub → llave pública hex (el resultado se puede compartir)
nak decode npub1exampleexampleexampleexampleexampleexampleexampleexamp
```

**No** pongas un `nsec` real en el historial del shell. Si debes firmar desde una terminal, pasa la llave desde un archivo con permisos cerrados y bórralo después.

---

## Firmantes: el secreto no entra al sitio

Un **firmante** es software que guarda el `nsec` y solo devuelve firmas.

### NIP-07 — extensión del navegador

Una extensión NIP-07 inyecta `window.nostr` en la página. La página puede pedir tu llave pública y pedirte que firmes. **No debe** recibir el secreto.

```javascript
// El sitio nunca ve el nsec. La extensión te pide aprobar.
if (!window.nostr) {
  throw new Error('Instala un firmante NIP-07 (nos2x, Alby, …)')
}

const pubkey = await window.nostr.getPublicKey() // hex, según NIP-07

const signed = await window.nostr.signEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Firmado sin entregar el nsec al sitio',
})

console.log(signed.id, signed.sig, signed.pubkey)
```

Si no hay `window.nostr`, el sitio te está pidiendo pegar una llave. Sal.

### NIP-46 — firmante remoto (“bunker”)

[NIP-46](https://github.com/nostr-protocol/nips/blob/master/46.md) deja que un cliente envíe `sign_event` a un firmante en otro dispositivo. El cliente guarda un par **desechable** solo para hablar con el bunker. La llave de firmar se queda en el bunker.

Verás cadenas `bunker://…` o `nostrconnect://…`. Pégalas **solo en el firmante que instalaste**, no en un chat con un desconocido.

### Firmantes en Android

En Android, una app firmante dedicada (Amber es el ejemplo habitual) puede aprobar firmas para otras apps para que esas apps nunca almacenen el `nsec`. Prefiere eso a teclear el `nsec` en cada cliente.

---

## Respaldos que no recrean una cuenta de empresa

| Método | Úsalo cuando | Riesgo |
|--------|--------------|--------|
| Papel, dos sitios | Por defecto para una identidad duradera | Fuego, robo, alguien fotografiando el papel |
| Placa de acero | Largo plazo, condiciones duras | Igual que el papel, más el lugar de guardado |
| Archivo cifrado **fuera de línea** | Ya usas bien un gestor de contraseñas | La cuenta del gestor puede estar a tu nombre legal |
| Dispositivo hardware | Identidad pública de alto valor | Costo, configuración; igual hay que respaldar la semilla |
| Captura en la nube | Nunca | Eso *es* entregarle la cuenta a Apple/Google |

Prueba restaurar **antes** de que la identidad importe. Si incautan el teléfono, asume que la llave que llevaba está quemada. Haz una llave **nueva**. No “cambies el nombre visible” de la vieja.

---

## Compartimentos (así se queda uno sin nombre)

Una persona, varias llaves:

| Llave | ¿Pública? | Trabajo |
|-------|-----------|---------|
| Cívica / firma | Sí | Trabajo que vas a respaldar con tu nombre |
| De campo / sensible | No | Cobertura, organización o habla que no debe apuntarte |
| Personal | Quizá | Amistades. Nunca la llave de campo |

Las listas de seguimiento (`kind 3`, [NIP-02](https://github.com/nostr-protocol/nips/blob/master/02.md)) son **públicas**. Seguir tu npub de firma desde el npub de campo **los enlaza**. También los zaps, las respuestas, las frases raras compartidas y un NIP-05 en un dominio tuyo.

Los perfiles (`kind 0`) son JSON público. Campos extra como `lud16` (dirección Lightning) e identificadores NIP-05 son comodidad **y** etiquetas de nombre. En un compartimento secreto, déjalos vacíos.

---

## Código: generar y codificar llaves tú

Úsalo solo en una máquina que controles. Estos fragmentos crean una llave **nueva** de práctica e imprimen el `npub` público. No publican nada.

=== "JavaScript (nostr-tools)"

    ```javascript
    import { generateSecretKey, getPublicKey } from 'nostr-tools'
    import { npubEncode, nsecEncode } from 'nostr-tools/nip19'

    const sk = generateSecretKey()           // Uint8Array, 32 bytes
    const pk = getPublicKey(sk)              // hex

    console.log('comparte esto:', npubEncode(pk))
    // Mantén nsecEncode(sk) fuera de la pantalla si alguien puede verla.
    ```

=== "Python (nostr-sdk)"

    ```python
    from nostr_sdk import Keys

    keys = Keys.generate()
    print("comparte esto:", keys.public_key().to_bech32())
    # keys.secret_key().to_bech32()  # nsec — no lo imprimas en una máquina compartida
    ```

=== "Rust (nostr-sdk)"

    ```rust
    use nostr_sdk::prelude::*;

    fn main() {
        let keys = Keys::generate();
        println!("comparte esto: {}", keys.public_key().to_bech32().unwrap());
        // keys.secret_key() es el nsec. No lo registres en logs.
    }
    ```

---

## Ejercicios

!!! example "Ejercicio A — simulacro de restauración"
    1. Genera una llave desechable en un firmante o cliente.
    2. Escribe el `nsec` en papel. Cierra la app / borra el perfil.
    3. Restaura solo desde el papel. Confirma que el `npub` coincide.
    4. Destruye la desechable (o guárdala como práctica, nunca como identidad real).

!!! example "Ejercicio B — rechaza la caja de pegar"
    1. Abre un cliente web en un perfil **nuevo**.
    2. Confirma que ofrece NIP-07 (o niégate a entrar).
    3. Si solo ofrece “pegar nsec”, cierra la pestaña.

!!! example "Ejercicio C — revisión de compartimento"
    En papel, lista cada lugar donde aparece el `npub` de campo (perfil, follows, Lightning, NIP-05, bio de GitHub, página de la redacción). Cada entrada es un enlace. Tacha lo que apunte a tu nombre legal.

---

## Siguiente

- [Tu primera hora](first-session.md) — si aún no publicaste una nota de prueba
- [Elegir relés](choose-relays.md) — a dónde van esas firmas
- [Guía de campo](high-risk-users.md) — periodistas, fuentes, organizadores
