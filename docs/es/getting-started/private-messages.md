# Mensajes privados

!!! info "Objetivos de aprendizaje"
    Al terminar podrás:

    - Tratar las **notas públicas** (`kind 1`) como públicas, para siempre
    - Explicar por qué los DM heredados ([NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md)) filtran **quién habló con quién**
    - Usar **DM privados** ([NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md)) solo en un cliente que de verdad los implemente
    - Publicar una **lista de relés de bandeja** (`kind 10050`) — y entender que **sin lista significa “no listo para recibir”**
    - Presentar fuentes **fuera de banda**, nunca siguiéndolas en público

    Quienes programan y necesitan el interior del cifrado: [Módulo 9](../modules/module-09-security.md) (NIP-44, gift wrap).

!!! warning "Cifrado no es lo mismo que sin nombre"
    El gift wrap oculta gran parte del grafo **público**. No oculta tu IP al relé de bandeja. No impide que una fuente se delate zappeándote desde su npub real. No gana a un teléfono incautado que aún tiene la llave.

---

## Público por defecto

Si lo escribes en el compositor principal, es un evento `kind 1`. Los relés lo guardan. Los buscadores lo indexan. Asume que una fiscalía, un empleador o una cuenta de capturas lo tiene.

Usa notas públicas para **hechos que puedes respaldar** o para una prueba desechable. Usa otro canal para cualquier cosa que queme a una persona.

---

## NIP-04 vs NIP-17 (en claro)

La lista de NIP marca NIP-04 como **no recomendado**, reemplazado por NIP-17.

| | NIP-04 (DM legado) | NIP-17 (DM privado) |
|--|--------------------|---------------------|
| Evento que ves en relés | `kind 4`, tu pubkey, la de la otra persona en etiquetas | `kind 1059` gift wrap, llave envoltorio **aleatoria** |
| Contenido | Cifrado (esquema viejo, sin autenticación) | [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md) dentro de un sello y wrap [NIP-59](https://github.com/nostr-protocol/nips/blob/master/59.md) |
| Quién habló con quién | **Visible** | Oculto del firehose público |
| Cuándo | `created_at` es la hora real | Los timestamps de sello y wrap se **aleatorizan hasta dos días atrás** |
| Si el cliente es vago | Asume NIP-04 | Confirma que dice NIP-17 / gift wrap |

Los mensajes de chat NIP-17 son **rumores** sin firmar de `kind 14` (texto) o `kind 15` (archivos). Se sellan como `kind 13` (firmado por quien envía) y se envuelven como `kind 1059` (firmado por una **llave aleatoria nueva** por wrap). Los clientes **deben** comprobar que la pubkey del sello coincide con la del rumor; si no, cualquiera podría hacerse pasar por cualquiera.

Envías un wrap **a cada destinatario y a ti** para poder leer el hilo después en otro dispositivo.

### Relés de bandeja (`kind 10050`)

NIP-17 dice que los clientes **DEBEN** publicar gift wraps solo en los relés de la lista `kind 10050` de quien recibe:

```json
{
  "kind": 10050,
  "tags": [
    ["relay", "wss://inbox.nostr.wine"],
    ["relay", "wss://myrelay.nostr1.com"]
  ],
  "content": ""
}
```

Mantén esa lista **pequeña** (1–3). Si alguien **no** tiene `kind 10050`, **no está listo para recibir** mensajes NIP-17. No le inventes un buzón.

Los relés **DEBERÍAN** servir `kind 1059` solo a la persona etiquetada en `p`, usando AUTH de [NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md). No todos lo hacen. Prefiere bandejas que lo documenten.

---

## Práctica: consulta relés de bandeja antes de un DM

Esto **no** envía un mensaje. Solo trae un `kind 10050` público (o muestra que no existe).

=== "JavaScript (nostr-tools)"

    ```javascript
    import { nip19 } from 'nostr-tools'
    import { SimplePool } from 'nostr-tools/pool'

    const npub = 'npub1…' // pega un npub público al que tienes motivo de escribir
    const pk = nip19.decode(npub).data

    const relays = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://purplepag.es']
    const pool = new SimplePool()
    const events = await pool.querySync(relays, {
      kinds: [10050],
      authors: [pk],
      limit: 1,
    })
    pool.close(relays)

    if (!events.length) {
      console.log('No hay kind 10050 — esta persona no está lista para DM NIP-17.')
    } else {
      const inboxes = events[0].tags
        .filter((t) => t[0] === 'relay')
        .map((t) => t[1])
      console.log('relés de bandeja:', inboxes)
    }
    ```

=== "CLI (nak)"

    ```bash
    nak req -k 10050 --limit 1 --author npub1… \
      wss://relay.damus.io wss://purplepag.es
    ```

Si estás construyendo un cliente, implementa wrap/unwrap desde NIP-17/NIP-59 con una librería que ya lo haga (ayudas NIP-59 de `nostr-tools`, APIs de gift wrap de `nostr-sdk`). No armes el cifrado a mano. Esta lección no pega un envoltorio completo: la especificación es exacta sobre llaves aleatorias, timestamps aleatorizados y sellar rumores **sin firmar**.

---

## Cómo se filtra el grafo igual

Aunque uses NIP-17:

- Tú o la otra persona se **siguen** en público (`kind 3`)
- La **mencionas** en un `kind 1`
- **Zappeas** desde una billetera KYC
- Envías un DM NIP-04 “solo esta vez”
- Ambos publican desde el Wi‑Fi del mismo café sin Tor
- Guardas su nombre en una lista **pública** (las listas `kind 30000` suelen ser públicas)

Para fuentes y organizadores, la [guía de campo](high-risk-users.md) es el documento operativo. Esta página es la razón de protocolo de esas reglas.

---

## Ejercicios

!!! example "Ejercicio 1 — público vs privado"
    Publica un `kind 1` desechable que diga `esto es público`. Tráelo con `nak req` desde un relé que no sueles usar. Ese es el control: todo lo que va al compositor principal es así de fácil de copiar.

!!! example "Ejercicio 2 — auditoría del cliente"
    Abre la pantalla de DM de tu cliente. Busca si documenta **NIP-17** (o “gift wrap”). Si solo dice “DM cifrados”, trátalo como NIP-04 hasta que se demuestre lo contrario. Anota el resultado en papel.

!!! example "Ejercicio 3 — lista de bandeja"
    Con una identidad desechable, publica `kind 10050` en 1–2 relés que inspeccionaste, **o** decide no recibir DM en absoluto. Luego consúltala desde una segunda máquina. Si no puedes traer tu propia lista de bandeja, tampoco puede quien envía y sigue la especificación.

!!! example "Ejercicio 4 — presentación fuera de banda"
    Escribe los pasos que usarías para dar a una fuente tu `npub` de campo **sin** publicar “escríbeme al DM” en una cuenta con tu nombre. (En persona, correo cifrado que ya exista, un QR impreso **solo** del `npub` — nunca el `nsec`.)

---

## Siguiente

- [Guía de campo](high-risk-users.md) — fuentes, organizadores, lista de incidente
- [Publicar y verificar](../tutorials/publish-and-verify.md) — notas públicas, límites del borrado
- [Módulo 9: Seguridad y privacidad](../modules/module-09-security.md) — NIP-44 e implementación
