# Module 7: Running Production Relays

!!! info "Module Overview"
    **Duration**: 8-10 hours  
    **Level**: Advanced  
    **Prerequisites**: Modules 1-6 completed  
    **Goal**: Design, deploy, and operate production-grade Nostr relays at scale

## 📋 Learning Objectives

By the end of this module, you will:

- ✅ Understand relay architecture and infrastructure requirements
- ✅ Deploy and configure production relays
- ✅ Implement advanced filtering and spam prevention
- ✅ Optimize relay performance and scalability
- ✅ Monitor relay health and troubleshoot issues
- ✅ Implement relay monetization strategies
- ✅ Handle security threats and abuse
- ✅ Plan for high availability and disaster recovery

## 7.1 Relay Architecture Fundamentals

### Relay Responsibilities

A Nostr relay has three core responsibilities:

1. **Accept Events** - Receive and validate events from clients
2. **Store Events** - Persist events according to storage policies
3. **Serve Events** - Respond to subscription filters with matching events

```mermaid
graph TB
    C1[Client 1] -->|Publish Event| R[Relay]
    C2[Client 2] -->|Subscribe Filter| R
    C3[Client 3] -->|Publish Event| R
    
    R -->|Validate| V[Validator]
    V -->|Store| S[Storage Layer]
    S -->|Query| Q[Query Engine]
    Q -->|Stream Events| C2
    
    style R fill:#667eea,stroke:#fff,color:#fff
    style V fill:#f093fb,stroke:#fff,color:#fff
    style S fill:#4facfe,stroke:#fff,color:#fff
    style Q fill:#43e97b,stroke:#fff,color:#fff
```

### Architecture Layers

```javascript
// High-level relay architecture
class NostrRelay {
  constructor(config) {
    // WebSocket server for client connections
    this.wsServer = new WebSocketServer(config.port);
    
    // Event validation and processing
    this.validator = new EventValidator();
    this.processor = new EventProcessor();
    
    // Storage backend
    this.storage = new StorageEngine(config.database);
    
    // Query and subscription management
    this.subscriptionManager = new SubscriptionManager();
    
    // Rate limiting and spam prevention
    this.rateLimiter = new RateLimiter(config.limits);
    
    // Monitoring and metrics
    this.metrics = new MetricsCollector();
  }
  
  async start() {
    await this.storage.connect();
    await this.wsServer.listen();
    console.log(`Relay started on port ${this.config.port}`);
  }
}
```

## 7.2 Storage Layer Design

### Database Selection

Different storage backends for different needs:

| Database | Best For | Pros | Cons |
|----------|----------|------|------|
| PostgreSQL | General purpose, complex queries | ACID, mature, feature-rich | Resource intensive |
| SQLite | Small relays, embedded | Simple, fast, portable | Single writer limitation |
| MongoDB | Document storage, flexibility | Schema flexibility, horizontal scaling | No ACID transactions |
| LevelDB | High performance, key-value | Very fast, low overhead | Limited query capabilities |
| Redis | Caching, real-time subscriptions | Extremely fast, pub/sub | In-memory only (expensive) |

### Optimized Schema Design

PostgreSQL example with efficient indexing:

```sql
-- Events table optimized for Nostr queries
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    pubkey TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    kind INTEGER NOT NULL,
    tags JSONB,
    content TEXT,
    sig TEXT NOT NULL,
    
    -- Computed columns for common filters
    e_tags TEXT[] GENERATED ALWAYS AS (
        array(SELECT jsonb_array_elements_text(tags) 
              FROM jsonb_array_elements(tags) 
              WHERE jsonb_array_element(tags, 0) = '"e"')
    ) STORED,
    
    p_tags TEXT[] GENERATED ALWAYS AS (
        array(SELECT jsonb_array_elements_text(tags) 
              FROM jsonb_array_elements(tags) 
              WHERE jsonb_array_element(tags, 0) = '"p"')
    ) STORED,
    
    t_tags TEXT[] GENERATED ALWAYS AS (
        array(SELECT jsonb_array_elements_text(tags) 
              FROM jsonb_array_elements(tags) 
              WHERE jsonb_array_element(tags, 0) = '"t"')
    ) STORED
);

-- Critical indexes for performance
CREATE INDEX idx_events_pubkey ON events(pubkey);
CREATE INDEX idx_events_kind ON events(kind);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_pubkey_kind ON events(pubkey, kind);

-- Tag-specific indexes using generated columns
CREATE INDEX idx_events_e_tags ON events USING GIN(e_tags);
CREATE INDEX idx_events_p_tags ON events USING GIN(p_tags);
CREATE INDEX idx_events_t_tags ON events USING GIN(t_tags);

-- Composite indexes for common filter combinations
CREATE INDEX idx_events_kind_created ON events(kind, created_at DESC);
CREATE INDEX idx_events_pubkey_created ON events(pubkey, created_at DESC);

-- Partial indexes for replaceable events
CREATE INDEX idx_replaceable_events ON events(pubkey, kind) 
    WHERE kind >= 10000 AND kind < 20000;

-- Index for parameterized replaceable events
CREATE INDEX idx_param_replaceable ON events(pubkey, kind, (tags->>'d'))
    WHERE kind >= 30000 AND kind < 40000;
```

### Storage Policies

```javascript
class StoragePolicy {
  constructor(config) {
    this.maxEventAge = config.maxEventAge || 365 * 24 * 60 * 60; // 1 year
    this.maxEventsPerPubkey = config.maxEventsPerPubkey || 10000;
    this.retentionByKind = config.retentionByKind || {};
  }
  
  shouldStore(event) {
    // Ephemeral events (20000-29999) are never stored
    if (event.kind >= 20000 && event.kind < 30000) {
      return false;
    }
    
    // Check event age
    const age = Date.now() / 1000 - event.created_at;
    if (age > this.maxEventAge) {
      return false;
    }
    
    // Check kind-specific retention
    const kindRetention = this.retentionByKind[event.kind];
    if (kindRetention && age > kindRetention) {
      return false;
    }
    
    return true;
  }
  
  async enforceReplaceableEvents(event, storage) {
    // Handle replaceable events (10000-19999)
    if (event.kind >= 10000 && event.kind < 20000) {
      await storage.deleteOlderEvents({
        pubkey: event.pubkey,
        kind: event.kind,
        created_at: { $lt: event.created_at }
      });
    }
    
    // Handle parameterized replaceable events (30000-39999)
    if (event.kind >= 30000 && event.kind < 40000) {
      const dTag = event.tags.find(t => t[0] === 'd')?.[1];
      if (dTag) {
        await storage.deleteOlderEvents({
          pubkey: event.pubkey,
          kind: event.kind,
          'd_tag': dTag,
          created_at: { $lt: event.created_at }
        });
      }
    }
  }
}
```

## 7.3 Event Validation & Processing

### Comprehensive Event Validator

```javascript
class ProductionEventValidator {
  constructor(config = {}) {
    this.maxContentLength = config.maxContentLength || 100000; // 100KB
    this.maxTagsCount = config.maxTagsCount || 2000;
    this.maxTagLength = config.maxTagLength || 1000;
    this.allowedKinds = config.allowedKinds || null; // null = all kinds
    this.blacklistedPubkeys = new Set(config.blacklistedPubkeys || []);
  }
  
  async validate(event) {
    const errors = [];
    
    // 1. Check required fields
    if (!event.id || !event.pubkey || !event.created_at || 
        event.kind === undefined || !event.tags || !event.content || !event.sig) {
      errors.push('Missing required fields');
      return { valid: false, errors };
    }
    
    // 2. Validate field formats
    if (!/^[0-9a-f]{64}$/.test(event.id)) {
      errors.push('Invalid event ID format');
    }
    
    if (!/^[0-9a-f]{64}$/.test(event.pubkey)) {
      errors.push('Invalid pubkey format');
    }
    
    if (!/^[0-9a-f]{128}$/.test(event.sig)) {
      errors.push('Invalid signature format');
    }
    
    // 3. Check blacklist
    if (this.blacklistedPubkeys.has(event.pubkey)) {
      errors.push('Pubkey is blacklisted');
      return { valid: false, errors };
    }
    
    // 4. Validate timestamp
    const now = Math.floor(Date.now() / 1000);
    if (event.created_at > now + 900) { // 15 min future tolerance
      errors.push('Timestamp too far in future');
    }
    
    if (event.created_at < now - (365 * 24 * 60 * 60)) { // 1 year past
      errors.push('Timestamp too far in past');
    }
    
    // 5. Validate kind
    if (!Number.isInteger(event.kind) || event.kind < 0) {
      errors.push('Invalid kind');
    }
    
    if (this.allowedKinds && !this.allowedKinds.includes(event.kind)) {
      errors.push(`Kind ${event.kind} not allowed on this relay`);
    }
    
    // 6. Validate content length
    if (event.content.length > this.maxContentLength) {
      errors.push(`Content exceeds maximum length of ${this.maxContentLength}`);
    }
    
    // 7. Validate tags
    if (!Array.isArray(event.tags)) {
      errors.push('Tags must be an array');
    } else {
      if (event.tags.length > this.maxTagsCount) {
        errors.push(`Too many tags (max ${this.maxTagsCount})`);
      }
      
      for (const tag of event.tags) {
        if (!Array.isArray(tag)) {
          errors.push('Each tag must be an array');
          break;
        }
        
        if (tag.length === 0) {
          errors.push('Tag cannot be empty');
          break;
        }
        
        for (const item of tag) {
          if (typeof item !== 'string') {
            errors.push('Tag items must be strings');
            break;
          }
          
          if (item.length > this.maxTagLength) {
            errors.push(`Tag item exceeds maximum length of ${this.maxTagLength}`);
            break;
          }
        }
      }
    }
    
    // 8. Verify event ID
    const calculatedId = this.calculateEventId(event);
    if (calculatedId !== event.id) {
      errors.push('Event ID does not match content');
    }
    
    // 9. Verify signature
    const signatureValid = await this.verifySignature(event);
    if (!signatureValid) {
      errors.push('Invalid signature');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  calculateEventId(event) {
    const { sha256 } = require('@noble/hashes/sha256');
    const { bytesToHex } = require('@noble/hashes/utils');
    
    const serialized = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);
    
    const hash = sha256(new TextEncoder().encode(serialized));
    return bytesToHex(hash);
  }
  
  async verifySignature(event) {
    const { schnorr } = require('@noble/curves/secp256k1');
    
    try {
      return schnorr.verify(event.sig, event.id, event.pubkey);
    } catch {
      return false;
    }
  }
}
```

## 7.4 Rate Limiting & Spam Prevention

### Multi-Layer Rate Limiting

```javascript
class AdvancedRateLimiter {
  constructor(redis, config) {
    this.redis = redis;
    this.config = {
      // Per-IP limits
      ip: {
        connections: { limit: 10, window: 60 }, // 10 connections per minute
        events: { limit: 100, window: 60 },     // 100 events per minute
        subscriptions: { limit: 20, window: 60 } // 20 subscriptions per minute
      },
      // Per-pubkey limits
      pubkey: {
        events: { limit: 1000, window: 3600 },    // 1000 events per hour
        kindLimits: {
          1: { limit: 100, window: 3600 },        // 100 notes per hour
          4: { limit: 500, window: 3600 },        // 500 DMs per hour
          7: { limit: 2000, window: 3600 }        // 2000 reactions per hour
        }
      },
      // Global limits
      global: {
        events: { limit: 100000, window: 60 },    // 100k events per minute globally
        bandwidth: { limit: 1000000000, window: 60 } // 1GB per minute
      },
      ...config
    };
  }
  
  async checkLimit(type, identifier, subtype = null) {
    const config = subtype 
      ? this.config[type][subtype]
      : this.config[type];
    
    if (!config) return { allowed: true };
    
    const key = `ratelimit:${type}:${identifier}:${subtype || 'default'}`;
    const window = config.window;
    const limit = config.limit;
    
    // Use Redis INCR with expiry for efficient rate limiting
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, window);
    }
    
    if (current > limit) {
      const ttl = await this.redis.ttl(key);
      return {
        allowed: false,
        limit,
        current,
        resetIn: ttl
      };
    }
    
    return {
      allowed: true,
      limit,
      remaining: limit - current
    };
  }
  
  async checkIPLimit(ip, type) {
    return this.checkLimit('ip', ip, type);
  }
  
  async checkPubkeyLimit(pubkey, kind = null) {
    // Check general pubkey limit
    const general = await this.checkLimit('pubkey', pubkey, 'events');
    if (!general.allowed) return general;
    
    // Check kind-specific limit if applicable
    if (kind !== null && this.config.pubkey.kindLimits[kind]) {
      return this.checkLimit('pubkey', pubkey, `kind_${kind}`);
    }
    
    return general;
  }
  
  async checkGlobalLimit(type) {
    return this.checkLimit('global', 'all', type);
  }
}
```

### Spam Detection

```javascript
class SpamDetector {
  constructor() {
    this.suspiciousPatterns = [
      /\b(buy|sell|crypto|investment|profit)\b.*\b(telegram|whatsapp|dm)\b/i,
      /\b(click here|limited time|act now|don't miss)\b/i,
      /(?:http[s]?:\/\/){3,}/i, // Multiple URLs
    ];
    
    this.contentHashCache = new Map(); // Detect duplicate content
  }
  
  async analyzeEvent(event) {
    const flags = [];
    const score = 0;
    
    // 1. Check for suspicious patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(event.content)) {
        flags.push('suspicious_content_pattern');
        score += 10;
        break;
      }
    }
    
    // 2. Check for excessive URLs
    const urlCount = (event.content.match(/https?:\/\//g) || []).length;
    if (urlCount > 5) {
      flags.push('excessive_urls');
      score += 5 * (urlCount - 5);
    }
    
    // 3. Check for content duplication
    const contentHash = this.hashContent(event.content);
    const recentSimilar = this.contentHashCache.get(event.pubkey) || [];
    
    if (recentSimilar.includes(contentHash)) {
      flags.push('duplicate_content');
      score += 20;
    }
    
    // Update cache
    recentSimilar.push(contentHash);
    if (recentSimilar.length > 100) recentSimilar.shift();
    this.contentHashCache.set(event.pubkey, recentSimilar);
    
    // 4. Check for mention spam
    const mentions = event.tags.filter(t => t[0] === 'p').length;
    if (mentions > 20) {
      flags.push('excessive_mentions');
      score += mentions - 20;
    }
    
    // 5. Check for hashtag spam
    const hashtags = event.tags.filter(t => t[0] === 't').length;
    if (hashtags > 10) {
      flags.push('excessive_hashtags');
      score += hashtags - 10;
    }
    
    // 6. Check content length vs mentions ratio
    if (mentions > 5 && event.content.length < 100) {
      flags.push('low_content_high_mentions');
      score += 15;
    }
    
    return {
      isSpam: score > 30,
      score,
      flags
    };
  }
  
  hashContent(content) {
    // Simple hash for duplicate detection
    const normalized = content.toLowerCase().replace(/\s+/g, ' ').trim();
    return normalized.substring(0, 100); // Use first 100 chars
  }
}
```

## 7.5 Query Optimization

### Efficient Filter Processing

```javascript
class OptimizedQueryEngine {
  constructor(storage) {
    this.storage = storage;
  }
  
  async processFilter(filter) {
    // Build optimized query based on filter complexity
    const query = this.buildQuery(filter);
    
    // Execute with appropriate strategy
    if (this.isSimpleQuery(filter)) {
      return this.executeSimpleQuery(query, filter);
    } else {
      return this.executeComplexQuery(query, filter);
    }
  }
  
  buildQuery(filter) {
    const conditions = [];
    const params = [];
    
    // IDs filter (most specific)
    if (filter.ids && filter.ids.length > 0) {
      conditions.push(`id = ANY($${params.length + 1})`);
      params.push(filter.ids);
    }
    
    // Authors filter
    if (filter.authors && filter.authors.length > 0) {
      conditions.push(`pubkey = ANY($${params.length + 1})`);
      params.push(filter.authors);
    }
    
    // Kinds filter
    if (filter.kinds && filter.kinds.length > 0) {
      conditions.push(`kind = ANY($${params.length + 1})`);
      params.push(filter.kinds);
    }
    
    // Tag filters (#e, #p, #t, etc.)
    Object.keys(filter).forEach(key => {
      if (key.startsWith('#')) {
        const tagName = key.substring(1);
        const values = filter[key];
        
        if (tagName === 'e') {
          conditions.push(`e_tags && $${params.length + 1}`);
        } else if (tagName === 'p') {
          conditions.push(`p_tags && $${params.length + 1}`);
        } else if (tagName === 't') {
          conditions.push(`t_tags && $${params.length + 1}`);
        } else {
          // Generic tag search (slower)
          conditions.push(`
            EXISTS (
              SELECT 1 FROM jsonb_array_elements(tags) AS tag
              WHERE tag->0 = $${params.length + 1}
              AND tag->1 = ANY($${params.length + 2})
            )
          `);
          params.push(JSON.stringify(tagName), values);
          return;
        }
        
        params.push(values);
      }
    });
    
    // Time range filters
    if (filter.since) {
      conditions.push(`created_at >= $${params.length + 1}`);
      params.push(filter.since);
    }
    
    if (filter.until) {
      conditions.push(`created_at <= $${params.length + 1}`);
      params.push(filter.until);
    }
    
    // Build final query
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    
    const limit = filter.limit || 500;
    
    const sql = `
      SELECT * FROM events
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return { sql, params };
  }
  
  isSimpleQuery(filter) {
    // Simple queries can use indexed lookups
    const hasIds = filter.ids && filter.ids.length > 0;
    const hasSpecificAuthors = filter.authors && filter.authors.length < 10;
    const hasIndexedTags = filter['#e'] || filter['#p'] || filter['#t'];
    
    return hasIds || (hasSpecificAuthors && !hasIndexedTags);
  }
  
  async executeSimpleQuery(query, filter) {
    const result = await this.storage.query(query.sql, query.params);
    return result.rows;
  }
  
  async executeComplexQuery(query, filter) {
    // For complex queries, use cursor-based pagination
    const result = await this.storage.query(query.sql, query.params);
    return result.rows;
  }
}
```

## 7.6 WebSocket Connection Management

### Production WebSocket Handler

```javascript
const WebSocket = require('ws');

class RelayWebSocketServer {
  constructor(config) {
    this.config = config;
    this.connections = new Map();
    this.subscriptions = new Map();
    
    this.wss = new WebSocket.Server({
      port: config.port,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      },
      maxPayload: 1024 * 1024 // 1MB max message size
    });
    
    this.setupConnectionHandling();
  }
  
  setupConnectionHandling() {
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      
      const clientInfo = {
        id: clientId,
        ip: clientIp,
        ws,
        subscriptions: new Set(),
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        messageCount: 0,
        eventCount: 0
      };
      
      this.connections.set(clientId, clientInfo);
      
      console.log(`Client connected: ${clientId} from ${clientIp}`);
      
      // Set up ping/pong for connection health
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });
      
      // Handle incoming messages
      ws.on('message', async (data) => {
        await this.handleMessage(clientId, data);
      });
      
      // Handle disconnection
      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });
      
      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
        this.handleDisconnect(clientId);
      });
    });
    
    // Set up connection health monitoring
    this.startHealthCheck();
  }
  
  async handleMessage(clientId, data) {
    const clientInfo = this.connections.get(clientId);
    if (!clientInfo) return;
    
    clientInfo.lastActivity = Date.now();
    clientInfo.messageCount++;
    
    try {
      const message = JSON.parse(data);
      const [type, ...args] = message;
      
      switch (type) {
        case 'EVENT':
          await this.handleEvent(clientInfo, args[0]);
          break;
          
        case 'REQ':
          await this.handleSubscription(clientInfo, args[0], ...args.slice(1));
          break;
          
        case 'CLOSE':
          await this.handleCloseSubscription(clientInfo, args[0]);
          break;
          
        case 'AUTH':
          await this.handleAuth(clientInfo, args[0]);
          break;
          
        default:
          this.sendNotice(clientInfo.ws, `Unknown message type: ${type}`);
      }
    } catch (error) {
      console.error(`Error handling message from ${clientId}:`, error);
      this.sendNotice(clientInfo.ws, 'Invalid message format');
    }
  }
  
  async handleEvent(clientInfo, event) {
    // Rate limit check
    const rateLimit = await this.rateLimiter.checkIPLimit(clientInfo.ip, 'events');
    if (!rateLimit.allowed) {
      this.sendNotice(clientInfo.ws, `Rate limit exceeded. Try again in ${rateLimit.resetIn}s`);
      return;
    }
    
    // Validate event
    const validation = await this.validator.validate(event);
    if (!validation.valid) {
      this.sendResponse(clientInfo.ws, ['OK', event.id, false, `Invalid: ${validation.errors[0]}`]);
      return;
    }
    
    // Check spam
    const spamCheck = await this.spamDetector.analyzeEvent(event);
    if (spamCheck.isSpam) {
      this.sendResponse(clientInfo.ws, ['OK', event.id, false, 'Rejected: spam detected']);
      return;
    }
    
    // Store event
    try {
      await this.storage.saveEvent(event);
      this.sendResponse(clientInfo.ws, ['OK', event.id, true, '']);
      
      // Broadcast to subscribers
      await this.broadcastEvent(event);
      
      clientInfo.eventCount++;
    } catch (error) {
      console.error('Error saving event:', error);
      this.sendResponse(clientInfo.ws, ['OK', event.id, false, 'Error: ' + error.message]);
    }
  }
  
  async handleSubscription(clientInfo, subscriptionId, ...filters) {
    // Check subscription limit
    if (clientInfo.subscriptions.size >= 20) {
      this.sendNotice(clientInfo.ws, 'Too many subscriptions');
      return;
    }
    
    // Store subscription
    const subscription = {
      id: subscriptionId,
      clientId: clientInfo.id,
      filters,
      createdAt: Date.now()
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    clientInfo.subscriptions.add(subscriptionId);
    
    // Query and send existing events
    for (const filter of filters) {
      const events = await this.queryEngine.processFilter(filter);
      
      for (const event of events) {
        this.sendEvent(clientInfo.ws, subscriptionId, event);
      }
    }
    
    // Send EOSE
    this.sendResponse(clientInfo.ws, ['EOSE', subscriptionId]);
  }
  
  async handleCloseSubscription(clientInfo, subscriptionId) {
    this.subscriptions.delete(subscriptionId);
    clientInfo.subscriptions.delete(subscriptionId);
  }
  
  async broadcastEvent(event) {
    // Find matching subscriptions
    for (const [subId, subscription] of this.subscriptions) {
      const matches = subscription.filters.some(filter => 
        this.eventMatchesFilter(event, filter)
      );
      
      if (matches) {
        const clientInfo = this.connections.get(subscription.clientId);
        if (clientInfo && clientInfo.ws.readyState === WebSocket.OPEN) {
          this.sendEvent(clientInfo.ws, subId, event);
        }
      }
    }
  }
  
  eventMatchesFilter(event, filter) {
    if (filter.ids && !filter.ids.includes(event.id)) return false;
    if (filter.authors && !filter.authors.includes(event.pubkey)) return false;
    if (filter.kinds && !filter.kinds.includes(event.kind)) return false;
    if (filter.since && event.created_at < filter.since) return false;
    if (filter.until && event.created_at > filter.until) return false;
    
    // Check tag filters
    for (const key in filter) {
      if (key.startsWith('#')) {
        const tagName = key.substring(1);
        const values = filter[key];
        const hasMatch = event.tags.some(tag => 
          tag[0] === tagName && values.includes(tag[1])
        );
        if (!hasMatch) return false;
      }
    }
    
    return true;
  }
  
  handleDisconnect(clientId) {
    const clientInfo = this.connections.get(clientId);
    if (!clientInfo) return;
    
    // Clean up subscriptions
    for (const subId of clientInfo.subscriptions) {
      this.subscriptions.delete(subId);
    }
    
    this.connections.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  }
  
  startHealthCheck() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Every 30 seconds
    
    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }
  
  sendEvent(ws, subscriptionId, event) {
    this.sendResponse(ws, ['EVENT', subscriptionId, event]);
  }
  
  sendNotice(ws, message) {
    this.sendResponse(ws, ['NOTICE', message]);
  }
  
  sendResponse(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  
  generateClientId() {
    return Math.random().toString(36).substring(2, 15);
  }
}
```

## 7.7 Monitoring & Observability

### Metrics Collection

```javascript
class RelayMetrics {
  constructor(prometheus) {
    this.prometheus = prometheus;
    
    // Define metrics
    this.metrics = {
      // Connection metrics
      activeConnections: new prometheus.Gauge({
        name: 'nostr_relay_active_connections',
        help: 'Number of active WebSocket connections'
      }),
      
      totalConnections: new prometheus.Counter({
        name: 'nostr_relay_total_connections',
        help: 'Total number of connections since start'
      }),
      
      // Event metrics
      eventsReceived: new prometheus.Counter({
        name: 'nostr_relay_events_received_total',
        help: 'Total events received',
        labelNames: ['kind']
      }),
      
      eventsStored: new prometheus.Counter({
        name: 'nostr_relay_events_stored_total',
        help: 'Total events stored',
        labelNames: ['kind']
      }),
      
      eventsRejected: new prometheus.Counter({
        name: 'nostr_relay_events_rejected_total',
        help: 'Total events rejected',
        labelNames: ['reason']
      }),
      
      // Query metrics
      subscriptions: new prometheus.Gauge({
        name: 'nostr_relay_active_subscriptions',
        help: 'Number of active subscriptions'
      }),
      
      queryDuration: new prometheus.Histogram({
        name: 'nostr_relay_query_duration_seconds',
        help: 'Query execution time',
        buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
      }),
      
      // Storage metrics
      storageSize: new prometheus.Gauge({
        name: 'nostr_relay_storage_bytes',
        help: 'Total storage used in bytes'
      }),
      
      eventCount: new prometheus.Gauge({
        name: 'nostr_relay_event_count',
        help: 'Total number of events stored'
      }),
      
      // Performance metrics
      cpuUsage: new prometheus.Gauge({
        name: 'nostr_relay_cpu_usage_percent',
        help: 'CPU usage percentage'
      }),
      
      memoryUsage: new prometheus.Gauge({
        name: 'nostr_relay_memory_usage_bytes',
        help: 'Memory usage in bytes'
      }),
      
      // Rate limit metrics
      rateLimitHits: new prometheus.Counter({
        name: 'nostr_relay_rate_limit_hits_total',
        help: 'Number of rate limit violations',
        labelNames: ['type']
      })
    };
    
    // Start collection
    this.startCollection();
  }
  
  startCollection() {
    // Collect system metrics every 10 seconds
    setInterval(() => {
      const usage = process.cpuUsage();
      const memUsage = process.memoryUsage();
      
      this.metrics.cpuUsage.set(
        (usage.user + usage.system) / 1000000 // Convert to seconds
      );
      
      this.metrics.memoryUsage.set(memUsage.heapUsed);
    }, 10000);
  }
  
  recordEvent(kind, stored = true) {
    this.metrics.eventsReceived.inc({ kind: kind.toString() });
    if (stored) {
      this.metrics.eventsStored.inc({ kind: kind.toString() });
    }
  }
  
  recordRejection(reason) {
    this.metrics.eventsRejected.inc({ reason });
  }
  
  recordQuery(duration) {
    this.metrics.queryDuration.observe(duration);
  }
  
  recordRateLimitHit(type) {
    this.metrics.rateLimitHits.inc({ type });
  }
}
```

## 7.8 Deployment & Infrastructure

### Docker Deployment

```dockerfile
# Dockerfile for production relay
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if needed
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nostr && \
    adduser -S nostr -u 1001

# Switch to non-root user
USER nostr

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start relay
CMD ["node", "dist/index.js"]
```

### Docker Compose Stack

```yaml
# docker-compose.yml
version: '3.8'

services:
  relay:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://nostr:password@postgres:5432/nostrdb
      - REDIS_URL=redis://redis:6379
      - MAX_CONNECTIONS=1000
      - RATE_LIMIT_ENABLED=true
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - nostr-network
    volumes:
      - ./config:/app/config:ro
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nostrdb
      - POSTGRES_USER=nostr
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - nostr-network
    restart: unless-stopped
  
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - nostr-network
    restart: unless-stopped
  
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - nostr-network
    restart: unless-stopped
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-dashboards:/etc/grafana/provisioning/dashboards
    networks:
      - nostr-network
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - relay
    networks:
      - nostr-network
    restart: unless-stopped

networks:
  nostr-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  prometheus-data:
  grafana-data:
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 4096;
}

http {
    upstream relay {
        server relay:8080;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=relay_limit:10m rate=100r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
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
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        
        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        
        # Rate limiting
        limit_req zone=relay_limit burst=200 nodelay;
        limit_conn conn_limit 20;
        
        # WebSocket proxying
        location / {
            proxy_pass http://relay;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 7d;
            proxy_send_timeout 7d;
            proxy_read_timeout 7d;
        }
        
        # Health check endpoint
        location /health {
            proxy_pass http://relay/health;
            access_log off;
        }
        
        # Metrics endpoint (restricted)
        location /metrics {
            proxy_pass http://relay/metrics;
            allow 10.0.0.0/8;  # Internal network only
            deny all;
        }
    }
}
```

## 7.9 Security Hardening

### Security Best Practices

```javascript
class RelaySecurityManager {
  constructor(config) {
    this.config = config;
    this.bannedIPs = new Set();
    this.bannedPubkeys = new Set();
    this.suspiciousActivity = new Map();
  }
  
  // IP-based threat detection
  async checkIPThreat(ip) {
    if (this.bannedIPs.has(ip)) {
      return { threat: true, reason: 'IP banned' };
    }
    
    const activity = this.suspiciousActivity.get(ip) || {
      violations: 0,
      lastViolation: 0
    };
    
    // Auto-ban after 10 violations in 1 hour
    if (activity.violations >= 10) {
      const hourAgo = Date.now() - 3600000;
      if (activity.lastViolation > hourAgo) {
        this.bannedIPs.add(ip);
        return { threat: true, reason: 'Too many violations' };
      }
    }
    
    return { threat: false };
  }
  
  // Content filtering
  filterContent(event) {
    const filters = [
      // Filter explicit content (basic example)
      /\b(explicit|harmful|pattern)\b/i,
      
      // Filter phishing attempts
      /password|private.?key|nsec1/i,
      
      // Filter excessive caps
      /[A-Z\s]{50,}/
    ];
    
    for (const filter of filters) {
      if (filter.test(event.content)) {
        return {
          allowed: false,
          reason: 'Content policy violation'
        };
      }
    }
    
    return { allowed: true };
  }
  
  // DDoS protection
  detectDDoS(metrics) {
    const threshold = {
      connectionsPerSecond: 100,
      eventsPerSecond: 1000,
      failedAuthPerSecond: 50
    };
    
    if (metrics.connectionsPerSecond > threshold.connectionsPerSecond ||
        metrics.eventsPerSecond > threshold.eventsPerSecond ||
        metrics.failedAuthPerSecond > threshold.failedAuthPerSecond) {
      
      return {
        attack: true,
        type: 'DDoS',
        action: 'enable_mitigation'
      };
    }
    
    return { attack: false };
  }
}
```

## 7.10 Practical Exercises

### Exercise 1: Deploy a Basic Relay
Set up and deploy a minimal relay:
1. Install dependencies (Node.js, PostgreSQL)
2. Configure database schema
3. Implement basic WebSocket handling
4. Test with nostr clients

### Exercise 2: Add Rate Limiting
Implement rate limiting:
1. Set up Redis for rate limiting
2. Add per-IP limits
3. Add per-pubkey limits
4. Test with load testing tools

### Exercise 3: Optimize Queries
Improve query performance:
1. Analyze slow queries
2. Add appropriate indexes
3. Implement query result caching
4. Measure performance improvements

### Exercise 4: Set Up Monitoring
Implement observability:
1. Add Prometheus metrics
2. Create Grafana dashboards
3. Set up alerts for critical metrics
4. Monitor production traffic

### Exercise 5: Implement Spam Detection
Build spam prevention:
1. Create content analysis rules
2. Implement duplicate detection
3. Add IP reputation checking
4. Test with spam samples

## 📝 Module 7 Quiz

1. **What are the three core responsibilities of a Nostr relay?**
   <details>
   <summary>Answer</summary>
   Accept events from clients, store events according to policy, and serve events matching subscription filters.
   </details>

2. **Why are replaceable events handled differently in storage?**
   <details>
   <summary>Answer</summary>
   Replaceable events (kinds 10000-19999) should only keep the latest event per pubkey+kind combination, so older events must be deleted when newer ones arrive to prevent storage bloat.
   </details>

3. **What's the purpose of rate limiting at multiple layers (IP, pubkey, global)?**
   <details>
   <summary>Answer</summary>
   Multi-layer rate limiting prevents abuse at different levels: IP limits stop DDoS attacks, pubkey limits prevent spam from individual users, and global limits protect overall relay capacity.
   </details>

4. **Why use indexes on tag columns (e_tags, p_tags, t_tags)?**
   <details>
   <summary>Answer</summary>
   Tag filters are extremely common in Nostr queries (#e, #p, #t). Array-based indexes using GIN or similar allow fast lookups without scanning the entire events table.
   </details>

5. **What's the difference between simple and complex query execution strategies?**
   <details>
   <summary>Answer</summary>
   Simple queries use specific indexed lookups (by ID, author, or kind), while complex queries with multiple tag filters may require more sophisticated execution plans, possibly with cursor-based pagination to manage large result sets.
   </details>

## 🎯 Module 7 Checkpoint

Before moving to Module 8, ensure you have:

- [ ] Deployed a working relay with WebSocket support
- [ ] Implemented database storage with proper indexes
- [ ] Added rate limiting and spam detection
- [ ] Set up monitoring and metrics collection
- [ ] Configured proper security measures
- [ ] Tested relay under load
- [ ] Implemented backup and recovery procedures
- [ ] Documented relay operations

## 📚 Additional Resources

- [Relay Implementation Guide (GitHub)](https://github.com/nostr-protocol/nostr)
- [NIP-01: Basic Protocol](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-11: Relay Information Document](https://github.com/nostr-protocol/nips/blob/master/11.md)
- [NIP-42: Authentication](https://github.com/nostr-protocol/nips/blob/master/42.md)
- [strfry Relay](https://github.com/hoytech/strfry) - High-performance C++ relay
- [nostream](https://github.com/Cameri/nostream) - TypeScript relay implementation
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

## 💬 Community Discussion

Join our Discord to discuss Module 7:
- Share your relay setup and configuration
- Get help with deployment issues
- Discuss scaling strategies
- Collaborate on relay improvements

---

!!! success "Congratulations!"
    You've learned how to build and operate production-grade Nostr relays! You understand architecture, optimization, security, and monitoring. Ready for Module 8: Scaling & Performance!

[Continue to Module 8: Scaling & Performance →](module-08-scaling-performance.md)
