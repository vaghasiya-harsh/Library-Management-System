import { useState } from "react";

const MemberForm = ({ initialValues, onSubmit, submitLabel }) => {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState("");

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

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const course = formData.course.trim();

    if (!name || !email || !phone || !course || !formData.joiningDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (formData.joiningDate > new Date().toISOString().slice(0, 10)) {
      setError("Joining date cannot be in the future.");
      return;
    }

    onSubmit({
      ...formData,
      name,
      email,
      phone,
      course,
      status: formData.status || "Active",
    });
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "course", label: "Course", type: "text" },
    { name: "joiningDate", label: "Joining Date", type: "date" },
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
            </label>

            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Member Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status || "Active"}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default MemberForm;
