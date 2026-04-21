import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export default function DisbursementsManager({ data }) {
  return (
    <div className="p-10 animate-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Bursary Disbursements</h2>
      <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="p-6">Student</th>
              <th className="p-6">Status</th>
              <th className="p-6">Amount (KES)</th>
              <th className="p-6 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item) => (
              <tr key={item._id} className="text-sm hover:bg-slate-50/50">
                <td className="p-6">
                  <div className="font-bold text-slate-900">{item.student?.name || "Unknown"}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{item.location?.ward || "No Ward"}</div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    item.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {item.status || 'pending'}
                  </span>
                </td>
                <td className="p-6 font-mono font-bold text-slate-700">
                  {Number(item.financials?.awardedAmount || 0).toLocaleString()}
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-1">
                    {item.reviews?.mca?.status === 'reviewed' ? <CheckCircle2 className="text-emerald-500" size={16}/> : <Clock className="text-slate-200" size={16}/>}
                    {item.reviews?.mp?.status === 'reviewed' ? <CheckCircle2 className="text-blue-500" size={16}/> : <Clock className="text-slate-200" size={16}/>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}