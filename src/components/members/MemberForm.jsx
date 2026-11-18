import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const MemberForm = ({ initialValues, onSubmit, submitLabel }) => {
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

    const name = formData.name?.trim();
    const email = formData.email?.trim();
    const phone = formData.phone?.trim();
    const course = formData.course?.trim();

    if (!name || !email || !phone || !course || !formData.joiningDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.joiningDate > new Date().toISOString().slice(0, 10)) {
      setError("Joining date cannot be set in the future.");
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name ?? ""}
            onChange={handleChange}
            placeholder="e.g. Aarav Sharma"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email ?? ""}
            onChange={handleChange}
            placeholder="e.g. member@university.edu"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Phone Number (10 digits) <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={10}
            value={formData.phone ?? ""}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Course */}
        <div>
          <label htmlFor="course" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Course / Department <span className="text-rose-500">*</span>
          </label>
          <input
            id="course"
            name="course"
            type="text"
            value={formData.course ?? ""}
            onChange={handleChange}
            placeholder="e.g. B.Tech Computer Science"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Joining Date */}
        <div>
          <label htmlFor="joiningDate" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Enrollment Date <span className="text-rose-500">*</span>
          </label>
          <input
            id="joiningDate"
            name="joiningDate"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={formData.joiningDate ?? ""}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white dark:focus:ring-indigo-900/40"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Account Status <span className="text-rose-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || "Active"}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:text-white"
          >
            <option value="Active">Active (Permitted to Borrow)</option>
            <option value="Inactive">Inactive (Suspended / On Hold)</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => navigate("/members")}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-600 transition"
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

export default MemberForm;
