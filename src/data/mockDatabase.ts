import { Institution, CertificateRecord, FraudHeatmapData } from '../types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'Anna University Chennai',
    category: 'University',
    accreditedSince: '1978-09-04',
    status: 'verified',
    issuedCount: 142500,
    verificationRequestsCount: 38920,
  },
  {
    id: 'inst-2',
    name: 'State Secondary Examination Board',
    category: 'Education Board',
    accreditedSince: '1965-06-15',
    status: 'verified',
    issuedCount: 980000,
    verificationRequestsCount: 120400,
  },
  {
    id: 'inst-3',
    name: 'Unique Identification Authority of India (UIDAI)',
    category: 'Government Department',
    accreditedSince: '2009-01-28',
    status: 'verified',
    issuedCount: 1300000000,
    verificationRequestsCount: 4500000,
  },
  {
    id: 'inst-4',
    name: 'TechCorp Global Solutions Ltd.',
    category: 'Employer',
    accreditedSince: '2012-04-10',
    status: 'verified',
    issuedCount: 18500,
    verificationRequestsCount: 4200,
  },
  {
    id: 'inst-5',
    name: 'State Medical Council',
    category: 'Professional Council',
    accreditedSince: '1984-11-20',
    status: 'verified',
    issuedCount: 65000,
    verificationRequestsCount: 14800,
  },
  {
    id: 'inst-6',
    name: 'Ministry of Corporate Affairs (GST & MCA)',
    category: 'Government Ministry',
    accreditedSince: '2017-07-01',
    status: 'verified',
    issuedCount: 14000000,
    verificationRequestsCount: 890000,
  }
];

export const INITIAL_CERTIFICATE_REGISTRY: CertificateRecord[] = [
  {
    id: 'CERT-88912',
    certificateNumber: 'AU-2023-CS-88912',
    recipientName: 'Arjun V. Sharma',
    documentType: 'Engineering Degree',
    category: 'Education',
    issuingInstitution: 'Anna University Chennai',
    issueDate: '2023-06-15',
    status: 'active',
    blockchainHash: '0x8f93a1c4b2e5d6f78a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: 'CERT-44901',
    certificateNumber: '8821 4490 1209',
    recipientName: 'Priya Sundaram',
    documentType: 'Aadhaar Card',
    category: 'Government ID',
    issuingInstitution: 'Unique Identification Authority of India (UIDAI)',
    issueDate: '2018-01-10',
    status: 'active',
    blockchainHash: '0x4f8a2b6c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a',
    createdAt: '2018-01-10T08:30:00Z',
  },
  {
    id: 'CERT-77102',
    certificateNumber: 'SMC-MED-77102',
    recipientName: 'Dr. S. Mukherjee',
    documentType: 'Medical License',
    category: 'Professional',
    issuingInstitution: 'State Medical Council',
    issueDate: '2019-03-12',
    status: 'revoked',
    blockchainHash: '0x77889900aabbccddeeff0011223344556677889900aabbccddeeff0011223344',
    createdAt: '2019-03-12T11:15:00Z',
  }
];

export const MOCK_FRAUD_HEATMAP: FraudHeatmapData[] = [
  { region: 'Northern Region (Delhi NCR / UP)', fraudCount: 342, topType: 'Mark Sheets & Experience Letters', riskLevel: 'High' },
  { region: 'Western Region (Mumbai / Pune)', fraudCount: 218, topType: 'Salary Slips & Offer Letters', riskLevel: 'Medium' },
  { region: 'Southern Region (Bengaluru / Chennai / Hyd)', fraudCount: 189, topType: 'B.Tech Degrees & Internship Certificates', riskLevel: 'Medium' },
  { region: 'Eastern Region (Kolkata / Patna)', fraudCount: 295, topType: 'Transfer & SSLC Certificates', riskLevel: 'High' },
  { region: 'Central Region (Bhopal / Indore)', fraudCount: 112, topType: 'Government IDs & Income Certificates', riskLevel: 'Low' },
];
