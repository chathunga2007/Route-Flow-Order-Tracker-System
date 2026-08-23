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
import { toast } from 'sonner';
import { playNotificationSound } from '../utils/audio';

let isFirstLoad = true;

export const useOrderStore = create((set, get) => ({
  orders: [],
  activeOrderId: null,
  loading: true,
  isDark: true,

  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

  setActiveOrder: (id) => set({ activeOrderId: id }),

  subscribeToOrders: () => {
    const ordersCol = collection(db, 'orders');
    
    const unsubscribe = onSnapshot(
      ordersCol, 
      (snapshot) => {
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const previousOrders = get().orders;

        if (!isFirstLoad) {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const orderId = change.doc.id;

            if (change.type === 'added') {
              playNotificationSound('new_order');
              toast.success(`🎉 New Order Received: #${orderId}`, {
                description: `${data.customer} placed an order for ${data.total}`,
              });
            }

            if (change.type === 'modified') {
              const oldOrder = previousOrders.find((o) => o.id === orderId);
              if (oldOrder && oldOrder.status !== data.status) {
                playNotificationSound('advance');
                const statusName = data.status?.replace(/_/g, ' ').toUpperCase();
                toast.info(`📦 Order Status Updated!`, {
                  description: `Order #${orderId} is now ${statusName}`,
                });
              }
            }
          });
        }

        isFirstLoad = false;

        set({ 
          orders: ordersList, 
          loading: false,
          activeOrderId: get().activeOrderId || (ordersList[0]?.id ?? null)
        });
      },
      (error) => {
        console.error("Firestore error: ", error);
        set({ loading: false });
      }
    );

    return unsubscribe;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update status: ' + error.message);
    }
  },

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