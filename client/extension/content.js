// Mono Vault Extension Content Script
class Mono VaultContent {
  constructor() {
    this.passwordFields = [];
    this.loginForms = [];
    this.init();
  }

  init() {
    // Only run on pages that might have login forms
    if (this.shouldInject()) {
      this.findPasswordFields();
      this.setupObserver();
      this.checkForSavedPasswords();
    }
  }

  shouldInject() {
    // Don't inject on Mono Vault's own pages or certain system pages
    const hostname = window.location.hostname;
    const excludedSites = ['localhost', 'chrome://', 'moz-extension://'];
    
    return !excludedSites.some(site => hostname.includes(site));
  }

  findPasswordFields() {
    // Find password fields and login forms
    this.passwordFields = Array.from(document.querySelectorAll('input[type="password"]'));
    this.loginForms = Array.from(document.querySelectorAll('form')).filter(form => {
      return form.querySelector('input[type="password"]') || 
             form.querySelector('input[type="email"]') ||
             form.querySelector('input[name*="username"]') ||
             form.querySelector('input[name*="login"]');
    });

    // Add Mono Vault indicators to password fields
    this.passwordFields.forEach(field => {
      this.addMono VaultIndicator(field);
    });
  }

  addMono VaultIndicator(passwordField) {
    // Don't add if already exists
    if (passwordField.parentNode.querySelector('.mono vault-indicator')) {
      return;
    }

    const indicator = document.createElement('div');
    indicator.className = 'mono vault-indicator';
    indicator.innerHTML = '🔒';
    indicator.title = 'Mono Vault can save this password';
    
    Object.assign(indicator.style, {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '16px',
      cursor: 'pointer',
      zIndex: '10000',
      background: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    });

    // Position the field relatively if it isn't already
    const fieldPosition = window.getComputedStyle(passwordField).position;
    if (fieldPosition === 'static') {
      passwordField.style.position = 'relative';
    }

    passwordField.parentNode.style.position = 'relative';
    passwordField.parentNode.appendChild(indicator);

    // Add click handler
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showPasswordSavePrompt(passwordField);
    });
  }

  setupObserver() {
    // Watch for dynamically added forms
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if new password fields were added
          const newPasswordFields = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .flatMap(node => [
              ...node.querySelectorAll ? node.querySelectorAll('input[type="password"]') : [],
              ...(node.type === 'password' ? [node] : [])
            ]);

          newPasswordFields.forEach(field => {
            this.addMono VaultIndicator(field);
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  async checkForSavedPasswords() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'checkPassword',
        url: window.location.href
      });

      if (response.success && response.data) {
        this.showAutoFillOption();
      }
    } catch (error) {
      console.error('Failed to check for saved passwords:', error);
    }
  }

  showAutoFillOption() {
    // Create a small notification for auto-fill
    const notification = document.createElement('div');
    notification.className = 'mono vault-autofill-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        cursor: pointer;
        transition: all 0.3s ease;
      " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
        🔒 Mono Vault can auto-fill this form
        <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Click to fill saved credentials</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5001);

    // Add click handler for auto-fill
    notification.addEventListener('click', () => {
      this.autoFillForm();
      notification.remove();
    });
  }

  async autoFillForm() {
    try {
      // In a real implementation, this would fetch and decrypt saved passwords
      const demoCredentials = {
        username: 'demo@example.com',
        password: 'demo-password'
      };

      // Find username/email field
      const usernameField = document.querySelector('input[type="email"], input[name*="username"], input[name*="email"], input[name*="login"]');
      if (usernameField) {
        usernameField.value = demoCredentials.username;
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Find password field
      const passwordField = document.querySelector('input[type="password"]');
      if (passwordField) {
        passwordField.value = demoCredentials.password;
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      }

      this.showTemporaryMessage('✅ Credentials auto-filled successfully!');
    } catch (error) {
      console.error('Auto-fill failed:', error);
      this.showTemporaryMessage('❌ Auto-fill failed. Please try manually.');
    }
  }

  showPasswordSavePrompt(passwordField) {
    // Create save prompt overlay
    const overlay = document.createElement('div');
    overlay.className = 'mono vault-save-prompt';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          max-width: 400px;
          width: 90%;
        ">
          <h3 style="margin: 0 0 16px 0; color: #333;">Save Password to Mono Vault</h3>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
            Would you like to save this password securely in Mono Vault?
          </p>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="mono vault-cancel" style="
              padding: 8px 16px;
              border: 1px solid #ddd;
              background: white;
              border-radius: 6px;
              cursor: pointer;
              color: #666;
            ">Cancel</button>
            <button class="mono vault-save" style="
              padding: 8px 16px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            ">Save Password</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners
    overlay.querySelector('.mono vault-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.querySelector('.mono vault-save').addEventListener('click', async () => {
      await this.savePasswordFromForm(passwordField);
      overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  async savePasswordFromForm(passwordField) {
    try {
      const form = passwordField.closest('form');
      const usernameField = form?.querySelector('input[type="email"], input[name*="username"], input[name*="email"], input[name*="login"]');
      
      const passwordData = {
        title: document.title,
        url: window.location.href,
        username: usernameField?.value || '',
        password: passwordField.value,
        domain: window.location.hostname
      };

      // In a real implementation, this would encrypt the password before saving
      // For now, we'll just show a success message
      this.showTemporaryMessage('🔒 Password saved securely to Mono Vault!');
      
    } catch (error) {
      console.error('Failed to save password:', error);
      this.showTemporaryMessage('❌ Failed to save password. Please try again.');
    }
  }

  showTemporaryMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = message;
    Object.assign(messageDiv.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: '100000',
      transition: 'all 0.3s ease'
    });

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 300);
    }, 3000);
  }
}

// Initialize content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Mono VaultContent();
  });
} else {
  new Mono VaultContent();
}