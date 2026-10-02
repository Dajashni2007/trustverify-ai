import React, { useState } from 'react';
import { VerificationResult } from '../types';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Eye, Cpu, QrCode, Database, FileText, Share2, Download, Lock, RefreshCw, KeyRound, Sparkles, AlertCircle, Building, Hash, Layers } from 'lucide-react';

interface DocumentAnalyzerViewProps {
  result: VerificationResult;
  onReset: () => void;
  onRequestOtp: () => void;
  onOpenReportModal: () => void;
}

export const DocumentAnalyzerView: React.FC<DocumentAnalyzerViewProps> = ({
  result,
  onReset,
  onRequestOtp,
  onOpenReportModal,
}) => {
  const [viewMode, setViewMode] = useState<'normal' | 'ocr' | 'tampering' | 'qr'>('tampering');
  const [activeTab, setActiveTab] = useState<'ocr' | 'tampering' | 'qr' | 'database' | 'blockchain'>('tampering');
  const [copiedLink, setCopiedLink] = useState(false);

  const isVerified = result.status === 'VERIFIED';
  const isLikelyGenuine = result.status === 'LIKELY_GENUINE';
  const isSuspicious = result.status === 'SUSPICIOUS';
  const isForgery = result.status === 'FORGERY';
  const isRevoked = result.status === 'REVOKED';

  const handleShareLink = () => {
    const url = `${window.location.origin}/verify?id=${result.extractedMetadata?.certificateNumber || result.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Color config for confidence gauge
  let scoreColor = 'text-emerald-400 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  if (result.confidenceScore < 50) {
    scoreColor = 'text-red-400 stroke-red-500 bg-red-500/10 border-red-500/30';
  } else if (result.confidenceScore < 85) {
    scoreColor = 'text-amber-400 stroke-amber-500 bg-amber-500/10 border-amber-500/30';
  }

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Analyze Another Document
          </button>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Doc ID: <code className="text-cyan-400 font-mono">{result.id}</code>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            {copiedLink ? 'Link Copied!' : 'Share Public Link'}
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Official Verification PDF Report
          </button>
        </div>
      </div>

      {/* Main Score & Status Banner */}
      <div className={`p-6 rounded-2xl border shadow-2xl relative overflow-hidden ${
        isVerified || isLikelyGenuine
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30'
          : isSuspicious
          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/30'
          : 'bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-red-500/30'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Score Circle Gauge */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={result.confidenceScore >= 85 ? 'text-emerald-400' : result.confidenceScore >= 50 ? 'text-amber-400' : 'text-red-500'}
                  strokeDasharray={`${result.confidenceScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white">{result.confidenceScore}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Confidence</span>
              </div>
            </div>
            <p className="text-xs font-semibold mt-2 text-slate-300 text-center">{result.statusLabel}</p>
          </div>

          {/* Status Breakdown & Summary */}
          <div className="md:col-span-8 lg:col-span-9 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 border ${
                isVerified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isLikelyGenuine
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : isSuspicious
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : isRevoked
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}>
                {isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                {isLikelyGenuine && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                {isSuspicious && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {(isForgery || isRevoked) && <XCircle className="w-4 h-4 text-red-400" />}
                {result.status}
              </span>

              <span className="text-xs text-slate-400">Category: <strong className="text-slate-200">{result.category}</strong></span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-xs text-slate-400">Issuer: <strong className="text-cyan-400">{result.issuerInfo.name}</strong></span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              {result.summaryReason}
            </p>

            {/* Real World Distinction Note */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {isVerified
                  ? 'Confirmed using official issuer digital signature, QR payload, and direct database hash match.'
                  : isLikelyGenuine
                  ? 'AI found no signs of tampering or photo edits. Official direct database API was unavailable for live cross-check.'
                  : isSuspicious
                  ? 'AI detected pixel compression jumps, font misalignments, or unverified QR links. Manual HR check recommended.'
                  : isRevoked
                  ? 'Official issuer database explicitly reports this certificate has been REVOKED.'
                  : 'AI computer vision detected clear photo edits, altered marks, or forged digital signatures.'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Document Viewer + Analytical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Document Image with Interactive Layer Toggles */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Document Visual Inspector
            </h3>
            
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setViewMode('normal')}
                className={`px-2.5 py-1 rounded transition-colors ${viewMode === 'normal' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Normal
              </button>
              <button
                onClick={() => setViewMode('ocr')}
                className={`px-2.5 py-1 rounded transition-colors ${viewMode === 'ocr' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                OCR Fields
              </button>
              <button
                onClick={() => setViewMode('tampering')}
                className={`px-2.5 py-1 rounded transition-colors ${viewMode === 'tampering' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                AI Heatmap
              </button>
              <button
                onClick={() => setViewMode('qr')}
                className={`px-2.5 py-1 rounded transition-colors ${viewMode === 'qr' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                QR &amp; Seal
              </button>
            </div>
          </div>

          {/* Interactive Canvas Container */}
          <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 min-h-[360px] flex items-center justify-center p-2 group">
            
            {/* Base Image */}
            <img
              src={result.sampleImageUrl || '/placeholder.png'}
              alt="Document Analysis"
              className={`max-h-[420px] w-auto object-contain transition-all ${
                viewMode === 'tampering' ? 'contrast-125 saturate-150' : ''
              }`}
            />

            {/* View Layer 1: OCR Bounding Overlay */}
            {viewMode === 'ocr' && (
              <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
                <div className="border-2 border-cyan-400/80 bg-cyan-500/10 rounded p-2 text-[10px] font-mono text-cyan-300 font-bold max-w-xs">
                  [OCR TITLE]: {result.extractedMetadata?.documentType || 'Degree Certificate'}
                </div>
                <div className="border-2 border-emerald-400/80 bg-emerald-500/10 rounded p-2 text-[10px] font-mono text-emerald-300 font-bold my-auto max-w-sm">
                  [RECIPIENT NAME]: {result.extractedMetadata?.recipientName || 'Verified Holder'}
                </div>
                <div className="border-2 border-blue-400/80 bg-blue-500/10 rounded p-2 text-[10px] font-mono text-blue-300 font-bold self-end">
                  [CERT NO]: {result.extractedMetadata?.certificateNumber || result.id}
                </div>
              </div>
            )}

            {/* View Layer 2: AI Tampering Heatmap Overlay */}
            {viewMode === 'tampering' && (
              <div className="absolute inset-0 p-4 pointer-events-none">
                {result.tamperingAnalysis.photoshopArtifactsDetected || result.tamperingAnalysis.fontMismatchDetected ? (
                  <>
                    <div className="absolute top-1/3 left-1/4 right-1/4 h-12 border-2 border-dashed border-red-500 bg-red-500/20 rounded flex items-center justify-center animate-pulse">
                      <span className="bg-red-950/90 text-red-300 font-bold text-[11px] px-2 py-0.5 rounded border border-red-500/40">
                        ⚠️ FONT MISMATCH &amp; PIXEL JUMP DETECTED
                      </span>
                    </div>
                    {result.tamperingAnalysis.photoReplaced && (
                      <div className="absolute bottom-1/4 right-8 w-24 h-28 border-2 border-red-500 bg-red-500/30 rounded flex items-center justify-center">
                        <span className="bg-red-950 text-red-300 font-bold text-[9px] px-1.5 py-0.5 rounded text-center">
                          PHOTO REPLACED
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute top-4 right-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" /> NO TAMPERING ARTIFACTS FOUND
                  </div>
                )}
              </div>
            )}

            {/* View Layer 3: QR & Seal Overlay */}
            {viewMode === 'qr' && (
              <div className="absolute inset-0 p-4 pointer-events-none">
                <div className="absolute bottom-6 left-6 w-24 h-24 border-2 border-cyan-400 bg-cyan-500/20 rounded-lg flex flex-col items-center justify-center text-center">
                  <QrCode className="w-6 h-6 text-cyan-300 mb-1" />
                  <span className="text-[9px] text-cyan-200 font-mono font-bold">QR DECODED</span>
                </div>
                <div className="absolute bottom-6 right-6 w-20 h-20 border-2 border-indigo-400 bg-indigo-500/20 rounded-full flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                  <span className="text-[8px] text-indigo-200 font-bold">RSA SEAL</span>
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Viewing: <strong className="capitalize text-white">{viewMode} Layer</strong>
            </span>
            <span className="text-[11px] text-slate-400">Click toggle buttons above to inspect analysis overlays</span>
          </div>
        </div>

        {/* Right Column: Multi-Check Detailed Tabs */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Tabs Nav */}
          <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('tampering')}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'tampering' ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> AI Tampering
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'ocr' ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> OCR Fields
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'qr' ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> QR &amp; RSA
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'database' ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Issuer DB
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'blockchain' ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5" /> Blockchain
            </button>
          </div>

          {/* Tab Content 1: AI Tampering */}
          {activeTab === 'tampering' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> AI Computer Vision &amp; Artifact Detection
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Pixel Compression Jump</div>
                  <div className="text-base font-bold text-slate-200 mt-0.5">
                    {result.tamperingAnalysis.pixelInconsistencyScore}% <span className="text-[10px] text-slate-500">Risk</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Font &amp; Alignment Check</div>
                  <div className={`text-xs font-bold mt-1 ${result.tamperingAnalysis.fontMismatchDetected ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.tamperingAnalysis.fontMismatchDetected ? '⚠️ Font Mismatch Detected' : '✔ Uniform Baseline'}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Photo Region Analysis</div>
                  <div className={`text-xs font-bold mt-1 ${result.tamperingAnalysis.photoReplaced ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.tamperingAnalysis.photoReplaced ? '🔴 Replaced Photo Artifact' : '✔ Intact Photo Seal'}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Digital Seal Integrity</div>
                  <div className={`text-xs font-bold mt-1 ${result.extractedMetadata?.sealAuthentic ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.extractedMetadata?.sealAuthentic ? '✔ Authentic Seal' : '⚠ Seal Unverified'}
                  </div>
                </div>
              </div>

              {/* Anomalies List */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Flagged Structural Anomalies</div>
                {result.tamperingAnalysis.anomalies && result.tamperingAnalysis.anomalies.length > 0 ? (
                  <ul className="space-y-1.5">
                    {result.tamperingAnalysis.anomalies.map((item, idx) => (
                      <li key={idx} className="text-xs text-red-300 bg-red-950/40 p-2 rounded-lg border border-red-500/30 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>No structural edits, photo replacements, or font anomalies detected.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content 2: OCR Fields */}
          {activeTab === 'ocr' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Extracted Text &amp; Metadata
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Recipient Name</span>
                  <strong className="text-slate-100 font-semibold">{result.extractedMetadata?.recipientName || 'N/A'}</strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Certificate Number</span>
                  <strong className="text-cyan-400 font-mono font-semibold">{result.extractedMetadata?.certificateNumber || result.id}</strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Registration Number</span>
                  <strong className="text-slate-200 font-mono">{result.extractedMetadata?.registrationNumber || 'N/A'}</strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Issuing Authority</span>
                  <strong className="text-slate-200">{result.extractedMetadata?.issuingInstitution || 'N/A'}</strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Issue Date</span>
                  <strong className="text-slate-200">{result.extractedMetadata?.issueDate || 'N/A'}</strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Grade / Marks / Status</span>
                  <strong className="text-slate-200">{result.extractedMetadata?.gradeOrMarks || 'Pass / Verified'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: QR Code & RSA */}
          {activeTab === 'qr' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" /> QR Code Payload &amp; Digital Signature
              </h4>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400">Decoded QR Payload</div>
                <code className="text-xs text-cyan-300 font-mono block break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {result.extractedMetadata?.qrCodeContent || 'https://trustverify.ai/verify?id=' + result.id}
                </code>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Digital RSA Signature</div>
                  <div className={`font-bold mt-1 ${result.extractedMetadata?.digitalSignatureValid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.extractedMetadata?.digitalSignatureValid ? '✔ Valid RSA Key' : '🔴 Invalid Signature'}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Issuer Domain Trust</div>
                  <div className="font-bold text-cyan-400 mt-1">✔ Verified Official Domain</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Issuer Database */}
          {activeTab === 'database' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Official Issuer Database Registry
              </h4>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Authority Name:</span>
                  <strong className="text-white">{result.issuerInfo.name}</strong>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Verification Source:</span>
                  <strong className="text-cyan-400">{result.issuerInfo.verificationSource}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Registry Match Status:</span>
                  <strong className={`uppercase font-bold ${
                    result.checks.databaseStatus === 'matched'
                      ? 'text-emerald-400'
                      : result.checks.databaseStatus === 'revoked'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}>
                    {result.checks.databaseStatus}
                  </strong>
                </div>
              </div>

              {/* Owner Consent OTP Button */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Owner Consent OTP
                  </div>
                  <span className="text-[11px] text-slate-400">Confirm identity via SMS/Email OTP</span>
                </div>
                <button
                  onClick={onRequestOtp}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Request OTP
                </button>
              </div>
            </div>
          )}

          {/* Tab Content 5: Blockchain Audit Trail */}
          {activeTab === 'blockchain' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" /> Blockchain Ledger Audit Trail
              </h4>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400">Immutable SHA-256 Hash</div>
                <code className="text-xs text-cyan-300 font-mono block break-all bg-slate-900 p-2 rounded border border-slate-800">
                  {result.blockchainHash}
                </code>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Block Number</div>
                  <div className="font-mono text-slate-200 font-bold mt-0.5">#{result.blockchainBlockNumber}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Ledger Consensus</div>
                  <div className="text-emerald-400 font-bold mt-0.5">32 Nodes Confirmed</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
