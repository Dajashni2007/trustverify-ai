import React, { useState } from 'react';
import { CertificateRecord, DocumentCategory } from '../types';
import { INITIAL_CERTIFICATE_REGISTRY } from '../data/mockDatabase';
import { issueCertificateAPI } from '../services/api';
import { Building2, PlusCircle, QrCode, Hash, Ban, CheckCircle2, Search, Award, Sparkles, FileText, ArrowUpRight } from 'lucide-react';

export const InstitutionPortal: React.FC = () => {
  const [issuedCerts, setIssuedCerts] = useState<CertificateRecord[]>(INITIAL_CERTIFICATE_REGISTRY);
  const [activeTab, setActiveTab] = useState<'issue' | 'registry' | 'analytics'>('issue');

  // Issue Form State
  const [recipientName, setRecipientName] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const [documentType, setDocumentType] = useState('Bachelor of Engineering Degree');
  const [category, setCategory] = useState<DocumentCategory>('Education');
  const [issuingInstitution, setIssuingInstitution] = useState('Anna University Chennai');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newCertModal, setNewCertModal] = useState<any | null>(null);

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await issueCertificateAPI({
        certificateNumber: certNumber || ('CERT-' + Math.floor(10000 + Math.random() * 90000)),
        recipientName,
        documentType,
        category,
        issuingInstitution,
        issueDate,
      });

      if (res.success && res.certificate) {
        setIssuedCerts([res.certificate, ...issuedCerts]);
        setNewCertModal(res.certificate);
        setSuccessMsg('Digital Certificate issued successfully and registered on Blockchain Ledger!');
        setRecipientName('');
        setCertNumber('');
      }
    } catch (err: any) {
      alert(err.message || 'Issuance failed');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRevoke = (certId: string) => {
    setIssuedCerts(issuedCerts.map(c => {
      if (c.id === certId) {
        return { ...c, status: c.status === 'active' ? 'revoked' : 'active' };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-indigo-950/60 border border-emerald-500/20 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Institution &amp; Issuer Management Portal</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            School, College, University, and Corporate portal for issuing digitally verifiable certificates with embedded QR codes &amp; SHA-256 blockchain hashes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'issue' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Issue New Certificate
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'registry' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Registry ({issuedCerts.length})
          </button>
        </div>
      </div>

      {/* Tab Content 1: Issue Form */}
      {activeTab === 'issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <form onSubmit={handleIssueSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Issue Digitally Signed Certificate
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun V. Sharma"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Certificate / Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. AU-2023-CS-88912 (Auto-generated if empty)"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Document Title / Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Engineering in Computer Science"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Education">Education</option>
                  <option value="Employment">Employment</option>
                  <option value="Government ID">Government ID</option>
                  <option value="Professional">Professional</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Issuing Institution *</label>
                <input
                  type="text"
                  required
                  value={issuingInstitution}
                  onChange={(e) => setIssuingInstitution(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Issue Date *</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Registering on Blockchain &amp; Generating QR...' : 'Issue Certificate &amp; Register Ledger Hash'}
            </button>
          </form>

          {/* Newly Issued Preview Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" /> Issued QR Code Preview
            </h3>

            {newCertModal ? (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 text-center space-y-3">
                {newCertModal.qrDataUrl && (
                  <img src={newCertModal.qrDataUrl} alt="QR Code" className="w-40 h-40 mx-auto rounded-lg border border-slate-800 bg-white p-2" />
                )}
                <div className="text-xs">
                  <div className="font-bold text-white">{newCertModal.recipientName}</div>
                  <div className="text-cyan-400 font-mono text-[11px]">{newCertModal.certificateNumber}</div>
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 text-left space-y-1">
                  <div>SHA-256 Hash:</div>
                  <code className="text-cyan-300 font-mono block break-all">{newCertModal.blockchainHash}</code>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800/60 p-4">
                Fill out the issuance form on the left to generate an authentic digital QR code and SHA-256 blockchain audit record.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab Content 2: Active Registry */}
      {activeTab === 'registry' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Active Certificate Registry</h3>
            <span className="text-xs text-slate-400 font-mono">{issuedCerts.length} Certificates Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Recipient Name</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Revocation Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {issuedCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">{cert.certificateNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{cert.recipientName}</td>
                    <td className="py-3 px-4 text-slate-300">{cert.documentType}</td>
                    <td className="py-3 px-4 text-slate-400">{cert.issueDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cert.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleRevoke(cert.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          cert.status === 'active'
                            ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30'
                            : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {cert.status === 'active' ? 'Revoke' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
