# Support LearnNostr

!!! tip "Help Keep This Resource Free"
    LearnNostr is a community-driven educational platform. Your support helps us maintain and expand this comprehensive Nostr learning resource for everyone.

## ⚡ Support LearnNostr

Donate to LearnNostr via Bitcoin Lightning:

```
greenmiracle695447@getalby.com
```

Copy and paste the address above into your Lightning wallet to support this project!

<style>
/* Compact container with smaller overall size */
.zap-interface {
  max-width: 400px !important;
  margin: 1.5rem auto;
  padding: 1.5rem;
  background: var(--md-default-bg-color);
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Smaller typography throughout */
.zap-interface h2 {
  font-size: 1.1rem !important;
  margin-bottom: 0.8rem !important;
}

.zap-interface p {
  font-size: 0.85rem !important;
  margin-bottom: 1rem !important;
}

/* Compact amount buttons grid */
.amount-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

/* Compact zap buttons with lightning design */
.amount-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 65px;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.amount-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, #7c3aed, #9333ea);
}

.amount-btn.selected {
  background: linear-gradient(135deg, #6d28d9, #7c3aed);
  box-shadow: 0 0 0 2px #8b5cf6;
  transform: scale(1.02);
}

.lightning-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.amount-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 0.125rem;
}

.amount-text small {
  font-size: 0.65rem;
  opacity: 0.9;
}

.usd-price {
  font-size: 0.7rem;
  opacity: 0.85;
  font-weight: 500;
}

/* Compact custom amount input */
.custom-amount {
  margin-bottom: 1rem;
}

.custom-amount input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 8px;
  background: var(--md-default-bg-color);
  color: var(--md-default-fg-color);
  font-size: 0.85rem;
  transition: border-color 0.2s ease;
}

.custom-amount input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* Compact message section */
.zap-message {
  position: relative;
  margin-bottom: 1rem;
}

.zap-message textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 8px;
  background: var(--md-default-bg-color);
  color: var(--md-default-fg-color);
  font-size: 0.85rem;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.2s ease;
}

.zap-message textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.char-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.7rem;
  color: var(--md-default-fg-color--light);
  background: var(--md-default-bg-color);
  padding: 0 0.25rem;
}

/* Compact zap button */
.zap-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.zap-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
}

.zap-button:disabled {
  background: var(--md-default-fg-color--lightest);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.zap-icon {
  font-size: 1rem;
}

.zap-amount {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Compact status messages */
.zap-status {
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  text-align: center;
  display: none;
}

.zap-status.success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: block;
}

.zap-status.error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
  display: block;
}

/* Dark mode adjustments */
[data-md-color-scheme="slate"] .zap-interface {
  background: var(--md-code-bg-color);
  border-color: var(--md-default-fg-color--lightest);
}

[data-md-color-scheme="slate"] .custom-amount input,
[data-md-color-scheme="slate"] .zap-message textarea {
  background: var(--md-code-bg-color);
  border-color: var(--md-default-fg-color--lightest);
}

[data-md-color-scheme="slate"] .char-count {
  background: var(--md-code-bg-color);
}

/* Responsive design for mobile */
@media (max-width: 480px) {
  .zap-interface {
    max-width: 100% !important;
    margin: 1rem;
    padding: 1rem;
  }
  
  .amount-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .amount-btn {
    padding: 0.6rem 0.4rem;
    min-height: 60px;
  }
  
  .lightning-icon {
    font-size: 1.1rem;
  }
  
  .amount-text {
    font-size: 0.7rem;
  }
  
  .usd-price {
    font-size: 0.65rem;
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
  
  // Set default selection to first button (10k sats)
  if (amountButtons.length > 0) {
    amountButtons[0].click();
  }
});
</script> 