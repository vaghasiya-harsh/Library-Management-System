import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
        <p className="mt-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400">
          {payload[0].value} book titles
        </p>
      </div>
    );
  }
  return null;
};

const BooksByCategoryChart = ({ books }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const categoryData = Object.values(
    books.reduce((groups, book) => {
      const category = book.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = { category, count: 0 };
      }
      groups[category].count += 1;
      return groups;
    }, {})
  ).sort((a, b) => b.count - a.count);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Books by Category
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Genre distribution across collection
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
          {categoryData.length} Genres
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <defs>
              <linearGradient id="bookBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#1e293b" : "#f1f5f9"}
            />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
              angle={-20}
              textAnchor="end"
              interval={0}
              height={40}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Book Titles"
              fill="url(#bookBarGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default BooksByCategoryChart;
