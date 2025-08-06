// Mono Vault Extension Background Script
class Mono VaultBackground {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupContextMenus();
  }

  setupEventListeners() {
    // Handle installation and updates
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.onInstall();
      } else if (details.reason === 'update') {
        this.onUpdate();
      }
    });

    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep the message channel open for async responses
    });

    // Handle tab updates for auto-detection
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.onTabComplete(tab);
      }
    });
  }

  onInstall() {
    console.log('Mono Vault extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      mono vault_settings: {
        autoSavePasswords: false,
        syncEnabled: true,
        theme: 'dark'
      },
      mono vault_bookmarks: [],
      mono vault_passwords: []
    });

    // Open welcome page
    chrome.tabs.create({
      url: 'http://localhost:5173?welcome=true'
    });
  }

  onUpdate() {
    console.log('Mono Vault extension updated');
  }

  setupContextMenus() {
    chrome.contextMenus.removeAll(() => {
      // Add bookmark context menu
      chrome.contextMenus.create({
        id: 'mono vault-add-bookmark',
        title: '🔖 Save to Mono Vault',
        contexts: ['page']
      });

      // Add link bookmark context menu
      chrome.contextMenus.create({
        id: 'mono vault-add-link',
        title: '🔗 Save link to Mono Vault',
        contexts: ['link']
      });
    });

    // Handle context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  async handleContextMenuClick(info, tab) {
    try {
      let bookmark = {};

      if (info.menuItemId === 'mono vault-add-bookmark') {
        bookmark = {
          title: tab.title,
          url: tab.url,
          favicon: tab.favIconUrl
        };
      } else if (info.menuItemId === 'mono vault-add-link') {
        bookmark = {
          title: info.linkText || 'Untitled Link',
          url: info.linkUrl,
          favicon: `${new URL(info.linkUrl).origin}/favicon.ico`
        };
      }

      await this.saveBookmark(bookmark);
      this.showNotification('Bookmark saved!', `Added "${bookmark.title}" to Mono Vault`);

    } catch (error) {
      console.error('Failed to save bookmark from context menu:', error);
      this.showNotification('Failed to save bookmark', 'Please try again');
    }
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'saveBookmark':
          const result = await this.saveBookmark(message.data);
          sendResponse({ success: true, data: result });
          break;

        case 'getBookmarks':
          const bookmarks = await this.getBookmarks();
          sendResponse({ success: true, data: bookmarks });
          break;

        case 'checkPassword':
          const hasPassword = await this.checkForSavedPassword(message.url);
          sendResponse({ success: true, data: hasPassword });
          break;

        case 'syncData':
          await this.syncWithBackend();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background message handler error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async saveBookmark(bookmarkData) {
    const bookmark = {
      id: Date.now().toString(),
      title: bookmarkData.title,
      url: bookmarkData.url,
      favicon: bookmarkData.favicon || `${new URL(bookmarkData.url).origin}/favicon.ico`,
      folder: bookmarkData.folder || '',
      createdAt: new Date().toISOString(),
      clickCount: 0,
      isStarred: false
    };

    // Get existing bookmarks
    const result = await chrome.storage.local.get(['mono vault_bookmarks']);
    const bookmarks = result.mono vault_bookmarks || [];

    // Check if bookmark already exists
    const existingIndex = bookmarks.findIndex(b => b.url === bookmark.url);
    if (existingIndex >= 0) {
      // Update existing bookmark
      bookmarks[existingIndex] = { ...bookmarks[existingIndex], ...bookmark };
    } else {
      // Add new bookmark
      bookmarks.unshift(bookmark);
    }

    // Save to storage
    await chrome.storage.local.set({ mono vault_bookmarks: bookmarks });

    // Sync with backend if authenticated
    await this.syncBookmarkToBackend(bookmark);

    return bookmark;
  }

  async getBookmarks() {
    const result = await chrome.storage.local.get(['mono vault_bookmarks']);
    return result.mono vault_bookmarks || [];
  }

  async checkForSavedPassword(url) {
    const result = await chrome.storage.local.get(['mono vault_passwords']);
    const passwords = result.mono vault_passwords || [];
    
    return passwords.some(password => {
      if (password.url) {
        const passwordDomain = new URL(password.url).hostname;
        const currentDomain = new URL(url).hostname;
        return passwordDomain === currentDomain;
      }
      return false;
    });
  }

  async syncBookmarkToBackend(bookmark) {
    try {
      const tokenResult = await chrome.storage.local.get(['mono vault_token']);
      if (!tokenResult.mono vault_token) {
        return; // Not authenticated
      }

      // In a real implementation, make API call to backend
      // const response = await fetch('http://localhost:5000/api/bookmarks', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${tokenResult.mono vault_token}`
      //   },
      //   body: JSON.stringify(bookmark)
      // });

      console.log('Bookmark synced to backend:', bookmark.title);
    } catch (error) {
      console.error('Failed to sync bookmark to backend:', error);
    }
  }

  async syncWithBackend() {
    try {
      const tokenResult = await chrome.storage.local.get(['mono vault_token']);
      if (!tokenResult.mono vault_token) {
        throw new Error('Not authenticated');
      }

      // In a real implementation, sync all data with backend
      console.log('Data synced with backend');
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  showNotification(title, message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message
    });
  }

  onTabComplete(tab) {
    // Check if this page has saved passwords and inject content script if needed
    this.checkForSavedPassword(tab.url).then(hasPassword => {
      if (hasPassword) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      }
    });
  }
}

// Initialize background script
const mono VaultBackground = new Mono VaultBackground();