import React, { useState, useRef } from 'react';
import { DocumentCategory, SampleDocumentPreset } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { Upload, Camera, FileCheck, Sparkles, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert, Award, FileText, BadgeCheck, FileSpreadsheet } from 'lucide-react';

interface VerificationUploadProps {
  onAnalyze: (payload: {
    imageBase64?: string;
    samplePresetId?: string;
    category: DocumentCategory;
    fileName: string;
  }) => void;
  isAnalyzing: boolean;
}

export const VerificationUpload: React.FC<VerificationUploadProps> = ({ onAnalyze, isAnalyzing }) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('Education');
  const [selectedPreset, setSelectedPreset] = useState<SampleDocumentPreset | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories: { name: DocumentCategory; icon: any; count: string }[] = [
    { name: 'Education', icon: Award, count: 'Degrees, Marksheets, Transfer Certs' },
    { name: 'Government ID', icon: BadgeCheck, count: 'Aadhaar, PAN, Passport, DL' },
    { name: 'Employment', icon: FileSpreadsheet, count: 'Salary Slips, Offer & Experience' },
    { name: 'Professional', icon: FileCheck, count: 'Medical, Bar Council, GST, ISO' },
    { name: 'Internship', icon: FileText, count: 'Offer Letters & Completion Certs' },
  ];

  const filteredPresets = SAMPLE_DOCUMENTS.filter(d => d.category === selectedCategory || selectedCategory === 'Education');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setSelectedPreset(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: SampleDocumentPreset) => {
    setSelectedPreset(preset);
    setUploadedImage(preset.previewUrl);
    setUploadedFileName(preset.title + '.png');
    setSelectedCategory(preset.category);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access failed or frame permissions denied.');
      setIsCameraActive(false);
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setUploadedImage(dataUrl);
        setUploadedFileName('Camera_Captured_Document.png');
        setSelectedPreset(null);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleSubmit = () => {
    if (selectedPreset) {
      onAnalyze({
        samplePresetId: selectedPreset.id,
        category: selectedPreset.category,
        fileName: selectedPreset.title,
      });
    } else if (uploadedImage) {
      onAnalyze({
        imageBase64: uploadedImage,
        category: selectedCategory,
        fileName: uploadedFileName || 'Uploaded_Document.png',
      });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Category Pills Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Select Document Category</h2>
          <span className="text-xs text-cyan-400">Step 1 of 2</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/10 rounded-bl-full flex items-start justify-end p-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <div className="font-semibold text-xs text-slate-200">{cat.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{cat.count}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dropzone / Camera Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Upload Box */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" /> Upload Document Image or Scan
            </h3>
            <span className="text-[11px] text-slate-400">PDF, PNG, JPG (Max 20MB)</span>
          </div>

          {!uploadedImage && !isCameraActive && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/40 hover:bg-slate-800/20 rounded-xl p-8 text-center cursor-pointer transition-all group"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Drag &amp; drop your certificate here, or <span className="text-cyan-400 underline">browse file</span>
              </p>
              <p className="text-xs text-slate-400">
                Supports School/College Degrees, Aadhaar, PAN, Salary Slips, Experience Letters &amp; Licenses
              </p>

              <div className="mt-6 flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-slate-600 text-xs">or</span>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold rounded-lg border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" /> Use Camera Scan
                </button>
              </div>
            </div>
          )}

          {/* Camera View */}
          {isCameraActive && (
            <div className="space-y-3 bg-black rounded-xl p-3 border border-cyan-500/30">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg" />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" /> Capture Photo
                </button>
              </div>
            </div>
          )}

          {/* Preview View */}
          {uploadedImage && !isCameraActive && (
            <div className="space-y-4">
              <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2 group">
                <img src={uploadedImage} alt="Document Preview" className="max-h-72 mx-auto rounded object-contain" />
                <button
                  onClick={() => { setUploadedImage(null); setSelectedPreset(null); }}
                  className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 text-slate-300 hover:text-white text-xs rounded-md border border-slate-700 backdrop-blur"
                >
                  Change File
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
                <span className="font-mono text-cyan-300 truncate max-w-xs">{uploadedFileName}</span>
                <span className="text-slate-500">{selectedPreset ? 'Preset Loaded' : 'User Upload'}</span>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Analyze CTA */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={(!uploadedImage && !selectedPreset) || isAnalyzing}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                (!uploadedImage && !selectedPreset) || isAnalyzing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-cyan-500/20 cursor-pointer scale-[1.01]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Document with AI, OCR &amp; Blockchain...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Verify Document Authenticity Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Presets Sidebar for 1-click Test */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Instant Sample Presets
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
              1-Click Test
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Don't have a document ready? Test our multi-check AI engine with these sample certificates:
          </p>

          <div className="space-y-2.5">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id;
              const isForgery = preset.expectedStatus === 'FORGERY';
              const isRevoked = preset.expectedStatus === 'REVOKED';

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                        {preset.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                      isForgery
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : isRevoked
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {preset.expectedStatus === 'VERIFIED' ? '✔ 99% Genuine' : preset.expectedStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Multi-Layer Verification
            </div>
            <p className="text-[10px] text-slate-400">
              Checks OCR text &bull; QR code payload &bull; Digital RSA signatures &bull; Tampering &amp; photo edits &bull; SHA-256 Blockchain Hash.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
