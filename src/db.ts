export interface Document {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

const documents: Document[] = [
  {
    id: 1,
    title: 'Security Alert: Unauthorized Access Attempt',
    content: 'Detected multiple failed login attempts from IP 192.168.1.45 targeting admin panel. Blocked by WAF rule set.',
    status: 'resolved',
    createdAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 2,
    title: 'Policy Update: API Rate Limiting',
    content: 'New rate limiting policy implemented for all external API endpoints. Maximum 1000 requests per hour per API key.',
    status: 'active',
    createdAt: '2024-01-16T10:15:00Z',
  },
  {
    id: 3,
    title: 'Policy Document: MFA Enforcement',
    content: 'All users must use MFA for privileged access. Multi-factor authentication is mandatory for admin panel and SSH access.',
    status: 'active',
    createdAt: '2024-01-17T14:22:00Z',
  },
  {
    id: 4,
    title: 'Access Review: Quarterly Permission Audit',
    content: 'Completed quarterly review of user permissions. 12 stale accounts deactivated, 5 elevated privileges revoked.',
    status: 'completed',
    createdAt: '2024-01-18T09:00:00Z',
  },
  {
    id: 5,
    title: 'Security Patch: CVE-2024-12345 Applied',
    content: 'Critical vulnerability in logging library patched. All affected services restarted and verified.',
    status: 'completed',
    createdAt: '2024-01-19T16:45:00Z',
  },
  {
    id: 6,
    title: 'New Threat Intelligence Feed Integrated',
    content: 'Integrated MITRE ATT&CK threat intelligence feed into SIEM. Enhanced detection rules for T1059 and T1071.',
    status: 'active',
    createdAt: '2024-01-20T11:30:00Z',
  },
  {
    id: 7,
    title: 'Phishing Campaign Detection',
    content: 'Detected targeted phishing campaign impersonating IT support. 3 users clicked, credentials rotated immediately.',
    status: 'resolved',
    createdAt: '2024-01-21T13:10:00Z',
  },
  {
    id: 8,
    title: 'Compliance: GDPR Data Mapping Complete',
    content: 'Completed data mapping exercise for GDPR Article 30. All personal data flows documented and retention policies updated.',
    status: 'completed',
    createdAt: '2024-01-22T10:00:00Z',
  },
  {
    id: 9,
    title: 'Firewall Rule Optimization',
    content: 'Consolidated 47 redundant firewall rules. Reduced rule set from 234 to 187 while maintaining coverage.',
    status: 'completed',
    createdAt: '2024-01-23T15:20:00Z',
  },
  {
    id: 10,
    title: 'Suspicious Process Execution Blocked',
    content: 'EDR blocked unauthorized PowerShell execution on workstation WKS-042. Process tree analyzed, false positive ruled out.',
    status: 'resolved',
    createdAt: '2024-01-24T07:55:00Z',
  },
  {
    id: 11,
    title: 'Certificate Renewal: Production TLS Certificates',
    content: 'Renewed TLS certificates for api.example.com and admin.example.com. New certs valid until 2025-07-24.',
    status: 'completed',
    createdAt: '2024-01-25T12:00:00Z',
  },
  {
    id: 12,
    title: 'Security Training: Social Engineering Awareness',
    content: 'Launched mandatory social engineering awareness training. 94% completion rate within first week.',
    status: 'active',
    createdAt: '2024-01-26T09:30:00Z',
  },
  {
    id: 13,
    title: 'Vulnerability Scan: Monthly External Scan Results',
    content: 'Monthly external vulnerability scan completed. 0 critical, 2 medium, 5 low findings. Remediation in progress.',
    status: 'in_progress',
    createdAt: '2024-01-27T14:40:00Z',
  },
  {
    id: 14,
    title: 'Insider Threat: Anomalous Data Access Pattern',
    content: 'UEBA detected unusual bulk data download by user dev-007. Investigation confirmed legitimate backup activity.',
    status: 'resolved',
    createdAt: '2024-01-28T11:15:00Z',
  },
  {
    id: 15,
    title: 'Backup Integrity Verification',
    content: 'Quarterly backup restoration test completed successfully. All critical databases restored and verified within RTO.',
    status: 'completed',
    createdAt: '2024-01-29T16:00:00Z',
  },
  {
    id: 16,
    title: 'API Gateway: Mutual TLS Enforcement',
    content: 'Enabled mTLS for all internal service-to-service communication. Certificate rotation automated via cert-manager.',
    status: 'active',
    createdAt: '2024-01-30T10:45:00Z',
  },
  {
    id: 17,
    title: 'Ransomware Simulation Exercise',
    content: 'Completed annual ransomware tabletop exercise. Identified 3 gaps in incident response playbook. Updates scheduled.',
    status: 'completed',
    createdAt: '2024-01-31T13:00:00Z',
  },
  {
    id: 18,
    title: 'Secrets Management: Rotation Policy Enforced',
    content: 'Implemented automated secret rotation for all database credentials and API keys. Rotation interval set to 90 days.',
    status: 'active',
    createdAt: '2024-02-01T08:20:00Z',
  },
  {
    id: 19,
    title: 'Cloud Security: S3 Bucket Misconfiguration Remediated',
    content: 'Discovered publicly accessible S3 bucket during CSPM scan. Immediately restricted access and enabled bucket logging.',
    status: 'resolved',
    createdAt: '2024-02-02T12:30:00Z',
  },
  {
    id: 20,
    title: 'Zero Trust Architecture: Phase 2 Deployment',
    content: 'Deployed device trust verification for remote access. All corporate devices now require valid device certificate.',
    status: 'in_progress',
    createdAt: '2024-02-03T15:10:00Z',
  },
  {
    id: 21,
    title: 'Security Incident: Supply Chain Compromise Alert',
    content: 'Monitoring for indicators of compromise related to recent supply chain attack on popular npm package. No impact detected.',
    status: 'monitoring',
    createdAt: '2024-02-04T10:00:00Z',
  },
  {
    id: 22,
    title: 'Penetration Test: External Network Assessment',
    content: 'Completed annual external penetration test. 4 medium-risk findings identified. Remediation plan approved by CISO.',
    status: 'in_progress',
    createdAt: '2024-02-05T14:00:00Z',
  },
];

export function searchDocuments(query: string): Document[] {
  if (!query || query.trim() === '') {
    return [];
  }
  const lowerQuery = query.toLowerCase();
  return documents.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.content.toLowerCase().includes(lowerQuery)
  );
}

export function getDocumentById(id: number): Document | undefined {
  return documents.find(doc => doc.id === id);
}

export function getAllDocuments(): Document[] {
  return [...documents];
}