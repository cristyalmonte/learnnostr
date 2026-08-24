---
template: home.html
title: LearnNostr - Aprende el protocolo social descentralizado
hide:
  - toc
  - navigation
  - feedback
---

# ¿Por qué LearnNostr?

<div class="grid cards" markdown>

-   :material-account-key:{ .lg .middle } __Identidad Digital Verdadera__

    ---

    Posee tu identidad con llaves criptográficas. Ninguna autoridad central puede eliminar tu cuenta, censurar tu contenido o controlar tu presencia digital.

    [:octicons-arrow-right-24: Aprende sobre las Llaves](concepts/keys.md)

-   :material-network:{ .lg .middle } __Resistente a la Censura__

    ---

    Construido sobre una red descentralizada de relés que ninguna entidad singular controla. Tu voz no puede ser silenciada por corporaciones o gobiernos.

    [:octicons-arrow-right-24: Comenzar](getting-started/what-is-nostr.md)

-   :material-lightning-bolt:{ .lg .middle } __Integración Lightning__

    ---

    Pagos Bitcoin sin fricciones a través de la integración con Lightning Network. Envía y recibe valor instantáneamente a través del protocolo.

    [:octicons-arrow-right-24: Construir Aplicaciones](tutorials/simple-client.md)

</div>

!!! danger "Para periodistas, organizadores y personas en riesgo"
    Nuevo: escenarios prácticos, sin código, para crear una identidad separada, publicar sin una cuenta a nombre real y entender lo que Nostr *no* oculta.

    [Abrir la guía para usuarios en alto riesgo →](getting-started/high-risk-users.md)

<style>
/* Hero section styling */
.hero {
    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
    margin: -2rem -2rem 2rem -2rem;
    border-radius: 0 0 1rem 1rem;
}

.hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
}

.hero-button {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    display: inline-block;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.hero-button:hover {
    background: rgba(255,255,255,0.3);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

/* Learning Path Header */
.learning-path-header {
    text-align: center;
    padding: 1rem 0;
    margin: -1.5rem 0 1rem;  /* Increased negative top margin to pull it much higher */
}

.learning-path-header h1 {
    font-size: 1.8rem;
    margin: 0 0 0.5rem;
    color: #9C27B0;
    font-weight: 700;
}

.learning-path-header p {
    font-size: 0.9rem;
    color: var(--md-default-fg-color--light);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.4;
}

/* Reduce spacing around horizontal rules */
hr {
    margin: 1rem 0 !important;
}

/* Target the area right before Learning Path to reduce spacing */
.learning-path-header + * {
    margin-top: 0.5rem;
}

/* Reduce spacing after the feature cards section */
.grid.cards {
    margin-bottom: 1rem !important;
}

/* Learning Path Grid - Compact Responsive Design */
.learning-path-grid {
    display: grid;
    gap: 0.75rem;
    margin: 1rem 0;
    /* Default: 2x2 grid for large screens */
    grid-template-columns: repeat(2, 1fr);
}

/* Tablet layout: 2x2 grid maintained */
@media screen and (max-width: 76rem) and (min-width: 60rem) {
    .learning-path-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

/* Small tablet layout: 2x2 grid maintained */
@media screen and (max-width: 59.9375rem) and (min-width: 48rem) {
    .learning-path-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

/* Mobile layout: single column */
@media screen and (max-width: 47.9375rem) {
    .learning-path-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}

/* Learning Path Cards - More Compact */
.learning-path-grid .card {
    background: var(--md-default-bg-color);
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    position: relative;
    overflow: hidden;
}

.learning-path-grid .card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.12);
    border-color: #9C27B0;
}

.learning-path-grid .card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #9C27B0, #7B1FA2);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.learning-path-grid .card:hover:before {
    opacity: 1;
}

.learning-path-grid .card h3 {
    color: #9C27B0;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.learning-path-grid .card p {
    margin-bottom: 0.75rem;
    line-height: 1.4;
    font-size: 0.85rem;
}

.learning-path-grid .card ul {
    margin: 0.5rem 0 0.75rem;
    padding-left: 1rem;
}

.learning-path-grid .card li {
    margin-bottom: 0.15rem;
    color: var(--md-default-fg-color--light);
    font-size: 0.8rem;
}

.learning-path-grid .card .md-button {
    background: #9C27B0;
    color: white;
    border-radius: 4px;
    padding: 0.3rem 0.7rem;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
    transition: all 0.2s ease;
    font-size: 0.8rem;
}

.learning-path-grid .card .md-button:hover {
    background: #7B1FA2;
    transform: translateX(2px);
}

/* General grid cards (for other sections) - keep existing responsive behavior */
.grid.cards:not(.learning-path-grid) {
    display: grid;
    gap: 2rem;
    margin: 2rem 0;
}

@media screen and (min-width: 76rem) {
    .grid.cards:not(.learning-path-grid) {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (min-width: 60rem) and (max-width: 75.9375rem) {
    .grid.cards:not(.learning-path-grid) {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (max-width: 59.9375rem) {
    .grid.cards:not(.learning-path-grid) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
</style>

<div class="learning-path-header" markdown>
# 🎯 Ruta de Aprendizaje
**Domina Nostr en 4 Pasos Progresivos** — Desde entender los conceptos básicos hasta construir tus propias aplicaciones, esta ruta de aprendizaje guiada te llevará de principiante a desarrollador.

</div>

<div class="learning-path-grid" markdown>

<div class="card" markdown>

:material-school:{ .lg .middle } **Comienza Aquí: Fundamentos del Protocolo**

---
**¿Nuevo en Nostr?** Comienza con lo básico. Aprende qué hace a Nostr diferente de las plataformas sociales tradicionales y entiende los conceptos centrales que impulsan este protocolo descentralizado.

**Lo que aprenderás:**

• Arquitectura y principios de diseño del protocolo  
• Descentralización vs. plataformas centralizadas  
• Terminología y conceptos básicos

[:octicons-arrow-right-24: Comenzar a Aprender](getting-started/what-is-nostr.md){ .md-button }

</div>

<div class="card" markdown>

:material-key-variant:{ .lg .middle } **Domina: Identidad y Seguridad**

---

**Habilidades Esenciales.** Profundiza en las llaves criptográficas, firmas digitales y gestión de identidad. Estos conceptos son fundamentales para todo lo que construirás en Nostr.

**Lo que aprenderás:**

• Criptografía de llaves públicas/privadas  
• Identidad digital y firmas  
• Mejores prácticas de seguridad

[:octicons-arrow-right-24: Dominar Llaves](concepts/keys.md){ .md-button }

</div>

<div class="card" markdown>

:material-code-tags:{ .lg .middle } **Construye: Tu Primera Aplicación**

---

**Desarrollo Práctico.** Lleva la teoría a la práctica construyendo aplicaciones Nostr reales. Aprende a conectarte a relés, publicar eventos y crear experiencias interactivas.

**Lo que construirás:**

• Cliente Nostr simple  
• Sistema de publicación de eventos  
• Comunicación con relés

[:octicons-arrow-right-24: Comenzar a Construir](tutorials/simple-client.md){ .md-button }

</div>

<div class="card" markdown>

:material-library:{ .lg .middle } **Referencia: Definiciones Completas**

---

**Recursos de Profundización.** Accede a definiciones y explicaciones completas de todos los conceptos, protocolos y especificaciones técnicas de Nostr en una ubicación organizada.

**Lo que encontrarás:**

• Definiciones técnicas y explicaciones  
• Especificaciones del protocolo (NIPs)  
• Herramientas y librerías de desarrollo

[:octicons-arrow-right-24: Explorar Definiciones](definitions.md){ .md-button }

</div>

</div>

## Ejemplo de Código

Aquí te mostramos cómo publicar tu primer evento en la red Nostr:

=== "JavaScript"

    ```javascript
    import { generatePrivateKey, getPublicKey, finishEvent, relayInit } from 'nostr-tools'

    // Genera tu identidad
    const sk = generatePrivateKey()
    const pk = getPublicKey(sk)

    // Crea un evento
    const event = finishEvent({
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: '¡Hola Nostr!',
    }, sk)

    // Publica en el relé
    const relay = relayInit('wss://relay.damus.io')
    await relay.connect()
    await relay.publish(event)
    ```

=== "Python"

    ```python
    from nostr.key import PrivateKey
    from nostr.event import Event
    from nostr.relay_manager import RelayManager
    import time

    # Genera identidad
    private_key = PrivateKey()
    public_key = private_key.public_key

    # Crea evento
    event = Event(
        kind=1,
        content="¡Hola Nostr!",
        created_at=int(time.time())
    )
    private_key.sign_event(event)

    # Publica evento
    relay_manager = RelayManager()
    relay_manager.add_relay("wss://relay.damus.io")
    relay_manager.publish_event(event)
    ```

=== "Rust"

    ```rust
    use nostr_sdk::prelude::*;

    #[tokio::main]
    async fn main() -> Result<()> {
        // Genera llaves
        let keys = Keys::generate();

        // Conecta al relé
        let client = Client::new(&keys);
        client.add_relay("wss://relay.damus.io", None).await?;
        client.connect().await;

        // Publica evento
        let event = EventBuilder::new_text_note("¡Hola Nostr!", &[])
            .to_event(&keys)?;
        
        client.send_event(event).await?;
        Ok(())
    }
    ```
