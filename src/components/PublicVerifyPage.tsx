import React, { useState } from 'react';
import { CertificateRecord } from '../types';
import { lookupCertificateAPI } from '../services/api';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, QrCode, Hash, ArrowLeft } from 'lucide-react';

interface PublicVerifyPageProps {
  initialLookupId?: string;
  onBackHome: () => void;
}

export const PublicVerifyPage: React.FC<PublicVerifyPageProps> = ({ initialLookupId, onBackHome }) => {
  const [query, setQuery] = useState(initialLookupId || '');
  const [searchedRecord, setSearchedRecord] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await lookupCertificateAPI(query.trim());
      setSearchedRecord(res);
    } catch (err) {
      setSearchedRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <button
        onClick={onBackHome}
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Public Certificate Lookup</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Verify any official digital certificate using its unique Certificate ID or SHA-256 Blockchain Ledger Hash.
        </p>

        <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            required
            placeholder="Enter Cert No (e.g. AU-2023-CS-88912) or Hash..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Lookup
          </button>
        </form>
      </div>

      {/* Result Display */}
      {searched && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Searching Blockchain Ledger &amp; Issuer Registries...</div>
          ) : searchedRecord ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>RECORD MATCH FOUND IN REGISTERED BLOCKCHAIN LEDGER</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-extrabold uppercase">
                  {searchedRecord.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Certificate Number</span>
                  <strong className="text-cyan-300 font-mono text-sm">{searchedRecord.certificateNumber}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Recipient Name</span>
                  <strong className="text-white text-sm">{searchedRecord.recipientName}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Document Qualification</span>
                  <strong className="text-slate-200">{searchedRecord.documentType}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Issuing Authority</span>
                  <strong className="text-slate-200">{searchedRecord.issuingInstitution}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Issue Date</span>
                  <strong className="text-slate-200">{searchedRecord.issueDate}</strong>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Ledger Registration Date</span>
                  <strong className="text-slate-200">{new Date(searchedRecord.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="text-[10px] text-slate-400">SHA-256 Ledger Hash:</div>
                <code className="text-cyan-300 font-mono text-[11px] block break-all">{searchedRecord.blockchainHash}</code>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="font-bold text-slate-200 text-sm">No Certificate Record Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No matching certificate found in the official registry for query <code className="text-cyan-300 font-mono">{query}</code>. Please double-check the ID or upload the document file directly for AI structural analysis.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
