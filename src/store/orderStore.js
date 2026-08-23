import { create } from 'zustand';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export const useOrderStore = create((set, get) => ({
  orders: [],
  activeOrderId: null,
  loading: true,

  setActiveOrder: (id) => set({ activeOrderId: id }),

  // Real-time Firestore Listener
  subscribeToOrders: () => {
    const ordersCol = collection(db, 'orders');
    
    const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ 
        orders: ordersList, 
        loading: false,
        activeOrderId: get().activeOrderId || (ordersList[0]?.id ?? null)
      });
    });

    return unsubscribe;
  },

  // Update Status in Firestore (Vendor side action)
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  },

  // Demo initial order add karanna
  seedInitialData: async () => {
    const demoId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const defaultOrder = {
      customer: 'Kamal Silva',
      status: 'preparing',
      items: [
        { name: 'Double Cheese Burger', qty: 2, price: 'Rs. 2,400' },
        { name: 'Crispy Fries (L)', qty: 1, price: 'Rs. 650' },
        { name: 'Coca-Cola Zero (500ml)', qty: 2, price: 'Rs. 500' },
      ],
      total: 'Rs. 3,550',
      address: 'No. 45, Galle Road, Colombo 03',
      driver: {
        name: 'Kasun Perera',
        rating: 4.9,
        vehicle: 'Honda CB Hornet (WP BD-4821)',
        phone: '+94 77 123 4567',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        deliveriesCount: '1,420+'
      },
      eta: '18 - 25 mins',
      timestamp: 'Just now'
    };

    await setDoc(doc(db, 'orders', demoId), defaultOrder);
  }
}));