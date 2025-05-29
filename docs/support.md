# Support LearnNostr

!!! tip "Help Keep This Resource Free"
    LearnNostr is a community-driven educational platform. Your support helps us maintain and expand this comprehensive Nostr learning resource for everyone.

## ⚡ Zap the Creator

Show your appreciation for LearnNostr with Bitcoin zaps! Every contribution helps keep this educational resource free and growing.

<div class="zap-interface">
  <div class="zap-amounts">
    <h3>Choose Amount</h3>
    <div class="amount-buttons">
      <button class="amount-btn" data-amount="21" data-sats="21">
        <span class="sats">21</span>
        <span class="label">sats</span>
        <span class="usd">~$0.01</span>
      </button>
      <button class="amount-btn" data-amount="100" data-sats="100">
        <span class="sats">100</span>
        <span class="label">sats</span>
        <span class="usd">~$0.03</span>
      </button>
      <button class="amount-btn popular" data-amount="500" data-sats="500">
        <span class="sats">500</span>
        <span class="label">sats</span>
        <span class="usd">~$0.15</span>
        <span class="popular-badge">Popular</span>
      </button>
      <button class="amount-btn" data-amount="1000" data-sats="1000">
        <span class="sats">1,000</span>
        <span class="label">sats</span>
        <span class="usd">~$0.30</span>
      </button>
      <button class="amount-btn" data-amount="5000" data-sats="5000">
        <span class="sats">5,000</span>
        <span class="label">sats</span>
        <span class="usd">~$1.50</span>
      </button>
      <button class="amount-btn generous" data-amount="10000" data-sats="10000">
        <span class="sats">10,000</span>
        <span class="label">sats</span>
        <span class="usd">~$3.00</span>
        <span class="generous-badge">Generous</span>
      </button>
    </div>
    
    <div class="custom-amount">
      <label for="custom-sats">Custom Amount (sats):</label>
      <input type="number" id="custom-sats" placeholder="Enter amount..." min="1" max="1000000">
    </div>
  </div>

  <div class="zap-message">
    <h3>Add a Message (Optional)</h3>
    <textarea id="zap-message" placeholder="Thanks for LearnNostr! 🚀" maxlength="280"></textarea>
    <div class="char-count">
      <span id="char-count">0</span>/280
    </div>
  </div>

  <div class="zap-actions">
    <button id="zap-btn" class="zap-button" disabled>
      <span class="zap-icon">⚡</span>
      <span class="zap-text">Send Zap</span>
      <span class="zap-amount">0 sats</span>
    </button>
    
    <div class="lightning-address">
      <p>Or zap directly to: <code>greenmiracle695447@getalby.com</code></p>
    </div>
  </div>

  <div class="zap-status" id="zap-status" style="display: none;">
    <div class="status-message"></div>
  </div>
</div>

## Other Ways to Support

### 🌟 Share LearnNostr
Help others discover this resource:
- Share on social media
- Recommend to friends learning about Nostr
- Link from your blog or website

### 🐛 Report Issues
Found a bug or have suggestions?
- [Open an issue on GitHub](https://github.com/cristyalmonte/learnnostr/issues)
- Suggest improvements or corrections
- Help us keep the content accurate

### 📝 Contribute Content
Want to help improve LearnNostr?
- Submit pull requests with improvements
- Suggest new topics or tutorials
- Help translate content

### 💜 Follow the Project
Stay updated with LearnNostr:
- ⭐ [Star on GitHub](https://github.com/cristyalmonte/learnnostr)
- 🐦 Follow updates on social media
- 📧 Subscribe to announcements

---

## Why Support LearnNostr?

**🎯 Mission**: Make Nostr accessible to everyone through comprehensive, beginner-friendly education.

**💰 Costs**: Hosting, domain, development time, and content creation.

**🚀 Impact**: Your support helps us:
- Keep the site ad-free and fast
- Add new tutorials and guides
- Maintain accurate, up-to-date information
- Expand to new topics and use cases

**🙏 Transparency**: All funds go directly to maintaining and improving LearnNostr.

<div class="support-thanks">
  <h3>Thank You! 🧡</h3>
  <p>Every zap, no matter how small, makes a difference. You're helping build the future of decentralized social media education.</p>
</div>

<style>
.zap-interface {
  background: linear-gradient(135deg, #f8f4ff, #f0e6ff);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  border: 2px solid #e1bee7;
}

.zap-amounts h3 {
  color: #6a1b9a;
  margin-bottom: 1rem;
  text-align: center;
}

.amount-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.amount-btn {
  background: white;
  border: 2px solid #e1bee7;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80px;
}

.amount-btn:hover {
  border-color: #9c27b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
}

.amount-btn.selected {
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  color: white;
  border-color: #9c27b0;
}

.amount-btn .sats {
  font-size: 1.2rem;
  font-weight: bold;
  color: #6a1b9a;
}

.amount-btn.selected .sats {
  color: white;
}

.amount-btn .label {
  font-size: 0.8rem;
  color: #9e9e9e;
  margin: 0.2rem 0;
}

.amount-btn.selected .label {
  color: #e1bee7;
}

.amount-btn .usd {
  font-size: 0.7rem;
  color: #757575;
}

.amount-btn.selected .usd {
  color: #f3e5f5;
}

.popular-badge, .generous-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff9800;
  color: white;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
}

.generous-badge {
  background: #4caf50;
}

.custom-amount {
  margin-top: 1rem;
  text-align: center;
}

.custom-amount label {
  display: block;
  margin-bottom: 0.5rem;
  color: #6a1b9a;
  font-weight: 500;
}

.custom-amount input {
  padding: 0.75rem;
  border: 2px solid #e1bee7;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  font-size: 1rem;
}

.custom-amount input:focus {
  outline: none;
  border-color: #9c27b0;
}

.zap-message {
  margin: 2rem 0;
}

.zap-message h3 {
  color: #6a1b9a;
  margin-bottom: 1rem;
}

.zap-message textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1bee7;
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.zap-message textarea:focus {
  outline: none;
  border-color: #9c27b0;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #9e9e9e;
  margin-top: 0.5rem;
}

.zap-actions {
  text-align: center;
}

.zap-button {
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.zap-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.3);
}

.zap-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zap-icon {
  font-size: 1.3rem;
}

.lightning-address {
  margin-top: 1rem;
}

.lightning-address code {
  background: #f3e5f5;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #6a1b9a;
  font-weight: 500;
}

.zap-status {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.zap-status.success {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.zap-status.error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #f44336;
}

.zap-status.loading {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #2196f3;
}

.support-thanks {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
  border: 2px solid #ffcc02;
}

.support-thanks h3 {
  color: #ef6c00;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .amount-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .zap-interface {
    padding: 1rem;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('custom-sats');
  const messageTextarea = document.getElementById('zap-message');
  const charCount = document.getElementById('char-count');
  const zapButton = document.getElementById('zap-btn');
  const zapAmount = document.querySelector('.zap-amount');
  const zapStatus = document.getElementById('zap-status');
  
  let selectedAmount = 0;
  
  // Amount button selection
  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAmount = parseInt(btn.dataset.amount);
      customInput.value = '';
      updateZapButton();
    });
  });
  
  // Custom amount input
  customInput.addEventListener('input', () => {
    amountButtons.forEach(b => b.classList.remove('selected'));
    selectedAmount = parseInt(customInput.value) || 0;
    updateZapButton();
  });
  
  // Message character count
  messageTextarea.addEventListener('input', () => {
    const count = messageTextarea.value.length;
    charCount.textContent = count;
    if (count > 250) {
      charCount.style.color = '#f44336';
    } else {
      charCount.style.color = '#9e9e9e';
    }
  });
  
  // Update zap button state
  function updateZapButton() {
    if (selectedAmount > 0) {
      zapButton.disabled = false;
      zapAmount.textContent = `${selectedAmount.toLocaleString()} sats`;
    } else {
      zapButton.disabled = true;
      zapAmount.textContent = '0 sats';
    }
  }
  
  // Zap button click
  zapButton.addEventListener('click', async () => {
    if (selectedAmount <= 0) return;
    
    const message = messageTextarea.value || 'Thanks for LearnNostr! 🚀';
    
    showStatus('Preparing zap...', 'loading');
    
    try {
      // Try WebLN first (browser extension wallets)
      if (typeof window.webln !== 'undefined') {
        await window.webln.enable();
        
        const invoice = await generateInvoice(selectedAmount, message);
        const result = await window.webln.sendPayment(invoice);
        
        showStatus('⚡ Zap sent successfully! Thank you for supporting LearnNostr! 🧡', 'success');
        resetForm();
      } else {
        // Fallback to lightning: URL
        const lightningUrl = `lightning:greenmiracle695447@getalby.com?amount=${selectedAmount}&message=${encodeURIComponent(message)}`;
        window.open(lightningUrl, '_blank');
        showStatus('Opening Lightning wallet... Complete the payment to send your zap! ⚡', 'success');
      }
    } catch (error) {
      console.error('Zap error:', error);
      showStatus('Unable to send zap automatically. Please try copying the Lightning address: greenmiracle695447@getalby.com', 'error');
    }
  });
  
  function showStatus(message, type) {
    zapStatus.style.display = 'block';
    zapStatus.className = `zap-status ${type}`;
    zapStatus.querySelector('.status-message').textContent = message;
    
    if (type === 'success') {
      setTimeout(() => {
        zapStatus.style.display = 'none';
      }, 5000);
    }
  }
  
  function resetForm() {
    amountButtons.forEach(b => b.classList.remove('selected'));
    customInput.value = '';
    messageTextarea.value = '';
    charCount.textContent = '0';
    selectedAmount = 0;
    updateZapButton();
  }
  
  async function generateInvoice(amount, message) {
    // This would typically call your LNURL-pay endpoint
    // For now, we'll use a placeholder
    throw new Error('Invoice generation not implemented - using fallback');
  }
  
  // Set default selection
  document.querySelector('[data-amount="500"]').click();
});
</script> 