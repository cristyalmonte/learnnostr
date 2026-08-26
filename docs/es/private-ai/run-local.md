# Correr un modelo de pesos abiertos en local

!!! info "Lab 2 — una tarea real, sin red"
    Instala [Ollama](https://ollama.com), baja un modelo **local** y reescribe un borrador con forma sensible **sin ningún paquete a una empresa de IA**.

    Ollama es un proyecto open source aparte ([github.com/ollama/ollama](https://github.com/ollama/ollama)). LearnNostr no es Ollama. Los comandos coinciden con su instalación actual y su [API](https://docs.ollama.com/api).

!!! warning "No uses etiquetas cloud"
    Los docs de Ollama muestran tanto `gemma4:cloud` como etiquetas que terminan en `-cloud` (por ejemplo `gpt-oss:120b-cloud`). Esas envían el prompt **fuera del dispositivo** y piden una cuenta en ollama.com. En este lab, solo modelos **sin** `:cloud` ni `-cloud`. Confirma en [ollama.com/library](https://ollama.com/library) que bajaste un peso local.

---

## Qué estás demostrando

Un modelo de **pesos abiertos** es un archivo de números que puedes guardar. La inferencia ocurre en un proceso que tú arrancaste. No hay cuenta, ni KYC, ni registro de prompts del vendedor.

Límites (con honestidad):

- La calidad la marcan tu RAM/GPU y el modelo.
- Los archivos en disco igual se pueden incautar.
- La **salida** deja de ser secreta cuando la copias a un cliente o un relé.

Sigue siendo el default correcto para las columnas 1 y 2 del [lab 1](cloud-surveillance.md).

---

## 1. Instala Ollama

Desde la [página oficial](https://ollama.com/download) / [README](https://github.com/ollama/ollama):

=== "Linux / macOS"

    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

=== "Windows (PowerShell)"

    ```powershell
    irm https://ollama.com/install.ps1 | iex
    ```

Prefiere el instalador de **ollama.com**, no un zip cualquiera. Después, si quieres una prueba dura offline: una vez el modelo esté en disco, puedes apagar el Wi‑Fi.

---

## 2. Baja un modelo local

Chat interactivo (el ejemplo actual de upstream es Gemma 4 — sáltalo si no cabe en RAM; elige un tag local más chico en la biblioteca):

```bash
ollama run gemma4
```

Sal con `/bye`.

Si `gemma4` es demasiado grande, su biblioteca documenta etiquetas de borde como `gemma4:e2b`. Mira [ollama.com/library](https://ollama.com/library) por un tag local de 1B–8B y:

```bash
ollama run <nombre-modelo-local>
```

Lista lo que hay en la máquina:

```bash
ollama list
```

Debes ver un tamaño en disco. Ese archivo es el modelo. Ya no necesita internet para responder.

---

## 3. Tarea real: reescritura publicable

Copia esto a `draft.txt` en **la misma máquina**. Es una plantilla **de ficción**. No la sustituyas con fuentes reales.

```text
INTERNAL — do not publish
Source A (name withheld) says the checkpoint on the north road
closed at 19:40. Driver of the white van is known to the newsroom.
We have a phone number. Two minors were in the second vehicle.
Quote: "They filmed us from the blue building."
```

Tu trabajo: un párrafo **público** que una redacción podría publicar: sin nombres, teléfono, “menores”, “camioneta blanca”, hora exacta ni “edificio azul”. Deja solo un hecho de interés público que no identifique a la fuente.

Quédate en el chat de Ollama, o usa la API REST en **localhost** (README de Ollama):

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gemma4",
  "messages": [{
    "role": "user",
    "content": "Rewrite the following INTERNAL notes into one public paragraph. Remove names, phones, vehicles, buildings, exact times, and anyone who could be identified. If a detail would identify someone, drop it. Notes:\n\nINTERNAL — do not publish\nSource A (name withheld) says the checkpoint on the north road closed at 19:40. Driver of the white van is known to the newsroom. We have a phone number. Two minors were in the second vehicle. Quote: They filmed us from the blue building."
  }],
  "stream": false
}'
```

Cambia `"model"` por lo que muestre `ollama list`.

=== "Python (paquete ollama)"

    ```python
    # pip install ollama
    from ollama import chat

    notes = open("draft.txt", encoding="utf-8").read()
    response = chat(
        model="gemma4",  # o tu tag local
        messages=[{
            "role": "user",
            "content": (
                "Rewrite these INTERNAL notes into one public paragraph. "
                "Remove names, phones, vehicles, buildings, exact times, "
                "and anyone who could be identified.\n\n" + notes
            ),
        }],
    )
    print(response.message.content)
    ```

Lee la salida. Si sobrevivió algún dato identificable, **edita a mano**. El modelo es un borrador, no un abogado.

---

## 4. Demuestra que se quedó en local

!!! example "Ejercicio — prueba offline"

    1. Baja el modelo con red.
    2. Apaga Wi‑Fi/Ethernet.
    3. Repite la reescritura. Si responde, el peso está en disco.
    4. Confirma que **no** usaste un tag `:cloud` ni `-cloud`.

!!! example "Ejercicio — honestidad ante un decomiso"

    En papel: ¿dónde está `draft.txt`? ¿El directorio de modelos de Ollama? Si se llevan la laptop, se van los dos. Sigue siendo mejor que un log de vendedor — pero no es magia. Cifrado de disco y la [guía de campo](../getting-started/high-risk-users.md) siguen aplicando.

---

## Qué no hace este lab

- No te hace anónima/o en Nostr.
- No sustituye un modelo más grande para análisis duro — eso es el [lab 3](maple-routstr.md), con los ojos abiertos.
- No publica nada. Publicar es el [lab 4](publish-without-leaking.md), **después** de un párrafo que respaldarías en público.

---

## Siguiente

Si el modelo local alcanza para el trabajo de esta semana, no pagues APIs. Si necesitas un modelo remoto más fuerte **sin** cuenta de ChatGPT, sigue con [Maple y Routstr](maple-routstr.md).
