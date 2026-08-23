import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { X, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const MENU_ITEMS = [
  { id: '1', name: 'Double Cheese Burger', price: 1200 },
  { id: '2', name: 'Crispy Chicken Submarine', price: 1850 },
  { id: '3', name: 'Crispy Fries (L)', price: 650 },
  { id: '4', name: 'Coca-Cola Zero (500ml)', price: 250 },
  { id: '5', name: 'BBQ Chicken Pizza (Personal)', price: 1950 },
];

export default function CreateOrderModal({ isOpen, onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const setActiveOrder = useOrderStore((state) => state.setActiveOrder);

  if (!isOpen) return null;

  const addItem = (item) => {
    const existing = selectedItems.find((i) => i.id === item.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
    }
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id));
  };

  const totalAmount = selectedItems.reduce((acc, i) => acc + i.price * i.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !address.trim() || selectedItems.length === 0) return;

    setSubmitting(true);
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const newOrder = {
        customer: customerName.trim(),
        address: address.trim(),
        status: 'placed',
        items: selectedItems.map((i) => ({
          name: i.name,
          qty: i.qty,
          price: `Rs. ${(i.price * i.qty).toLocaleString()}`,
        })),
        total: `Rs. ${totalAmount.toLocaleString()}`,
        driver: {
          name: 'Kasun Perera',
          rating: 4.9,
          vehicle: 'Honda CB Hornet (WP BD-4821)',
          phone: '+94 77 123 4567',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          deliveriesCount: '1,420+'
        },
        eta: '25 - 30 mins',
        timestamp: 'Just now',
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'orders', newOrderId), newOrder);
      
      // Auto switch focus to the new order in tracking view
      setActiveOrder(newOrderId);

      // Reset state and close modal
      setSelectedItems([]);
      setCustomerName('');
      setAddress('');
      onClose();
    } catch (err) {
      console.error('Error adding order:', err);
      alert('Error placing order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Place New Order</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400 block mb-1.5">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kasun Fernando"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400 block mb-1.5">Delivery Address</label>
            <input
              type="text"
              required
              placeholder="e.g. No 23, Galle Road, Bambalapitiya"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Menu Selection */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400 block mb-2">Select Items</label>
            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
              {MENU_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs"
                >
                  <span className="text-slate-200 font-medium">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-semibold">Rs. {item.price}</span>
                    <button
                      type="button"
                      onClick={() => addItem(item)}
                      className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          {selectedItems.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Selected Items</span>
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">
                    {item.qty}x {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Rs. {item.price * item.qty}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">Total:</span>
                <span className="text-emerald-400">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={submitting || selectedItems.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            {submitting ? 'Placing Order...' : 'Confirm & Place Live Order'}
          </button>
        </form>
      </div>
    </div>
  );
}