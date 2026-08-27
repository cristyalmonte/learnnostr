# LearnNostr Offline

This package contains the English and Spanish LearnNostr curriculum and the assets required to browse and search it without an internet connection.

## Start

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

Spanish is available at:

```text
http://127.0.0.1:8000/es/
```

## Notes

- A local HTTP server is required because browsers restrict features opened directly with `file://`.
- Internal lessons, search, fonts, scripts, and diagrams are included.
- Links to websites outside LearnNostr require an internet connection.
- Keep directory URLs and trailing slashes when hosting a mirror.

For public-mirror instructions, see:

https://github.com/cristyalmonte/learnnostr/blob/main/MIRROR.md
