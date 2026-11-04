import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: item } = payload[0];
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{name}</p>
        <p className="mt-1 text-xs font-semibold" style={{ color: item.fill }}>
          {value} transactions
        </p>
      </div>
    );
  }
  return null;
};

const ReturnStatusChart = ({ transactions }) => {

  const today = new Date().toISOString().slice(0, 10);

  const returned = transactions.filter((t) => t.status === "Returned").length;
  const overdue = transactions.filter(
    (t) => ["Issued", "Overdue"].includes(t.status) && t.dueDate < today
  ).length;
  const activeIssued = transactions.filter(
    (t) => t.status === "Issued" && t.dueDate >= today
  ).length;

  const data = [
    { name: "Returned On Time", value: returned, color: "#10b981" },
    { name: "Active (On Schedule)", value: activeIssued, color: "#6366f1" },
    { name: "Overdue", value: overdue, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const total = transactions.length;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Circulation Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Returns, active issues, and overdue balance
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
          {total} Total Loans
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-slate-400">
            No transaction records found yet.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="46%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                cornerRadius={5}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default ReturnStatusChart;
