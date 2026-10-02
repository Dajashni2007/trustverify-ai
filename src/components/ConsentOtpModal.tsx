import React, { useState } from 'react';
import { sendOtpAPI, verifyOtpAPI } from '../services/api';
import { KeyRound, Smartphone, Mail, X, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface ConsentOtpModalProps {
  documentId: string;
  recipientName?: string;
  isOpen: boolean;
  onClose: () => void;
  onConsentVerified: () => void;
}

export const ConsentOtpModal: React.FC<ConsentOtpModalProps> = ({
  documentId,
  recipientName,
  isOpen,
  onClose,
  onConsentVerified,
}) => {
  const [method, setMethod] = useState<'SMS' | 'Email'>('SMS');
  const [recipient, setRecipient] = useState('+91 98******10');
  const [step, setStep] = useState<'request' | 'enter' | 'success'>('request');
  const [sessionId, setSessionId] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [demoHint, setDemoHint] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await sendOtpAPI(recipient, method, documentId);
      if (res.success) {
        setSessionId(res.sessionId);
        setDemoHint(res.demoOtpHint || '');
        setStep('enter');
      } else {
        setErrorMsg(res.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await verifyOtpAPI(sessionId, otpInput.trim());
      if (res.success && res.verified) {
        setStep('success');
        setTimeout(() => {
          onConsentVerified();
          onClose();
        }, 1800);
      } else {
        setErrorMsg(res.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Owner Identity &amp; Consent Verification</h3>
            <p className="text-xs text-slate-400">Doc ID: {documentId}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 'request' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              To verify official database records for <strong className="text-cyan-300">{recipientName || 'Document Holder'}</strong>, we require owner consent.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Select Verification Channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setMethod('SMS'); setRecipient('+91 98******10'); }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    method === 'SMS' ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-indigo-400" /> Mobile SMS
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('Email'); setRecipient('holder@example.com'); }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    method === 'Email' ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Mail className="w-4 h-4 text-indigo-400" /> Email OTP
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Target Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Sending OTP Code...' : 'Send 6-Digit Consent OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 'enter' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
              <p>6-Digit OTP sent to <strong className="text-white">{recipient}</strong>.</p>
              {demoHint && (
                <p className="mt-1 text-[11px] text-cyan-300 font-mono">
                  [Demo Testing Code: <strong>{demoHint}</strong>]
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Enter OTP Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono tracking-widest text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpInput.length < 6}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Verifying OTP...' : 'Confirm &amp; Unlock Database Record'}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-white">Owner Consent Verified!</h4>
            <p className="text-xs text-slate-400">
              Official verification session token generated. Unlocking direct database record...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
