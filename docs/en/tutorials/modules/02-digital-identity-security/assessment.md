# Module 2 Assessment

!!! info "Assessment Overview"
    **Module 2 Final Assessment** • **Estimated Time:** 20 minutes  
    **Type:** Knowledge Check + Practical Demonstration + Security Audit

## Learning Objectives Review

Before proceeding to Module 3, let's verify you've mastered digital identity and security concepts.

By now, you should be able to:

- [x] Understand how public-key cryptography creates digital identity
- [x] Generate, manage, and secure your cryptographic keys
- [x] Implement proper backup and recovery procedures
- [x] Recognize and avoid common security pitfalls
- [x] Use your digital identity confidently across the Nostr network

---

## 📝 Knowledge Assessment

### Part 1: Cryptographic Fundamentals

!!! question "Question 1"
    **Explain the mathematical relationship between private and public keys. Why is this relationship "one-way"?**
    
    ??? success "Answer Key"
        Public keys are derived from private keys using elliptic curve cryptography (specifically secp256k1). The relationship is "one-way" because while it's computationally easy to derive a public key from a private key (milliseconds), the reverse operation (finding the private key from a public key) is computationally infeasible - it would take longer than the age of the universe with current technology.

!!! question "Question 2"
    **How do digital signatures prove identity without revealing the private key?**
    
    ??? success "Answer Key"
        Digital signatures use the private key to sign a hash of the message, creating a unique signature. This signature can be verified using the public key, proving that only the holder of the corresponding private key could have created it. The signature doesn't reveal the private key itself - it's mathematically impossible to derive the private key from the signature.

### Part 2: Key Management

!!! question "Question 3"
    **What makes a random number generator "cryptographically secure" and why does this matter for key generation?**
    
    ??? success "Answer Key"
        A cryptographically secure random number generator (CSPRNG) is unpredictable, non-reproducible, and has high entropy drawn from hardware-based sources. This matters because predictable or low-entropy key generation can be exploited by attackers who could guess or brute-force your private key.

!!! question "Question 4"
    **Describe the 3-2-1 backup rule and explain why each component is important.**
    
    ??? success "Answer Key"
        3 copies of your data (original + 2 backups), 2 different types of media (digital + physical), 1 offsite backup. This provides redundancy against multiple failure modes: if one backup fails you have others, different media protects against technology failures, and offsite protects against disasters like fire or theft.

### Part 3: Security Practices

!!! question "Question 5"
    **What are the key differences between hex and bech32 key formats, and when should you use each?**
    
    ??? success "Answer Key"
        Hex format is the raw 64-character format (0-9, a-f) used internally by applications. Bech32 format (nsec/npub) includes error detection, human-readable prefixes, and is safer for manual entry and sharing. Use hex for internal processing and APIs, bech32 for user interfaces, sharing, and manual backup.

!!! question "Question 6"
    **Why should you never take screenshots of your private keys, even if you plan to delete them?**
    
    ??? success "Answer Key"
        Screenshots are automatically backed up to cloud services, can be accidentally shared, create digital copies that are harder to secure than properly encrypted text, often lack context about their sensitive nature, and may be stored in device memory or cache even after deletion.

---

## 🛠️ Practical Assessment

### Demonstration 1: Secure Key Generation

**Objective:** Demonstrate ability to generate keys securely

**Instructions:**
1. Generate a new test key pair using a cryptographically secure method
2. Explain why the method you chose is secure
3. Convert between hex and bech32 formats
4. Create a test message and sign it with your key

**Success Criteria:**
- [ ] Keys generated using proper CSPRNG
- [ ] Can explain security properties of generation method
- [ ] Correctly converts between formats
- [ ] Successfully creates and verifies signature

### Demonstration 2: Backup Implementation

**Objective:** Create and test a complete backup system

**Instructions:**
1. Create encrypted digital backup of test keys
2. Create physical backup following best practices
3. Test recovery from each backup method
4. Document your backup strategy

**Success Criteria:**
- [ ] Digital backup properly encrypted with strong passphrase
- [ ] Physical backup clearly written and securely stored
- [ ] Can successfully recover keys from both backup types
- [ ] Backup strategy follows 3-2-1 rule principles

### Demonstration 3: Multi-Client Identity Setup

**Objective:** Configure identity across multiple Nostr applications

**Instructions:**
1. Import your test identity into 2+ different clients
2. Set up profile information consistently
3. Verify synchronization across clients
4. Test basic functionality (posting, following)

**Success Criteria:**
- [ ] Identity works correctly in multiple clients
- [ ] Profile information synchronized properly
- [ ] Basic functionality verified across platforms
- [ ] Can explain any client-specific differences observed

---

## 🔒 Security Audit Exercise

### Personal Security Assessment

**Objective:** Audit your current security practices and create improvement plan

#### Current State Evaluation

Rate your implementation (1-5 scale):

**Key Generation & Storage**
- [ ] Used cryptographically secure generation method (1-5)
- [ ] Private keys stored encrypted (1-5)
- [ ] Multiple backup copies exist (1-5)
- [ ] Backup recovery tested successfully (1-5)

**Operational Security**
- [ ] Strong unique passwords for security tools (1-5)
- [ ] Device security (encryption, screen locks) (1-5)
- [ ] Software kept updated (1-5)
- [ ] Secure network practices (1-5)

**Backup Strategy**
- [ ] Digital backups properly encrypted (1-5)
- [ ] Physical backups in secure locations (1-5)
- [ ] Offsite backup implemented (1-5)
- [ ] Regular backup testing scheduled (1-5)

**Documentation & Planning**
- [ ] Security procedures documented (1-5)
- [ ] Incident response plan exists (1-5)
- [ ] Recovery procedures tested (1-5)
- [ ] Maintenance schedule established (1-5)

#### Improvement Planning

For any item rated 3 or below:
1. **Specific improvement needed**
2. **Resources required** (time, money, tools)
3. **Implementation timeline**
4. **Success measurement**

### Threat Model Exercise

**Personal Threat Assessment:**

1. **What are your highest-value digital assets?**
2. **Who might want to target you and why?**
3. **What attack vectors are you most vulnerable to?**
4. **What would be the impact of different types of compromise?**
5. **What security measures are proportionate to your risk level?**

Create a 1-page threat model document that guides your security decisions.

---

## 🎯 Real-World Application

### Scenario Response

For each scenario, describe how you would respond:

#### Scenario 1: Suspected Compromise
You notice unusual activity that suggests your private key might have been compromised. What are your immediate actions and long-term response?

#### Scenario 2: Device Loss
Your laptop with your private keys is stolen. You have backups, but need to secure your identity quickly. What's your step-by-step response?

#### Scenario 3: Backup Failure
You discover that your primary backup method has failed and you can't recover your keys from it. What do you do?

#### Scenario 4: Social Engineering
Someone contacts you claiming to be from a Nostr service and asking for your private key to "verify your account." How do you respond?

---

## 💡 Critical Thinking Questions

### Deep Understanding

1. **Trade-offs:** What are the trade-offs between security and convenience in key management? How do you find the right balance?

2. **Future-proofing:** How might quantum computing affect current cryptographic security? What preparations should users consider?

3. **Social Recovery:** Could there be secure ways to recover identity through social consensus while maintaining cryptographic security?

4. **Scalability:** How might key management practices need to evolve as Nostr grows to millions of users?

5. **Education:** What are the biggest barriers to teaching good security practices to new users?

---

## ✅ Readiness Check

Before moving to Module 3, confirm you can:

- [ ] **Generate secure keys** using multiple methods
- [ ] **Implement robust backups** following 3-2-1 rule
- [ ] **Use keys safely** across multiple applications
- [ ] **Recognize security threats** and respond appropriately
- [ ] **Maintain ongoing security** through regular practices

### If You're Not Ready

**Areas for additional focus:**
- **Key generation practice** - Try different methods and tools
- **Backup implementation** - Set up and test multiple backup types
- **Security research** - Study additional threat models and mitigations
- **Community learning** - Engage with security-focused discussions

### If You're Ready

**Congratulations! 🎉** You have solid digital identity and security skills that will serve you well throughout your Nostr journey and beyond.

---

## 🎓 Module 2 Complete

### What You've Accomplished

- ✅ **Mastered cryptographic fundamentals** - Understand how digital identity works
- ✅ **Developed practical skills** - Can generate, store, and manage keys securely
- ✅ **Implemented security practices** - Have robust backup and operational procedures
- ✅ **Built real-world confidence** - Ready to use digital identity safely

### Skills That Transfer Beyond Nostr

The security skills you've learned apply to:
- **Cryptocurrency wallets** - Bitcoin, Ethereum, and other crypto assets
- **Other decentralized protocols** - Similar key management across platforms
- **General digital security** - Better practices for all online accounts
- **Professional development** - Security skills valuable in tech careers

### Up Next: Module 3

In the next module, you'll learn about **Events - The Language of Nostr**:

- How information flows through the Nostr protocol
- Different types of events and their purposes
- Event structure and validation
- Building complex interactions through event relationships

Your solid foundation in digital identity will make understanding the technical protocol much easier.

<div class="module-nav">
  <a href="identity-in-practice.md">← Previous: Identity in Practice</a>
  <a href="../../03-events-language-of-nostr/">Next: Module 3 →</a>
</div>

---

!!! tip "Share Your Progress"
    **Celebrate your achievement!** You've mastered one of the most challenging aspects of decentralized protocols. Consider sharing your learning milestone on Nostr using #LearnNostr.

!!! info "Security is Ongoing"
    Remember that security is a practice, not a destination. Schedule regular reviews of your security practices and stay current with new threats and mitigations.

!!! warning "Help Others Learn"
    Security knowledge is more valuable when shared. Consider helping other new users understand these concepts - teaching others reinforces your own learning.

**Ready for Module 3?** [Start learning about Events - The Language of Nostr →](../../03-events-language-of-nostr/)
