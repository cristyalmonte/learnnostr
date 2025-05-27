# Setting Up a Nostr Relay

A Nostr relay is a server that stores and forwards Nostr events. Running your own relay gives you control over your data and helps strengthen the Nostr network's decentralization.

## What You'll Learn

- How to choose the right relay software
- Setting up a basic relay
- Configuring relay policies
- Monitoring and maintenance

## Prerequisites

- Basic command line knowledge
- A server or VPS (Virtual Private Server)
- Domain name (optional but recommended)

## Popular Relay Implementations

### 1. Strfry (Recommended for Beginners)

**Strfry** is a high-performance relay written in C++ that's easy to set up and configure.

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install git build-essential libtool autotools-dev automake pkg-config libssl-dev libevent-dev bsdmainutils python3

# Clone and build strfry
git clone https://github.com/hoytech/strfry.git
cd strfry
git submodule update --init
make setup-golpe
make -j4
```

### 2. Nostream (Node.js)

**Nostream** is a TypeScript/Node.js relay that's feature-rich and actively maintained.

```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup nostream
git clone https://github.com/Cameri/nostream.git
cd nostream
npm install
```

### 3. Relay Pool (Go)

**Relay Pool** is a lightweight Go implementation that's simple to deploy.

```bash
# Install Go
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# Clone and build
git clone https://github.com/fiatjaf/relay-pool.git
cd relay-pool
go build
```

## Basic Configuration

### Strfry Configuration

Create a configuration file `strfry.conf`:

```toml
##
## Default strfry config
##

# Directory that contains the strfry LMDB database (restart required)
db = "./strfry-db/"

dbParams {
    # Maximum number of threads/processes that can simultaneously have LMDB transactions open (restart required)
    maxreaders = 256

    # Size of mmap to use when loading LMDB (restart required)
    mapsize = 1TB
}

relay {
    # Interface to listen on. Use 0.0.0.0 to listen on all interfaces (restart required)
    bind = "0.0.0.0"

    # Port to open for the nostr websocket protocol (restart required)
    port = 7777

    # Set OS-limit on maximum number of open files/sockets (if 0, don't attempt to set) (restart required)
    nofiles = 1000000

    # HTTP header that contains the client's real IP, before reverse proxying (ie x-real-ip) (MUST be all lower-case)
    realIpHeader = ""

    info {
        # NIP-11: Name of this server. Short/descriptive (< 30 characters)
        name = "My Nostr Relay"

        # NIP-11: Detailed plain-text description of relay
        description = "A personal Nostr relay"

        # NIP-11: Administrative nostr pubkey, for contact purposes
        pubkey = "your-pubkey-here"

        # NIP-11: Alternative administrative contact (email, website, etc)
        contact = "admin@yourrelay.com"
    }

    # Maximum accepted incoming websocket frame size (should be larger than max event and yesstr msg size)
    maxWebsocketPayloadSize = 131072

    # Websocket-level PING message frequency (should be less than any reverse proxy idle timeouts)
    autoPingSeconds = 55

    # If TCP keep-alive should be enabled (detect dropped connections to upstream reverse proxy)
    enableTcpKeepalive = false

    # How much uninterrupted CPU time a REQ query should get during its DB scan
    queryTimesliceBudgetMicroseconds = 10000

    # Maximum records that can be returned per filter
    maxFilterLimit = 500

    # Maximum number of subscriptions (concurrent REQs) a connection can have open at any time
    maxSubsPerConnection = 20

    writePolicy {
        # If non-empty, path to an executable script that implements the writePolicy plugin logic
        plugin = ""
    }

    compression {
        # Use permessage-deflate compression if supported by client. Reduces bandwidth, but uses more CPU (restart required)
        enabled = true

        # Maintain a sliding window buffer for each connection. Improves compression, but uses more memory (restart required)
        slidingWindow = true
    }
}

events {
    # Maximum size of normalised JSON, in bytes
    maxEventSize = 65536

    # Events newer than this will be rejected
    rejectEventsNewerThanSeconds = 900

    # Events older than this will be rejected
    rejectEventsOlderThanSeconds = 94608000

    # Ephemeral events older than this will be rejected
    rejectEphemeralEventsOlderThanSeconds = 60

    # Ephemeral events newer than this will be rejected
    rejectEphemeralEventsNewerThanSeconds = 60

    # Maximum number of tags allowed
    maxNumTags = 2000

    # Maximum size for tag values
    maxTagValSize = 1024
}
```

### Running Your Relay

```bash
# Start strfry
./strfry relay

# Or run in background
nohup ./strfry relay > relay.log 2>&1 &
```

## Setting Up Reverse Proxy (Nginx)

For production deployment, use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name your-relay-domain.com;

    location / {
        proxy_pass http://127.0.0.1:7777;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/TLS Setup

Use Let's Encrypt for free SSL certificates:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-relay-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Relay Policies and Moderation

### Content Filtering

You can implement content filtering using plugins or built-in policies:

```bash
# Example strfry write policy script
#!/bin/bash
# This script can accept or reject events based on custom logic

# Read the event from stdin
event=$(cat)

# Example: Reject events with certain keywords
if echo "$event" | grep -q "spam\|scam"; then
    echo '{"action": "reject", "msg": "Content policy violation"}'
    exit 0
fi

# Accept the event
echo '{"action": "accept"}'
```

### Rate Limiting

Configure rate limiting to prevent abuse:

```toml
# In strfry.conf
writePolicy {
    plugin = "./write-policy.sh"
    
    # Rate limiting settings
    rateLimitPerSecond = 10
    rateLimitBurst = 50
}
```

## Monitoring Your Relay

### Basic Monitoring

```bash
# Check relay status
curl -H "Accept: application/nostr+json" http://your-relay.com

# Monitor logs
tail -f relay.log

# Check database size
du -sh strfry-db/
```

### Advanced Monitoring

Set up monitoring with tools like:

- **Prometheus + Grafana** for metrics
- **Uptime monitoring** services
- **Log aggregation** tools

## Relay Discovery

### NIP-11 Relay Information

Ensure your relay provides proper NIP-11 information:

```json
{
  "name": "My Nostr Relay",
  "description": "A personal relay for the Nostr network",
  "pubkey": "your-pubkey-here",
  "contact": "admin@yourrelay.com",
  "supported_nips": [1, 2, 9, 11, 12, 15, 16, 20, 22],
  "software": "strfry",
  "version": "0.9.6"
}
```

### Adding to Relay Lists

Submit your relay to:

- [Nostr.watch](https://nostr.watch)
- [Relay registries](https://github.com/fiatjaf/nostr-relay-registry)
- Community relay lists

## Maintenance and Updates

### Regular Tasks

```bash
# Backup database
cp -r strfry-db/ backup-$(date +%Y%m%d)/

# Update software
git pull
make -j4

# Restart relay
pkill strfry
nohup ./strfry relay > relay.log 2>&1 &
```

### Database Maintenance

```bash
# Compact database (strfry)
./strfry compact

# Check database integrity
./strfry verify
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Check firewall and port configuration
2. **SSL errors**: Verify certificate installation
3. **High memory usage**: Adjust database parameters
4. **Slow queries**: Optimize database settings

### Debug Mode

```bash
# Run with debug logging
./strfry relay --verbose

# Check specific event
./strfry export --since=1hour | grep "event-id"
```

## Next Steps

- Join relay operator communities
- Implement custom policies
- Set up monitoring and alerting
- Consider clustering for high availability

## Resources

- [Strfry Documentation](https://github.com/hoytech/strfry)
- [Nostream Guide](https://github.com/Cameri/nostream)
- [Relay Operator Chat](https://t.me/nostr_relay_operators)
- [NIP-11 Specification](https://github.com/nostr-protocol/nips/blob/master/11.md)

!!! tip "Pro Tip"
    Start with a simple setup and gradually add features. Monitor your relay's performance and adjust configurations based on usage patterns. 