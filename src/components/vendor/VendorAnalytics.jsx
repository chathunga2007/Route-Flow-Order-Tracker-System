import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, Clock } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';

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
  const isDark = useOrderStore((state) => state.isDark);

  const totalRevenue = orders.reduce((acc, order) => {
    const rawPrice = parseInt(order.total?.replace(/[^0-9]/g, '') || 0, 10);
    return acc + rawPrice;
  }, 0);

  const completedCount = orders.filter((o) => o.status === 'delivered').length;
  const inProgressCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <div className="space-y-6">
      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 border rounded-2xl shadow-sm transition-colors duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex justify-between items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs uppercase font-bold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-500 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14.2% from yesterday
          </span>
        </div>

        <div className={`p-5 border rounded-2xl shadow-sm transition-colors duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex justify-between items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs uppercase font-bold">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500 mt-2">{inProgressCount}</p>
          <span className={`text-[11px] mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Active kitchen tickets
          </span>
        </div>

        <div className={`p-5 border rounded-2xl shadow-sm transition-colors duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex justify-between items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs uppercase font-bold">Delivered</span>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-500 mt-2">{completedCount}</p>
          <span className="text-[11px] text-emerald-500 mt-1 block font-semibold">100% success rate</span>
        </div>

        <div className={`p-5 border rounded-2xl shadow-sm transition-colors duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex justify-between items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs uppercase font-bold">Avg. Delivery</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>22 mins</p>
          <span className="text-[11px] text-purple-500 mt-1 block font-semibold">-3 mins faster</span>
        </div>
      </div>

      {/* Chart */}
      <div className={`p-6 border rounded-2xl shadow-sm transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Today's Revenue Flow</h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hourly sales generated from online deliveries</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
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
              <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
              <YAxis
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `Rs.${val / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  color: isDark ? '#fff' : '#0f172a',
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