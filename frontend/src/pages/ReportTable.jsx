import React from "react";

export default function ReportTable({ reports }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <table className="w-full border rounded-lg shadow-sm bg-white">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="border p-3">Report ID</th>
          <th className="border p-3">Title</th>
          <th className="border p-3">Status</th>
          <th className="border p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id} className="hover:bg-gray-50">
            <td className="border p-3">{report.id}</td>
            <td className="border p-3">{report.title}</td>
            <td className="border p-3">
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </td>
            <td className="border p-3 space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Update
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
