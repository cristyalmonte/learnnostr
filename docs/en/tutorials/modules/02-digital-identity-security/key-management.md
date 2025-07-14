# Lesson 2: Key Generation & Management

!!! info "Lesson Overview"
    **Module 2, Lesson 2 of 4** • **Estimated Time:** 60 minutes  
    **Learning Style:** Practical Skills + Hands-on

## Learning Objectives

After this lesson, you'll be able to:

- [ ] Generate cryptographically secure keys using multiple methods
- [ ] Understand different key formats and when to use each
- [ ] Implement secure key storage practices
- [ ] Set up proper backup and recovery procedures

---

## From Theory to Practice

In the previous lesson, you learned how public-key cryptography works. Now let's get hands-on with generating, storing, and managing your actual Nostr identity keys.

!!! warning "Practice Safely"
    This lesson uses real key generation techniques. While learning, always use test keys that you don't mind losing. Once you're confident, you can apply these methods to create your permanent identity.

## Secure Key Generation

### What Makes Keys "Secure"?

Not all random numbers are equally random. Secure key generation requires:

#### **Cryptographically Secure Randomness**
- **Not predictable** - Can't be guessed even with knowledge of previous numbers
- **Not reproducible** - Same process should never generate the same key twice
- **High entropy** - Drawn from a large pool of possible values
- **Hardware-based** - Uses unpredictable physical processes when possible

#### **Proper Implementation**
- **No human input** - Human choices are predictable
- **No shortcuts** - Must use the full 256-bit space
- **No reused randomness** - Each key must be independently generated

### ❌ Insecure Methods (Never Use These)

```javascript
// NEVER DO THIS - Predictable!
const badKey1 = "1234567890abcdef..."

// NEVER DO THIS - Not random enough!
const badKey2 = Math.random().toString(16)

// NEVER DO THIS - Brainwallet (hackable!)
const badKey3 = sha256("my secret passphrase")
```

### ✅ Secure Methods

#### Method 1: Using Nostr Libraries

=== "JavaScript (nostr-tools)"

    ```javascript
    import { generatePrivateKey } from 'nostr-tools'
    
    // Generate cryptographically secure private key
    const privateKey = generatePrivateKey()
    console.log('Private key:', privateKey)
    
    // This uses the Web Crypto API's secure random number generator
    // or Node.js crypto.randomBytes() - both are cryptographically secure
    ```

=== "Python (python-nostr)"

    ```python
    from nostr.key import PrivateKey
    
    # Generate secure private key
    private_key = PrivateKey()
    print(f"Private key: {private_key.hex()}")
    
    # Uses os.urandom() which draws from OS entropy pool
    ```

=== "Rust (nostr-sdk)"

    ```rust
    use nostr_sdk::prelude::*;
    
    // Generate secure keys
    let keys = Keys::generate();
    println!("Private key: {}", keys.secret_key().display_secret());
    
    // Uses rand crate with OS random number generator
    ```

#### Method 2: Hardware Wallets

For maximum security, use dedicated hardware:

- **Ledger Nano** - Generate and store keys on hardware device
- **Trezor** - Air-gapped key generation and signing
- **ColdCard** - Bitcoin-focused hardware wallet with Nostr support
- **SeedSigner** - DIY hardware solution

#### Method 3: Secure Offline Generation

For advanced users who want maximum control:

1. **Air-gapped computer** - Never connected to internet
2. **Live Linux USB** - Fresh OS with no persistent storage
3. **Hardware randomness** - Use dice, coins, or hardware RNG
4. **Manual verification** - Check entropy and validate keys

### 🛠️ Hands-on: Generate Your First Secure Keys

Let's walk through secure key generation step by step:

#### Step 1: Environment Setup

=== "Node.js"

    ```bash
    # Create a secure environment
    mkdir secure-keygen
    cd secure-keygen
    npm init -y
    npm install nostr-tools
    
    # Create key generation script
    touch generate-keys.js
    ```

=== "Python"

    ```bash
    # Create virtual environment
    python -m venv nostr-keys
    source nostr-keys/bin/activate
    pip install nostr
    
    # Create key generation script  
    touch generate_keys.py
    ```

#### Step 2: Key Generation Script

=== "JavaScript"

    ```javascript
    // generate-keys.js
    import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools'
    
    function generateNostrIdentity() {
        console.log('Generating new Nostr identity...\n')
        
        // Generate private key
        const privateKey = generatePrivateKey()
        
        // Derive public key
        const publicKey = getPublicKey(privateKey)
        
        // Convert to user-friendly formats
        const nsec = nip19.nsecEncode(privateKey)
        const npub = nip19.npubEncode(publicKey)
        
        console.log('=== YOUR NOSTR IDENTITY ===')
        console.log('Private Key (hex):', privateKey)
        console.log('Public Key (hex):', publicKey)
        console.log('')
        console.log('=== USER-FRIENDLY FORMATS ===')
        console.log('Private Key (nsec):', nsec)
        console.log('Public Key (npub):', npub)
        console.log('')
        console.log('⚠️  IMPORTANT: Save your private key securely!')
        console.log('⚠️  Anyone with your private key controls your identity!')
        
        return { privateKey, publicKey, nsec, npub }
    }
    
    // Generate identity
    const identity = generateNostrIdentity()
    ```

=== "Python"

    ```python
    # generate_keys.py
    from nostr.key import PrivateKey
    from nostr.bech32 import encode, decode
    
    def generate_nostr_identity():
        print("Generating new Nostr identity...\n")
        
        # Generate private key
        private_key = PrivateKey()
        
        # Get public key
        public_key = private_key.public_key
        
        # Convert to bech32 formats
        nsec = encode("nsec", private_key.raw())
        npub = encode("npub", public_key.raw())
        
        print("=== YOUR NOSTR IDENTITY ===")
        print(f"Private Key (hex): {private_key.hex()}")
        print(f"Public Key (hex): {public_key.hex()}")
        print("")
        print("=== USER-FRIENDLY FORMATS ===")
        print(f"Private Key (nsec): {nsec}")
        print(f"Public Key (npub): {npub}")
        print("")
        print("⚠️  IMPORTANT: Save your private key securely!")
        print("⚠️  Anyone with your private key controls your identity!")
        
        return {
            'private_key': private_key,
            'public_key': public_key,
            'nsec': nsec,
            'npub': npub
        }
    
    # Generate identity
    if __name__ == "__main__":
        identity = generate_nostr_identity()
    ```

#### Step 3: Run Secure Generation

```bash
# Run the script in a secure environment
node generate-keys.js
# or
python generate_keys.py
```

You should see output like:
```
=== YOUR NOSTR IDENTITY ===
Private Key (hex): d63b64d9c2c4f8c7b8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2
Public Key (hex): a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2

=== USER-FRIENDLY FORMATS ===
Private Key (nsec): nsec1mclkfkwu2n7v0wuwn6d2kwx56mn0029ceuxr6ul6xjm2k6l7qxsqrxqhp8
Public Key (npub): npub15xkv85x2um6h3jfgxhj259x54fvv7n7k9c5wxq9ewn64fhux5xeqz8p2qv
```

## Understanding Key Formats

### Hexadecimal Format

**Raw format** - 64 character strings using 0-9 and a-f:

```
Private: d63b64d9c2c4f8c7b8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2
Public:  a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

**When to use:**
- Internal application processing
- API interactions
- Debugging and development

### Bech32 Format (NIP-19)

**Human-readable** with error detection:

```
Private: nsec1mclkfkwu2n7v0wuwn6d2kwx56mn0029ceuxr6ul6xjm2k6l7qxsqrxqhp8
Public:  npub15xkv85x2um6h3jfgxhj259x54fvv7n7k9c5wxq9ewn64fhux5xeqz8p2qv
```

**When to use:**
- Sharing public keys with others
- User interfaces and QR codes
- Backup and recovery
- Manual entry

### Format Conversion

You should be comfortable converting between formats:

=== "JavaScript"

    ```javascript
    import { nip19 } from 'nostr-tools'
    
    // Hex to bech32
    const nsec = nip19.nsecEncode(hexPrivateKey)
    const npub = nip19.npubEncode(hexPublicKey)
    
    // Bech32 to hex
    const { type, data } = nip19.decode(nsec)
    console.log('Type:', type) // 'nsec'
    console.log('Hex:', data)  // Original hex private key
    ```

=== "Python"

    ```python
    from nostr.bech32 import encode, decode
    
    # Hex to bech32
    nsec = encode("nsec", bytes.fromhex(hex_private_key))
    npub = encode("npub", bytes.fromhex(hex_public_key))
    
    # Bech32 to hex
    decoded_data = decode(nsec)
    hex_key = decoded_data[1].hex()
    ```

## Secure Storage Strategies

### Storage Security Levels

#### Level 1: Basic Digital Storage
**Good for:** Learning and small amounts

- **Encrypted password manager** (1Password, Bitwarden)
- **Encrypted notes app** with strong master password
- **Local encrypted file** (not cloud synced)

#### Level 2: Enhanced Digital Security  
**Good for:** Regular use with significant value

- **Hardware security module** (YubiKey, etc.)
- **Multiple encrypted backups** in different locations
- **Paper backup** in secure physical location
- **Encrypted cloud storage** with strong encryption

#### Level 3: Maximum Security
**Good for:** High-value or critical identities

- **Air-gapped storage** (never connected to internet)
- **Hardware wallets** with secure element chips
- **Multi-signature schemes** requiring multiple keys
- **Geographically distributed backups**

### 🔒 Practical Storage Setup

Let's implement Level 2 security (good for most users):

#### Step 1: Create Encrypted Digital Backup

=== "Using GPG"

    ```bash
    # Create encrypted backup file
    echo "nsec1your-private-key-here" | gpg --symmetric --armor > nostr-key-backup.asc
    
    # Enter a strong passphrase when prompted
    # Store this file securely (encrypted cloud storage, USB drive, etc.)
    ```

=== "Using OpenSSL"

    ```bash
    # Create encrypted backup
    echo "nsec1your-private-key-here" | openssl enc -aes-256-cbc -salt > nostr-key-backup.enc
    
    # Enter a strong password when prompted
    ```

#### Step 2: Create Paper Backup

1. **Write key on paper** using permanent ink
2. **Include format identifier** (nsec1...)
3. **Add checksum** (last 4 characters) for verification
4. **Store in fireproof safe** or safety deposit box
5. **Make multiple copies** in different locations

#### Step 3: Set Up Password Manager

```
Title: Nostr Identity - Main
Username: [Your npub]
Password: [Your nsec]
Notes: Generated on [date] using secure method
Tags: nostr, identity, cryptocurrency
```

#### Step 4: Test Recovery Process

**Critical step:** Verify you can actually recover your keys!

1. **Clear keys from applications**
2. **Recover from each backup method**
3. **Verify keys work** by signing a test message
4. **Document any issues** and fix them

### Storage Don'ts

❌ **Never store in:**
- Plain text files
- Unencrypted cloud storage
- Screenshots or photos
- Email or messaging apps
- Browser password managers (for permanent keys)
- Shared computers or accounts

❌ **Never share with:**
- Support services (they should never ask!)
- Friends or family members
- Online communities or forums
- Any third-party services

## Key Management Best Practices

### Multiple Identity Strategy

Consider having different keys for different purposes:

#### **Main Identity**
- Primary social presence
- Long-term reputation building
- Highest security requirements

#### **Testing Identity**  
- Learning and experimentation
- Trying new applications
- Lower security requirements

#### **Anonymous Identity**
- Privacy-focused interactions
- Temporary or specific use cases
- Compartmentalized activities

### Rotation and Migration

Unlike passwords, you can't just "change" your Nostr keys. Instead:

#### **When to Create New Identity**
- Key compromise suspected
- Moving to higher security setup
- Changing life circumstances
- Learning better practices

#### **Migration Process**
1. **Generate new keys** using improved security
2. **Announce migration** on old identity
3. **Update followers** with new public key
4. **Gradually transition** content and interactions
5. **Archive old identity** securely

### 🎯 Hands-on Exercise: Complete Setup

**Objective:** Set up a complete key management system

**Steps:**
1. **Generate test keys** using secure method
2. **Store in password manager** with proper metadata
3. **Create encrypted backup** using GPG or similar
4. **Write paper backup** and store securely
5. **Test recovery process** from each backup
6. **Document your procedure** for future reference

**Time:** 30 minutes

**Success Criteria:** 
- Can recover keys from any backup method
- All backups are properly secured
- Process is documented for future use

## 📝 Knowledge Check

!!! question "Test Your Understanding"
    
    **1. What makes a random number generator "cryptographically secure"?**
    
    ??? success "Answer"
        It must be unpredictable (can't be guessed), non-reproducible (never generates the same number twice), and have high entropy (draws from a large space of possible values), typically using hardware-based randomness sources.
    
    **2. Why shouldn't you create a private key from a passphrase?**
    
    ??? success "Answer"
        Human-created passphrases have much less entropy than true random generation. They're vulnerable to dictionary attacks and are much more predictable than cryptographically secure random numbers.
    
    **3. What's the difference between hex and bech32 key formats?**
    
    ??? success "Answer"
        Hex is the raw format (64 characters, 0-9 and a-f) used internally. Bech32 includes error detection, human-readable prefixes (nsec/npub), and is safer for manual entry and sharing.

---

## ✅ Lesson Complete

You now have the practical skills to generate, store, and manage cryptographic keys securely. This is a critical foundation skill that protects your digital sovereignty.

**Key Skills Acquired:**
- Secure key generation using multiple methods
- Understanding of different key formats and their uses
- Implementation of proper storage and backup procedures
- Testing and verification of recovery processes

<div class="lesson-nav">
  <a href="crypto-fundamentals.md">← Previous: Cryptographic Fundamentals</a>
  <a href="practical-security.md">Next: Security Best Practices →</a>
</div>

---

!!! success "Portfolio Addition"
    **Document your setup**: Create a secure note describing your key management system (without including the actual keys!). Include your storage methods, backup procedures, and recovery testing process.

!!! warning "Security Reminder"
    The keys you generated in this lesson are real. If you used them for testing, make sure to either secure them properly or generate new ones for your permanent identity.

!!! tip "Practice Makes Perfect"
    Key management is a skill that improves with practice. Start with lower-value identities and gradually move to more secure setups as you gain confidence.

!!! info "Deep Dive Available"
    For comprehensive technical details about Nostr key management, see [Keys and Identity](../../../concepts/keys.md) in our reference section.
