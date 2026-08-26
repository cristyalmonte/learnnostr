# Tu primera hora en Nostr

!!! info "Para quién es esto"
    No hace falta escribir código. Necesitas una forma de **publicar y leer sin crear una cuenta de una empresa**.

    Al terminar esta hora deberías tener:

    - Una **llave nueva** que nunca vivió en un gestor de contraseñas en la nube que no elegiste
    - Una **copia en papel** del secreto (`nsec`)
    - Un cliente que **no exige número de teléfono**
    - Notas escritas en **más de un relé**
    - Prueba de que un **segundo dispositivo o navegador** puede ver la nota

    Si eres periodista, organizador/a o enfrentas vigilancia dirigida, lee esta página y sigue con la [guía de campo](high-risk-users.md).

!!! warning "Nostr no es anónimo por defecto"
    Los relés ven tu **IP** salvo que conectes Tor o una VPN de confianza **antes** de abrir el cliente. Las notas son **públicas**. **No hay restablecer contraseña**.

---

## 0. Una frase antes de instalar nada

Escríbela en papel:

> ¿Quién podría intentar silenciarme o desenmascararme, y qué pasa si lo logra?

Esa frase decide si usas el teléfono de todos los días, un perfil de navegador dedicado o una llave desechable. Una cuenta de hobby y una identidad de cobertura son trabajos distintos. No las mezcles.

---

## 1. Primero la red, después la app

El orden importa:

1. Conecta **Tor** (mejor para el anonimato) o una VPN que no hayas pagado con una tarjeta a tu nombre.
2. Abre un **perfil de navegador nuevo** o un usuario del teléfono que **no** esté logueado en Google, Apple o una cuenta de trabajo.
3. Solo entonces instala o abre un cliente Nostr.

!!! danger "No pegues un `nsec` en un sitio web"
    Si una página te pide “iniciar sesión” pegando la llave secreta, sal. Usa un [firmante](keys-without-accounts.md#firmantes-el-secreto-no-entra-al-sitio) (NIP-07 en el navegador, o un firmante Android como Amber) para que el sitio **nunca** tenga la llave.

---

## 2. Elige un cliente (puntos de partida, no avales)

Los clientes cambian rápido. Verifica el publicador. Ninguno de estos exige teléfono.

| Tienes | Empieza con | Guarda la llave en |
|--------|-------------|--------------------|
| iPhone | Damus o Primal desde el listado oficial de App Store | La app (un dispositivo dedicado es más seguro) |
| Android | Amethyst o Primal desde F-Droid / el sitio del proyecto — **no** un APK cualquiera | La app, o Amber para que otras apps no vean el `nsec` |
| Portátil | Coracle o Snort **más** una extensión NIP-07 (nos2x, Alby u otra) | La extensión, nunca el sitio |

Revisa permisos después de cada actualización. Un cliente es una ventana a los relés. **No** es tu cuenta.

---

## 3. Crea la llave en este dispositivo

1. Usa **Generar** / **Crear cuenta** en el cliente o firmante. Hazlo **en un entorno que controles**: no generes un secreto en un “generador de llaves” cualquiera en la web.
2. Verás dos cadenas:

    | Cadena | Prefijo | ¿Se comparte? |
    |--------|---------|----------------|
    | Llave pública | `npub1…` | Sí. Es tu dirección. |
    | Llave secreta | `nsec1…` | **Nunca.** *Es* la cuenta. |

3. Escribe el `nsec` en **papel** (dos copias, dos sitios si la identidad debe durar). No hagas captura. No te lo envíes por WhatsApp, Signal, Notas de iCloud ni correo.
4. Confirma que puedes **restaurar** desde ese papel en un segundo perfil **antes** de publicar algo que importe.

No hay soporte al cliente. [NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md) solo codifica llaves para humanos (`npub` / `nsec`). El protocolo usa hex. Perder el `nsec` es perder esa identidad.

---

## 4. Relés: escribe en varios, lee de varios

Un relé es un servidor que guarda eventos JSON. Cualquiera puede operar uno. **Un operador no es la red.**

En el cliente, añade **al menos tres** relés de escritura en **más de un país** si puedes. Después:

- Publica una nota de prueba **aburrida**: `learnnostr primera-hora` — sin ciudad, trabajo ni selfie.
- Abre un **segundo** cliente (biblioteca, teléfono de alguien de confianza, o una ventana privada con otro cliente) y busca tu `npub`.
- Si la nota no aparece, ese relé la tiró o nunca la guardó. Es normal. Añade otro relé y publica de nuevo. El **mismo evento firmado** se puede enviar a muchos relés; no pueden falsificarlo, pero sí rechazarlo.

Cómo elegir e inspeccionar relés: [Elegir relés](choose-relays.md).

---

## 5. Perfil: un rol, no un pasaporte

Tu perfil es un evento `kind 0` ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)): un JSON firmado con nombre, texto y URL de imagen. Es **público** y **reemplazable**.

Para la primera hora usa:

- Un nombre genérico (`Notas de campo`, `Actualizaciones cívicas`)
- Sin foto de tu cara
- Sin sitio web, dirección NIP-05 ni Lightning

Eso puedes añadirlo después en una identidad **pública** a la que pondrás tu nombre. No lo pongas en un compartimento que deba quedar sin nombre. Detalles: [Llaves sin cuentas en la nube](keys-without-accounts.md).

---

## Práctica: termina esta lista

!!! example "Ejercicio de la primera hora"

    Hazlo en orden. Márcalo en papel.

    - [ ] Frase de amenaza escrita
    - [ ] Tor o VPN **antes** del cliente
    - [ ] Perfil de navegador o usuario de teléfono nuevo
    - [ ] Cliente instalado desde un listado oficial
    - [ ] Llave nueva generada en este dispositivo
    - [ ] `nsec` en papel; restauración comprobada
    - [ ] Al menos tres relés
    - [ ] Nota de prueba publicada (sin datos identificables)
    - [ ] La misma nota visible desde un **segundo** cliente o dispositivo
    - [ ] El perfil no tiene nombre real, NIP-05 ni Lightning con KYC

---

## Lo que acabas de demostrar

1. **Puedes tener identidad sin una empresa.** Sin correo, sin SMS.
2. **Una tienda de apps o un solo relé no puede borrarte en todo el mundo.** Las copias viven donde las enviaste.
3. **El secreto es la cuenta.** Un “respaldo en la nube” del `nsec` es entregarle la cuenta a otro.

Eso es el caso de uso de HRF en la práctica: identidad seudónima y publicación que no depende de que una plataforma siga siendo amable.

---

## Siguiente

<div class="grid cards" markdown>

-   **Llaves sin cuentas en la nube**

    ---

    Cómo funcionan `nsec` / `npub`, firmantes, respaldos y cómo la gente se desenmascara.

    [Leer →](keys-without-accounts.md)

-   **Elegir relés**

    ---

    Qué ve un operador, cómo inspeccionar un relé y por qué escribes en más de uno.

    [Leer →](choose-relays.md)

-   **Guía de campo**

    ---

    Periodistas, organizadores, fuentes y listas de incidente.

    [Leer →](high-risk-users.md)

</div>
