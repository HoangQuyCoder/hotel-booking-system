import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4000, bookings: 240 },
  { month: "Feb", revenue: 3000, bookings: 198 },
  { month: "Mar", revenue: 2000, bookings: 980 },
  { month: "Apr", revenue: 2780, bookings: 390 },
  { month: "May", revenue: 1890, bookings: 480 },
  { month: "Jun", revenue: 2390, bookings: 380 },
  { month: "Jul", revenue: 3490, bookings: 430 },
  { month: "Aug", revenue: 4200, bookings: 550 },
  { month: "Sep", revenue: 3800, bookings: 490 },
  { month: "Oct", revenue: 4800, bookings: 620 },
  { month: "Nov", revenue: 5500, bookings: 750 },
  { month: "Dec", revenue: 6800, bookings: 900 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
        <p className="text-gray-900 font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold text-gray-900">${entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Revenue Over Time */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-gray-900 text-lg font-bold">Revenue Overview</h3>
            <p className="text-gray-400 text-sm">Monthly performance statistics</p>
          </div>
          <select className="bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
            <option>Last 12 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-gray-900 text-lg font-bold">Booking Trends</h3>
            <p className="text-gray-400 text-sm">Comparison of monthly reservations</p>
          </div>
          <button className="text-indigo-600 text-xs font-semibold hover:underline">Download Report</button>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="bookings" 
                name="Bookings" 
                radius={[6, 6, 0, 0]}
                animationDuration={2000}
              >
                {revenueData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === revenueData.length - 1 ? "#4F46E5" : "#E0E7FF"} 
                    className="hover:fill-indigo-400 transition-colors duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
