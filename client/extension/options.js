// Mono Vault Extension Options JavaScript
class Mono VaultOptions {
  constructor() {
    this.settings = {
      autoSavePasswords: false,
      syncEnabled: true,
      showContextMenus: true,
      autoLock: true,
      requireAuthForAutofill: false
    };
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadStats();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(['mono vault_settings']);
      if (result.mono vault_settings) {
        this.settings = { ...this.settings, ...result.mono vault_settings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async loadStats() {
    try {
      const results = await chrome.storage.local.get([
        'mono vault_bookmarks',
        'mono vault_passwords',
        'mono vault_folders',
        'mono vault_sync_count'
      ]);

      const bookmarks = results.mono vault_bookmarks || [];
      const passwords = results.mono vault_passwords || [];
      const folders = results.mono vault_folders || [];
      const syncCount = results.mono vault_sync_count || 0;

      document.getElementById('bookmark-count').textContent = bookmarks.length;
      document.getElementById('password-count').textContent = passwords.length;
      document.getElementById('folder-count').textContent = folders.length;
      document.getElementById('sync-count').textContent = syncCount;

    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  setupEventListeners() {
    // Toggle switches
    document.getElementById('auto-save-toggle').addEventListener('click', () => {
      this.toggleSetting('autoSavePasswords', 'auto-save-toggle');
    });

    document.getElementById('sync-toggle').addEventListener('click', () => {
      this.toggleSetting('syncEnabled', 'sync-toggle');
    });

    document.getElementById('context-menu-toggle').addEventListener('click', () => {
      this.toggleSetting('showContextMenus', 'context-menu-toggle');
    });

    document.getElementById('auto-lock-toggle').addEventListener('click', () => {
      this.toggleSetting('autoLock', 'auto-lock-toggle');
    });

    document.getElementById('auth-autofill-toggle').addEventListener('click', () => {
      this.toggleSetting('requireAuthForAutofill', 'auth-autofill-toggle');
    });
  }

  toggleSetting(settingKey, toggleId) {
    this.settings[settingKey] = !this.settings[settingKey];
    this.updateToggleUI(toggleId, this.settings[settingKey]);
  }

  updateToggleUI(toggleId, isActive) {
    const toggle = document.getElementById(toggleId);
    if (isActive) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  updateUI() {
    // Update all toggle switches based on current settings
    this.updateToggleUI('auto-save-toggle', this.settings.autoSavePasswords);
    this.updateToggleUI('sync-toggle', this.settings.syncEnabled);
    this.updateToggleUI('context-menu-toggle', this.settings.showContextMenus);
    this.updateToggleUI('auto-lock-toggle', this.settings.autoLock);
    this.updateToggleUI('auth-autofill-toggle', this.settings.requireAuthForAutofill);
  }

  async saveSettings() {
    try {
      await chrome.storage.local.set({ mono vault_settings: this.settings });
      this.showSuccessMessage('Settings saved successfully! ✅');
      
      // Send message to background script to update context menus
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: this.settings
      });

    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showSuccessMessage('Failed to save settings. Please try again.', true);
    }
  }

  async resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.settings = {
        autoSavePasswords: false,
        syncEnabled: true,
        showContextMenus: true,
        autoLock: true,
        requireAuthForAutofill: false
      };
      
      this.updateUI();
      await this.saveSettings();
      this.showSuccessMessage('Settings reset to defaults ↻');
    }
  }

  async syncData() {
    this.showSuccessMessage('Syncing data...', false, 0);
    
    try {
      // Send sync request to background script
      const response = await chrome.runtime.sendMessage({ action: 'syncData' });
      
      if (response.success) {
        // Update sync count
        const result = await chrome.storage.local.get(['mono vault_sync_count']);
        const newCount = (result.mono vault_sync_count || 0) + 1;
        await chrome.storage.local.set({ mono vault_sync_count: newCount });
        document.getElementById('sync-count').textContent = newCount;
        
        this.showSuccessMessage('Data synced successfully! ✅');
      } else {
        throw new Error(response.error || 'Sync failed');
      }
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.showSuccessMessage('Sync failed. Please check your connection and try again.', true);
    }
  }

  async exportData() {
    try {
      const results = await chrome.storage.local.get([
        'mono vault_bookmarks',
        'mono vault_passwords',
        'mono vault_folders',
        'mono vault_settings'
      ]);

      const exportData = {
        bookmarks: results.mono vault_bookmarks || [],
        folders: results.mono vault_folders || [],
        settings: results.mono vault_settings || this.settings,
        exportDate: new Date().toISOString()
      };

      // Note: Passwords are excluded from export for security
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mono vault-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      this.showSuccessMessage('Data exported successfully! 📁');
      
    } catch (error) {
      console.error('Export failed:', error);
      this.showSuccessMessage('Export failed. Please try again.', true);
    }
  }

  openWebApp() {
    chrome.tabs.create({
      url: 'http://localhost:5173' // Update with your actual web app URL
    });
  }

  showSuccessMessage(message, isError = false, duration = 3000) {
    const messageEl = document.getElementById('success-message');
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    
    if (isError) {
      messageEl.style.background = 'rgba(244, 67, 54, 0.1)';
      messageEl.style.color = '#F44336';
      messageEl.style.borderColor = 'rgba(244, 67, 54, 0.2)';
    } else {
      messageEl.style.background = 'rgba(76, 175, 80, 0.1)';
      messageEl.style.color = '#4CAF50';
      messageEl.style.borderColor = 'rgba(76, 175, 80, 0.2)';
    }
    
    if (duration > 0) {
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, duration);
    }
  }
}

// Global functions for HTML onclick handlers
let mono VaultOptions;

async function saveSettings() {
  await mono VaultOptions.saveSettings();
}

async function resetSettings() {
  await mono VaultOptions.resetSettings();
}

async function syncData() {
  await mono VaultOptions.syncData();
}

async function exportData() {
  await mono VaultOptions.exportData();
}

function openWebApp() {
  mono VaultOptions.openWebApp();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  mono VaultOptions = new Mono VaultOptions();
});