import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import API from "../api/axiosConfig";
import BursaryForm from "./BursaryForm";

export default function BursaryManager() {
  const [bursaries, setBursaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");

  const fetchBursaries = async () => {
    try {
      setLoading(true);

      const res = await API.get("/bursaries");

      setBursaries(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load bursaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBursaries();
  }, []);

  useEffect(() => {
    const data = bursaries.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, bursaries]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bursary?")) return;

    try {
      await API.delete(`/bursaries/${id}`);

      fetchBursaries();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (item) => {
    try {
      await API.put(`/bursaries/${item._id}`, {
        ...item,
        status: item.status === "OPEN" ? "CLOSED" : "OPEN",
      });

      fetchBursaries();
    } catch (err) {
      alert("Unable to update status");
    }
  };

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-3xl font-black">
            Bursary Management
          </h2>

          <p className="text-slate-500">
            Create and manage bursaries
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          New Bursary
        </button>

      </div>

      <div className="relative mb-8">

        <Search
          className="absolute left-4 top-3 text-slate-400"
          size={18}
        />

        <input
          className="w-full border rounded-xl pl-11 p-3"
          placeholder="Search bursaries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {loading ? (
        <div className="flex justify-center py-20">

          <Loader2
            className="animate-spin text-blue-600"
            size={35}
          />

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filtered.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-2xl shadow border p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-bold text-xl">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {item.description}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === "OPEN"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <div className="mt-6 space-y-3">

                <div className="flex items-center gap-2">

                  <DollarSign size={18} />

                  <span>
                    KES {Number(item.amount).toLocaleString()}
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <Calendar size={18} />

                  <span>
                    {new Date(item.deadline).toLocaleDateString()}
                  </span>

                </div>

              </div>

              <div className="flex gap-3 mt-8">

                <button
                  onClick={() => {
                    setEditing(item);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white px-4 rounded-xl"
                >
                  <Trash2 size={16} />
                </button>

              </div>

              <button
                onClick={() => toggleStatus(item)}
                className={`mt-4 w-full py-2 rounded-xl font-semibold ${
                  item.status === "OPEN"
                    ? "bg-orange-500 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {item.status === "OPEN"
                  ? "Close Bursary"
                  : "Open Bursary"}
              </button>

            </div>

          ))}

        </div>
      )}

      {showForm && (
        <BursaryForm
          bursary={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchBursaries();
          }}
        />
      )}

    </div>
  );
}