# Run an open-weight model locally

!!! info "Lab 2 — a real task, offline"
    Install [Ollama](https://ollama.com), pull a **local** model, and rewrite a sensitive-shaped draft **without any packet to an AI company**.

    Ollama is a separate open-source project ([github.com/ollama/ollama](https://github.com/ollama/ollama)). LearnNostr is not Ollama. Commands below match their current install and [API](https://docs.ollama.com/api) docs.

!!! warning "Do not use cloud tags"
    Ollama’s own docs show both `gemma4:cloud` and tags ending in `-cloud` (for example `gpt-oss:120b-cloud`). Those send the prompt **off-device** and require an ollama.com account. For this lab, only run models **without** `:cloud` or `-cloud`. Confirm on [ollama.com/library](https://ollama.com/library) that you pulled a local weight.

---

## What you are proving

An **open-weight** model is a file of numbers you can store. Inference happens in a process you started. There is no account, no KYC, no vendor prompt log.

Limits (be honest):

- Quality is bounded by your RAM/GPU and the model you chose.
- The files on disk can still be seized.
- The **output** is not secret once you copy it into a client or a relay.

That is still the right default for column 1 and 2 of [lab 1](cloud-surveillance.md).

---

## 1. Install Ollama

From the [official download page](https://ollama.com/download) / [README](https://github.com/ollama/ollama):

=== "Linux / macOS"

    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

=== "Windows (PowerShell)"

    ```powershell
    irm https://ollama.com/install.ps1 | iex
    ```

Prefer the installer from **ollama.com**, not a random GitHub zip. Then disconnect extra browsers if you want a hard offline test: after the model file is on disk, Wi‑Fi can go off.

---

## 2. Pull a local model

Interactive chat (current upstream example is Gemma 4 — skip it if it does not fit in RAM; pick a smaller local tag from the library):

```bash
ollama run gemma4
```

Leave with `/bye`.

If `gemma4` is too large, their library documents edge tags such as `gemma4:e2b`. Browse [ollama.com/library](https://ollama.com/library) for a 1B–8B **local** tag and:

```bash
ollama run <local-model-name>
```

List what is actually on the machine:

```bash
ollama list
```

You should see a size on disk. That file is the model. It does not need the internet to answer once pulled.

---

## 3. Real task: public-safe rewrite

Copy this into `draft.txt` on the **same machine**. It is a **fiction** template. Replace nothing with real sources.

```text
INTERNAL — do not publish
Source A (name withheld) says the checkpoint on the north road
closed at 19:40. Driver of the white van is known to the newsroom.
We have a phone number. Two minors were in the second vehicle.
Quote: "They filmed us from the blue building."
```

Your job: produce a **public** paragraph that a newsroom could post: no names, no phone, no “minors,” no “white van,” no exact time, no “blue building.” Keep only a fact that is already in the public interest and cannot identify the source.

Stay in the Ollama chat, or use the REST API on **localhost** (from Ollama’s README):

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

Change `"model"` to whatever `ollama list` shows.

=== "Python (ollama package)"

    ```python
    # pip install ollama
    from ollama import chat

    notes = open("draft.txt", encoding="utf-8").read()
    response = chat(
        model="gemma4",  # or your local tag
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

Read the output. If any identifying scrap survived, **edit by hand**. The model is a draft horse, not a lawyer.

---

## 4. Prove it stayed local

!!! example "Exercise — offline check"

    1. Pull the model while you still have network.
    2. Turn Wi‑Fi/Ethernet **off** (phone in airplane mode if that is the box).
    3. Run the rewrite again. If it still answers, the weight is on disk.
    4. Confirm you did **not** use a `:cloud` or `-cloud` tag (`ollama list` / the run command).

!!! example "Exercise — seizure honesty"

    On paper: where is `draft.txt`? Where is the Ollama model directory? If this laptop is taken, both are gone. That is still better than a vendor log — but it is not magic. Disk encryption and the [field guide](../getting-started/high-risk-users.md) still apply.

---

## What this lab does not do

- It does not make you anonymous on Nostr.
- It does not replace a larger model you might need for hard analysis — that is [lab 3](maple-routstr.md), with eyes open.
- It does not publish anything. Publishing is [lab 4](publish-without-leaking.md), **after** you have a paragraph you would stand behind in public.

---

## Next

If the local model is enough for this week’s work, skip paid APIs. If you need a stronger remote model **without** a ChatGPT account, continue with [Maple and Routstr](maple-routstr.md).
