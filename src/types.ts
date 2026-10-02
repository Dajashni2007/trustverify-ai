export type VerificationStatus =
  | 'VERIFIED'
  | 'LIKELY_GENUINE'
  | 'SUSPICIOUS'
  | 'UNABLE_TO_VERIFY'
  | 'FORGERY'
  | 'REVOKED';

export type DocumentCategory = 'Education' | 'Employment' | 'Government ID' | 'Professional' | 'Internship';

export type UserRole = 'citizen' | 'recruiter' | 'institution' | 'admin';

export interface ExtractedMetadata {
  documentType: string;
  recipientName?: string;
  dateOfBirth?: string;
  certificateNumber?: string;
  registrationNumber?: string;
  issuingInstitution?: string;
  issueDate?: string;
  expiryDate?: string;
  gradeOrMarks?: string;
  qrCodeContent?: string;
  digitalSignaturePresent?: boolean;
  digitalSignatureValid?: boolean;
  sealPresent?: boolean;
  sealAuthentic?: boolean;
}

export interface TamperingCheck {
  pixelInconsistencyScore: number; // 0 (none) to 100 (severe)
  photoshopArtifactsDetected: boolean;
  fontMismatchDetected: boolean;
  photoReplaced: boolean;
  textRemovedOrAltered: boolean;
  clonedRegionsDetected: boolean;
  signatureMismatch: boolean;
  fakeSealDetected: boolean;
  compressionArtifactsScore: number;
  anomalies: string[];
}

export interface VerificationChecks {
  ocrStatus: 'passed' | 'warning' | 'failed';
  qrStatus: 'passed' | 'warning' | 'failed' | 'missing';
  signatureStatus: 'passed' | 'warning' | 'failed' | 'missing';
  databaseStatus: 'matched' | 'unmatched' | 'revoked' | 'not_supported';
  blockchainStatus: 'verified' | 'unverified' | 'tampered';
  aiTamperingStatus: 'passed' | 'suspicious' | 'failed';
  otpConsentStatus: 'verified' | 'pending' | 'skipped';
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  documentName: string;
  category: DocumentCategory;
  confidenceScore: number; // 0 to 100
  status: VerificationStatus;
  statusLabel: string;
  summaryReason: string;
  extractedMetadata: ExtractedMetadata;
  tamperingAnalysis: TamperingCheck;
  checks: VerificationChecks;
  blockchainHash: string;
  blockchainBlockNumber: number;
  issuerInfo: {
    name: string;
    code: string;
    verifiedIssuer: boolean;
    verificationSource: string;
  };
  sampleImageUrl?: string;
}

export interface SampleDocumentPreset {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  expectedStatus: VerificationStatus;
  expectedScore: number;
  previewUrl: string;
  imageAlt: string;
  extractedTextPreview: string;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  recipientName: string;
  documentType: string;
  category: DocumentCategory;
  issuingInstitution: string;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'revoked';
  blockchainHash: string;
  qrDataUrl?: string;
  createdAt: string;
}

export interface Institution {
  id: string;
  name: string;
  category: string;
  accreditedSince: string;
  status: 'verified' | 'pending' | 'suspended';
  issuedCount: number;
  verificationRequestsCount: number;
}

export interface FraudHeatmapData {
  region: string;
  fraudCount: number;
  topType: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}
