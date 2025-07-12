# Despliegue de Infraestructura de Relés

!!! info "Objetivos de Aprendizaje"
    Al final de esta lección, entenderás:
    
    - Arquitectura de relés y requisitos operacionales
    - Procedimientos de instalación y configuración para despliegue en producción
    - Técnicas de endurecimiento de seguridad y optimización de rendimiento
    - Estrategias de monitoreo, mantenimiento y escalado

## Resumen de Infraestructura de Relés

Los relés de Nostr sirven como la infraestructura fundamental para el protocolo descentralizado, proporcionando servicios de almacenamiento, recuperación y distribución de eventos. Operar un relé contribuye a la resistencia de la red mientras ofrece control sobre la persistencia de datos y políticas de acceso.

Entender el despliegue de relés permite la participación en la infraestructura del protocolo y soporta casos de uso avanzados incluyendo redes privadas, curación de contenido y servicios especializados.

## Consideraciones de Arquitectura de Despliegue

### Requisitos del Sistema

#### Especificaciones Mínimas de Producción
- **CPU**: 2+ núcleos con soporte de conjunto de instrucciones moderno
- **Memoria**: 4GB RAM mínimo, 8GB+ recomendado para mayor rendimiento
- **Almacenamiento**: 50GB+ SSD con capacidad de expansión para crecimiento de base de datos de eventos
- **Red**: Conexión a internet confiable con asignación adecuada de ancho de banda
- **Sistema Operativo**: Distribución Linux con actualizaciones de seguridad actuales

#### Consideraciones de Escalado
- El almacenamiento de base de datos crece aproximadamente 1-10GB por mes dependiendo de las políticas del relé
- Los requisitos de ancho de banda de red escalan con el conteo de usuarios y patrones de actividad
- La utilización de CPU se correlaciona con la validación de eventos y operaciones criptográficas
- El uso de memoria depende de la concurrencia de conexiones y estrategias de caché

### Opciones de Arquitectura de Software

#### Strfry (Implementación en C++)
**Características Técnicas:**
- Implementación de alto rendimiento optimizada para throughput y latencia
- Backend de base de datos LMDB proporcionando cumplimiento ACID y resistencia a fallos
- Huella de recursos mínima con gestión eficiente de memoria
- Arquitectura de plugins para filtrado personalizado de eventos y aplicación de políticas

**Beneficios Operacionales:**
- Estabilidad probada bajo condiciones de alta carga
- Herramientas administrativas integrales para gestión de base de datos
- Desarrollo activo con actualizaciones regulares de seguridad y rendimiento
- Documentación extensa de despliegue y soporte comunitario

#### Nostream (TypeScript/Node.js)
**Características Técnicas:**
- Integración del ecosistema JavaScript con amplio soporte de librerías
- Opciones de base de datos PostgreSQL o SQLite para diferentes escalas de despliegue
- Procesamiento de pagos integrado e integración con Lightning Network
- Arquitectura modular que soporta plugins personalizados y extensiones

**Beneficios Operacionales:**
- Entorno de desarrollo familiar para desarrolladores web
- Endpoints API integrales para monitoreo y administración
- Características avanzadas incluyendo analíticas y gestión de usuarios
- Soporte de contenedorización Docker para despliegue simplificado

## Despliegue de Producción: Implementación Strfry

### Preparación del Sistema

**Aprovisionamiento del Servidor:**
```bash
# Actualizaciones del sistema y endurecimiento de seguridad
apt update && apt upgrade -y
apt install -y ufw fail2ban unattended-upgrades

# Configuración del firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Crear usuario dedicado del sistema
useradd -r -s /bin/false -d /opt/strfry strfry
mkdir -p /opt/strfry
chown strfry:strfry /opt/strfry
```

**Instalación de Dependencias:**
```bash
# Dependencias de compilación
apt install -y git build-essential libtool autotools-dev automake \
pkg-config libssl-dev libevent-dev bsdmainutils python3 \
nginx certbot python3-certbot-nginx

# Librerías de optimización de rendimiento
apt install -y libjemalloc2 libjemalloc-dev
```

### Compilación e Instalación de Strfry

**Preparación del Código Fuente:**
```bash
cd /opt/strfry
sudo -u strfry git clone https://github.com/hoytech/strfry.git .
sudo -u strfry git submodule update --init
```

**Configuración de Compilación:**
```bash
# Configurar entorno de compilación
sudo -u strfry make setup-golpe

# Compilar con optimizaciones
sudo -u strfry make -j$(nproc) CXXFLAGS="-O3 -march=native"

# Verificar integridad de compilación
sudo -u strfry ./strfry --version
```

### Gestión de Configuración

**Archivo de Configuración Principal (`/opt/strfry/strfry.conf`):**
```toml
# Configuración de base de datos
db = "/opt/strfry/data/strfry-db/"

dbParams {
    maxreaders = 512
    mapsize = 1TB
}

# Configuración de red
relay {
    bind = "127.0.0.1"
    port = 7777
    nofiles = 65536
    
    # Ajuste de rendimiento
    maxWebsocketPayloadSize = 131072
    autoPingSeconds = 30
    enableTcpKeepalive = true
    queryTimesliceBudgetMicroseconds = 5000
    
    # Limitación de velocidad
    maxFilterLimit = 1000
    maxSubsPerConnection = 50
    
    # Metadatos del relé (NIP-11)
    info {
        name = "Relé Nostr de Producción"
        description = "Infraestructura de relé Nostr de alto rendimiento"
        pubkey = "<relay_operator_pubkey>"
        contact = "admin@relay.example.com"
        supported_nips = [1, 2, 9, 11, 12, 15, 16, 20, 22]
        software = "strfry"
        version = "0.9.6"
    }
}

# Filtrado y validación de eventos
events {
    maxEventSize = 65536
    rejectEventsNewerThanSeconds = 900
    rejectEventsOlderThanSeconds = 31536000
    rejectEphemeralEventsOlderThanSeconds = 60
    maxNumTags = 1000
    maxTagValSize = 1024
}

# Configuración de política de escritura
writePolicy {
    plugin = "/opt/strfry/write-policy.sh"
}
```

**Implementación de Política de Escritura (`/opt/strfry/write-policy.sh`):**
```bash
#!/bin/bash

# Leer evento desde stdin
event=$(cat)

# Extraer propiedades del evento para análisis
kind=$(echo "$event" | jq -r '.kind')
pubkey=$(echo "$event" | jq -r '.pubkey')
content=$(echo "$event" | jq -r '.content')

# Filtrado básico de contenido
if echo "$content" | grep -qi "spam\|scam\|malware"; then
    echo '{"action": "reject", "msg": "Violación de política de contenido"}'
    exit 0
fi

# Limitación de velocidad por pubkey (implementar con almacenamiento externo)
# rate_limit_check "$pubkey" || {
#     echo '{"action": "reject", "msg": "Límite de velocidad excedido"}'
#     exit 0
# }

# Aceptar eventos que cumplen
echo '{"action": "accept"}'
```

### Configuración de Proxy Inverso

**Configuración de Nginx (`/etc/nginx/sites-available/nostr-relay`):**
```nginx
upstream strfry_backend {
    server 127.0.0.1:7777;
    keepalive 32;
}

server {
    listen 80;
    server_name relay.example.com;
    
    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name relay.example.com;
    
    # Configuración SSL
    ssl_certificate /etc/letsencrypt/live/relay.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/relay.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Optimización de rendimiento
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # Configuración de proxy WebSocket
    location / {
        proxy_pass http://strfry_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Configuración de timeout
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Configuración de buffer
        proxy_buffering off;
        proxy_request_buffering off;
    }
    
    # Información del relé NIP-11
    location = / {
        add_header Content-Type application/nostr+json;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
        
        if ($http_accept ~* "application/nostr\+json") {
            proxy_pass http://strfry_backend;
        }
        
        # Respuesta por defecto para navegadores web
        return 200 '{"name":"Relé Nostr de Producción","description":"Infraestructura de relé de alto rendimiento","supported_nips":[1,2,9,11,12,15,16,20,22],"software":"strfry","version":"0.9.6"}';
    }
}
```

### Gestión de Certificados SSL

**Configuración de Let's Encrypt:**
```bash
# Generación inicial de certificados
certbot --nginx -d relay.example.com --email admin@example.com --agree-tos

# Configuración de renovación automática
cat > /etc/cron.d/certbot << EOF
0 12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF
```

### Configuración de Servicio del Sistema

**Unidad de Servicio Systemd (`/etc/systemd/system/strfry.service`):**
```ini
[Unit]
Description=Relé Nostr Strfry
After=network.target
Wants=network.target

[Service]
Type=simple
User=strfry
Group=strfry
WorkingDirectory=/opt/strfry
ExecStart=/opt/strfry/strfry relay
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

# Endurecimiento de seguridad
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/strfry/data

# Límites de recursos
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
```

**Gestión de Servicios:**
```bash
# Habilitar e iniciar servicio
systemctl daemon-reload
systemctl enable strfry
systemctl start strfry

# Verificar operación
systemctl status strfry
journalctl -u strfry -f
```

## Monitoreo y Mantenimiento

### Monitoreo de Rendimiento

**Recolección de Métricas del Sistema:**
```bash
# Instalar herramientas de monitoreo
apt install -y htop iotop nethogs

# Monitoreo de tamaño de base de datos
du -sh /opt/strfry/data/strfry-db/

# Monitoreo de conexiones
ss -tuln | grep :7777
netstat -an | grep :443 | wc -l
```

**Métricas de Aplicación:**
```bash
# Estadísticas del relé
/opt/strfry/strfry export --count

# Análisis de eventos
/opt/strfry/strfry export --since=1hour | jq '.kind' | sort | uniq -c

# Pruebas de rendimiento
echo '["REQ","test",{"kinds":[1],"limit":10}]' | websocat wss://relay.example.com
```

### Mantenimiento de Base de Datos

**Operaciones de Mantenimiento Rutinario:**
```bash
# Compactación de base de datos
systemctl stop strfry
sudo -u strfry /opt/strfry/strfry compact
systemctl start strfry

# Procedimientos de respaldo
sudo -u strfry /opt/strfry/strfry export > backup-$(date +%Y%m%d).jsonl
tar -czf backup-$(date +%Y%m%d).tar.gz /opt/strfry/data/

# Verificación de base de datos
sudo -u strfry /opt/strfry/strfry verify
```

### Endurecimiento de Seguridad

**Implementación de Control de Acceso:**
```bash
# Configuración de Fail2ban para abuso de WebSocket
cat > /etc/fail2ban/jail.d/strfry.conf << EOF
[strfry]
enabled = true
port = 443
filter = strfry
logpath = /var/log/nginx/access.log
maxretry = 10
bantime = 3600
findtime = 600
EOF

# Limitación de velocidad a nivel nginx
# Agregar a configuración nginx:
# limit_req_zone $binary_remote_addr zone=websocket:10m rate=10r/s;
# limit_req zone=websocket burst=20 nodelay;
```

**Seguridad de Red:**
```bash
# Configuración de protección DDoS
echo 'net.core.rmem_default = 262144' >> /etc/sysctl.conf
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_default = 262144' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
sysctl -p
```

## Ejercicio Práctico: Laboratorio de Despliegue de Relé

!!! example "Implementación de Relé de Producción"
    
    **Objetivo:** Desplegar y configurar un relé Nostr listo para producción
    
    **Fase 1: Configuración de Infraestructura**
    1. Aprovisionar VPS con especificaciones apropiadas
    2. Completar endurecimiento de seguridad y preparación del sistema
    3. Instalar y configurar todas las dependencias requeridas
    4. Implementar infraestructura de monitoreo y logging
    
    **Fase 2: Configuración del Relé**
    1. Compilar e instalar Strfry con optimizaciones
    2. Configurar políticas del relé y parámetros operacionales
    3. Implementar proxy inverso con terminación SSL
    4. Crear servicio systemd para gestión de procesos
    
    **Fase 3: Pruebas y Validación**
    1. Verificar conectividad WebSocket y cumplimiento del protocolo
    2. Probar funcionalidad de publicación y recuperación de eventos
    3. Validar configuración y renovación de certificados SSL
    4. Realizar pruebas de carga y optimización de rendimiento
    
    **Fase 4: Procedimientos Operacionales**
    1. Implementar procedimientos de respaldo y recuperación
    2. Configurar sistemas de monitoreo y alertas
    3. Documentar procedimientos de mantenimiento y solución de problemas
    4. Establecer procesos de actualización de seguridad y gestión de parches

## Escalado y Optimización

### Optimización de Rendimiento

**Ajuste de Base de Datos:**
```toml
# Configuración avanzada de LMDB
dbParams {
    maxreaders = 1024
    mapsize = 5TB
    
    # Optimización de mapeo de memoria
    mdb_env_set_mapsize = 5497558138880  # 5TB en bytes
    mdb_env_set_maxdbs = 16
}
```

**Optimización de Conexiones:**
```toml
relay {
    # Incrementar límites de conexión
    nofiles = 131072
    maxSubsPerConnection = 100
    
    # Optimizar rendimiento de consultas
    queryTimesliceBudgetMicroseconds = 10000
    maxFilterLimit = 2000
    
    # Ajuste de red
    autoPingSeconds = 25
    enableTcpKeepalive = true
}
```

### Estrategias de Escalado Horizontal

**Configuración de Balanceamiento de Carga:**
```nginx
upstream strfry_cluster {
    least_conn;
    server 10.0.1.10:7777 weight=3;
    server 10.0.1.11:7777 weight=3;
    server 10.0.1.12:7777 weight=2;
    
    keepalive 64;
}
```

**Replicación de Base de Datos:**
```bash
# Configuración de replicación maestro-esclavo
/opt/strfry/strfry sync --source wss://master-relay.example.com \
                        --target /opt/strfry/data/strfry-db/
```

## Solución de Problemas y Diagnósticos

### Problemas Comunes y Resolución

**Problemas de Conexión:**
```bash
# Pruebas de conectividad WebSocket
wscat -c wss://relay.example.com

# Validación de certificado SSL
openssl s_client -connect relay.example.com:443 -servername relay.example.com

# Análisis de conectividad de red
tcptraceroute relay.example.com 443
```

**Problemas de Rendimiento:**
```bash
# Análisis de utilización de recursos
htop
iotop -a
iostat -x 1

# Monitoreo de rendimiento de base de datos
/opt/strfry/strfry stats
lmdb_stat /opt/strfry/data/strfry-db/
```

**Problemas de Procesamiento de Eventos:**
```bash
# Pruebas de validación de eventos
echo '{"id":"test","pubkey":"test","created_at":1234567890,"kind":1,"tags":[],"content":"test","sig":"test"}' | /opt/strfry/strfry import

# Depuración de política de escritura
echo '{"kind":1,"content":"contenido de prueba"}' | /opt/strfry/write-policy.sh
```

## Configuración Avanzada

### Filtrado Personalizado de Eventos

**Política de Escritura Avanzada:**
```bash
#!/bin/bash

event=$(cat)

# Extraer metadatos del evento
kind=$(echo "$event" | jq -r '.kind')
pubkey=$(echo "$event" | jq -r '.pubkey')
created_at=$(echo "$event" | jq -r '.created_at')
content=$(echo "$event" | jq -r '.content')

# Validación de timestamp
current_time=$(date +%s)
time_diff=$((current_time - created_at))

if [ $time_diff -gt 300 ] || [ $time_diff -lt -60 ]; then
    echo '{"action": "reject", "msg": "Timestamp inválido"}'
    exit 0
fi

# Validación de longitud de contenido
content_length=${#content}
if [ $content_length -gt 10000 ]; then
    echo '{"action": "reject", "msg": "Contenido demasiado largo"}'
    exit 0
fi

# Implementación de lista blanca/negra
if grep -q "$pubkey" /opt/strfry/blacklist.txt; then
    echo '{"action": "reject", "msg": "Usuario bloqueado"}'
    exit 0
fi

echo '{"action": "accept"}'
```

### Analíticas y Reportes

**Implementación de Analíticas de Eventos:**
```bash
# Estadísticas diarias de eventos
/opt/strfry/strfry export --since=1day | \
jq -r '[.kind, .pubkey[0:8]] | @csv' | \
sort | uniq -c | sort -nr > daily-stats.txt

# Análisis de actividad de usuarios
/opt/strfry/strfry export --since=1week | \
jq -r '.pubkey' | sort | uniq -c | sort -nr | head -20
```

## Próximos Pasos

El despliegue exitoso de relés proporciona experiencia práctica con la infraestructura de Nostr y te prepara para el desarrollo avanzado de protocolos. Entender los requisitos operacionales permite una contribución efectiva a la infraestructura de red y el desarrollo de servicios especializados.

<div class="next-lesson">
  <a href="../../concepts/" class="btn btn-primary">
    Conceptos Avanzados del Protocolo →
  </a>
</div>

---

## Evaluación de Maestría en Infraestructura

!!! question "Competencia en Operaciones de Relé"
    
    1. ¿Cuáles son las consideraciones críticas para la configuración y optimización de la base de datos del relé?
    2. ¿Cómo permiten las políticas de escritura la moderación de contenido mientras mantienen los principios de descentralización?
    3. ¿Qué medidas de seguridad son esenciales para el despliegue de relés en producción?
    4. ¿Cómo pueden los operadores de relés equilibrar rendimiento, escalabilidad y costos de recursos?
    
    ??? success "Análisis de Infraestructura"
        1. **La configuración de base de datos** debe equilibrar eficiencia de almacenamiento, rendimiento de consultas y patrones de acceso concurrente mientras asegura integridad de datos y resistencia a fallos
        2. **Las políticas de escritura** proporcionan filtrado programático de contenido a nivel de relé, permitiendo a los operadores implementar reglas personalizadas mientras los usuarios conservan la capacidad de elegir relés que se alineen con sus preferencias
        3. **Las medidas de seguridad** incluyen endurecimiento del sistema, protección de red, cifrado SSL/TLS, control de acceso, monitoreo y actualizaciones regulares de seguridad para proteger contra varios vectores de ataque
        4. **La optimización de rendimiento** requiere ajuste cuidadoso de parámetros de base de datos, límites de conexión, estrategias de caché y recursos de hardware mientras implementa estrategias de escalado rentables

---