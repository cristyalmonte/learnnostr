# Aprende IA privada

!!! info "Para quién es este camino"
    Necesitas usar IA **sin entregar prompts, documentos o tu nombre** a OpenAI, Google, Anthropic o al ISP que ve esos hosts HTTPS.

    Esto es educación en LearnNostr — no es el producto de Maple, Routstr, Ollama ni de nadie más. Enlazamos **su documentación actual** y damos laboratorios para copiar y pegar. No rehospedamos su software.

    Cuatro laboratorios. Hazlos en orden. Primero local; remoto de pago solo cuando lo local no alcance.

!!! warning "La IA no protege fuentes por sí sola"
    Un modelo en tu portátil igual **escribe texto**. Si lo pegas en un relé, la nota es pública. Si pegas el nombre de una fuente en *cualquier* API remota, ese operador (o su upstream) puede guardarlo. Combina este camino con [Tu primera hora](../getting-started/first-session.md) y la [guía de campo](../getting-started/high-risk-users.md).

---

## Por qué existe

Los chats en la nube son cómodos porque son **cuentas**: correo, teléfono, tarjeta, un registro de cada prompt. Para quien vive bajo censura ese registro es prueba.

El trabajo de HRF sobre IA para derechos individuales trata del **control de la inferencia** — la misma soberanía que este sitio ya enseña para identidad y publicación. Esta pista es el artefacto de esa solicitud: un camino corto que una periodista o un organizador puede terminar.

## Los cuatro laboratorios

<div class="grid cards" markdown>

-   **1. La IA en la nube es vigilancia**

    ---

    Qué no teclear, quién lo registra, pagos KYC y jurisdicción.

    [Empezar →](cloud-surveillance.md)

-   **2. Corre un modelo en local**

    ---

    Instala Ollama, deja los pesos en disco, termina una reescritura **sin red**.

    [Lab →](run-local.md)

-   **3. Cuando lo local no alcanza**

    ---

    Maple (TEE + atestación) y Routstr (descubrimiento Nostr + Cashu) — como lo describen sus docs, incluido lo que **no** ocultan.

    [Lab →](maple-routstr.md)

-   **4. Publica sin filtrar el prompt**

    ---

    Cómo interactúan llaves Nostr, relés y consultas de IA. Ejemplo: sanitiza en local y publica solo la nota pública.

    [Lab →](publish-without-leaking.md)

</div>

## Regla de decisión (en papel)

| Situación | Por defecto |
|-----------|-------------|
| Borrador, traducción o reescritura **sensible** | Modelo de pesos abiertos **local** ([lab 2](run-local.md)) |
| Necesitas un modelo más capaz, aún sin plaintext a OpenAI/Google/Anthropic | Camino TEE documentado de Maple ([lab 3](maple-routstr.md)) |
| Pago por petición sin tarjeta | Cashu documentado de Routstr — **lee primero la advertencia sobre el prompt** |
| Algo que no pondrías en un `kind 1` | No lo pegues en una API remota |

---

## Siguiente

Empieza por [por qué la IA en la nube es un riesgo de vigilancia](cloud-surveillance.md). Si ya lo sabes y tu máquina corre un modelo pequeño, pasa a [correr en local](run-local.md).
