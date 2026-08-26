# La IA en la nube es un riesgo de vigilancia

!!! info "Lab 1 — aún no instales nada"
    Al terminar puedes listar **quién ve un prompt de ChatGPT/Gemini/Claude**, qué añade el rastro de pago, y qué cadenas no deben salir del dispositivo.

    Escribe las respuestas en papel. No teclees tu modelo de amenaza real en un chatbot de nube “para comprobar”.

---

## Qué entregas cuando “solo preguntas a ChatGPT”

Un asistente hospedado no es un cuaderno. Es un **programa remoto** atado a una cuenta.

| Capa | Qué puede retener | Por qué importa bajo un dictador |
|------|-------------------|----------------------------------|
| Cuenta | Correo, teléfono, ID de Google/Apple | Ata el registro del prompt a una persona legal |
| Prompt y archivos | El texto, PDFs, fotos | Nombres de fuentes, lugares, planes |
| Metadatos | IP, hora, dispositivo, locale aproximado | “Esta persona consultó X desde este café” |
| Pago | Tarjeta, PayPal, cuenta de tienda | KYC; orden judicial al procesador |
| Política | Entrenamiento, revisión, “trust and safety” | Humanos u otros modelos pueden leer el log |
| Jurisdicción | EE. UU. / UE / sede del vendedor | Tu ley local **y** la del vendedor |

No puedes auditar el servidor. “No entrenamos con tus datos” es una **política**, no un protocolo. Las políticas cambian; los logs se copian; el personal recibe órdenes.

Nostr ya enseñó el patrón: si una empresa puede bloquear la cuenta, también puede **entregar el historial**.

---

## Qué no teclear (nunca) en un modelo hospedado

Trata el compositor como un formulario que se leerá en un tribunal.

**No** pegues:

- Nombres de fuentes, teléfonos, handles o “el conductor que…”
- Ubicación en vivo, retenes, hotel, trabajo o horarios únicos
- Documentos inéditos, filtraciones o fotos con EXIF
- Tu `nsec`, semillas o PIN del firmante (el modelo los repetirá)
- Tu `npub` de campo más una historia que solo tú podrías haber escrito
- Material médico, familiar o de chantaje “solo para reescribirlo”

Solo es razonablemente seguro en un modelo **hospedado** si ya lo publicarías como `kind 1`.

!!! danger "El truco de reescribir igual filtra"
    “Quita los nombres de esta transcripción” **envía los nombres**. Que el modelo vea el secreto es el fallo, aunque la respuesta se vea limpia.

---

## Los pagos son identidad

La IA en la nube rara vez es gratis al volumen que necesita quien investiga.

- Una **tarjeta** es nombre, dirección y banco.
- La facturación de **App Store / Play** es la misma cuenta Apple o Google que no debías mezclar con la identidad de campo.
- **Cripto desde un exchange con KYC** sigue siendo un nombre si el depósito se puede agrupar.

Si más tarde usas Bitcoin o Cashu con un proveedor privado, fóndelo de un modo que **no** apunte a la misma identidad legal que el npub de campo. La [advertencia de zaps](../getting-started/high-risk-users.md#8-money-zaps-and-why-they-unmask-people) aplica también a créditos de IA.

---

## Red: el ISP no necesita el prompt

Aunque uses HTTPS, el operador de red local ve **que** abriste `openai.com` o `gemini.google.com`, cuándo y cuánto. En un país que filtra esos hosts, el intento de conexión ya es una señal.

Tor o una VPN de confianza **antes** del navegador cambia lo que ve el ISP. **No** impide que OpenAI vea el prompt si igual se lo envías.

El orden es el de Nostr: [primero la red, después la app](../getting-started/first-session.md#1-network-first-then-the-app).

---

## Práctica (sigue sin red de IA)

!!! example "Ejercicio — lista roja"

    En papel, tres columnas:

    1. **Nunca sale de esta habitación** (nombres, archivos, nsec)
    2. **Solo a un modelo local** (borradores, traducciones de hechos públicos)
    3. **Puede ir a una API remota** (texto que igual publicarías)

    Mete el trabajo de hoy en esas columnas. Si la columna 1 está vacía, aún no estás pensando en un adversario real.

!!! example "Ejercicio — mapa de vendedor"

    Elige un producto que hayas usado (ChatGPT, Gemini, Claude, Copilot, una “IA de VPN gratis”). De memoria: método de login, de pago, sede. No hace falta su política de privacidad. El punto es que **no** ves el disco.

---

## Qué es “suficientemente privado” en este sitio

1. **Modelo local de pesos abiertos** — el prompt no sale de la máquina ([siguiente lab](run-local.md)).
2. **Remoto con una historia de seguridad publicada que puedes comprobar** — TEE + atestación de Maple, o el pago sin cuenta de Routstr, con **sus límites documentados** ([lab 3](maple-routstr.md)).
3. **Publica solo el resto público** en Nostr ([lab 4](publish-without-leaking.md)).

---

## Siguiente

[Correr un modelo de pesos abiertos en local](run-local.md)
