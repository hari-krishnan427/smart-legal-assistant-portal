import type { LegalDocument } from './document';

export type CaseType =
  | 'CIVIL'
  | 'CRIMINAL'
  | 'CORPORATE'
  | 'FAMILY'
  | 'INTELLECTUAL_PROPERTY'
  | 'LABOR'
  | 'GENERAL_LITIGATION';

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_HEARING' | 'CLOSED';

export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CaseNoteResponse {
  id: number;
  caseId: number;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface CaseResponse {
  id: number;
  caseNumber: string;
  title: string;
  caseType: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  courtName?: string;
  judgeName?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  description?: string;
  assignedLawyerName: string;
  filingDate?: string;
  nextHearingDate?: string;
  documents: LegalDocument[];
  notes: CaseNoteResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseRequest {
  title: string;
  caseType: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  courtName?: string;
  judgeName?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  description?: string;
  filingDate?: string;
  nextHearingDate?: string;
}

export interface UpdateCaseRequest {
  title?: string;
  caseType?: CaseType;
  status?: CaseStatus;
  priority?: CasePriority;
  courtName?: string;
  judgeName?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  description?: string;
  filingDate?: string;
  nextHearingDate?: string;
}

export interface CreateCaseNoteRequest {
  content: string;
}
