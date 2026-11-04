import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{label}</p>
        <p className="mt-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
          {payload[0].value} book issues
        </p>
      </div>
    );
  }
  return null;
};

const MonthlyIssuesChart = ({ transactions }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const monthlyCounts = {};
  transactions.forEach((transaction) => {
    if (!transaction.issueDate) return;
    const month = transaction.issueDate.slice(0, 7);
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });

  const data = Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month,
      count,
    }));

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Circulation Timeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly book issues activity
          </p>
        </div>
        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
          {data.length} Recorded Months
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#1e293b" : "#f1f5f9"}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default MonthlyIssuesChart;
