import { Link } from "react-router-dom";
import { ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  gradient: string;
  link: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  gradient,
  link,
}: StatCardProps) {
  return (
    <Link to={link} className="no-underline block group">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
        <div>
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
          <p className="text-gray-900 text-3xl font-bold tracking-tight group-hover:text-indigo-600 transition-colors">
            {value}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 group-hover:text-indigo-500 transition-colors">
          <span>View details</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
