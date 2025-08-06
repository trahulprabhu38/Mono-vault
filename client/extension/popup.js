// Mono Vault Extension Popup JavaScript
class Mono VaultPopup {
  constructor() {
    this.currentTab = null;
    this.isAuthenticated = false;
    this.bookmarks = [];
    this.init();
  }

  async init() {
    await this.getCurrentTab();
    await this.checkAuthentication();
    this.render();
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
  }

  async checkAuthentication() {
    try {
      const result = await chrome.storage.local.get(['mono vault_token']);
      this.isAuthenticated = !!result.mono vault_token;
      
      if (this.isAuthenticated) {
        await this.loadBookmarks();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.isAuthenticated = false;
    }
  }

  async loadBookmarks() {
    try {
      // In a real implementation, this would fetch from your API
      const result = await chrome.storage.local.get(['mono vault_bookmarks']);
      this.bookmarks = result.mono vault_bookmarks || [];
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  }

  render() {
    const content = document.getElementById('content');
    
    if (!this.isAuthenticated) {
      content.innerHTML = this.renderAuthRequired();
    } else {
      content.innerHTML = this.renderMainInterface();
      this.setupEventListeners();
    }
  }

  renderAuthRequired() {
    return `
      <div class="auth-container">
        <div class="auth-icon">🔐</div>
        <div class="auth-message">
          Please sign in to Mono Vault to access your bookmarks and passwords.
        </div>
        <button class="btn" onclick="mono VaultPopup.openWebApp()">
          Open Mono Vault
        </button>
      </div>
    `;
  }

  renderMainInterface() {
    return `
      <div class="tabs">
        <div class="tab active" data-tab="bookmark">Add Bookmark</div>
        <div class="tab" data-tab="quick">Quick Access</div>
      </div>

      <div id="bookmark-tab" class="tab-content">
        ${this.renderBookmarkForm()}
      </div>

      <div id="quick-tab" class="tab-content" style="display: none;">
        ${this.renderQuickAccess()}
      </div>
    `;
  }

  renderBookmarkForm() {
    return `
      <div class="bookmark-form">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" id="bookmark-title" class="form-input" 
                 value="${this.currentTab?.title || ''}" placeholder="Bookmark title">
        </div>
        <div class="form-group">
          <label class="form-label">URL</label>
          <input type="url" id="bookmark-url" class="form-input" 
                 value="${this.currentTab?.url || ''}" placeholder="https://example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Folder (Optional)</label>
          <select id="bookmark-folder" class="form-input">
            <option value="">No folder</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="dev">Development</option>
          </select>
        </div>
        <button class="btn" onclick="mono VaultPopup.saveBookmark()">
          💾 Save Bookmark
        </button>
      </div>
      <div id="bookmark-message"></div>
    `;
  }

  renderQuickAccess() {
    const recentBookmarks = this.bookmarks.slice(0, 8);
    
    return `
      <div class="quick-actions">
        <button class="quick-btn" onclick="mono VaultPopup.openWebApp()">
          🏠 Dashboard
        </button>
        <button class="quick-btn" onclick="mono VaultPopup.syncData()">
          🔄 Sync
        </button>
      </div>

      <div class="bookmark-list">
        ${recentBookmarks.length > 0 ? 
          recentBookmarks.map(bookmark => `
            <div class="bookmark-item" onclick="mono VaultPopup.openBookmark('${bookmark.url}')">
              <img class="bookmark-favicon" src="${bookmark.favicon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/></svg>'}" 
                   onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\"><path fill=\\"white\\" d=\\"M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z\\"/></svg>'">
              <span class="bookmark-title">${bookmark.title}</span>
            </div>
          `).join('') : 
          '<div style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">No bookmarks yet</div>'
        }
      </div>
    `;
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  }

  async saveBookmark() {
    const title = document.getElementById('bookmark-title').value.trim();
    const url = document.getElementById('bookmark-url').value.trim();
    const folder = document.getElementById('bookmark-folder').value;
    const messageEl = document.getElementById('bookmark-message');

    if (!title || !url) {
      this.showMessage('Please fill in both title and URL', 'error');
      return;
    }

    try {
      const bookmark = {
        id: Date.now().toString(),
        title,
        url,
        folder,
        favicon: `${new URL(url).origin}/favicon.ico`,
        createdAt: new Date().toISOString(),
        clickCount: 0
      };

      // Save locally
      this.bookmarks.unshift(bookmark);
      await chrome.storage.local.set({ mono vault_bookmarks: this.bookmarks });

      // In a real implementation, also sync with the backend API
      await this.syncToBackend(bookmark);

      this.showMessage('Bookmark saved successfully! 🎉', 'success');
      
      // Clear form
      document.getElementById('bookmark-title').value = '';
      document.getElementById('bookmark-url').value = '';
      document.getElementById('bookmark-folder').value = '';

    } catch (error) {
      console.error('Failed to save bookmark:', error);
      this.showMessage('Failed to save bookmark. Please try again.', 'error');
    }
  }

  async syncToBackend(bookmark) {
    // Mock API call - in real implementation, this would call your backend
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  showMessage(message, type = 'success') {
    const messageEl = document.getElementById('bookmark-message');
    messageEl.innerHTML = `<div class="${type}-message">${message}</div>`;
    
    // Clear message after 3 seconds
    setTimeout(() => {
      messageEl.innerHTML = '';
    }, 3000);
  }

  openBookmark(url) {
    chrome.tabs.create({ url });
  }

  openWebApp() {
    chrome.tabs.create({ url: 'http://localhost:5173' }); // Update with your actual URL
  }

  async syncData() {
    this.showMessage('Syncing data...', 'success');
    
    try {
      // In real implementation, sync with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.showMessage('Data synced successfully! ✅', 'success');
    } catch (error) {
      this.showMessage('Sync failed. Please try again.', 'error');
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.mono VaultPopup = new Mono VaultPopup();
});