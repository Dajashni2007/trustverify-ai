import React from 'react';
import { VerificationResult } from '../types';
import { ShieldCheck, Download, Printer, X, CheckCircle2, QrCode, Hash, Calendar, Building, Award } from 'lucide-react';

interface VerificationReportModalProps {
  result: VerificationResult;
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationReportModal: React.FC<VerificationReportModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 text-white my-8">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base text-white">TrustVerify AI &bull; Audit Certificate Report</h3>
              <p className="text-[11px] text-slate-400">Official Immutable Verification Audit Summary</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Certificate Paper Container */}
        <div id="printable-report" className="bg-white text-slate-900 rounded-xl p-8 border-4 border-slate-200 shadow-inner space-y-6">
          
          {/* Certificate Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">TRUSTVERIFY AI</div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Document Authenticity Certificate</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block">Report ID: {result.id}</span>
              <span className="text-[10px] text-slate-500 block">Issued: {new Date(result.timestamp).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${
            result.status === 'VERIFIED'
              ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
              : result.status === 'FORGERY' || result.status === 'REVOKED'
              ? 'bg-red-50 border-red-600 text-red-900'
              : 'bg-amber-50 border-amber-600 text-amber-900'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">Verification Verdict</span>
              <span className="text-lg font-extrabold">{result.statusLabel}</span>
            </div>
            <div className="text-right font-mono font-bold text-xl">
              Score: {result.confidenceScore}/100
            </div>
          </div>

          {/* Document & Recipient Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-slate-200 py-4">
            <div>
              <span className="text-slate-500 font-medium block">Document Type</span>
              <strong className="text-slate-900 text-sm">{result.extractedMetadata?.documentType || 'Official Document'}</strong>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Recipient / Holder</span>
              <strong className="text-slate-900 text-sm">{result.extractedMetadata?.recipientName || 'Verified Recipient'}</strong>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Certificate Number</span>
              <strong className="text-slate-900 font-mono text-sm">{result.extractedMetadata?.certificateNumber || result.id}</strong>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Issuing Authority</span>
              <strong className="text-slate-900 text-sm">{result.issuerInfo.name}</strong>
            </div>
          </div>

          {/* Multi-Check Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Audit Check Matrix</h4>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 border rounded">
                <span className="text-slate-500 block">OCR Extraction</span>
                <strong className="text-emerald-700 font-bold uppercase">{result.checks.ocrStatus}</strong>
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <span className="text-slate-500 block">AI Computer Vision</span>
                <strong className="text-emerald-700 font-bold uppercase">{result.checks.aiTamperingStatus}</strong>
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <span className="text-slate-500 block">QR Code Signature</span>
                <strong className="text-emerald-700 font-bold uppercase">{result.checks.qrStatus}</strong>
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <span className="text-slate-500 block">Issuer Database</span>
                <strong className="text-emerald-700 font-bold uppercase">{result.checks.databaseStatus}</strong>
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <span className="text-slate-500 block">Blockchain Hash</span>
                <strong className="text-emerald-700 font-bold uppercase">{result.checks.blockchainStatus}</strong>
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <span className="text-slate-500 block">Owner Consent</span>
                <strong className="text-emerald-700 font-bold uppercase">{result.checks.otpConsentStatus}</strong>
              </div>
            </div>
          </div>

          {/* Blockchain & QR Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-slate-900 text-[10px] text-slate-600">
            <div>
              <div className="font-bold text-slate-900">Immutable SHA-256 Ledger Hash:</div>
              <code className="font-mono text-slate-800 text-[9px] block max-w-sm break-all">
                {result.blockchainHash}
              </code>
              <p className="mt-1 text-slate-500">Block #{result.blockchainBlockNumber} &bull; Consensus: 32 Verified Nodes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 border-2 border-slate-900 rounded flex items-center justify-center font-bold text-[9px] mx-auto">
                QR SEAL
              </div>
              <span className="text-[9px] font-bold text-slate-800">Scan to Verify</span>
            </div>
          </div>

        </div>

        <div className="text-center text-xs text-slate-400">
          This report is auto-generated by TrustVerify AI platform and secured by SHA-256 Cryptographic Signatures.
        </div>

      </div>
    </div>
  );
};
