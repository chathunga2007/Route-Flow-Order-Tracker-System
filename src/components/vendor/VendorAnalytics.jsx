import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, Clock } from 'lucide-react';

const HOURLY_DATA = [
  { time: '10 AM', revenue: 4200, orders: 2 },
  { time: '12 PM', revenue: 12400, orders: 6 },
  { time: '02 PM', revenue: 8900, orders: 4 },
  { time: '04 PM', revenue: 6500, orders: 3 },
  { time: '06 PM', revenue: 18400, orders: 9 },
  { time: '08 PM', revenue: 24500, orders: 12 },
  { time: '10 PM', revenue: 15200, orders: 7 },
];

export default function VendorAnalytics({ orders = [] }) {
  const totalRevenue = orders.reduce((acc, order) => {
    const rawPrice = parseInt(order.total?.replace(/[^0-9]/g, '') || 0, 10);
    return acc + rawPrice;
  }, 0);

  const completedCount = orders.filter((o) => o.status === 'delivered').length;
  const inProgressCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">Rs. {totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from yesterday
          </span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{inProgressCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active kitchen tickets</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold">Delivered</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">{completedCount}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">100% success rate</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold">Avg. Delivery Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">22 mins</p>
          <span className="text-[11px] text-purple-400 mt-1 block">-3 mins faster</span>
        </div>
      </div>

      {/* Hourly Sales Performance Chart */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-bold text-base text-white">Today's Revenue Flow</h4>
            <p className="text-xs text-slate-400">Hourly sales generated from online deliveries</p>
          </div>
          <span className="px-3 py-1 bg-slate-800 text-xs font-semibold rounded-lg text-slate-300">
            Live Today
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `Rs.${val / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}