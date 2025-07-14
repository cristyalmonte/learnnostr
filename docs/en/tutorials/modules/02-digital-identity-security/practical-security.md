# Lesson 3: Security Best Practices

!!! info "Lesson Overview"
    **Module 2, Lesson 3 of 4** • **Estimated Time:** 45 minutes  
    **Learning Style:** Applied Security + Risk Management

## Learning Objectives

After this lesson, you'll be able to:

- [ ] Implement robust backup and recovery procedures
- [ ] Recognize and avoid common security threats
- [ ] Set up secure operational practices for daily use
- [ ] Create contingency plans for various security scenarios

---

## Beyond Key Generation: Operational Security

You've learned to generate and store keys securely. Now let's cover the ongoing security practices that keep your digital identity safe in real-world use.

!!! warning "Security is a Process"
    Security isn't a one-time setup - it's an ongoing practice. The strongest cryptography in the world won't help if you get careless with operational security.

## Backup Strategies

### The 3-2-1 Rule

For critical data like your Nostr keys, follow the **3-2-1 backup rule**:

- **3** copies of your data (original + 2 backups)
- **2** different types of media (digital + physical)
- **1** offsite backup (different location)

### Multiple Backup Types

#### Type 1: Digital Encrypted Backups

**Password Manager**
```
✅ Pros: Always accessible, encrypted, synced across devices
⚠️ Cons: Single point of failure if master password compromised
🎯 Use for: Primary access and daily use
```

**Encrypted Files**
```bash
# GPG encrypted backup
echo "nsec1your-private-key" | gpg --symmetric --armor > backup.asc

# Password-protected ZIP
zip -e nostr-backup.zip keys.txt

# OpenSSL encryption
openssl enc -aes-256-cbc -salt -in keys.txt -out keys.enc
```

#### Type 2: Physical Backups

**Steel Plates**
- **Fireproof and waterproof** - survives disasters
- **Tamper-evident** - physical security
- **Long-term durability** - decades of storage
- **Products**: Cryptosteel, SteelWallet, Blockplate

**Paper Backups**
- **Multiple copies** in different locations
- **Archival quality paper** and permanent ink
- **Laminated protection** from water damage
- **Safe deposit boxes** or fireproof safes

#### Type 3: Distributed Backups

**Shamir's Secret Sharing**
Split your key into multiple parts:

```python
# Example concept (don't use in production without proper implementation)
# Split key into 5 parts, any 3 can recover
shares = split_secret(private_key, threshold=3, total_shares=5)

# Distribute shares to trusted parties/locations
# Family members, safety deposit boxes, etc.
```

**Geographic Distribution**
- **Home safe** - everyday access
- **Bank safety deposit box** - secure offsite
- **Trusted family member** - emergency access
- **Second home/office** - redundant offsite

### 🛠️ Hands-on: Create Your Backup System

Let's implement a complete backup strategy:

#### Step 1: Create Encrypted Digital Backup

=== "Using GPG"

    ```bash
    # Create master backup file
    cat > nostr-identity.txt << EOF
    # Nostr Identity Backup
    # Generated: $(date)
    # 
    # Private Key (nsec): nsec1your-key-here
    # Public Key (npub): npub1your-key-here
    # 
    # KEEP THIS FILE SECURE
    EOF
    
    # Encrypt with strong passphrase
    gpg --symmetric --armor nostr-identity.txt
    
    # This creates nostr-identity.txt.asc - the encrypted version
    # Store this in multiple secure locations
    ```

=== "Using Age (Modern Alternative)"

    ```bash
    # Install age: https://github.com/FiloSottile/age
    
    # Create backup and encrypt
    echo "nsec1your-key-here" | age -p > nostr-backup.age
    
    # Decrypt when needed
    age -d nostr-backup.age
    ```

#### Step 2: Create Physical Backup

```
NOSTR IDENTITY BACKUP
Generated: [DATE]

Private Key: nsec1[write full key here]
Public Key: npub1[write full key here]

Checksum: [last 8 characters of private key]

⚠️  ANYONE WITH PRIVATE KEY CONTROLS THIS IDENTITY
⚠️  STORE IN SECURE LOCATION
⚠️  NEVER PHOTOGRAPH OR SCAN
```

#### Step 3: Test Recovery Process

**Critical step**: Regularly test that you can actually recover your keys!

```bash
# Recovery test checklist:
# [ ] Can decrypt digital backup
# [ ] Can read physical backup clearly
# [ ] Keys work to sign messages
# [ ] All backup locations accessible
# [ ] Recovery process documented
```

## Threat Model Analysis

### Understanding Your Risks

Different users face different threats. Identify your specific risks:

#### Personal User Threats
- **Device theft/loss** - laptop, phone stolen
- **Account compromise** - password manager hacked
- **Physical break-in** - home burglary
- **Social engineering** - tricked into revealing information
- **Shoulder surfing** - someone watching you type

#### Public Figure Threats
- **Targeted attacks** - sophisticated adversaries
- **Legal pressure** - government demands
- **Extortion attempts** - ransomware, blackmail
- **Advanced persistent threats** - long-term surveillance
- **Supply chain attacks** - compromised hardware/software

#### Developer/Business Threats
- **Infrastructure attacks** - servers compromised
- **Code repository compromise** - malicious commits
- **Dependency attacks** - malicious packages
- **Insider threats** - malicious employees
- **Regulatory pressure** - compliance requirements

### Risk Mitigation Strategies

#### For Personal Users

**Device Security**
```
✅ Full disk encryption enabled
✅ Screen lock with strong PIN/password
✅ Auto-lock after short timeout
✅ Biometric authentication where appropriate
✅ Remote wipe capability enabled
```

**Network Security**
```
✅ Use VPN on public WiFi
✅ Verify HTTPS connections
✅ Keep software updated
✅ Use reputable DNS servers
✅ Be cautious of public computers
```

#### For High-Risk Users

**Air-Gapped Operations**
```
✅ Dedicated offline computer for key operations
✅ Never connected to internet
✅ Physical security for device
✅ Verified software installation
✅ Tamper-evident storage
```

**Operational Security**
```
✅ Compartmentalized identities
✅ Multiple secure communication channels
✅ Regular security audits
✅ Legal and technical advisors
✅ Emergency response procedures
```

## Common Security Mistakes

### ❌ What Not to Do

#### Storage Mistakes
- **Screenshots of keys** - stored in cloud photos
- **Plaintext files** - unencrypted on computer
- **Email/messaging** - sending keys to yourself
- **Cloud storage** - Google Drive, Dropbox without encryption
- **Browser storage** - saved passwords for permanent keys

#### Operational Mistakes
- **Reusing keys** - same key for testing and production
- **Public key confusion** - accidentally sharing private key
- **Unsecured recovery** - password reset emails accessible
- **Social media oversharing** - revealing security practices
- **Predictable patterns** - using same security everywhere

#### Human Mistakes
- **Overconfidence** - thinking "it won't happen to me"
- **Convenience over security** - shortcuts that create risks
- **Not testing backups** - discovering they don't work when needed
- **Ignoring updates** - not keeping security software current
- **Poor documentation** - can't remember own security setup

### 🚨 Red Flags to Watch For

#### Technical Red Flags
- **Requests for private keys** - no legitimate service needs these
- **Urgent security updates** - high-pressure tactics
- **Unusual network activity** - unexpected connections
- **Software behaving strangely** - potential malware
- **Unexpected authentication requests** - potential account takeover

#### Social Red Flags
- **Impersonation attempts** - fake support contacts
- **Information gathering** - seemingly innocent questions
- **Pressure tactics** - "act now or lose access"
- **Too-good-to-be-true offers** - free money, services
- **Requests for verification** - asking you to prove identity

## Incident Response Planning

### Before an Incident

#### Preparation Checklist
```
[ ] Contact list of security experts
[ ] Documented recovery procedures
[ ] Multiple communication channels
[ ] Legal contact information (if needed)
[ ] Backup verification schedule
[ ] Security audit schedule
[ ] Emergency fund access
```

#### Documentation to Maintain
- **Asset inventory** - what keys/accounts you have
- **Backup locations** - where everything is stored
- **Recovery procedures** - step-by-step instructions
- **Contact information** - who to call for help
- **Timeline records** - when backups were created/tested

### During an Incident

#### Immediate Response (First Hour)
1. **Assess the situation** - what exactly happened?
2. **Isolate affected systems** - prevent further damage
3. **Check backup integrity** - ensure recovery options exist
4. **Document everything** - screenshots, logs, timeline
5. **Contact support resources** - technical and legal help

#### Communication Strategy
- **Internal notification** - team/family awareness
- **User notification** - if others are affected
- **Public communication** - if reputation management needed
- **Legal notification** - if regulatory requirements exist

### After an Incident

#### Recovery Process
1. **Generate new keys** - with improved security
2. **Migrate identity** - announce change to followers
3. **Update all systems** - use new keys everywhere
4. **Revoke old keys** - if possible with service providers
5. **Analyze root cause** - prevent future incidents

#### Lessons Learned
- **Security improvements** - what to do differently
- **Process updates** - better procedures
- **Training needs** - skills to develop
- **Tool upgrades** - better security software
- **Documentation updates** - keep procedures current

## 🎯 Practical Exercise: Security Audit

**Objective:** Audit your current security setup and create improvement plan

### Current State Assessment

**Digital Security Checklist:**
```
[ ] Private keys stored encrypted
[ ] Multiple backup copies exist
[ ] Password manager secured
[ ] Device encryption enabled
[ ] Software kept updated
[ ] Strong unique passwords
[ ] Two-factor authentication enabled
[ ] Regular backup testing
```

**Physical Security Checklist:**
```
[ ] Paper backups in secure location
[ ] Steel backup created (if high value)
[ ] Home security adequate
[ ] Work security adequate
[ ] Travel security considered
[ ] Family/roommate education
```

**Operational Security Checklist:**
```
[ ] Threat model documented
[ ] Incident response plan exists
[ ] Recovery procedures tested
[ ] Security practices documented
[ ] Regular security reviews scheduled
[ ] Expert contacts available
```

### Improvement Planning

For each unchecked item:
1. **Priority level** (High/Medium/Low)
2. **Required resources** (time, money, expertise)
3. **Implementation timeline** (this week, month, quarter)
4. **Success criteria** (how to verify completion)

**Example:**
```
❌ Steel backup created
Priority: High (valuable identity)
Resources: $100, 2 hours research + setup
Timeline: This month
Success: Keys stamped on steel, stored in bank safe
```

## 📝 Knowledge Check

!!! question "Test Your Understanding"
    
    **1. What is the 3-2-1 backup rule and why is it important?**
    
    ??? success "Answer"
        3 copies of your data, 2 different types of media, 1 offsite backup. This provides redundancy against multiple failure modes - if one backup fails, you have others. Different media types protect against technology failures, and offsite protects against disasters.
    
    **2. Why should you never take screenshots of your private keys?**
    
    ??? success "Answer"
        Screenshots are automatically backed up to cloud services, can be accidentally shared, and create digital copies that are harder to secure than properly encrypted text. They also often lack context about what they contain, making them easier to mishandle.
    
    **3. What should you do immediately if you suspect your private key has been compromised?**
    
    ??? success "Answer"
        Generate new keys immediately, announce the migration to your network, update all applications to use new keys, revoke old keys where possible, and analyze how the compromise happened to prevent recurrence.

---

## ✅ Lesson Complete

You now have the knowledge to maintain strong operational security for your Nostr identity. Security is an ongoing practice that requires regular attention and updates.

**Key Skills Acquired:**
- Comprehensive backup strategies using multiple methods
- Threat model analysis and risk mitigation
- Recognition of common security mistakes and red flags
- Incident response planning and execution

<div class="lesson-nav">
  <a href="key-management.md">← Previous: Key Management</a>
  <a href="identity-in-practice.md">Next: Identity in Practice →</a>
</div>

---

!!! success "Portfolio Addition"
    **Create your security plan**: Document your personal threat model, backup strategy, and incident response plan. This becomes your security playbook for protecting your Nostr identity.

!!! warning "Regular Maintenance"
    Schedule regular security reviews (quarterly or semi-annually) to test backups, update procedures, and assess new threats. Security requires ongoing attention, not just one-time setup.

!!! tip "Community Learning"
    Join security-focused discussions in the Nostr community. Learning from others' experiences and near-misses helps everyone improve their security practices.

!!! info "Deep Dive Available"
    For additional security resources and advanced techniques, check the security sections in our [reference materials](../../../concepts/) and [support resources](../../../support.md).
