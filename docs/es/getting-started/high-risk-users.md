# Escenarios prácticos: periodistas, organizadores y personas en riesgo

!!! info "Para quién es esta guía"
    Esta lección es para quienes necesitan Nostr como **herramienta de comunicación**, no como un curso de programación: periodistas, organizadores y personas en entornos de alto riesgo. No hace falta escribir código.

    Al terminar sabrás cómo:

    - Crear una identidad Nostr **separada**, no ligada a tu nombre real
    - Publicar y leer notas sin depender de una sola empresa o un solo servidor
    - Elegir clientes y relés pensando en la privacidad
    - Evitar los errores más comunes que identifican a las personas
    - Entender lo que Nostr **no** protege

!!! warning "Límites honestos"
    Nostr te da **identidad portable** y **resistencia a que una sola plataforma te baneé**. No te hace invisible. Los relés pueden ver tu dirección IP si no tomas medidas extra. Las fotos, el estilo de escritura, los zaps y los horarios de publicación también pueden identificarte. Esto es una lista práctica, no una garantía.

## Por qué Nostr importa en entornos de alto riesgo

Las plataformas tradicionales pueden:

- Suspender una cuenta y borrar una red de fuentes de un día para otro
- Exigir un número de teléfono o un documento de identidad
- Entregar datos de la cuenta a un gobierno o a un empleador
- Silenciar en silencio la cobertura de una protesta o una investigación

En Nostr:

- **Tú** tienes la llave privada. Eso *es* la cuenta.
- Las notas son eventos firmados. Cualquiera puede verificar que salieron de esa llave.
- Publicas en **varios relés**. Un operador hostil no puede borrarte en todo el mundo.
- Puedes cambiar de app (Damus, Primal, Amethyst, Coracle, …) sin reconstruir tu identidad.

Eso solo sirve si **no mezclas** esta llave con tu identidad real.

---

## Escenario 1 — Periodista cubriendo una historia sensible

**Objetivo:** Publicar actualizaciones y hablar con fuentes sin atar la llave a tu firma periodística, al portátil de la redacción o a tus redes personales.

### Configuración (una sola vez; en un dispositivo dedicado si puedes)

1. Instala un cliente de confianza. Prefiere uno que guarde las llaves en el dispositivo y que soporte un firmante (extensión NIP-07 o un firmante remoto como nsec.app / Amber) en lugar de pegar tu `nsec` en sitios web aleatorios.
2. **Genera un par de llaves nuevo.** No reutilices la llave de tu perfil público de periodista.
3. Escribe el `nsec` (o la semilla) **fuera de línea**: papel, no captura de pantalla, no correo, no notas en la nube.
4. Completa los metadatos de perfil (kind 0) con un **rol**, no con un nombre: por ejemplo `Notas de campo | cobertura de protestas` y una imagen genérica. Sin logo de la redacción, sin cara, sin ciudad en la bio si esa ciudad te identifica.
5. Añade **varios** relés en distintas jurisdicciones. No dependas de un solo relé popular.

### Publicar

- Escribe como si un adversario fuera a leer la nota mañana. Sin nombres de hotel, sin “acabo de aterrizar en…”, sin fotos con metadatos de ubicación.
- Quita el EXIF de las imágenes antes de publicar, o no publiques fotos desde el terreno.
- Prefiere **texto** para actualizaciones urgentes. Imagen y vídeo son de alto riesgo.
- Si una fuente debe contactarte, dale **solo este npub** por un canal que ya consideres de confianza. No anuncies “escríbeme por DM para filtraciones” en tu cuenta pública con tu nombre real.

### Hablar con fuentes

- Los DM por defecto en muchos clientes (NIP-04 antiguo) filtran metadatos. Prefiere clientes con **mensajes privados (NIP-17 / gift wrap)** cuando la conversación sea sensible.
- Nunca pidas a una fuente que instale una app aleatoria que no hayas verificado.
- Acuerda de antemano qué pasa si la llave se quema: rotas a un npub nuevo y avisas a las personas de confianza por otro canal.

### Si hay que abandonar la identidad

Si crees que la llave está comprometida: **deja de usarla**. Genera una nueva. Avisa a las fuentes por otro canal. En Nostr no existe “restablecer contraseña”.

---

## Escenario 2 — Organizador coordinando una comunidad

**Objetivo:** Difundir información pública (hora, lugar, apoyo legal) y mantener la planificación y las listas de miembros fuera del feed público.

### Separa identidades a propósito

| Llave | Úsala para | No la uses para |
|-----|------------|-------------------|
| **npub público de organización** | Anuncios, peticiones de apoyo mutuo, enlaces a abogados | Listas de miembros, direcciones privadas, quién va a asistir |
| **npub del grupo de trabajo** | Solo con personas de confianza | Posts públicos, zaps desde un exchange KYC que lleve tu nombre |
| **npub personal** | Amistades, bromas, zaps | Cualquier cosa sobre la acción |

Usar una sola llave para todo es el error más común de quien organiza.

### Anuncios públicos

- Publica la misma nota en **varios relés** para que un solo operador no pueda tumbar el anuncio.
- Pon los datos críticos en el **texto**, no solo en una imagen (las imágenes fallan en conexiones lentas y son más difíciles de archivar).
- Usa un hashtag o etiqueta `t` estable para que la gente siga el tema sin seguirte a ti.

### Coordinación privada

- Listas de miembros y logística van en **chat de grupo cifrado o DM NIP-17**, no en un hilo público.
- No menciones (@) a personas que no hayan aceptado ser visibles.
- Si administras un relé comunitario, publica una política clara: qué registras, cuánto tiempo guardas eventos y cómo pedir borrado (NIP-09 es un esfuerzo razonable; el relé puede conservar una copia).

### Después del evento

- Asume que las notas públicas son permanentes, aunque envíes un evento de borrado.
- Rota la llave del grupo de trabajo si hubo decomisos de dispositivos o coacción.

---

## Escenario 3 — Persona en riesgo que necesita hablar sin cuenta a nombre real

**Objetivo:** Entrar a Nostr en menos de 30 minutos sin vincular teléfono, correo ni documento de identidad.

### Primeros 30 minutos

1. **Llave nueva. Perfil nuevo. Perfil de dispositivo nuevo** si es posible (otro perfil del navegador u otro usuario del teléfono).
2. No nombres la cuenta como tu Twitter, Instagram o correo.
3. Conéctate a 3–5 relés. Incluye al menos uno que no hayas elegido de un tuit al azar.
4. Lee antes de publicar. Sigue unos npubs de confianza. Confirma que las notas aparecen en otro cliente.
5. Recién entonces publica. Primera nota: sin selfies, sin trabajo, sin “mi nombre real es…”.

### Privacidad de red (en lenguaje sencillo)

| Riesgo | Qué ocurre | Respuesta práctica |
|------|----------------|-------------------|
| El relé ve tu IP | El operador puede registrar quién se conectó | Usa Tor o una VPN de confianza **antes** de abrir el cliente |
| Número de teléfono | Muchas apps “fáciles” lo piden | Usa un cliente que no exija teléfono |
| Zaps de Lightning | Los pagos pueden vincularse a un exchange KYC | No hagas zap desde un exchange a tu nombre legal si necesitas anonimato |
| Capturas de pantalla | Otras personas pueden republicarte | Escribe en consecuencia |

### Qué publicar — y qué no

**Más seguro:** análisis general, documentación de hechos públicos, copias de documentos ya públicos, enlaces.

**Peligroso:** ubicación en vivo, fotos de familia, documentos de identidad, “soy la única enfermera del turno de noche en el hospital X”, cualquier cosa que una autoridad local pueda usar para encontrar una casa o un trabajo.

---

## Reglas compartidas (los tres escenarios)

1. **Una finalidad por llave.** Mezclar identidades es cómo encuentran a la gente.
2. **Nunca pegues tu `nsec` en un sitio web.** Usa una extensión firmante o un firmante móvil.
3. **Respalda la llave fuera de línea.** Si la pierdes, pierdes la identidad. No hay mesa de ayuda.
4. **Varios relés, no uno.** La resistencia a la censura es un *hábito*, no un eslogan.
5. **Asume que las notas públicas duran para siempre.**
6. **Nostr no oculta tu IP por sí solo.** Combínalo con Tor/VPN cuando el modelo de amenaza lo exija.
7. **Verifica los clientes.** Descárgalos de sitios oficiales o de F-Droid / App Store que hayas comprobado, no de anuncios.

## Clientes de partida sugeridos

Esto cambia con el tiempo. Revisa recomendaciones actuales y verifica la fuente de descarga:

- **iOS:** Damus, Primal
- **Android:** Amethyst, Primal
- **Web (con firmante):** Coracle, Snort — usa una extensión NIP-07; no pegues el `nsec`
- **Endurecimiento:** un firmante dedicado (extensión de navegador o app tipo Amber) para que los sitios nunca vean la llave privada

## Cómo se conecta con el resto de LearnNostr

- Llaves y respaldos: [Llaves](../concepts/keys.md) y [Módulo 2](../modules/module-02-keys-identity.md)
- Relés y por qué importan varios: [Relés](../concepts/relays.md) y [Módulo 4](../modules/module-04-relays-architecture.md)
- Cifrado, DM y modelos de amenaza: [Módulo 9: Seguridad y privacidad](../modules/module-09-security.md)
- Tutorial técnico de cliente: [Construir un cliente simple](../tutorials/simple-client.md)

## Lista rápida

- [ ] Creé una llave **nueva** para este propósito, no mi llave personal pública
- [ ] El `nsec` está escrito fuera de línea, no en fotos de la nube
- [ ] El perfil no tiene nombre real, cara ni lugar de trabajo
- [ ] Estoy conectada/o a más de un relé
- [ ] No pego la llave privada en sitios web
- [ ] Sé que Nostr no oculta mi IP por sí solo
- [ ] Tengo un plan para **rotar llaves** si decomisan un dispositivo o se quema una fuente
