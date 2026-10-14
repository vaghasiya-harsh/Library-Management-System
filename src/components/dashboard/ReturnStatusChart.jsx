
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const ReturnStatusChart = ({ transactions }) => {
  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const returned = transactions.filter(
    (transaction) => transaction.status === "Returned"
  ).length;

  const overdue = transactions.filter(
    (transaction) =>
      ["Issued", "Overdue"].includes(transaction.status) &&
      transaction.dueDate < todayKey
  ).length;

  const data = [
    { name: "Returned", value: returned },
    { name: "Overdue", value: overdue },
  ];

  const colors = ["#16a34a", "#dc2626"];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Returned vs Overdue
      </h2>

      {data.every((item) => item.value === 0) ? (
        <p className="py-20 text-center text-sm text-gray-500">
          No returned or overdue transactions yet.
        </p>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {data.map((item, index) => (
                  <Cell key={item.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ReturnStatusChart;
