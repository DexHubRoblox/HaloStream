import { Media } from './api';

export interface Notification {
  id: string;
  type: 'new_episode' | 'new_season' | 'recommendation' | 'trending';
  title: string;
  message: string;
  media?: Media;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const NOTIFICATIONS_UPDATED_EVENT = 'notifications-updated';

// Notify components of notification changes
export const notifyNotificationsUpdated = () => {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
};

// Get all notifications
export const getNotifications = (): Notification[] => {
  const notifications = localStorage.getItem('notifications');
  return notifications ? JSON.parse(notifications) : [];
};

// Add a new notification
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false
  };
  
  notifications.unshift(newNotification);
  
  // Keep only last 50 notifications
  const trimmedNotifications = notifications.slice(0, 50);
  localStorage.setItem('notifications', JSON.stringify(trimmedNotifications));
  notifyNotificationsUpdated();
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  );
  
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  notifyNotificationsUpdated();
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    read: true
  }));
  
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  notifyNotificationsUpdated();
};

// Get unread notification count
export const getUnreadNotificationCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(notification => !notification.read).length;
};

// Clear all notifications
export const clearAllNotifications = (): void => {
  localStorage.removeItem('notifications');
  notifyNotificationsUpdated();
};

// Check for new episodes (mock implementation)
export const checkForNewEpisodes = async (): Promise<void> => {
  // In a real app, this would check against a backend API
  // For demo purposes, we'll create mock notifications
  
  const mockNewEpisodes = [
    {
      type: 'new_episode' as const,
      title: 'New Episode Available!',
      message: 'Season 2, Episode 5 of your favorite show is now available.',
      actionUrl: '/watch/tv/12345'
    },
    {
      type: 'new_season' as const,
      title: 'New Season Released!',
      message: 'Season 3 of Breaking Bad is now streaming.',
      actionUrl: '/details/tv/1396'
    }
  ];

  // Randomly add notifications (for demo)
  if (Math.random() > 0.8) {
    const randomNotification = mockNewEpisodes[Math.floor(Math.random() * mockNewEpisodes.length)];
    addNotification(randomNotification);
  }
};

// Auto-refresh notifications periodically
export const startNotificationPolling = (): void => {
  // Check for new episodes every 30 minutes
  const interval = setInterval(checkForNewEpisodes, 30 * 60 * 1000);
  
  // Store interval ID for cleanup
  (window as any).notificationInterval = interval;
};

// Stop notification polling
export const stopNotificationPolling = (): void => {
  if ((window as any).notificationInterval) {
    clearInterval((window as any).notificationInterval);
    delete (window as any).notificationInterval;
  }
};