# Usa LearnNostr sin Conexión o Ejecuta una Réplica

LearnNostr puede descargarse como un paquete independiente para lectura local, clases, distribución por USB o alojamiento en un servidor separado.

## Descarga el paquete sin conexión

Descarga el archivo `learnnostr-offline-*.zip` más reciente desde:

[Versiones de LearnNostr](https://github.com/cristyalmonte/learnnostr/releases/latest){ .md-button .md-button--primary }

Cada versión también incluye un archivo `.sha256` para verificar la descarga.

## Lee el sitio sin internet

Después de descargar el ZIP:

```bash
unzip learnnostr-offline-*.zip
cd learnnostr-*
python3 -m http.server 8000
```

Abre [http://127.0.0.1:8000/](http://127.0.0.1:8000/) en un navegador.

Las lecciones en inglés y español, la búsqueda, los diagramas, los estilos y los scripts están incluidos en el paquete. Los enlaces a sitios externos todavía requieren conexión a internet.

!!! note "¿Por qué usar un servidor local?"
    Los navegadores restringen algunas funciones de búsqueda y navegación cuando un sitio se abre directamente con `file://`. Un pequeño servidor HTTP local ofrece el mismo comportamiento que el sitio público.

## Verifica el paquete

En Linux:

```bash
sha256sum -c learnnostr-offline-*.zip.sha256
```

En macOS:

```bash
shasum -a 256 learnnostr-offline-*.zip
```

Compara el resultado con el valor del archivo `.sha256` descargado.

## Aloja una réplica pública o privada

Descomprime el paquete en el directorio raíz de cualquier servidor web estático. Conserva las URLs de directorio y las barras finales, especialmente para `/es/`.

Consulta la [guía de réplicas](https://github.com/cristyalmonte/learnnostr/blob/main/MIRROR.md) del repositorio para ver ejemplos de despliegue y recomendaciones operativas.

## Comparte el paquete de forma segura

- Mantén juntos el ZIP y su suma de verificación.
- Verifica la suma después de copiar el paquete a una memoria USB u otro dispositivo.
- Comparte el enlace de la versión original cuando los destinatarios tengan acceso a internet.
- Indica la versión al distribuir copias para que los lectores sepan qué edición del currículo tienen.
