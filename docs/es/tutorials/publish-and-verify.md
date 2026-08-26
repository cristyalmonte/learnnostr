# Publicar y verificar una nota

!!! info "Qué vas a hacer"
    Esto es un **taller**, no una clase de protocolo. Vas a:

    1. Firmar una nota de texto `kind 1` ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) / [NIP-10](https://github.com/nostr-protocol/nips/blob/master/10.md))
    2. Enviar **el mismo evento** a más de un relé
    3. Traerlo de vuelta **sin fiarte de la UI del primer cliente**
    4. Ver qué hace una petición de borrado ([NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md)) — y qué **no** hace

    Usa una **llave desechable**. No practiques con una identidad que necesitas conservar.

!!! tip "Camino sin código"
    Si no quieres terminal, haz las secciones 1, 3 y 5 con dos clientes distintos (por ejemplo Damus y un cliente web con firmante NIP-07). La regla es la misma: **verifica desde una segunda ventana**.

---

## Por qué este es el simulacro de resistencia a la censura

Las plataformas hacen que publicar parezca un ida y vuelta con una empresa. En Nostr, publicar es “aquí hay un objeto JSON firmado; por favor guarda una copia”. Verificar es “¿los buzones **independientes** de verdad la guardaron?”

Hasta que lo hayas hecho una vez, “relés, no plataformas” es un eslogan.

---

## 1. Crea una nota aburrida

El contenido no debe identificarte: sin ciudad, trabajo, foto ni muletilla única.

Bien: `learnnostr taller — desechable`

El evento en el cable se ve así (campos de NIP-01):

```json
{
  "id": "<32-byte hex sha256 del evento serializado>",
  "pubkey": "<32-byte hex de la llave pública>",
  "created_at": 1710000000,
  "kind": 1,
  "tags": [],
  "content": "learnnostr taller — desechable",
  "sig": "<64-byte hex firma Schnorr de id>"
}
```

`id` es `sha256` del arreglo JSON UTF-8 `[0, pubkey, created_at, kind, tags, content]`. Relés y otros clientes lo recalculan. Si alguien muta `content`, la firma falla.

---

## 2. Publica desde código (opcional)

Cambia los relés de ejemplo si están caídos. Inspecciona [NIP-11](../getting-started/choose-relays.md#nip-11) primero.

=== "JavaScript (nostr-tools)"

    ```javascript
    import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools'
    import { npubEncode, noteEncode } from 'nostr-tools/nip19'
    import { SimplePool } from 'nostr-tools/pool'

    const sk = generateSecretKey()
    const pk = getPublicKey(sk)
    console.log('npub desechable:', npubEncode(pk))

    const event = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['t', 'learnnostr']],
      content: 'learnnostr taller — desechable',
    }, sk)

    if (!verifyEvent(event)) throw new Error('firma inválida')
    console.log('id de nota:', noteEncode(event.id))

    const relays = [
      'wss://relay.damus.io',
      'wss://nos.lol',
      'wss://relay.primal.net',
    ]

    const pool = new SimplePool()
    const pubs = pool.publish(relays, event)
    for (const [i, p] of pubs.entries()) {
      try {
        await p
        console.log('aceptado', relays[i])
      } catch (err) {
        console.log('rechazado', relays[i], err)
      }
    }
    ```

=== "Python (nostr-sdk)"

    ```python
    import asyncio
    from nostr_sdk import Client, EventBuilder, Keys, NostrSigner

    RELAYS = [
        "wss://relay.damus.io",
        "wss://nos.lol",
        "wss://relay.primal.net",
    ]

    async def main():
        keys = Keys.generate()
        print("npub desechable:", keys.public_key().to_bech32())

        client = Client(NostrSigner.keys(keys))
        for url in RELAYS:
            await client.add_relay(url)
        await client.connect()

        output = await client.send_event_builder(
            EventBuilder.text_note("learnnostr taller — desechable")
        )
        print("aceptados:", output.success)
        print("rechazados:", output.failed)

    asyncio.run(main())
    ```

=== "Rust (nostr-sdk)"

    ```rust
    use nostr_sdk::prelude::*;
    use std::time::Duration;

    #[tokio::main]
    async fn main() -> Result<()> {
        let keys = Keys::generate();
        println!("npub desechable: {}", keys.public_key().to_bech32()?);

        let client = Client::builder().signer(keys.clone()).build();
        for url in [
            "wss://relay.damus.io",
            "wss://nos.lol",
            "wss://relay.primal.net",
        ] {
            client.add_relay(url).await?;
        }
        client.connect().await;

        let output = client
            .send_event_builder(EventBuilder::text_note(
                "learnnostr taller — desechable",
            ))
            .await?;
        println!("id: {}", output.id().to_bech32()?);
        println!("aceptados: {:?}", output.success);
        println!("rechazados: {:?}", output.failed);

        let filter = Filter::new()
            .kind(Kind::TextNote)
            .author(keys.public_key())
            .limit(5);
        let events = client.fetch_events(filter, Duration::from_secs(10)).await?;
        println!("recuperadas {} notas", events.len());
        Ok(())
    }
    ```

=== "CLI (nak)"

    ```bash
    # Solo desechable. Evita poner nsec en la línea de comandos si puedes.
    nak event -k 1 --content "learnnostr taller — desechable" \
      wss://relay.damus.io wss://nos.lol
    ```

Si una versión de librería falla en `text_note` o `send_event_builder`, consulta el id publicado con `nak req` — ese camino no depende de los nombres del SDK.

---

## 3. Verifica desde un segundo buzón

**No** mires solo el cliente que acaba de decir “publicado”.

**Sin código:** abre otro cliente, pega el `npub`, confirma la nota.

**CLI:** consulta cada relé por separado para ver quién de verdad la guardó:

```bash
nak req -k 1 --limit 5 --author <npub-o-hex> wss://relay.damus.io
nak req -k 1 --limit 5 --author <npub-o-hex> wss://nos.lol
```

Un relé puede responder `["OK", "<id>", false, "blocked: …"]` o `rate-limited: …` (prefijos de [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Esa es la política de **ese** operador. Envía el mismo evento a otro lado.

**Web:** algunos buscadores indexan notas públicas. Úsalos solo con una llave desechable; son más observadores.

---

## 4. Republicar está permitido (y se espera)

Los eventos son inmutables. No “editas en el servidor”. Envías el **mismo** objeto firmado otra vez a relés nuevos. Los clientes que ya lo tienen deberían tratarlo como duplicado (`duplicate:` en un `OK` es éxito).

Si una jurisdicción bloquea un relé popular, tu trabajo es: **mantener copias en otros relés**, y dar a quien lee un `nevent` o `nprofile` con pistas de relé ([NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md)) cuando puedas.

---

## 5. “Borrar” es una petición (NIP-09)

Un evento `kind 5` pide a los relés tirar **tus** eventos listados en etiquetas `e` (o `a`). Los relés **DEBERÍAN** cumplir para eventos con la misma pubkey. **No están obligados**. Otros relés, archivos, capturas y clientes que ya bajaron la nota la conservan.

```javascript
import { finalizeEvent } from 'nostr-tools'

const deletion = finalizeEvent({
  kind: 5,
  created_at: Math.floor(Date.now() / 1000),
  tags: [
    ['e', eventIdHex],
    ['k', '1'],
  ],
  content: 'publicada para un taller; por favor elimínenla',
}, sk)
```

La etiqueta `k` la recomienda [NIP-09](https://github.com/nostr-protocol/nips/blob/master/09.md) para que el relé sepa el kind que se pide borrar.

!!! warning "Asume que las notas públicas son para siempre"
    Si el texto dañaría a una fuente en una captura, no lo publiques. El borrado no te va a salvar.

---

## Lista del taller

!!! example "El taller está completo cuando"

    - [ ] Llave desechable (no tu identidad real)
    - [ ] Nota publicada en **≥ 2** relés
    - [ ] Nota recuperada desde un **segundo** cliente o con `nak req` en un relé concreto
    - [ ] Anotaste qué relé aceptó y cuál rechazó
    - [ ] Sabes que NIP-09 es una petición, no un borrador
    - [ ] Desechaste o aislaste el `nsec` de práctica

---

## Siguiente

- [Mensajes privados](../getting-started/private-messages.md) — cuándo no ponerlo en `kind 1`
- [Construir un cliente simple](simple-client.md) — si quieres una UI alrededor de este ciclo
- [Guía de campo](../getting-started/high-risk-users.md)
