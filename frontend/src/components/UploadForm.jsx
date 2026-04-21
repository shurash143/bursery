import React, { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files); // FileList object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // append each file
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadedUrls(res.data.doc.urls);
      setName("");
      setFiles([]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Bursary Documents</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Document Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Optional"
          />
        </label>

        <label className="block mb-4">
          Select Files:
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <ul className="list-disc list-inside">
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
