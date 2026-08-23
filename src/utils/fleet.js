export const DRIVERS_FLEET = [
  {
    name: 'Kasun Perera',
    rating: 4.9,
    vehicle: 'Honda CB Hornet (WP BD-4821)',
    phone: '+94 77 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    deliveriesCount: '1,420+'
  },
  {
    name: 'Nuwan Jayawardena',
    rating: 4.8,
    vehicle: 'Yamaha FZ-S (WP QH-8812)',
    phone: '+94 71 889 2314',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    deliveriesCount: '890+'
  },
  {
    name: 'Sithum Fernando',
    rating: 5.0,
    vehicle: 'TVS NTorq 125 (WP BE-3301)',
    phone: '+94 76 554 1102',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    deliveriesCount: '2,100+'
  }
];

export const getRandomDriver = () => {
  return DRIVERS_FLEET[Math.floor(Math.random() * DRIVERS_FLEET.length)];
};