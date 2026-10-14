import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const BooksByCategoryChart = ({ books }) => {
  const categoryData = Object.values(
    books.reduce((groups, book) => {
      const category = book.category || "Uncategorized";

      if (!groups[category]) {
        groups[category] = { category, count: 0 };
      }

      // Count book records in each category.
      groups[category].count += 1;

      return groups;
    }, {}),
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Books by Category
      </h2>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Book records" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default BooksByCategoryChart;
