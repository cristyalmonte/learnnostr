---
template: home.html
title: LearnNostr - Aprende el protocolo social descentralizado
hide:
  - toc
  - navigation
  - feedback
  - title
---

<div class="grid cards" markdown>

-   :material-account-key:{ .lg .middle } **Tus llaves, tu identidad**

    ---

    Tú tienes las llaves criptográficas. Ninguna empresa puede borrar tu cuenta ni hablar por ti.

    [Llaves →](concepts/keys.md)

-   :material-network:{ .lg .middle } **Relés, no plataformas**

    ---

    Las notas viven en una red de servidores que cualquiera puede operar. Ningún operador es la red.

    [¿Qué es Nostr? →](getting-started/what-is-nostr.md)

-   :material-lightning-bolt:{ .lg .middle } **Bitcoin incluido**

    ---

    Los zaps de Lightning envían valor por el mismo protocolo que las notas y la identidad.

    [Construir un cliente →](tutorials/simple-client.md)

</div>

!!! info "Para periodistas, organizadores y personas en riesgo"
    Modelo de amenaza, protección de fuentes, relés, DM (NIP-04 vs NIP-17), zaps y lo que Nostr *no* oculta.

    [Abrir la guía de campo →](getting-started/high-risk-users.md)

## Ruta de aprendizaje

Cuatro pasos cortos, desde la primera nota hasta un cliente que funciona.

<div class="home-path" markdown>

1.  **¿Qué es Nostr?**  
    Cómo funciona el protocolo, y por qué no es una red social.  
    [Empezar →](getting-started/what-is-nostr.md)

2.  **Llaves e identidad**  
    Firmas, npubs y cómo tu cuenta sigue siendo tuya.  
    [Leer →](concepts/keys.md)

3.  **Construir un cliente**  
    Conéctate a un relé y publica un evento.  
    [Tutorial →](tutorials/simple-client.md)

4.  **Referencia**  
    Términos, NIPs y herramientas en un solo lugar.  
    [Explorar →](definitions.md)

</div>

## Publica una nota

=== "JavaScript"

    ```javascript
    import { generateSecretKey, getPublicKey, finalizeEvent, Relay } from 'nostr-tools'

    const sk = generateSecretKey()
    const pk = getPublicKey(sk)

    const event = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '¡Hola Nostr!',
    }, sk)

    const relay = await Relay.connect('wss://relay.damus.io')
    await relay.publish(event)
    ```

=== "Python"

    ```python
    from nostr.key import PrivateKey
    from nostr.event import Event
    from nostr.relay_manager import RelayManager
    import time

    private_key = PrivateKey()
    event = Event(kind=1, content="¡Hola Nostr!", created_at=int(time.time()))
    private_key.sign_event(event)

    relay_manager = RelayManager()
    relay_manager.add_relay("wss://relay.damus.io")
    relay_manager.publish_event(event)
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        let keys = Keys::generate();
        let client = Client::new(&keys);
        client.add_relay("wss://relay.damus.io").await?;
        client.connect().await;
        client.publish_text_note("¡Hola Nostr!", []).await?;
        Ok(())
    }
    ```
