export type Theme = 'light' | 'dark' | 'system';

export const THEME_UPDATED_EVENT = 'theme-updated';

// Notify components of theme changes
export const notifyThemeUpdated = () => {
  window.dispatchEvent(new Event(THEME_UPDATED_EVENT));
};

// Get current theme
export const getTheme = (): Theme => {
  const theme = localStorage.getItem('theme') as Theme;
  return theme || 'dark';
};

// Set theme
export const setTheme = (theme: Theme): void => {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  notifyThemeUpdated();
};

// Apply theme to document
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('dark', 'light');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

// Initialize theme on app start
export const initializeTheme = (): void => {
  const theme = getTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') {
      applyTheme('system');
    }
  });
};