# Use LearnNostr Offline or Run a Mirror

LearnNostr can be downloaded as a self-contained package for local reading, classroom use, USB distribution, or hosting on an independent server.

## Download the offline package

Download the newest `learnnostr-offline-*.zip` file from:

[LearnNostr releases](https://github.com/cristyalmonte/learnnostr/releases/latest){ .md-button .md-button--primary }

Each release also includes a `.sha256` file so you can verify the download.

## Read it without internet access

After downloading the ZIP:

```bash
unzip learnnostr-offline-*.zip
cd learnnostr-*
python3 -m http.server 8000
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in a browser.

The English and Spanish lessons, site search, diagrams, styles, and scripts are included in the package. Links to websites outside LearnNostr still require an internet connection.

!!! note "Why use a local server?"
    Browsers restrict some search and navigation features when a site is opened directly with `file://`. A small local HTTP server provides the same behavior as the public website.

## Verify the package

On Linux:

```bash
sha256sum -c learnnostr-offline-*.zip.sha256
```

On macOS:

```bash
shasum -a 256 learnnostr-offline-*.zip
```

Compare the result with the value in the downloaded `.sha256` file.

## Host a public or private mirror

Unzip the package into the document root of any static web server. Keep directory URLs and trailing slashes enabled, especially for `/es/`.

For deployment examples and operational guidance, see the repository's [mirror guide](https://github.com/cristyalmonte/learnnostr/blob/main/MIRROR.md).

## Share safely

- Keep the ZIP and checksum together.
- Verify the checksum after copying the package to a USB drive or another device.
- Share the original release URL when recipients have internet access.
- State the release version when distributing copies so readers know which curriculum they have.
