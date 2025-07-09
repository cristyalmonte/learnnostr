# Eventos y Mensajes

Esta página está siendo traducida al español.

**Página original en inglés:** [Events and Messages](/en/concepts/events-and-messages/)

---

## Resumen Rápido

Los eventos son la unidad básica de datos en Nostr. Todo en Nostr es un evento:

### Estructura Básica de Evento
```json
{
  "id": "identificador_unico",
  "pubkey": "llave_publica_autor",
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "Contenido del mensaje",
  "sig": "firma_digital"
}
```

### Tipos de Eventos Principales
- **Kind 0**: Perfil de usuario
- **Kind 1**: Nota de texto (como tweet)
- **Kind 3**: Lista de seguidos
- **Kind 4**: Mensaje directo encriptado
- **Kind 7**: Reacción (like)

### Conceptos Importantes
- Los eventos son **inmutables** una vez creados
- Cada evento tiene una **firma digital** que prueba autenticidad
- Las **etiquetas** proporcionan metadatos adicionales
- Los eventos se propagan a través de **relés**

---

*Esta traducción está en progreso. Visita la versión en inglés para el contenido completo.*
