import { Link } from "react-router-dom";
import { ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  gradient: string;
  link: string;
  chartData?: { value: number }[];
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  gradient,
  link,
  chartData,
  color = "#4F46E5",
}: StatCardProps) {
  return (
    <Link to={link} className="no-underline block group">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
          <Icon className="w-24 h-24 rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110 duration-300`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>

            {trend && trendValue && (
              <div
                className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                  trend === "up"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-red-50 text-red-500 border-red-200"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {trendValue}
              </div>
            )}
          </div>

          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-gray-900 text-3xl font-bold tracking-tight group-hover:text-indigo-600 transition-colors">
              {value}
            </p>
            {trend && (
              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                vs last month
              </span>
            )}
          </div>
        </div>

        {/* Sparkline */}
        {chartData && (
          <div className="h-12 w-full mt-4 -mx-6 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={color}
                  fillOpacity={0.05}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 group-hover:text-indigo-500 transition-colors relative z-10">
          <span>View detailed report</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
