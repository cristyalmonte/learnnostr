# Mirror LearnNostr

LearnNostr is a static bilingual site. You can host a mirror from the official offline ZIP without running a database or application server.

## Get and verify a release

Download the ZIP and checksum from the [latest LearnNostr release](https://github.com/cristyalmonte/learnnostr/releases/latest).

```bash
sha256sum -c learnnostr-offline-*.zip.sha256
unzip learnnostr-offline-*.zip
```

The extracted `learnnostr-*` directory is the web root.

## Test locally

```bash
cd learnnostr-*
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/` and test:

- `/`
- `/es/`
- A deep module page in each language
- Search in English and Spanish
- The language switcher

## Nginx example

```nginx
server {
    listen 80;
    server_name learnnostr.example;

    root /var/www/learnnostr;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Copy a release into place:

```bash
rsync -a --delete learnnostr-*/ /var/www/learnnostr/
```

## Caddy example

```caddyfile
learnnostr.example {
    root * /var/www/learnnostr
    file_server
}
```

## Important URL requirements

- Serve the extracted directory at the root of a host, not under a subpath.
- Preserve directory URLs and trailing slashes.
- Do not redirect `/es/` to `/es`.
- Use HTTPS for a public mirror.

These rules preserve navigation, assets, search, and the English/Spanish language switcher.

## What works offline

The package contains the curriculum, theme assets, search index, JavaScript, fonts, diagrams, and both languages. Links to external Nostr resources remain external and require connectivity.

## Updating a mirror

For each release:

1. Download the new ZIP and checksum.
2. Verify the checksum.
3. Extract into a new directory.
4. Test English, Spanish, and search.
5. Replace the previous web root atomically.

Keep the previous release available for rollback until the new mirror has been verified.
