import React, { useState } from "react";
import { X } from "lucide-react";
import API from "../api/axiosConfig";

export default function BursaryForm({
  bursary,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: bursary?.title || "",
    description: bursary?.description || "",
    amount: bursary?.amount || "",
    deadline: bursary?.deadline
      ? bursary.deadline.substring(0, 10)
      : "",
    eligibility: bursary?.eligibility || "",
    status: bursary?.status || "OPEN",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (bursary) {
        await API.put(
          `/bursaries/${bursary._id}`,
          formData
        );
      } else {
        await API.post(
          "/bursaries",
          formData
        );
      }

      onSuccess();

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to save bursary"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">

      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl">

        {/* HEADER */}

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-black">

            {bursary
              ? "Edit Bursary"
              : "Create New Bursary"}

          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div>

            <label className="font-semibold">
              Title
            </label>

            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Description
            </label>

            <textarea
              rows="5"
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="font-semibold">
                Amount (KES)
              </label>

              <input
                type="number"
                required
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div>

              <label className="font-semibold">
                Deadline
              </label>

              <input
                type="date"
                required
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

          </div>

          <div>

            <label className="font-semibold">
              Eligibility
            </label>

            <textarea
              rows="3"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
              placeholder="Who qualifies?"
            />

          </div>

          <div>

            <label className="font-semibold">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option value="OPEN">
                OPEN
              </option>

              <option value="CLOSED">
                CLOSED
              </option>

            </select>

          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>

      <button
  type="submit"
  disabled={loading}
  className="bg-blue-600 text-white px-6 py-3 rounded-xl"
>
  {loading ? "Saving..." : bursary ? "Update Bursary" : "Create Bursary"}
</button>
          </div>

        </form>

      </div>

    </div>

  );
}