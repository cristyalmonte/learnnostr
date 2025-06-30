# Relay Infrastructure Deployment

!!! info "Learning Objectives"
    By the end of this lesson, you'll understand:
    
    - Relay architecture and operational requirements
    - Installation and configuration procedures for production deployment
    - Security hardening and performance optimization techniques
    - Monitoring, maintenance, and scaling strategies

## Relay Infrastructure Overview

Nostr relays serve as the foundational infrastructure for the decentralized protocol, providing event storage, retrieval, and distribution services. Operating a relay contributes to network resilience while offering control over data persistence and access policies.

Understanding relay deployment enables participation in protocol infrastructure and supports advanced use cases including private networks, content curation, and specialized services.

## Deployment Architecture Considerations

### System Requirements

#### Minimum Production Specifications
- **CPU**: 2+ cores with modern instruction set support
- **Memory**: 4GB RAM minimum, 8GB+ recommended for higher throughput
- **Storage**: 50GB+ SSD with expansion capability for event database growth
- **Network**: Reliable internet connection with adequate bandwidth allocation
- **Operating System**: Linux distribution with current security updates

#### Scaling Considerations
- Database storage grows approximately 1-10GB per month depending on relay policies
- Network bandwidth requirements scale with user count and activity patterns
- CPU utilization correlates with event validation and cryptographic operations
- Memory usage depends on connection concurrency and caching strategies

### Software Architecture Options

#### Strfry (C++ Implementation)
**Technical Characteristics:**
- High-performance implementation optimized for throughput and latency
- LMDB database backend providing ACID compliance and crash resistance
- Minimal resource footprint with efficient memory management
- Plugin architecture for custom event filtering and policy enforcement

**Operational Benefits:**
- Proven stability under high-load conditions
- Comprehensive administrative tooling for database management
- Active development with regular security and performance updates
- Extensive deployment documentation and community support

#### Nostream (TypeScript/Node.js)
**Technical Characteristics:**
- JavaScript ecosystem integration with extensive library support
- PostgreSQL or SQLite database options for different deployment scales
- Built-in payment processing and Lightning Network integration
- Modular architecture supporting custom plugins and extensions

**Operational Benefits:**
- Familiar development environment for web developers
- Comprehensive API endpoints for monitoring and administration
- Advanced features including analytics and user management
- Docker containerization support for simplified deployment

## Production Deployment: Strfry Implementation

### System Preparation

**Server Provisioning:**
```bash
# System updates and security hardening
apt update && apt upgrade -y
apt install -y ufw fail2ban unattended-upgrades

# Firewall configuration
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Create dedicated system user
useradd -r -s /bin/false -d /opt/strfry strfry
mkdir -p /opt/strfry
chown strfry:strfry /opt/strfry
```

**Dependency Installation:**
```bash
# Build dependencies
apt install -y git build-essential libtool autotools-dev automake \
pkg-config libssl-dev libevent-dev bsdmainutils python3 \
nginx certbot python3-certbot-nginx

# Performance optimization libraries
apt install -y libjemalloc2 libjemalloc-dev
```

### Strfry Compilation and Installation

**Source Code Preparation:**
```bash
cd /opt/strfry
sudo -u strfry git clone https://github.com/hoytech/strfry.git .
sudo -u strfry git submodule update --init
```

**Build Configuration:**
```bash
# Configure build environment
sudo -u strfry make setup-golpe

# Compile with optimizations
sudo -u strfry make -j$(nproc) CXXFLAGS="-O3 -march=native"

# Verify build integrity
sudo -u strfry ./strfry --version
```

### Configuration Management

**Primary Configuration File (`/opt/strfry/strfry.conf`):**
```toml
# Database configuration
db = "/opt/strfry/data/strfry-db/"

dbParams {
    maxreaders = 512
    mapsize = 1TB
}

# Network configuration
relay {
    bind = "127.0.0.1"
    port = 7777
    nofiles = 65536
    
    # Performance tuning
    maxWebsocketPayloadSize = 131072
    autoPingSeconds = 30
    enableTcpKeepalive = true
    queryTimesliceBudgetMicroseconds = 5000
    
    # Rate limiting
    maxFilterLimit = 1000
    maxSubsPerConnection = 50
    
    # Relay metadata (NIP-11)
    info {
        name = "Production Nostr Relay"
        description = "High-performance Nostr relay infrastructure"
        pubkey = "<relay_operator_pubkey>"
        contact = "admin@relay.example.com"
        supported_nips = [1, 2, 9, 11, 12, 15, 16, 20, 22]
        software = "strfry"
        version = "0.9.6"
    }
}

# Event filtering and validation
events {
    maxEventSize = 65536
    rejectEventsNewerThanSeconds = 900
    rejectEventsOlderThanSeconds = 31536000
    rejectEphemeralEventsOlderThanSeconds = 60
    maxNumTags = 1000
    maxTagValSize = 1024
}

# Write policy configuration
writePolicy {
    plugin = "/opt/strfry/write-policy.sh"
}
```

**Write Policy Implementation (`/opt/strfry/write-policy.sh`):**
```bash
#!/bin/bash

# Read event from stdin
event=$(cat)

# Extract event properties for analysis
kind=$(echo "$event" | jq -r '.kind')
pubkey=$(echo "$event" | jq -r '.pubkey')
content=$(echo "$event" | jq -r '.content')

# Basic content filtering
if echo "$content" | grep -qi "spam\|scam\|malware"; then
    echo '{"action": "reject", "msg": "Content policy violation"}'
    exit 0
fi

# Rate limiting by pubkey (implement with external storage)
# rate_limit_check "$pubkey" || {
#     echo '{"action": "reject", "msg": "Rate limit exceeded"}'
#     exit 0
# }

# Accept compliant events
echo '{"action": "accept"}'
```

### Reverse Proxy Configuration

**Nginx Configuration (`/etc/nginx/sites-available/nostr-relay`):**
```nginx
upstream strfry_backend {
    server 127.0.0.1:7777;
    keepalive 32;
}

server {
    listen 80;
    server_name relay.example.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name relay.example.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/relay.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/relay.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Performance optimization
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # WebSocket proxy configuration
    location / {
        proxy_pass http://strfry_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout configuration
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer configuration
        proxy_buffering off;
        proxy_request_buffering off;
    }
    
    # NIP-11 relay information
    location = / {
        add_header Content-Type application/nostr+json;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
        
        if ($http_accept ~* "application/nostr\+json") {
            proxy_pass http://strfry_backend;
        }
        
        # Default response for web browsers
        return 200 '{"name":"Production Nostr Relay","description":"High-performance relay infrastructure","supported_nips":[1,2,9,11,12,15,16,20,22],"software":"strfry","version":"0.9.6"}';
    }
}
```

### SSL Certificate Management

**Let's Encrypt Configuration:**
```bash
# Initial certificate generation
certbot --nginx -d relay.example.com --email admin@example.com --agree-tos

# Automatic renewal configuration
cat > /etc/cron.d/certbot << EOF
0 12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF
```

### System Service Configuration

**Systemd Service Unit (`/etc/systemd/system/strfry.service`):**
```ini
[Unit]
Description=Strfry Nostr Relay
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

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/strfry/data

# Resource limits
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
```

**Service Management:**
```bash
# Enable and start service
systemctl daemon-reload
systemctl enable strfry
systemctl start strfry

# Verify operation
systemctl status strfry
journalctl -u strfry -f
```

## Monitoring and Maintenance

### Performance Monitoring

**System Metrics Collection:**
```bash
# Install monitoring tools
apt install -y htop iotop nethogs

# Database size monitoring
du -sh /opt/strfry/data/strfry-db/

# Connection monitoring
ss -tuln | grep :7777
netstat -an | grep :443 | wc -l
```

**Application Metrics:**
```bash
# Relay statistics
/opt/strfry/strfry export --count

# Event analysis
/opt/strfry/strfry export --since=1hour | jq '.kind' | sort | uniq -c

# Performance testing
echo '["REQ","test",{"kinds":[1],"limit":10}]' | websocat wss://relay.example.com
```

### Database Maintenance

**Routine Maintenance Operations:**
```bash
# Database compaction
systemctl stop strfry
sudo -u strfry /opt/strfry/strfry compact
systemctl start strfry

# Backup procedures
sudo -u strfry /opt/strfry/strfry export > backup-$(date +%Y%m%d).jsonl
tar -czf backup-$(date +%Y%m%d).tar.gz /opt/strfry/data/

# Database verification
sudo -u strfry /opt/strfry/strfry verify
```

### Security Hardening

**Access Control Implementation:**
```bash
# Fail2ban configuration for WebSocket abuse
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

# Rate limiting at nginx level
# Add to nginx configuration:
# limit_req_zone $binary_remote_addr zone=websocket:10m rate=10r/s;
# limit_req zone=websocket burst=20 nodelay;
```

**Network Security:**
```bash
# DDoS protection configuration
echo 'net.core.rmem_default = 262144' >> /etc/sysctl.conf
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_default = 262144' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
sysctl -p
```

## Practical Exercise: Relay Deployment Laboratory

!!! example "Production Relay Implementation"
    
    **Objective:** Deploy and configure a production-ready Nostr relay
    
    **Phase 1: Infrastructure Setup**
    1. Provision VPS with appropriate specifications
    2. Complete security hardening and system preparation
    3. Install and configure all required dependencies
    4. Implement monitoring and logging infrastructure
    
    **Phase 2: Relay Configuration**
    1. Compile and install Strfry with optimizations
    2. Configure relay policies and operational parameters
    3. Implement reverse proxy with SSL termination
    4. Create systemd service for process management
    
    **Phase 3: Testing and Validation**
    1. Verify WebSocket connectivity and protocol compliance
    2. Test event publishing and retrieval functionality
    3. Validate SSL certificate configuration and renewal
    4. Perform load testing and performance optimization
    
    **Phase 4: Operational Procedures**
    1. Implement backup and recovery procedures
    2. Configure monitoring and alerting systems
    3. Document maintenance procedures and troubleshooting
    4. Establish security update and patch management processes

## Scaling and Optimization

### Performance Optimization

**Database Tuning:**
```toml
# Advanced LMDB configuration
dbParams {
    maxreaders = 1024
    mapsize = 5TB
    
    # Memory mapping optimization
    mdb_env_set_mapsize = 5497558138880  # 5TB in bytes
    mdb_env_set_maxdbs = 16
}
```

**Connection Optimization:**
```toml
relay {
    # Increase connection limits
    nofiles = 131072
    maxSubsPerConnection = 100
    
    # Optimize query performance
    queryTimesliceBudgetMicroseconds = 10000
    maxFilterLimit = 2000
    
    # Network tuning
    autoPingSeconds = 25
    enableTcpKeepalive = true
}
```

### Horizontal Scaling Strategies

**Load Balancing Configuration:**
```nginx
upstream strfry_cluster {
    least_conn;
    server 10.0.1.10:7777 weight=3;
    server 10.0.1.11:7777 weight=3;
    server 10.0.1.12:7777 weight=2;
    
    keepalive 64;
}
```

**Database Replication:**
```bash
# Master-slave replication setup
/opt/strfry/strfry sync --source wss://master-relay.example.com \
                        --target /opt/strfry/data/strfry-db/
```

## Troubleshooting and Diagnostics

### Common Issues and Resolution

**Connection Problems:**
```bash
# WebSocket connectivity testing
wscat -c wss://relay.example.com

# SSL certificate validation
openssl s_client -connect relay.example.com:443 -servername relay.example.com

# Network connectivity analysis
tcptraceroute relay.example.com 443
```

**Performance Issues:**
```bash
# Resource utilization analysis
htop
iotop -a
iostat -x 1

# Database performance monitoring
/opt/strfry/strfry stats
lmdb_stat /opt/strfry/data/strfry-db/
```

**Event Processing Problems:**
```bash
# Event validation testing
echo '{"id":"test","pubkey":"test","created_at":1234567890,"kind":1,"tags":[],"content":"test","sig":"test"}' | /opt/strfry/strfry import

# Write policy debugging
echo '{"kind":1,"content":"test content"}' | /opt/strfry/write-policy.sh
```

## Advanced Configuration

### Custom Event Filtering

**Advanced Write Policy:**
```bash
#!/bin/bash

event=$(cat)

# Extract event metadata
kind=$(echo "$event" | jq -r '.kind')
pubkey=$(echo "$event" | jq -r '.pubkey')
created_at=$(echo "$event" | jq -r '.created_at')
content=$(echo "$event" | jq -r '.content')

# Timestamp validation
current_time=$(date +%s)
time_diff=$((current_time - created_at))

if [ $time_diff -gt 300 ] || [ $time_diff -lt -60 ]; then
    echo '{"action": "reject", "msg": "Invalid timestamp"}'
    exit 0
fi

# Content length validation
content_length=${#content}
if [ $content_length -gt 10000 ]; then
    echo '{"action": "reject", "msg": "Content too long"}'
    exit 0
fi

# Whitelist/blacklist implementation
if grep -q "$pubkey" /opt/strfry/blacklist.txt; then
    echo '{"action": "reject", "msg": "Blocked user"}'
    exit 0
fi

echo '{"action": "accept"}'
```

### Analytics and Reporting

**Event Analytics Implementation:**
```bash
# Daily event statistics
/opt/strfry/strfry export --since=1day | \
jq -r '[.kind, .pubkey[0:8]] | @csv' | \
sort | uniq -c | sort -nr > daily-stats.txt

# User activity analysis
/opt/strfry/strfry export --since=1week | \
jq -r '.pubkey' | sort | uniq -c | sort -nr | head -20
```

## Next Steps

Successful relay deployment provides hands-on experience with Nostr infrastructure and prepares you for advanced protocol development. Understanding operational requirements enables effective contribution to network infrastructure and specialized service development.

<div class="next-lesson">
  <a href="../../concepts/" class="btn btn-primary">
    Advanced Protocol Concepts →
  </a>
</div>

---

## Infrastructure Mastery Assessment

!!! question "Relay Operations Proficiency"
    
    1. What are the critical considerations for relay database configuration and optimization?
    2. How do write policies enable content moderation while maintaining decentralization principles?
    3. What security measures are essential for production relay deployment?
    4. How can relay operators balance performance, scalability, and resource costs?
    
    ??? success "Infrastructure Analysis"
        1. **Database configuration** must balance storage efficiency, query performance, and concurrent access patterns while ensuring data integrity and crash resistance
        2. **Write policies** provide programmatic content filtering at the relay level, allowing operators to implement custom rules while users retain the ability to choose relays that align with their preferences
        3. **Security measures** include system hardening, network protection, SSL/TLS encryption, access control, monitoring, and regular security updates to protect against various attack vectors
        4. **Performance optimization** requires careful tuning of database parameters, connection limits, caching strategies, and hardware resources while implementing cost-effective scaling strategies

---