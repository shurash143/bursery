import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/applications/my")
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          My Bursary Applications
        </h2>
        <p className="text-gray-500 mb-8">
          Track the status and details of your submitted applications
        </p>

        {loading ? (
          <div className="text-center text-gray-500">Loading applications…</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-gray-500">
            You have not submitted any bursary applications yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {app.schoolName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Admission No: {app.admissionNumber}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyles[app.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">County:</span>{" "}
                    {app.county}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Constituency:
                    </span>{" "}
                    {app.constituency}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Ward:</span>{" "}
                    {app.ward}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Awarded Amount:
                    </span>{" "}
                    {app.awardedAmount
                      ? `KES ${app.awardedAmount.toLocaleString()}`
                      : "Not awarded"}
                  </p>
                </div>

                {/* Documents */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Documents
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {app.documents?.idCopy && (
                      <a
                        href={app.documents.idCopy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge bg-blue-100 text-blue-700"
                      >
                        ID Copy
                      </a>
                    )}
                    {app.documents?.admissionLetter && (
                      <a
                        href={app.documents.admissionLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge bg-green-100 text-green-700"
                      >
                        Admission Letter
                      </a>
                    )}
                    {app.documents?.feeStructure && (
                      <a
                        href={app.documents.feeStructure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge bg-purple-100 text-purple-700"
                      >
                        Fee Structure
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-xs text-gray-400">
                  Submitted on{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
