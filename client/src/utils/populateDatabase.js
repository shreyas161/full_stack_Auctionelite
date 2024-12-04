import { rtdb } from '../config/firebase';
import { ref, set, push } from 'firebase/database';
import { upcomingAuctionsData } from '../data/upcomingAuctionsData';

export const populateUpcomingAuctions = async () => {
  try {
    const itemsRef = ref(rtdb, 'items');
    
    for (const item of upcomingAuctionsData) {
      const newItemRef = push(itemsRef);
      await set(newItemRef, item);
    }
    
    console.log('Database populated with upcoming auctions');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}; 