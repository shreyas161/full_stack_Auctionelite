import { rtdb } from '../config/firebase';
import { ref, push, set, get } from 'firebase/database';

export const notificationService = {
  // Save notification preference
  subscribeToAuction: async (userId, auctionId, auctionData) => {
    try {
      const notificationRef = ref(rtdb, `notifications/${userId}`);
      const newNotificationRef = push(notificationRef);
      
      await set(newNotificationRef, {
        auctionId,
        auctionTitle: auctionData.title,
        auctionDate: auctionData.auctionDate,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error subscribing to auction:', error);
      return false;
    }
  },

  // Check for notifications that need to be sent
  checkNotifications: async (userId) => {
    try {
      const notificationsRef = ref(rtdb, `notifications/${userId}`);
      const snapshot = await get(notificationsRef);
      const notifications = [];
      
      snapshot.forEach((child) => {
        const notification = child.val();
        const auctionDate = new Date(notification.auctionDate);
        const now = new Date();
        
        // Check if auction is starting within the next hour
        if (auctionDate - now <= 3600000 && notification.status === 'pending') {
          notifications.push({
            id: child.key,
            ...notification
          });
        }
      });
      
      return notifications;
    } catch (error) {
      console.error('Error checking notifications:', error);
      return [];
    }
  },

  // Mark notification as sent
  markNotificationAsSent: async (userId, notificationId) => {
    try {
      const notificationRef = ref(rtdb, `notifications/${userId}/${notificationId}`);
      await set(notificationRef, { status: 'sent' });
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  }
}; 