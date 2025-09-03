export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

class KeyboardShortcutManager {
  private shortcuts: KeyboardShortcut[] = [];
  private isEnabled = true;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  register(shortcut: KeyboardShortcut) {
    this.shortcuts.push(shortcut);
  }

  unregister(key: string) {
    this.shortcuts = this.shortcuts.filter(s => s.key !== key);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;
    
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const shortcut = this.shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.altKey === event.altKey &&
      !!s.shiftKey === event.shiftKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  getShortcuts() {
    return [...this.shortcuts];
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.shortcuts = [];
  }
}

export const keyboardManager = new KeyboardShortcutManager();

// Global shortcuts
export const registerGlobalShortcuts = () => {
  // ESC to close modals/overlays
  keyboardManager.register({
    key: 'Escape',
    action: () => {
      // Close any open modals
      const modals = document.querySelectorAll('[role="dialog"]');
      modals.forEach(modal => {
        const closeButton = modal.querySelector('[aria-label*="close"], [data-dismiss]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      });
    },
    description: 'Close modals and overlays'
  });

  // Search shortcut
  keyboardManager.register({
    key: '/',
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: 'Focus search bar'
  });

  // Home shortcut
  keyboardManager.register({
    key: 'h',
    action: () => {
      window.location.href = '/';
    },
    description: 'Go to home page'
  });
};