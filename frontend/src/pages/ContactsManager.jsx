import React from "react";
import {
  Mail,
  Trash2,
  Calendar,
  User,
  MessageSquare,
  Send
} from "lucide-react";
import API from "../api/axiosConfig";

export default function ContactsManager({ messages, refreshData }) {

  // DELETE CONTACT (FIXED ROUTE)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      await API.delete(`/contacts/${id}`); // ✅ FIXED HERE
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete the message.");
    }
  };

  // REPLY VIA EMAIL
  const handleReply = (msg) => {
    const subject = encodeURIComponent(`Re: Bursary Inquiry - ${msg.name}`);
    const body = encodeURIComponent(
      `\n\n--- Original Message ---\nFrom: ${msg.name}\nMessage: ${msg.message}`
    );

    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Public Inquiries
          </h2>
          <p className="text-slate-500 font-medium">
            Managing {messages.length} messages from the public.
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <MessageSquare size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            No messages found
          </p>
        </div>
      ) : (
        // MESSAGES GRID
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >

              {/* TOP SECTION */}
              <div className="flex justify-between items-start mb-6">

                <div className="flex items-center gap-4">

                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User size={24} />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {msg.name}
                    </h4>

                    <p className="text-sm text-slate-400 flex items-center gap-1.5">
                      <Mail size={14} /> {msg.email}
                    </p>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                  <button
                    onClick={() => handleReply(msg)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Reply via Email"
                  >
                    <Send size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Inquiry"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

              </div>

              {/* MESSAGE BODY */}
              <div className="bg-slate-50 p-6 rounded-2xl mb-6 min-h-[100px]">
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{msg.message}"
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between">

                <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </div>

                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Verified Inquiry
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}