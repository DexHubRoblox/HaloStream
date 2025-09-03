import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerGlobalShortcuts } from './utils/keyboardShortcuts'
import { setupAutoRefresh, setupVisibilityHandling, setupNetworkAwareRefresh } from './utils/autoRefresh'
import { startNotificationPolling } from './utils/notifications'

// Initialize global features
registerGlobalShortcuts();
setupAutoRefresh();
setupVisibilityHandling();
setupNetworkAwareRefresh();
startNotificationPolling();
createRoot(document.getElementById("root")!).render(<App />);
