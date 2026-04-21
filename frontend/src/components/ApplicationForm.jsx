import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import API from "../api/axiosConfig";

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    studentName: "",
    schoolName: "",
    admissionNumber: "",
    familyIncome: "",
    county: "",
    constituency: "",
    ward: "",
    reason: "",
    role: ""   
  });

  const [files, setFiles] = useState({
    idCopy: null,
    admissionLetter: null,
    feeStructure: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    // ✅ FORCE SYNC: Ensure all text fields are added to FormData
    data.append("studentName", formData.studentName);
    data.append("schoolName", formData.schoolName);
    data.append("admissionNumber", formData.admissionNumber);
    data.append("familyIncome", formData.familyIncome);
    data.append("county", formData.county);
    data.append("constituency", formData.constituency); // CRITICAL
    data.append("ward", formData.ward);                 // CRITICAL
    data.append("reason", formData.reason);
    data.append("role", formData.role);                 // CRITICAL

    // ✅ Append Files
    if (files.idCopy) data.append("idCopy", files.idCopy);
    if (files.admissionLetter) data.append("admissionLetter", files.admissionLetter);
    if (files.feeStructure) data.append("feeStructure", files.feeStructure);

    try {
      await API.post("/applications/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setStep(4);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-white font-bold">Bursary Application</div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Step 1: Academic & Target</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input name="studentName" placeholder="Full Name" onChange={handleChange} className="border p-3 rounded" required />
                <input name="admissionNumber" placeholder="Admission Number" onChange={handleChange} className="border p-3 rounded" required />
                <input name="schoolName" placeholder="School Name" onChange={handleChange} className="border p-3 rounded" required />
                <input name="familyIncome" type="number" placeholder="Family Income" onChange={handleChange} className="border p-3 rounded" required />
                <select name="role" onChange={handleChange} className="border p-3 rounded" required>
                  <option value="">Apply To (MP or MCA?)</option>
                  <option value="mp">MP (Constituency Level)</option>
                  <option value="mca">MCA (Ward Level)</option>
                </select>
              </div>
              <button type="button" onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Step 2: Your Location</h2>
              <input name="county" placeholder="County" onChange={handleChange} className="border p-3 rounded w-full" required />
              <input name="constituency" placeholder="Constituency" onChange={handleChange} className="border p-3 rounded w-full" required />
              <input name="ward" placeholder="Ward" onChange={handleChange} className="border p-3 rounded w-full" required />
              <textarea name="reason" placeholder="Why do you need this bursary?" onChange={handleChange} className="border p-3 rounded w-full h-32" required />
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)}>Back</button>
                <button type="button" onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Step 3: Documents</h2>
              <div className="grid gap-4">
                <label>ID Copy: <input type="file" name="idCopy" onChange={handleFileChange} required /></label>
                <label>Admission Letter: <input type="file" name="admissionLetter" onChange={handleFileChange} required /></label>
                <label>Fee Structure: <input type="file" name="feeStructure" onChange={handleFileChange} required /></label>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(2)}>Back</button>
                <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-8 py-2 rounded flex items-center">
                  {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Submitting ({progress}%)</> : "Submit Application"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600">Successfully Submitted!</h2>
              <p className="text-slate-500 mt-2">The official will review your application soon.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}