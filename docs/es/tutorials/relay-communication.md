# Comunicación con Relés

!!! info "Lo Que Aprenderás"
    En este tutorial, dominarás:
    
    - Cómo funcionan los relés Nostr y su papel en la red
    - Patrones de comunicación WebSocket
    - Filtros de suscripción y actualizaciones en tiempo real
    - Publicación de eventos a múltiples relés
    - Manejo de fallas de conexión y reintentos
    - Estrategias de selección de relés

!!! tip "Prerrequisitos"
    - Comprensión de [eventos Nostr](./understanding-events.md)
    - Conocimiento básico de WebSocket
    - Patrones de async/await en JavaScript

## Entendiendo los Relés

Los relés son la columna vertebral de la red Nostr. Son servidores simples que:

- **Almacenan eventos** enviados por clientes
- **Sirven eventos** a clientes basándose en filtros
- **Retransmiten eventos** entre clientes en tiempo real
- **No mantienen cuentas de usuario** - solo eventos

Piensa en los relés como bases de datos inteligentes que hablan un protocolo común.

## El Protocolo de Relés

Nostr usa WebSockets para comunicación en tiempo real entre clientes y relés. Todos los mensajes son arrays JSON con formatos específicos:

### Mensajes de Cliente a Relé

| Tipo de Mensaje | Formato | Propósito |
|-----------------|---------|-----------|
| `EVENT` | `["EVENT", <event>]` | Publicar un evento |
| `REQ` | `["REQ", <sub_id>, <filters>...]` | Suscribirse a eventos |
| `CLOSE` | `["CLOSE", <sub_id>]` | Cerrar una suscripción |
| `AUTH` | `["AUTH", <event>]` | Autenticarse con el relé |
| `COUNT` | `["COUNT", <sub_id>, <filters>...]` | Contar eventos coincidentes |

### Mensajes de Relé a Cliente

| Tipo de Mensaje | Formato | Propósito |
|-----------------|---------|-----------|
| `EVENT` | `["EVENT", <sub_id>, <event>]` | Enviar evento al cliente |
| `EOSE` | `["EOSE", <sub_id>]` | Fin de eventos almacenados |
| `OK` | `["OK", <event_id>, <true\|false>, <message>]` | Resultado de publicación de evento |
| `NOTICE` | `["NOTICE", <message>]` | Mensaje legible para humanos |
| `CLOSED` | `["CLOSED", <sub_id>, <message>]` | Suscripción cerrada |
| `AUTH` | `["AUTH", <challenge>]` | Desafío de autenticación |
| `COUNT` | `["COUNT", <sub_id>, <count>]` | Respuesta de conteo de eventos |

## Conectando a Relés

Comencemos con una conexión básica a relé:

=== "Conexión Básica"

    ```javascript
    import { relayInit } from 'nostr-tools'

    async function conectarARelé(url) {
        const relay = relayInit(url)
        
        relay.on('connect', () => {
            console.log(`Conectado a ${url}`)
        })
        
        relay.on('error', () => {
            console.error(`Falló la conexión a ${url}`)
        })
        
        relay.on('disconnect', () => {
            console.log(`Desconectado de ${url}`)
        })
        
        try {
            await relay.connect()
            return relay
        } catch (error) {
            console.error('Falló la conexión:', error)
            throw error
        }
    }

    // Uso
    const relay = await conectarARelé('wss://relay.damus.io')
    ```

=== "Conexión con Reintentos"

    ```javascript
    async function conectarConReintentos(url, maxIntentos = 3) {
        let intentos = 0
        
        while (intentos < maxIntentos) {
            try {
                const relay = relayInit(url)
                
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Timeout de conexión'))
                    }, 5000)
                    
                    relay.on('connect', () => {
                        clearTimeout(timeout)
                        resolve()
                    })
                    
                    relay.on('error', () => {
                        clearTimeout(timeout)
                        reject(new Error('Error de conexión'))
                    })
                    
                    relay.connect()
                })
                
                console.log(`Conectado a ${url} en intento ${intentos + 1}`)
                return relay
                
            } catch (error) {
                intentos++
                console.log(`Intento ${intentos} falló para ${url}:`, error.message)
                
                if (intentos < maxIntentos) {
                    const delay = Math.min(1000 * Math.pow(2, intentos), 10000)
                    console.log(`Reintentando en ${delay}ms...`)
                    await new Promise(resolve => setTimeout(resolve, delay))
                }
            }
        }
        
        throw new Error(`No se pudo conectar a ${url} después de ${maxIntentos} intentos`)
    }
    ```

## Suscribiéndose a Eventos

Las suscripciones son el corazón de la comunicación en tiempo real en Nostr:

=== "Suscripción Básica"

    ```javascript
    function suscribirseANotas(relay, pubkey = null) {
        const filtros = {
            kinds: [1], // Solo notas de texto
            limit: 50   // Máximo 50 eventos
        }
        
        // Si se proporciona pubkey, filtrar por autor
        if (pubkey) {
            filtros.authors = [pubkey]
        }
        
        const sub = relay.sub([filtros])
        
        sub.on('event', (event) => {
            console.log('Nueva nota recibida:', event.content)
        })
        
        sub.on('eose', () => {
            console.log('Fin de eventos almacenados')
        })
        
        return sub
    }

    // Uso
    const subscription = suscribirseANotas(relay)
    
    // Cerrar suscripción cuando termine
    setTimeout(() => {
        subscription.unsub()
    }, 60000) // Cerrar después de 1 minuto
    ```

=== "Filtros Avanzados"

    ```javascript
    function crearFiltrosAvanzados() {
        return [
            // Feed personal - solo autores que sigo
            {
                kinds: [1],
                authors: ['pubkey1', 'pubkey2', 'pubkey3'],
                limit: 20,
                since: Math.floor(Date.now() / 1000) - 3600 // Última hora
            },
            
            // Menciones - eventos que me mencionan
            {
                kinds: [1],
                '#p': ['mi-pubkey'],
                limit: 10
            },
            
            // Hashtags específicos
            {
                kinds: [1],
                '#t': ['nostr', 'bitcoin', 'descentralizado'],
                limit: 15,
                since: Math.floor(Date.now() / 1000) - 86400 // Último día
            },
            
            // Reacciones a mis notas
            {
                kinds: [7], // Reacciones
                '#e': ['id-de-mi-nota'],
                limit: 100
            }
        ]
    }

    function suscripcionMultiple(relay) {
        const filtros = crearFiltrosAvanzados()
        const sub = relay.sub(filtros)
        
        sub.on('event', (event) => {
            switch (event.kind) {
                case 1: // Nota de texto
                    manejarNota(event)
                    break
                case 7: // Reacción
                    manejarReaccion(event)
                    break
                default:
                    console.log('Evento no manejado:', event)
            }
        })
        
        return sub
    }

    function manejarNota(event) {
        // Verificar si es mención
        const menciones = event.tags.filter(tag => tag[0] === 'p')
        if (menciones.some(tag => tag[1] === miPubkey)) {
            console.log('[MENTION] Nueva mención:', event.content)
        } else {
            console.log('[NOTE] Nueva nota:', event.content)
        }
    }

    function manejarReaccion(event) {
        const emoji = event.content || '+'
        console.log(`${emoji} Reacción recibida`)
    }
    ```

=== "Filtros en Tiempo Real"

    ```javascript
    class GestorSuscripciones {
        constructor(relay) {
            this.relay = relay
            this.suscripciones = new Map()
        }
        
        suscribirseAHashtag(hashtag, callback) {
            const subId = `hashtag-${hashtag}`
            
            // Cerrar suscripción existente si existe
            if (this.suscripciones.has(subId)) {
                this.suscripciones.get(subId).unsub()
            }
            
            const sub = this.relay.sub([{
                kinds: [1],
                '#t': [hashtag],
                limit: 20,
                since: Math.floor(Date.now() / 1000)
            }])
            
            sub.on('event', callback)
            this.suscripciones.set(subId, sub)
            
            return sub
        }
        
        suscribirseAAutor(pubkey, callback) {
            const subId = `autor-${pubkey}`
            
            if (this.suscripciones.has(subId)) {
                this.suscripciones.get(subId).unsub()
            }
            
            const sub = this.relay.sub([{
                kinds: [1, 6, 7], // Notas, reposts, reacciones
                authors: [pubkey],
                limit: 50
            }])
            
            sub.on('event', callback)
            this.suscripciones.set(subId, sub)
            
            return sub
        }
        
        cerrarTodas() {
            for (const [id, sub] of this.suscripciones) {
                sub.unsub()
            }
            this.suscripciones.clear()
        }
    }

    // Uso
    const gestor = new GestorSuscripciones(relay)
    
    gestor.suscribirseAHashtag('nostr', (event) => {
        console.log('Nuevo post sobre Nostr:', event.content)
    })
    ```

## Publicando Eventos

La publicación de eventos requiere manejo cuidadoso de errores y confirmaciones:

=== "Publicación Básica"

    ```javascript
    import { finishEvent } from 'nostr-tools'

    async function publicarNota(relay, contenido, privateKey) {
        try {
            const evento = finishEvent({
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                content: contenido,
            }, privateKey)
            
            const pub = relay.publish(evento)
            
            pub.on('ok', () => {
                console.log(`[OK] Evento publicado exitosamente: ${evento.id}`)
            })
            
            pub.on('failed', (reason) => {
                console.error(`[ERROR] Falló la publicación: ${reason}`)
            })
            
            return evento
            
        } catch (error) {
            console.error('Error creando evento:', error)
            throw error
        }
    }

    // Uso
    await publicarNota(relay, '¡Hola Nostr!', miPrivateKey)
    ```

=== "Publicación con Validación"

    ```javascript
    async function publicarConValidacion(relay, contenido, privateKey) {
        // Validaciones previas
        if (!contenido || contenido.trim().length === 0) {
            throw new Error('El contenido no puede estar vacío')
        }
        
        if (contenido.length > 5000) {
            throw new Error('Contenido demasiado largo (máx 5000 caracteres)')
        }
        
        if (relay.status !== 1) {
            throw new Error('Relé no conectado')
        }
        
        try {
            const evento = finishEvent({
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: extraerHashtags(contenido),
                content: contenido.trim(),
            }, privateKey)
            
            return new Promise((resolve, reject) => {
                const pub = relay.publish(evento)
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout de publicación'))
                }, 10000)
                
                pub.on('ok', () => {
                    clearTimeout(timeout)
                    resolve(evento)
                })
                
                pub.on('failed', (reason) => {
                    clearTimeout(timeout)
                    reject(new Error(`Publicación falló: ${reason}`))
                })
            })
            
        } catch (error) {
            console.error('Error en publicación:', error)
            throw error
        }
    }

    function extraerHashtags(contenido) {
        const hashtags = contenido.match(/#\w+/g) || []
        return hashtags.map(tag => ['t', tag.slice(1).toLowerCase()])
    }
    ```

=== "Publicación a Múltiples Relés"

    ```javascript
    class PublicadorMultiRelé {
        constructor(relés) {
            this.relés = relés
        }
        
        async publicar(evento) {
            const resultados = await Promise.allSettled(
                this.relés.map(relay => this.publicarARelé(relay, evento))
            )
            
            const exitosos = resultados.filter(r => r.status === 'fulfilled').length
            const fallidos = resultados.filter(r => r.status === 'rejected').length
            
            console.log(`📊 Publicación: ${exitosos} exitosos, ${fallidos} fallidos`)
            
            if (exitosos === 0) {
                throw new Error('Falló publicación en todos los relés')
            }
            
            return {
                evento,
                exitosos,
                fallidos,
                resultados
            }
        }
        
        async publicarARelé(relay, evento) {
            if (relay.status !== 1) {
                throw new Error(`Relé ${relay.url} no conectado`)
            }
            
            return new Promise((resolve, reject) => {
                const pub = relay.publish(evento)
                const timeout = setTimeout(() => {
                    reject(new Error(`Timeout en ${relay.url}`))
                }, 5000)
                
                pub.on('ok', () => {
                    clearTimeout(timeout)
                    resolve(relay.url)
                })
                
                pub.on('failed', (reason) => {
                    clearTimeout(timeout)
                    reject(new Error(`${relay.url}: ${reason}`))
                })
            })
        }
    }

    // Uso
    const publicador = new PublicadorMultiRelé(misRelés)
    const resultado = await publicador.publicar(miEvento)
    ```

## Gestión de Múltiples Relés

Para una experiencia robusta, necesitas gestionar múltiples relés:

=== "Pool de Relés"

    ```javascript
    class PoolRelés {
        constructor() {
            this.relés = new Map()
            this.urlsRelés = [
                'wss://relay.damus.io',
                'wss://nos.lol',
                'wss://relay.snort.social',
                'wss://relay.nostr.band',
                'wss://nostr.wine'
            ]
        }
        
        async inicializar() {
            const promesasConexión = this.urlsRelés.map(url => 
                this.conectarRelé(url).catch(error => {
                    console.warn(`Falló conexión a ${url}:`, error.message)
                    return null
                })
            )
            
            const resultados = await Promise.allSettled(promesasConexión)
            const conectados = resultados.filter(r => r.status === 'fulfilled' && r.value)
            
            console.log(`Conectado a ${conectados.length}/${this.urlsRelés.length} relés`)
            
            if (conectados.length === 0) {
                throw new Error('No se pudo conectar a ningún relé')
            }
        }
        
        async conectarRelé(url) {
            try {
                const relay = relayInit(url)
                
                relay.on('disconnect', () => {
                    console.log(`Desconectado de ${url}, reintentando...`)
                    this.reconectar(url)
                })
                
                await relay.connect()
                this.relés.set(url, {
                    relay,
                    conectado: true,
                    ultimaActividad: Date.now(),
                    errores: 0
                })
                
                return relay
                
            } catch (error) {
                console.error(`Error conectando a ${url}:`, error)
                throw error
            }
        }
        
        async reconectar(url) {
            const info = this.relés.get(url)
            if (info) {
                info.conectado = false
                info.errores++
                
                // Backoff exponencial
                const delay = Math.min(1000 * Math.pow(2, info.errores), 30000)
                
                setTimeout(async () => {
                    try {
                        await this.conectarRelé(url)
                        info.errores = 0
                        console.log(`Reconectado a ${url}`)
                    } catch (error) {
                        console.error(`Falló reconexión a ${url}:`, error)
                        this.reconectar(url)
                    }
                }, delay)
            }
        }
        
        getRelésSaludables() {
            return Array.from(this.relés.values())
                .filter(info => info.conectado && info.relay.status === 1)
                .map(info => info.relay)
        }
        
        async publicarATodos(evento) {
            const relés = this.getRelésSaludables()
            
            if (relés.length === 0) {
                throw new Error('No hay relés disponibles')
            }
            
            const promesas = relés.map(relay => {
                return new Promise((resolve) => {
                    const pub = relay.publish(evento)
                    pub.on('ok', () => resolve({ relay: relay.url, éxito: true }))
                    pub.on('failed', (reason) => resolve({ relay: relay.url, éxito: false, error: reason }))
                })
            })
            
            const resultados = await Promise.all(promesas)
            return resultados
        }
        
        suscribirseATodos(filtros, callback) {
            const relés = this.getRelésSaludables()
            const suscripciones = []
            
            for (const relay of relés) {
                const sub = relay.sub(filtros)
                sub.on('event', (event) => {
                    callback(event, relay.url)
                })
                suscripciones.push(sub)
            }
            
            return suscripciones
        }
        
        cerrarTodo() {
            for (const [url, info] of this.relés) {
                try {
                    info.relay.close()
                } catch (error) {
                    console.error(`Error cerrando ${url}:`, error)
                }
            }
            this.relés.clear()
        }
    }

    // Uso
    const pool = new PoolRelés()
    await pool.inicializar()

    // Publicar a todos los relés
    const resultados = await pool.publicarATodos(miEvento)
    console.log('Resultados de publicación:', resultados)
    ```

## Manejo de Eventos Duplicados

Al usar múltiples relés, recibirás eventos duplicados:

=== "Deduplicación"

    ```javascript
    class DeduplicadorEventos {
        constructor() {
            this.eventosVistos = new Set()
            this.limpiarIntervalo = setInterval(() => {
                this.limpiarCache()
            }, 300000) // Limpiar cada 5 minutos
        }
        
        esNuevo(evento) {
            if (this.eventosVistos.has(evento.id)) {
                return false
            }
            
            this.eventosVistos.add(evento.id)
            return true
        }
        
        limpiarCache() {
            // Mantener solo los últimos 10,000 eventos
            if (this.eventosVistos.size > 10000) {
                const array = Array.from(this.eventosVistos)
                this.eventosVistos = new Set(array.slice(-5000))
            }
        }
        
        destruir() {
            clearInterval(this.limpiarIntervalo)
            this.eventosVistos.clear()
        }
    }

    // Uso con múltiples relés
    const deduplicador = new DeduplicadorEventos()

    pool.suscribirseATodos([{ kinds: [1], limit: 50 }], (evento, relayUrl) => {
        if (deduplicador.esNuevo(evento)) {
            console.log(`Nuevo evento único de ${relayUrl}:`, evento.content)
            procesarEvento(evento)
        }
    })
    ```

## Monitoreo de Salud de Relés

=== "Monitor de Relés"

    ```javascript
    class MonitorRelés {
        constructor(pool) {
            this.pool = pool
            this.estadísticas = new Map()
            this.iniciarMonitoreo()
        }
        
        iniciarMonitoreo() {
            setInterval(() => {
                this.verificarSalud()
            }, 30000) // Verificar cada 30 segundos
        }
        
        async verificarSalud() {
            for (const [url, info] of this.pool.relés) {
                const stats = this.obtenerEstadísticas(url)
                
                if (info.conectado) {
                    // Enviar ping para verificar latencia
                    const inicio = Date.now()
                    try {
                        await this.ping(info.relay)
                        stats.latencia = Date.now() - inicio
                        stats.disponibilidad = Math.min(stats.disponibilidad + 0.1, 1.0)
                    } catch (error) {
                        stats.erroresConsecutivos++
                        stats.disponibilidad = Math.max(stats.disponibilidad - 0.2, 0.0)
                    }
                } else {
                    stats.disponibilidad = Math.max(stats.disponibilidad - 0.1, 0.0)
                }
                
                this.evaluarCalidad(url, stats)
            }
        }
        
        async ping(relay) {
            return new Promise((resolve, reject) => {
                const sub = relay.sub([{ kinds: [1], limit: 1 }])
                const timeout = setTimeout(() => {
                    sub.unsub()
                    reject(new Error('Ping timeout'))
                }, 5000)
                
                sub.on('eose', () => {
                    clearTimeout(timeout)
                    sub.unsub()
                    resolve()
                })
            })
        }
        
        obtenerEstadísticas(url) {
            if (!this.estadísticas.has(url)) {
                this.estadísticas.set(url, {
                    latencia: 0,
                    disponibilidad: 1.0,
                    erroresConsecutivos: 0,
                    calidad: 'buena'
                })
            }
            return this.estadísticas.get(url)
        }
        
        evaluarCalidad(url, stats) {
            let calidad = 'buena'
            
            if (stats.disponibilidad < 0.5 || stats.erroresConsecutivos > 3) {
                calidad = 'mala'
            } else if (stats.disponibilidad < 0.8 || stats.latencia > 2000) {
                calidad = 'regular'
            }
            
            if (stats.calidad !== calidad) {
                console.log(`📊 Calidad de ${url} cambió a: ${calidad}`)
                stats.calidad = calidad
            }
        }
        
        obtenerMejoresRelés(cantidad = 3) {
            return Array.from(this.estadísticas.entries())
                .filter(([url, stats]) => stats.calidad !== 'mala')
                .sort(([,a], [,b]) => {
                    // Ordenar por disponibilidad y luego por latencia
                    if (a.disponibilidad !== b.disponibilidad) {
                        return b.disponibilidad - a.disponibilidad
                    }
                    return a.latencia - b.latencia
                })
                .slice(0, cantidad)
                .map(([url]) => url)
        }
        
        mostrarEstadísticas() {
            console.table(
                Array.from(this.estadísticas.entries()).map(([url, stats]) => ({
                    url,
                    disponibilidad: `${(stats.disponibilidad * 100).toFixed(1)}%`,
                    latencia: `${stats.latencia}ms`,
                    calidad: stats.calidad,
                    errores: stats.erroresConsecutivos
                }))
            )
        }
    }

    // Uso
    const monitor = new MonitorRelés(pool)
    
    // Mostrar estadísticas cada minuto
    setInterval(() => {
        monitor.mostrarEstadísticas()
        console.log('Mejores relés:', monitor.obtenerMejoresRelés())
    }, 60000)
    ```

## Mejores Prácticas

!!! tip "Mejores Prácticas de Comunicación con Relés"
    
    1. **Usa Múltiples Relés**: Nunca dependas de un solo relé
    2. **Maneja Fallas Graciosamente**: Siempre ten mecanismos de respaldo
    3. **Monitorea Salud**: Rastrea el rendimiento de relés y cambia cuando sea necesario
    4. **Deduplica Eventos**: Maneja el mismo evento de múltiples relés
    5. **Limita Suscripciones**: No sobrecargues relés con demasiados filtros
    6. **Cierra Suscripciones No Usadas**: Limpia cuando termines
    7. **Respeta Límites de Velocidad**: Verifica la información del relé para limitaciones

!!! warning "Errores Comunes"
    
    - **No manejar desconexiones**: Los relés pueden desconectarse
    - **Olvidar cancelar suscripciones**: Puede llevar a pérdidas de memoria
    - **Demasiadas suscripciones concurrentes**: Puede abrumar clientes
    - **Ignorar limitaciones del relé**: Verifica max_subscriptions y otros límites
    - **No validar eventos**: Siempre verifica firmas y formato

## Ejemplo Completo: Cliente de Chat

Aquí hay un ejemplo completo que combina todos los conceptos:

=== "Cliente de Chat"

    ```javascript
    class ClienteChat {
        constructor() {
            this.pool = new PoolRelés()
            this.deduplicador = new DeduplicadorEventos()
            this.monitor = new MonitorRelés(this.pool)
            this.suscripciones = []
        }
        
        async inicializar(privateKey, canales = ['general']) {
            this.privateKey = privateKey
            this.publicKey = getPublicKey(privateKey)
            
            await this.pool.inicializar()
            this.configurarSuscripciones(canales)
            
            console.log('[CHAT] Cliente de chat inicializado')
        }
        
        configurarSuscripciones(canales) {
            // Suscribirse a mensajes de canales
            const filtrosCanal = canales.map(canal => ({
                kinds: [42], // Mensajes de canal
                '#t': [canal],
                limit: 50,
                since: Math.floor(Date.now() / 1000) - 3600
            }))
            
            // Suscribirse a menciones directas
            const filtroMenciones = {
                kinds: [1, 42],
                '#p': [this.publicKey],
                limit: 20
            }
            
            const subs = this.pool.suscribirseATodos(
                [...filtrosCanal, filtroMenciones],
                (evento, relayUrl) => {
                    if (this.deduplicador.esNuevo(evento)) {
                        this.procesarMensaje(evento)
                    }
                }
            )
            
            this.suscripciones = subs
        }
        
        procesarMensaje(evento) {
            const timestamp = new Date(evento.created_at * 1000).toLocaleTimeString()
            const autor = evento.pubkey.slice(0, 8) + '...'
            
            if (evento.kind === 42) {
                // Mensaje de canal
                const canal = evento.tags.find(tag => tag[0] === 't')?.[1] || 'desconocido'
                console.log(`[${timestamp}] #${canal} ${autor}: ${evento.content}`)
            } else {
                // Mención directa
                console.log(`[${timestamp}] 📢 ${autor}: ${evento.content}`)
            }
        }
        
        async enviarMensaje(contenido, canal = 'general') {
            const evento = finishEvent({
                kind: 42,
                created_at: Math.floor(Date.now() / 1000),
                tags: [['t', canal]],
                content: contenido,
            }, this.privateKey)
            
            try {
                const resultados = await this.pool.publicarATodos(evento)
                const exitosos = resultados.filter(r => r.éxito).length
                console.log(`[SENT] Mensaje enviado a ${exitosos} relés`)
                return true
            } catch (error) {
                console.error('[ERROR] Error enviando mensaje:', error)
                return false
            }
        }
        
        async mencionar(pubkey, contenido) {
            const evento = finishEvent({
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [['p', pubkey]],
                content: contenido,
            }, this.privateKey)
            
            return this.pool.publicarATodos(evento)
        }
        
        cerrar() {
            this.suscripciones.forEach(sub => sub.unsub())
            this.pool.cerrarTodo()
            this.deduplicador.destruir()
            console.log('👋 Cliente de chat cerrado')
        }
    }

    // Uso
    const cliente = new ClienteChat()
    await cliente.inicializar(miPrivateKey, ['general', 'nostr', 'dev'])

    // Enviar mensajes
    await cliente.enviarMensaje('¡Hola a todos!', 'general')
    await cliente.mencionar(otroPubkey, '¿Cómo estás?')

    // Cerrar cuando termine
    process.on('SIGINT', () => {
        cliente.cerrar()
        process.exit(0)
    })
    ```

## Próximos Pasos

Ahora puedes explorar:

- [Entendiendo Eventos](./understanding-events.md) - Estructuras de datos profundas
- [Construir un Cliente Simple](./simple-client.md) - Aplicación práctica

---

<div class="tutorial-navigation">
  <a href="./understanding-events.md" class="btn btn-outline">
     Anterior: Entendiendo Eventos
  </a>
  <a href="./simple-client.md" class="btn btn-primary">
    Siguiente: Cliente Simple →
  </a>
</div>