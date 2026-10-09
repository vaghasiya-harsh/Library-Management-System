import React from "react";
const BookForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [formData, setFormData] = React.useState(initialValues);
  const [error, setError] = React.useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: ["publishedYear", "totalCopies", "availableCopies"].includes(name)
        ? value
        : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.category.trim() ||
      !formData.isbn.trim() ||
      !formData.publisher.trim()
    ) {
      setError("Please fill in all required fields.");
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
        "Enter a valid year and copies. Available copies must be between 0 and total copies."
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
    });
  };

  const fields = [
    { name: "title", label: "Book Title", type: "text" },
    { name: "author", label: "Author", type: "text" },
    { name: "category", label: "Category", type: "text" },
    { name: "isbn", label: "ISBN", type: "text" },
    { name: "publisher", label: "Publisher", type: "text" },
    { name: "publishedYear", label: "Published Year", type: "number" },
    { name: "totalCopies", label: "Total Copies", type: "number" },
    { name: "availableCopies", label: "Available Copies", type: "number" },
    { name: "image", label: "Image URL (optional)", type: "text" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.name !== "image" && (
                <span className="text-red-500"> *</span>
              )}
            </label>

            <input
              id={field.name}
              name={field.name}
              type={field.type}
              min={
                ["publishedYear", "availableCopies"].includes(field.name)
                  ? 0
                  : field.name === "totalCopies"
                    ? 1
                    : undefined
              }
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              required={field.name !== "image"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default BookForm;