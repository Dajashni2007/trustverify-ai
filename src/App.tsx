import React, { useState } from 'react';
import { UserRole, VerificationResult, DocumentCategory } from './types';
import { PRESET_VERIFICATION_RESULTS } from './data/sampleDocuments';
import { verifyDocumentAPI } from './services/api';
import { Navbar } from './components/Navbar';
import { VerificationUpload } from './components/VerificationUpload';
import { DocumentAnalyzerView } from './components/DocumentAnalyzerView';
import { ConsentOtpModal } from './components/ConsentOtpModal';
import { VerificationReportModal } from './components/VerificationReportModal';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { InstitutionPortal } from './components/InstitutionPortal';
import { GovernmentAdminPortal } from './components/GovernmentAdminPortal';
import { PublicVerifyPage } from './components/PublicVerifyPage';
import { ShieldCheck, Sparkles, AlertCircle, FileCheck, Award, Lock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeResult, setActiveResult] = useState<VerificationResult | null>(null);
  
  // Modals state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Search lookup state
  const [publicLookupQuery, setPublicLookupQuery] = useState<string | null>(null);

  // Handle document analysis request
  const handleAnalyzeDocument = async (payload: {
    imageBase64?: string;
    samplePresetId?: string;
    category: DocumentCategory;
    fileName: string;
  }) => {
    setIsAnalyzing(true);
    try {
      if (payload.samplePresetId && PRESET_VERIFICATION_RESULTS[payload.samplePresetId]) {
        // Return preset sample result instantly with fresh timestamp
        const preset = PRESET_VERIFICATION_RESULTS[payload.samplePresetId];
        setActiveResult({ ...preset, timestamp: new Date().toISOString() });
      } else {
        // Call Express backend endpoint
        const res = await verifyDocumentAPI(payload);
        setActiveResult(res);
      }
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearchLookup = (query: string) => {
    setPublicLookupQuery(query);
  };

  const handleConsentVerified = () => {
    if (activeResult) {
      setActiveResult({
        ...activeResult,
        checks: {
          ...activeResult.checks,
          otpConsentStatus: 'verified',
          databaseStatus: 'matched',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={(role) => {
          setCurrentRole(role);
          setPublicLookupQuery(null);
        }}
        onSearchLookup={handleSearchLookup}
        onGoHome={() => {
          setPublicLookupQuery(null);
          setActiveResult(null);
          setCurrentRole('citizen');
        }}
      />

      {/* Main Body Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Public Lookup Mode Active */}
        {publicLookupQuery ? (
          <PublicVerifyPage
            initialLookupId={publicLookupQuery}
            onBackHome={() => setPublicLookupQuery(null)}
          />
        ) : (
          <>
            {/* Citizen / Public Verifier Workspace */}
            {currentRole === 'citizen' && (
              <div className="space-y-8">
                
                {/* Hero / Concept Banner */}
                {!activeResult && (
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-8 md:p-10 shadow-2xl">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="max-w-3xl space-y-4 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" /> AI-Powered Multi-Check Verification System
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Universal Digital Certificate &amp; Document Verification Platform
                      </h1>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Verify degrees, mark sheets, Aadhaar cards, salary slips, offer letters, and medical licenses instantly. TrustVerify AI combines Computer Vision, OCR, RSA digital signatures, QR code decoding, issuer registries, and SHA-256 blockchain audit logs.
                      </p>

                      <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confidence Score Output
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tampering &amp; Photoshop Detection
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Owner OTP Consent Workflow
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload or Analyzer View */}
                {!activeResult ? (
                  <VerificationUpload
                    onAnalyze={handleAnalyzeDocument}
                    isAnalyzing={isAnalyzing}
                  />
                ) : (
                  <DocumentAnalyzerView
                    result={activeResult}
                    onReset={() => setActiveResult(null)}
                    onRequestOtp={() => setIsOtpModalOpen(true)}
                    onOpenReportModal={() => setIsReportModalOpen(true)}
                  />
                )}
              </div>
            )}

            {/* Recruiter / HR Portal */}
            {currentRole === 'recruiter' && (
              <RecruiterDashboard
                onSelectResult={(result) => {
                  setActiveResult(result);
                  setCurrentRole('citizen');
                }}
                onBulkVerify={(files) => {
                  alert(`Started processing ${files.length} candidate documents...`);
                }}
              />
            )}

            {/* Institution / Issuer Portal */}
            {currentRole === 'institution' && (
              <InstitutionPortal />
            )}

            {/* Government Admin Portal */}
            {currentRole === 'admin' && (
              <GovernmentAdminPortal />
            )}
          </>
        )}

      </main>

      {/* Modals */}
      {activeResult && (
        <>
          <ConsentOtpModal
            documentId={activeResult.extractedMetadata?.certificateNumber || activeResult.id}
            recipientName={activeResult.extractedMetadata?.recipientName}
            isOpen={isOtpModalOpen}
            onClose={() => setIsOtpModalOpen(false)}
            onConsentVerified={handleConsentVerified}
          />

          <VerificationReportModal
            result={activeResult}
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
          />
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> TrustVerify AI &bull; Smart Verification Protocol
          </div>
          <p className="text-[11px] text-slate-400">
            Designed for SIH, Recruiter Security &amp; University Certificate Fraud Prevention.
          </p>
        </div>
      </footer>

    </div>
  );
}
