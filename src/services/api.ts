import { VerificationResult, CertificateRecord, DocumentCategory } from '../types';

export async function verifyDocumentAPI(payload: {
  imageBase64?: string;
  samplePresetId?: string;
  category?: DocumentCategory;
  fileName?: string;
  documentTypeHint?: string;
}): Promise<VerificationResult> {
  const response = await fetch('/api/verify-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Verification request failed');
  }

  const data = await response.json();
  return data.result;
}

export async function sendOtpAPI(recipient: string, method: 'SMS' | 'Email', documentId: string) {
  const response = await fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient, method, documentId }),
  });
  return response.json();
}

export async function verifyOtpAPI(sessionId: string, code: string) {
  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, code }),
  });
  return response.json();
}

export async function issueCertificateAPI(data: {
  certificateNumber: string;
  recipientName: string;
  documentType: string;
  category: DocumentCategory;
  issuingInstitution: string;
  issueDate: string;
}) {
  const response = await fetch('/api/issue-certificate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function lookupCertificateAPI(idOrHash: string): Promise<CertificateRecord | null> {
  const response = await fetch(`/api/certificates/${encodeURIComponent(idOrHash)}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.certificate;
}

export async function fetchAnalyticsAPI() {
  const response = await fetch('/api/analytics');
  return response.json();
}
