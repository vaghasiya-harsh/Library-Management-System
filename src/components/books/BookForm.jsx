import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const BookForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.title?.trim() ||
      !formData.author?.trim() ||
      !formData.category?.trim() ||
      !formData.isbn?.trim() ||
      !formData.publisher?.trim()
    ) {
      setError("Please fill in all mandatory fields marked with an asterisk (*).");
      return;
    }

    const year = Number(formData.publishedYear);
    const total = Number(formData.totalCopies);
    const available = Number(formData.availableCopies);

    if (
      !Number.isInteger(year) ||
      year < 0 ||
      !Number.isInteger(total) ||
      total < 1 ||
      !Number.isInteger(available) ||
      available < 0 ||
      available > total
    ) {
      setError(
        "Please enter valid numeric values. Total copies must be at least 1, and available copies cannot exceed total copies."
      );
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim(),
      category: formData.category.trim(),
      isbn: formData.isbn.trim(),
      publisher: formData.publisher.trim(),
      publishedYear: year,
      totalCopies: total,
      availableCopies: available,
      image: formData.image?.trim() || "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
    >
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Cover Preview Strip if image entered */}
      {formData.image && (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="h-16 w-12 overflow-hidden rounded-lg bg-slate-200 shadow-xs dark:bg-slate-700">
            <img
              src={formData.image}
              alt="Cover preview"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Cover Image Preview
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
              {formData.image}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Book Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title ?? ""}
            onChange={handleChange}
            placeholder="e.g. Clean Architecture"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Author <span className="text-rose-500">*</span>
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author ?? ""}
            onChange={handleChange}
            placeholder="e.g. Robert C. Martin"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Category / Genre <span className="text-rose-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category ?? ""}
            onChange={handleChange}
            placeholder="e.g. Computer Science, Fiction, Science..."
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            ISBN-13 Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={formData.isbn ?? ""}
            onChange={handleChange}
            placeholder="e.g. 9780134494166"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Publisher */}
        <div>
          <label htmlFor="publisher" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Publisher <span className="text-rose-500">*</span>
          </label>
          <input
            id="publisher"
            name="publisher"
            type="text"
            value={formData.publisher ?? ""}
            onChange={handleChange}
            placeholder="e.g. Prentice Hall"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Published Year */}
        <div>
          <label htmlFor="publishedYear" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Publication Year <span className="text-rose-500">*</span>
          </label>
          <input
            id="publishedYear"
            name="publishedYear"
            type="number"
            min={1000}
            max={2100}
            value={formData.publishedYear ?? ""}
            onChange={handleChange}
            placeholder="e.g. 2017"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Total Copies */}
        <div>
          <label htmlFor="totalCopies" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Total Copies in Stock <span className="text-rose-500">*</span>
          </label>
          <input
            id="totalCopies"
            name="totalCopies"
            type="number"
            min={1}
            value={formData.totalCopies ?? ""}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Available Copies */}
        <div>
          <label htmlFor="availableCopies" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Available Copies (Ready to Loan) <span className="text-rose-500">*</span>
          </label>
          <input
            id="availableCopies"
            name="availableCopies"
            type="number"
            min={0}
            value={formData.availableCopies ?? ""}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Cover Image URL */}
        <div className="md:col-span-2">
          <label htmlFor="image" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Cover Image URL <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={formData.image ?? ""}
            onChange={handleChange}
            placeholder="https://covers.openlibrary.org/b/isbn/..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => navigate("/books")}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
