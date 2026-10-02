import { SampleDocumentPreset, VerificationResult } from '../types';

// Helper to create clean inline SVG Data URLs for realistic document samples
function createDocumentSVG(title: string, subtitle: string, certNo: string, recipient: string, date: string, isTampered = false, badgeText = 'OFFICIAL'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none">
    <rect width="600" height="800" fill="${isTampered ? '#FFFDF9' : '#FFFFFF'}"/>
    <rect x="20" y="20" width="560" height="760" rx="8" stroke="${isTampered ? '#D97706' : '#1E3A8A'}" stroke-width="4" fill="none"/>
    <rect x="30" y="30" width="540" height="740" rx="4" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4 4" fill="none"/>
    
    <!-- Header Emblem -->
    <circle cx="300" cy="100" r="35" fill="#1E3A8A" opacity="0.9"/>
    <polygon points="300,75 310,95 330,98 315,112 320,132 300,120 280,132 285,112 270,98 290,95" fill="#F59E0B"/>
    
    <text x="300" y="165" font-family="serif" font-size="22" font-weight="bold" fill="#1E3A8A" text-anchor="middle">${title.toUpperCase()}</text>
    <text x="300" y="190" font-family="sans-serif" font-size="14" fill="#475569" text-anchor="middle">${subtitle}</text>
    
    <line x1="100" y1="210" x2="500" y2="210" stroke="#CBD5E1" stroke-width="2"/>
    
    <text x="300" y="250" font-family="serif" font-size="14" font-style="italic" fill="#64748B" text-anchor="middle">This is to certify that</text>
    
    <!-- Recipient Name (Highlight if tampered) -->
    <rect x="120" y="270" width="360" height="45" rx="6" fill="${isTampered ? '#FEF3C7' : '#F1F5F9'}" stroke="${isTampered ? '#F59E0B' : '#CBD5E1'}"/>
    <text x="300" y="300" font-family="sans-serif" font-size="20" font-weight="bold" fill="${isTampered ? '#B45309' : '#0F172A'}" text-anchor="middle">${recipient}</text>
    ${isTampered ? '<text x="460" y="280" font-family="sans-serif" font-size="10" fill="#DC2626" font-weight="bold">⚠️ FONT MISMATCH</text>' : ''}
    
    <text x="300" y="350" font-family="sans-serif" font-size="13" fill="#475569" text-anchor="middle">has successfully fulfilled the prescribed qualification for</text>
    
    <text x="300" y="385" font-family="serif" font-size="18" font-weight="bold" fill="#1E3A8A" text-anchor="middle">BACHELOR OF TECHNOLOGY</text>
    <text x="300" y="410" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">Computer Science &amp; Engineering</text>
    
    <g transform="translate(100, 450)">
      <text x="0" y="0" font-family="sans-serif" font-size="12" fill="#64748B">Certificate No:</text>
      <text x="120" y="0" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">${certNo}</text>
      
      <text x="0" y="30" font-family="sans-serif" font-size="12" fill="#64748B">Issue Date:</text>
      <text x="120" y="30" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">${date}</text>
      
      <text x="0" y="60" font-family="sans-serif" font-size="12" fill="#64748B">Status:</text>
      <text x="120" y="60" font-family="sans-serif" font-size="13" font-weight="bold" fill="#166534">${badgeText}</text>
    </g>

    <!-- Photo box -->
    <rect x="420" y="440" width="100" height="120" rx="4" fill="#E2E8F0" stroke="${isTampered ? '#DC2626' : '#94A3B8'}" stroke-width="${isTampered ? '3' : '1'}"/>
    <circle cx="470" cy="485" r="25" fill="#94A3B8"/>
    <path d="M435 550 C 435 515, 505 515, 505 550 Z" fill="#94A3B8"/>
    ${isTampered ? '<text x="470" y="575" font-family="sans-serif" font-size="9" fill="#DC2626" font-weight="bold" text-anchor="middle">PHOTO EDITED</text>' : ''}
    
    <!-- QR Code Placeholder SVG pattern -->
    <g transform="translate(80, 620)">
      <rect x="0" y="0" width="90" height="90" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
      <rect x="10" y="10" width="25" height="25" fill="#0F172A"/>
      <rect x="55" y="10" width="25" height="25" fill="#0F172A"/>
      <rect x="10" y="55" width="25" height="25" fill="#0F172A"/>
      <rect x="15" y="15" width="15" height="15" fill="#FFFFFF"/>
      <rect x="60" y="15" width="15" height="15" fill="#FFFFFF"/>
      <rect x="15" y="60" width="15" height="15" fill="#FFFFFF"/>
      <rect x="45" y="45" width="20" height="20" fill="#0F172A"/>
      <text x="45" y="105" font-family="sans-serif" font-size="10" fill="#64748B" text-anchor="middle">VERIFIED QR</text>
    </g>
    
    <!-- Digital Seal -->
    <g transform="translate(450, 660)">
      <circle cx="0" cy="0" r="35" fill="#1E3A8A" opacity="0.1" stroke="#1E3A8A" stroke-width="2"/>
      <circle cx="0" cy="0" r="28" stroke="#1E3A8A" stroke-width="1" stroke-dasharray="2 2" fill="none"/>
      <text x="0" y="4" font-family="sans-serif" font-size="9" font-weight="bold" fill="#1E3A8A" text-anchor="middle">OFFICIAL SEAL</text>
    </g>

    <line x1="50" y1="730" x2="550" y2="730" stroke="#CBD5E1" stroke-width="1"/>
    <text x="300" y="750" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">Verified with TrustVerify AI Blockchain Registry &bull; Doc ID: ${certNo}</text>
  </svg>`;
  
  return 'data:image/svg+xml;base64,' + typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(svg))) : '';
}

export const SAMPLE_DOCUMENTS: SampleDocumentPreset[] = [
  {
    id: 'sample-1',
    title: 'B.E. Degree Certificate (Anna University)',
    category: 'Education',
    description: 'Genuine Degree Certificate with intact digital seal, valid QR code, and matching university database registry.',
    expectedStatus: 'VERIFIED',
    expectedScore: 99,
    previewUrl: createDocumentSVG('Anna University Chennai', 'State University of Higher Education', 'AU-2023-CS-88912', 'Arjun V. Sharma', '15 June 2023', false, 'VERIFIED'),
    imageAlt: 'Official Anna University Degree Certificate',
    extractedTextPreview: 'ANNA UNIVERSITY CHENNAI - Degree of Bachelor of Engineering in Computer Science - Recipient: Arjun V. Sharma - Reg: AU-2023-CS-88912',
  },
  {
    id: 'sample-2',
    title: 'SSLC Mark Sheet (Altered Marks & Photo)',
    category: 'Education',
    description: 'Tampered Document with detected photo replacement, font inconsistency on marks, and invalid QR payload.',
    expectedStatus: 'FORGERY',
    expectedScore: 28,
    previewUrl: createDocumentSVG('State Secondary Board', 'SSLC Examination Mark Certificate', 'SSLC-2021-99823', 'Rajesh K. Kumar (Altered)', '20 May 2021', true, 'SUSPICIOUS'),
    imageAlt: 'Altered SSLC Marksheet with photo mismatch',
    extractedTextPreview: 'STATE SECONDARY BOARD - SSLC Mark Certificate - Student: Rajesh K. Kumar - Marks: Mathematics 98/100 (Altered font detected) - Reg: SSLC-2021-99823',
  },
  {
    id: 'sample-3',
    title: 'Aadhaar Identification Card (Govt of India)',
    category: 'Government ID',
    description: 'Official Aadhaar ID with encrypted QR code, official UIDAI signature, and valid demographic structure.',
    expectedStatus: 'VERIFIED',
    expectedScore: 98,
    previewUrl: createDocumentSVG('Unique Identification Authority of India', 'Government of India - Aadhaar Card', 'UID-8821-4490-1209', 'Priya Sundaram', '10 Jan 2018', false, 'VALID ID'),
    imageAlt: 'Aadhaar Card Sample',
    extractedTextPreview: 'GOVERNMENT OF INDIA - Unique Identification Authority of India - Aadhaar No: 8821 4490 1209 - Priya Sundaram - DOB: 14/08/1996',
  },
  {
    id: 'sample-4',
    title: 'TechCorp Experience & Salary Slip',
    category: 'Employment',
    description: 'Experience letter with suspicious font edits around salary figure and missing official HR stamp.',
    expectedStatus: 'SUSPICIOUS',
    expectedScore: 48,
    previewUrl: createDocumentSVG('TechCorp Global Solutions', 'Employment Experience & Relieving Certificate', 'EXP-2024-9041', 'Vikramaditya Rao', '01 Feb 2024', true, 'UNVERIFIED'),
    imageAlt: 'TechCorp Salary Slip with altered figures',
    extractedTextPreview: 'TECHCORP GLOBAL - Relieving & Experience Letter - Employee: Vikramaditya Rao - Designation: Senior Software Engineer - Monthly CTC: ₹1,85,000 (Font inconsistency flagged)',
  },
  {
    id: 'sample-5',
    title: 'Medical Council License (Revoked)',
    category: 'Professional',
    description: 'Validly structured medical registration certificate, but flagged as REVOKED in State Medical Council registry.',
    expectedStatus: 'REVOKED',
    expectedScore: 12,
    previewUrl: createDocumentSVG('State Medical Council', 'Certificate of Medical Practitioner Registration', 'SMC-MED-77102', 'Dr. S. Mukherjee', '12 Mar 2019', false, 'REVOKED'),
    imageAlt: 'State Medical Council Practitioner License',
    extractedTextPreview: 'STATE MEDICAL COUNCIL - Registration Certificate - Medical Practitioner: Dr. S. Mukherjee - Reg No: SMC-MED-77102 - Registry Status: REVOKED ON 2025-11-10',
  },
];

export const PRESET_VERIFICATION_RESULTS: Record<string, VerificationResult> = {
  'sample-1': {
    id: 'VER-2026-8801',
    timestamp: new Date().toISOString(),
    documentName: 'Anna_University_Degree_CS_2023.pdf',
    category: 'Education',
    confidenceScore: 99,
    status: 'VERIFIED',
    statusLabel: '99% Genuine - Authenticated',
    summaryReason: 'Extracted OCR, QR code payload, digital signature, and seal match official Anna University records. Blockchain audit hash confirmed.',
    extractedMetadata: {
      documentType: 'Bachelor of Engineering Degree',
      recipientName: 'Arjun V. Sharma',
      dateOfBirth: '1998-05-12',
      certificateNumber: 'AU-2023-CS-88912',
      registrationNumber: '312419104088',
      issuingInstitution: 'Anna University Chennai',
      issueDate: '2023-06-15',
      gradeOrMarks: 'First Class with Distinction (CGPA: 8.92)',
      qrCodeContent: 'https://annauniv.edu/verify?cert=AU-2023-CS-88912&hash=0a8f9e21',
      digitalSignaturePresent: true,
      digitalSignatureValid: true,
      sealPresent: true,
      sealAuthentic: true,
    },
    tamperingAnalysis: {
      pixelInconsistencyScore: 2,
      photoshopArtifactsDetected: false,
      fontMismatchDetected: false,
      photoReplaced: false,
      textRemovedOrAltered: false,
      clonedRegionsDetected: false,
      signatureMismatch: false,
      fakeSealDetected: false,
      compressionArtifactsScore: 4,
      anomalies: [],
    },
    checks: {
      ocrStatus: 'passed',
      qrStatus: 'passed',
      signatureStatus: 'passed',
      databaseStatus: 'matched',
      blockchainStatus: 'verified',
      aiTamperingStatus: 'passed',
      otpConsentStatus: 'verified',
    },
    blockchainHash: '0x8f93a1c4b2e5d6f78a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    blockchainBlockNumber: 4891023,
    issuerInfo: {
      name: 'Anna University Chennai',
      code: 'AU-CHN-01',
      verifiedIssuer: true,
      verificationSource: 'National Academic Depository (NAD) API & Direct University Node',
    },
  },
  'sample-2': {
    id: 'VER-2026-8802',
    timestamp: new Date().toISOString(),
    documentName: 'SSLC_MarkSheet_Tampered_Copy.png',
    category: 'Education',
    confidenceScore: 28,
    status: 'FORGERY',
    statusLabel: '28% Genuine - Possible Forgery Detected',
    summaryReason: 'AI Tampering engine detected clear photo replacement, font mismatch on Mathematics mark (88 changed to 98), and mismatched QR payload.',
    extractedMetadata: {
      documentType: 'Secondary School Leaving Certificate (SSLC)',
      recipientName: 'Rajesh K. Kumar',
      dateOfBirth: '2005-02-18',
      certificateNumber: 'SSLC-2021-99823',
      registrationNumber: 'REG-2021-44102',
      issuingInstitution: 'State Secondary Examination Board',
      issueDate: '2021-05-20',
      gradeOrMarks: 'Total Marks: 482/500 (Tampered)',
      qrCodeContent: 'https://fake-verify-sslc.net/check?id=99823',
      digitalSignaturePresent: true,
      digitalSignatureValid: false,
      sealPresent: true,
      sealAuthentic: false,
    },
    tamperingAnalysis: {
      pixelInconsistencyScore: 88,
      photoshopArtifactsDetected: true,
      fontMismatchDetected: true,
      photoReplaced: true,
      textRemovedOrAltered: true,
      clonedRegionsDetected: true,
      signatureMismatch: true,
      fakeSealDetected: true,
      compressionArtifactsScore: 82,
      anomalies: [
        'Photo region contains bounding pixel compression jump (Replaced photo)',
        'Font kerning and weight mismatch detected on Mathematics score (98/100)',
        'QR Code redirects to unverified domain "fake-verify-sslc.net"',
        'Digital signature hash does not match original board certificate public key',
      ],
    },
    checks: {
      ocrStatus: 'warning',
      qrStatus: 'failed',
      signatureStatus: 'failed',
      databaseStatus: 'unmatched',
      blockchainStatus: 'tampered',
      aiTamperingStatus: 'failed',
      otpConsentStatus: 'pending',
    },
    blockchainHash: '0x11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff',
    blockchainBlockNumber: 4890119,
    issuerInfo: {
      name: 'State Secondary Examination Board',
      code: 'SSEB-01',
      verifiedIssuer: true,
      verificationSource: 'Board Registry API - Record mismatch',
    },
  },
  'sample-3': {
    id: 'VER-2026-8803',
    timestamp: new Date().toISOString(),
    documentName: 'Aadhaar_Card_Priya_Sundaram.pdf',
    category: 'Government ID',
    confidenceScore: 98,
    status: 'VERIFIED',
    statusLabel: '98% Genuine - Verified Identity Document',
    summaryReason: 'Extracted Aadhaar QR code contains valid 2048-bit RSA encrypted payload. UIDAI signature verified and demographic details match.',
    extractedMetadata: {
      documentType: 'Aadhaar Card (National ID)',
      recipientName: 'Priya Sundaram',
      dateOfBirth: '1996-08-14',
      certificateNumber: '8821 4490 1209',
      registrationNumber: 'UIDAI-2018-9901',
      issuingInstitution: 'Unique Identification Authority of India (UIDAI)',
      issueDate: '2018-01-10',
      qrCodeContent: 'Priya Sundaram|1996-08-14|882144901209|UIDAI_RSA_SIG_OK',
      digitalSignaturePresent: true,
      digitalSignatureValid: true,
      sealPresent: true,
      sealAuthentic: true,
    },
    tamperingAnalysis: {
      pixelInconsistencyScore: 3,
      photoshopArtifactsDetected: false,
      fontMismatchDetected: false,
      photoReplaced: false,
      textRemovedOrAltered: false,
      clonedRegionsDetected: false,
      signatureMismatch: false,
      fakeSealDetected: false,
      compressionArtifactsScore: 5,
      anomalies: [],
    },
    checks: {
      ocrStatus: 'passed',
      qrStatus: 'passed',
      signatureStatus: 'passed',
      databaseStatus: 'matched',
      blockchainStatus: 'verified',
      aiTamperingStatus: 'passed',
      otpConsentStatus: 'verified',
    },
    blockchainHash: '0x4f8a2b6c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a',
    blockchainBlockNumber: 4891100,
    issuerInfo: {
      name: 'Unique Identification Authority of India (UIDAI)',
      code: 'UIDAI-GOV',
      verifiedIssuer: true,
      verificationSource: 'Official UIDAI Offline Digital Signature Verifier',
    },
  },
  'sample-4': {
    id: 'VER-2026-8804',
    timestamp: new Date().toISOString(),
    documentName: 'TechCorp_Salary_Experience_2024.pdf',
    category: 'Employment',
    confidenceScore: 45,
    status: 'SUSPICIOUS',
    statusLabel: '45% Genuine - Suspicious Edits Detected',
    summaryReason: 'Document structure matches TechCorp format, but AI image analysis found suspicious font modifications in the monthly salary box.',
    extractedMetadata: {
      documentType: 'Relieving & Salary Experience Letter',
      recipientName: 'Vikramaditya Rao',
      dateOfBirth: '1995-11-20',
      certificateNumber: 'EXP-2024-9041',
      registrationNumber: 'EMP-77102',
      issuingInstitution: 'TechCorp Global Solutions Ltd.',
      issueDate: '2024-02-01',
      gradeOrMarks: 'Monthly CTC: ₹1,85,000 (Unverified)',
      qrCodeContent: 'https://techcorp.com/verify?id=EXP-2024-9041',
      digitalSignaturePresent: false,
      digitalSignatureValid: false,
      sealPresent: true,
      sealAuthentic: false,
    },
    tamperingAnalysis: {
      pixelInconsistencyScore: 62,
      photoshopArtifactsDetected: true,
      fontMismatchDetected: true,
      photoReplaced: false,
      textRemovedOrAltered: true,
      clonedRegionsDetected: false,
      signatureMismatch: true,
      fakeSealDetected: true,
      compressionArtifactsScore: 55,
      anomalies: [
        'Font baseline alignment on CTC amount "₹1,85,000" deviates from standard corporate template',
        'HR digital signature missing',
        'Corporate seal image lacks expected transparency overlay',
      ],
    },
    checks: {
      ocrStatus: 'passed',
      qrStatus: 'warning',
      signatureStatus: 'missing',
      databaseStatus: 'unmatched',
      blockchainStatus: 'unverified',
      aiTamperingStatus: 'suspicious',
      otpConsentStatus: 'pending',
    },
    blockchainHash: '0x99aabbccddeeff0011223344556677889900aabbccddeeff0011223344556677',
    blockchainBlockNumber: 4891150,
    issuerInfo: {
      name: 'TechCorp Global Solutions Ltd.',
      code: 'TECHCORP-HR',
      verifiedIssuer: true,
      verificationSource: 'Employer Verification Network - Pending Employer Consent',
    },
  },
  'sample-5': {
    id: 'VER-2026-8805',
    timestamp: new Date().toISOString(),
    documentName: 'Medical_Practitioner_License_DrMukherjee.pdf',
    category: 'Professional',
    confidenceScore: 12,
    status: 'REVOKED',
    statusLabel: '12% Genuine - License Revoked by Authority',
    summaryReason: 'Certificate visually authentic, but official State Medical Council database reports this practitioner license was REVOKED.',
    extractedMetadata: {
      documentType: 'Medical Practitioner Registration Certificate',
      recipientName: 'Dr. S. Mukherjee',
      dateOfBirth: '1982-04-05',
      certificateNumber: 'SMC-MED-77102',
      registrationNumber: 'MCI-881923',
      issuingInstitution: 'State Medical Council',
      issueDate: '2019-03-12',
      expiryDate: '2029-03-11',
      qrCodeContent: 'https://statemedicalcouncil.org/verify?lic=SMC-MED-77102',
      digitalSignaturePresent: true,
      digitalSignatureValid: true,
      sealPresent: true,
      sealAuthentic: true,
    },
    tamperingAnalysis: {
      pixelInconsistencyScore: 5,
      photoshopArtifactsDetected: false,
      fontMismatchDetected: false,
      photoReplaced: false,
      textRemovedOrAltered: false,
      clonedRegionsDetected: false,
      signatureMismatch: false,
      fakeSealDetected: false,
      compressionArtifactsScore: 8,
      anomalies: [
        'Official State Medical Council Database returned status: REVOKED (Order #2025/MC-882)',
      ],
    },
    checks: {
      ocrStatus: 'passed',
      qrStatus: 'passed',
      signatureStatus: 'passed',
      databaseStatus: 'revoked',
      blockchainStatus: 'verified',
      aiTamperingStatus: 'passed',
      otpConsentStatus: 'verified',
    },
    blockchainHash: '0x77889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344',
    blockchainBlockNumber: 4890900,
    issuerInfo: {
      name: 'State Medical Council',
      code: 'SMC-GOV-01',
      verifiedIssuer: true,
      verificationSource: 'National Medical Commission Central Database API',
    },
  },
};
