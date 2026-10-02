import React, { useState } from 'react';
import { MOCK_FRAUD_HEATMAP, INITIAL_INSTITUTIONS } from '../data/mockDatabase';
import { Landmark, ShieldAlert, Cpu, Activity, AlertTriangle, CheckCircle2, Search, Filter, Server, Database, Globe } from 'lucide-react';

export const GovernmentAdminPortal: React.FC = () => {
  const [institutions, setInstitutions] = useState(INITIAL_INSTITUTIONS);

  const handleApproveInstitution = (id: string) => {
    setInstitutions(institutions.map(inst => {
      if (inst.id === id) {
        return { ...inst, status: 'verified' as const };
      }
      return inst;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-950/60 border border-purple-500/20 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Government Oversight &amp; Platform Admin</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Monitor nation-wide document fraud trends, accredit new institutions, audit AI model outputs, and inspect rate limits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded-lg font-mono">
            AI Engine: Gemini 3.6 Flash Active
          </span>
          <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-lg font-mono">
            Malware Scan: 100% Clean
          </span>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400">Accredited Issuers</div>
          <div className="text-2xl font-black text-white mt-1">842</div>
          <div className="text-[10px] text-emerald-400 mt-1">✔ Verified Authorities</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400">Total Verifications Handled</div>
          <div className="text-2xl font-black text-white mt-1">148,920</div>
          <div className="text-[10px] text-cyan-400 mt-1">Average Latency: 1.2s</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow">
          <div className="text-xs text-amber-400">Flagged Fraud Attempts</div>
          <div className="text-2xl font-black text-amber-400 mt-1">5,320</div>
          <div className="text-[10px] text-amber-400 mt-1">Photoshop &amp; QR Forgeries</div>
        </div>

        <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-4 shadow">
          <div className="text-xs text-purple-400">Blockchain Nodes</div>
          <div className="text-2xl font-black text-purple-400 mt-1">32 / 32</div>
          <div className="text-[10px] text-purple-300 mt-1">SHA-256 Ledger Synchronized</div>
        </div>
      </div>

      {/* Fraud Heatmap & Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Regional Fraud Heatmap */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Regional Document Fraud Heatmap
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Live Telemetry
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_FRAUD_HEATMAP.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.region}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.riskLevel === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.riskLevel} Risk ({item.fraudCount} cases)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.riskLevel === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, (item.fraudCount / 350) * 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Most Targeted Type: <strong className="text-slate-200">{item.topType}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Accredited Institution Approval Queue */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" /> Accredited Institution Registry
          </h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {institutions.map((inst) => (
              <div key={inst.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white">{inst.name}</div>
                    <div className="text-[10px] text-slate-400">{inst.category} &bull; Est. {inst.accreditedSince}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inst.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {inst.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Issued: {inst.issuedCount.toLocaleString()}</span>
                  <span>Verifications: {inst.verificationRequestsCount.toLocaleString()}</span>
                </div>

                {inst.status === 'pending' && (
                  <button
                    onClick={() => handleApproveInstitution(inst.id)}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    Approve Accreditation
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
