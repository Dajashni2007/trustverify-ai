import React, { useState } from 'react';
import { VerificationResult } from '../types';
import { PRESET_VERIFICATION_RESULTS } from '../data/sampleDocuments';
import { Briefcase, Upload, Search, Download, AlertCircle, CheckCircle2, XCircle, Filter, FileCheck, Users, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

interface RecruiterDashboardProps {
  onSelectResult: (result: VerificationResult) => void;
  onBulkVerify: (files: FileList) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onSelectResult, onBulkVerify }) => {
  const [candidateList, setCandidateList] = useState<VerificationResult[]>([
    PRESET_VERIFICATION_RESULTS['sample-1'],
    PRESET_VERIFICATION_RESULTS['sample-2'],
    PRESET_VERIFICATION_RESULTS['sample-3'],
    PRESET_VERIFICATION_RESULTS['sample-4'],
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCandidates = candidateList.filter((c) => {
    const matchesSearch = c.extractedMetadata?.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.extractedMetadata?.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.documentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'verified' && c.status === 'VERIFIED') ||
      (filterStatus === 'suspicious' && c.status === 'SUSPICIOUS') ||
      (filterStatus === 'forgery' && c.status === 'FORGERY');

    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onBulkVerify(e.target.files);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Candidate Name,Document Type,Cert Number,Score,Status,Issuer"].join(",") + "\n"
      + candidateList.map(c => [
          `"${c.extractedMetadata?.recipientName || 'Candidate'}"`,
          `"${c.extractedMetadata?.documentType || 'Document'}"`,
          `"${c.extractedMetadata?.certificateNumber || c.id}"`,
          c.confidenceScore,
          c.status,
          `"${c.issuerInfo.name}"`
        ].join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Candidate_Verification_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifiedCount = candidateList.filter(c => c.status === 'VERIFIED').length;
  const suspiciousCount = candidateList.filter(c => c.status === 'SUSPICIOUS').length;
  const forgeryCount = candidateList.filter(c => c.status === 'FORGERY').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 border border-blue-500/20 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Recruiter &amp; HR Verification Portal</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Bulk verify candidate degrees, mark sheets, Aadhaar cards, and previous salary slips at scale.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" /> Bulk Upload Resume &amp; Certs
            <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="text-xs text-slate-400">Total Candidates Evaluated</div>
          <div className="text-2xl font-black text-white mt-1">{candidateList.length}</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 shadow">
          <div className="text-xs text-emerald-400 font-semibold">✔ Genuine &amp; Verified</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{verifiedCount}</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 shadow">
          <div className="text-xs text-amber-400 font-semibold">⚠ Suspicious Edits</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{suspiciousCount}</div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-xl p-4 shadow">
          <div className="text-xs text-red-400 font-semibold">🔴 Possible Forgery Flagged</div>
          <div className="text-2xl font-black text-red-400 mt-1">{forgeryCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name or certificate number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Status:
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg ${filterStatus === 'all' ? 'bg-cyan-600 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            All ({candidateList.length})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-2.5 py-1 rounded-lg ${filterStatus === 'verified' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setFilterStatus('suspicious')}
            className={`px-2.5 py-1 rounded-lg ${filterStatus === 'suspicious' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            Suspicious ({suspiciousCount})
          </button>
          <button
            onClick={() => setFilterStatus('forgery')}
            className={`px-2.5 py-1 rounded-lg ${filterStatus === 'forgery' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            Forgery ({forgeryCount})
          </button>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Candidate / Document</th>
                <th className="py-3.5 px-4">Document Category</th>
                <th className="py-3.5 px-4">Certificate No.</th>
                <th className="py-3.5 px-4">Confidence Score</th>
                <th className="py-3.5 px-4">AI &amp; DB Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="font-semibold text-slate-100">{candidate.extractedMetadata?.recipientName || 'Candidate Record'}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{candidate.documentName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {candidate.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-cyan-300 font-semibold">
                    {candidate.extractedMetadata?.certificateNumber || candidate.id}
                  </td>

                  <td className="py-3.5 px-4 font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${candidate.confidenceScore >= 85 ? 'bg-emerald-500' : candidate.confidenceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${candidate.confidenceScore}%` }}
                        />
                      </div>
                      <span className="text-xs">{candidate.confidenceScore}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      candidate.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : candidate.status === 'SUSPICIOUS'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {candidate.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectResult(candidate)}
                      className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      Inspect Audit <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
