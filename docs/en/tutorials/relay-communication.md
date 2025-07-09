# Relay Communication

!!! info "What You'll Learn"
    In this tutorial, you'll master:
    
    - How Nostr relays work and their role in the network
    - WebSocket communication patterns
    - Subscription filters and real-time updates
    - Publishing events to multiple relays
    - Handling connection failures and retries
    - Relay selection strategies

!!! tip "Prerequisites"
    - Understanding of [Nostr events](./understanding-events.md)
    - Basic WebSocket knowledge
    - JavaScript async/await patterns

## Understanding Relays

Relays are the backbone of the Nostr network. They're simple servers that:

- **Store events** submitted by clients
- **Serve events** to clients based on filters
- **Relay events** between clients in real-time
- **Maintain no user accounts** - just events

Think of relays as smart databases that speak a common protocol.

## The Relay Protocol

Nostr uses WebSockets for real-time communication between clients and relays. All messages are JSON arrays with specific formats:

### Client to Relay Messages

| Message Type | Format | Purpose |
|--------------|--------|---------|
| `EVENT` | `["EVENT", <event>]` | Publish an event |
| `REQ` | `["REQ", <sub_id>, <filters>...]` | Subscribe to events |
| `CLOSE` | `["CLOSE", <sub_id>]` | Close a subscription |
| `AUTH` | `["AUTH", <event>]` | Authenticate with relay |
| `COUNT` | `["COUNT", <sub_id>, <filters>...]` | Count matching events |

### Relay to Client Messages

| Message Type | Format | Purpose |
|--------------|--------|---------|
| `EVENT` | `["EVENT", <sub_id>, <event>]` | Send event to client |
| `EOSE` | `["EOSE", <sub_id>]` | End of stored events |
| `OK` | `["OK", <event_id>, <true\|false>, <message>]` | Event publish result |
| `NOTICE` | `["NOTICE", <message>]` | Human-readable message |
| `CLOSED` | `["CLOSED", <sub_id>, <message>]` | Subscription closed |
| `AUTH` | `["AUTH", <challenge>]` | Authentication challenge |
| `COUNT` | `["COUNT", <sub_id>, <count>]` | Event count response |

## Connecting to Relays

Let's start with a basic relay connection:

=== "Basic Connection"

    ```javascript
    import { relayInit } from 'nostr-tools'

    async function connectToRelay(url) {
        const relay = relayInit(url)
        
        relay.on('connect', () => {
            console.log(`Connected to ${url}`)
        })
        
        relay.on('error', () => {
            console.error(`Failed to connect to ${url}`)
        })
        
        relay.on('disconnect', () => {
            console.log(`Disconnected from ${url}`)
        })
        
        try {
            await relay.connect()
            return relay
        } catch (error) {
            console.error('Connection failed:', error)
            throw error
        }
    }

    // Usage
    const relay = await connectToRelay('wss://relay.damus.io')
    ```

## Best Practices

!!! tip "Relay Communication Best Practices"
    
    1. **Use Multiple Relays**: Never rely on a single relay
    2. **Handle Failures Gracefully**: Always have fallback mechanisms
    3. **Monitor Health**: Track relay performance and switch when needed
    4. **Deduplicate Events**: Handle the same event from multiple relays
    5. **Limit Subscriptions**: Don't overload relays with too many filters
    6. **Close Unused Subscriptions**: Clean up when done
    7. **Respect Rate Limits**: Check relay info for limitations

!!! warning "Common Pitfalls"
    
    - **Not handling disconnections**: Relays can go offline
    - **Forgetting to unsubscribe**: Can lead to memory leaks
    - **Too many concurrent subscriptions**: Can overwhelm clients
    - **Ignoring relay limitations**: Check max_subscriptions and other limits
    - **Not validating events**: Always verify signatures and format

## Next Steps

Now you can explore:

- [Understanding Events](./understanding-events.md)

---

<div class="tutorial-navigation">
  <a href="./understanding-events.md" class="btn btn-outline">
     Previous: Understanding Events
  </a>
</div>
