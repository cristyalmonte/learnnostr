---
template: home.html
title: LearnNostr - Aprende el protocolo social descentralizado
hide:
  - toc
  - navigation
  - feedback
---

<!-- Material injects a nav-title heading unless the page already contains <h1 -->

Si una empresa o un gobierno puede bloquear la cuenta, bloquear el teléfono, leer el registro de prompts o borrar el post, este es el otro camino: **inferencia que tú controlas**, **llaves que tú sostienes**, **relés que cualquiera puede operar**.

<div class="grid cards" markdown>

-   :material-shield-lock:{ .lg .middle } **Aprende IA privada**

    ---

    Cuatro laboratorios: por qué el chat en la nube es prueba, corre un modelo sin red, Maple o Routstr cuando lo local no alcanza, publica sin filtrar el borrador.

    [Empezar el camino →](private-ai/index.md)

-   :material-account-key:{ .lg .middle } **Tus llaves, tu identidad**

    ---

    Tú tienes las llaves criptográficas. Ninguna empresa puede borrar tu cuenta ni hablar por ti.

    [Llaves sin cuentas en la nube →](getting-started/keys-without-accounts.md)

-   :material-network:{ .lg .middle } **Relés, no plataformas**

    ---

    Las notas viven en una red de servidores que cualquiera puede operar. Ningún operador es la red.

    [Elegir relés →](getting-started/choose-relays.md)

-   :material-shield-account:{ .lg .middle } **Publicar bajo presión**

    ---

    Identidad seudónima y publicación segura para quien no puede fiarse de una plataforma.

    [Primera hora →](getting-started/first-session.md)

</div>

## Ruta de aprendizaje

Tres caminos. El mismo sitio. IA privada es el principal si viniste a dejar los prompts fuera de OpenAI, Google y Anthropic. La pista Nostr bajo censura sigue siendo la puerta si viniste a publicar.

### Aprende IA privada

Laboratorios para copiar y pegar, para quien vive bajo censura. LearnNostr es el aula, no Maple, Routstr ni Ollama.

<div class="home-path" markdown>

1.  **La IA en la nube es vigilancia**  
    Qué no teclear. Registros, pagos KYC y jurisdicción.  
    [Empezar →](private-ai/cloud-surveillance.md)

2.  **Corre un modelo en local**  
    Instala Ollama, baja una etiqueta local, termina una reescritura real sin red.  
    [Lab →](private-ai/run-local.md)

3.  **Maple y Routstr**  
    Chat en TEE o Cashu + descubrimiento Nostr cuando lo local no alcanza — como lo describen sus docs.  
    [Lab →](private-ai/maple-routstr.md)

4.  **Publica sin filtrar**  
    Infiere en localhost. Edita a mano. Publica solo el párrafo público desde una clave de un solo uso.  
    [Lab →](private-ai/publish-without-leaking.md)

</div>

### Usa Nostr cuando una plataforma puede silenciarte

Pasos prácticos para identidad seudónima y publicación — el caso de uso que Human Rights Foundation financió para que este sitio enseñe.

<div class="home-path" markdown>

1.  **Primera hora**  
    Cliente, llaves en papel, tres relés, una nota de prueba que ves en un segundo dispositivo.  
    [Empezar →](getting-started/first-session.md)

2.  **Llaves sin cuentas en la nube**  
    `nsec` vs `npub`, firmantes para que los sitios no tengan el secreto, compartimentos.  
    [Leer →](getting-started/keys-without-accounts.md)

3.  **Elegir relés**  
    Qué registran los operadores, cómo inspeccionar NIP-11, por qué escribes en más de uno.  
    [Leer →](getting-started/choose-relays.md)

4.  **Guía de campo**  
    Periodistas, organizadores, fuentes y una lista de incidente.  
    [Leer →](getting-started/high-risk-users.md)

</div>

Talleres siguientes: [publicar y verificar una nota](tutorials/publish-and-verify.md) · [mensajes privados (NIP-17)](getting-started/private-messages.md)

### Construye sobre Nostr

Cuatro pasos cortos si quieres un cliente que funciona.

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

El mismo evento firmado, varios relés. Un rechazo en uno no es un baneo global.

=== "JavaScript"

    ```javascript
    import { generateSecretKey, finalizeEvent } from 'nostr-tools'
    import { SimplePool } from 'nostr-tools/pool'

    const sk = generateSecretKey()
    const event = finalizeEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '¡Hola Nostr!',
    }, sk)

    const relays = ['wss://relay.damus.io', 'wss://nos.lol']
    const pool = new SimplePool()
    await Promise.any(pool.publish(relays, event))
    pool.close(relays)
    ```

=== "Python"

    ```python
    import asyncio
    from nostr_sdk import Client, EventBuilder, Keys, NostrSigner

    async def main():
        keys = Keys.generate()
        client = Client(NostrSigner.keys(keys))
        await client.add_relay("wss://relay.damus.io")
        await client.add_relay("wss://nos.lol")
        await client.connect()
        await client.send_event_builder(EventBuilder.text_note("¡Hola Nostr!"))

    asyncio.run(main())
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        let keys = Keys::generate();
        let client = Client::builder().signer(keys).build();
        client.add_relay("wss://relay.damus.io").await?;
        client.add_relay("wss://nos.lol").await?;
        client.connect().await;
        client
            .send_event_builder(EventBuilder::text_note("¡Hola Nostr!"))
            .await?;
        Ok(())
    }
    ```
