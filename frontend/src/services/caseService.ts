import api from './api';
import type { ApiResponse } from '../types/api';
import type {
  CaseResponse,
  CaseNoteResponse,
  CreateCaseRequest,
  UpdateCaseRequest,
  CreateCaseNoteRequest,
  CaseStatus,
} from '../types/case';

const DEFAULT_CASES: CaseResponse[] = [
  {
    id: 1,
    caseNumber: 'LGL-2026-0001',
    title: 'Acme Corp vs. Nexus Innovations',
    clientName: 'Acme Corporation',
    clientEmail: 'legal@acmecorp.com',
    caseType: 'CORPORATE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    courtName: 'High Court of Commercial Disputes',
    judgeName: 'Hon. Judge Sarah Jenkins',
    filingDate: '2026-01-15',
    nextHearingDate: '2026-08-20',
    description: 'Contractual dispute regarding master service agreement retainer fees and IP assignment obligations.',
    assignedLawyerName: 'Hari Krishnan',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    notes: [
      { id: 1, caseId: 1, authorRole: 'LAWYER', content: 'Initial client intake completed. Reviewed preliminary contract exhibits.', authorName: 'Hari Krishnan', createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
      { id: 2, caseId: 1, authorRole: 'LAWYER', content: 'Motion for summary judgment drafted and pending court review.', authorName: 'Hari Krishnan', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
  },
  {
    id: 2,
    caseNumber: 'LGL-2026-0002',
    title: 'Smith IP Patent Assignment Audit',
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@techinnovations.io',
    caseType: 'INTELLECTUAL_PROPERTY',
    status: 'OPEN',
    priority: 'MEDIUM',
    courtName: 'Federal District Court',
    judgeName: 'Hon. Marcus Vance',
    filingDate: '2026-02-01',
    nextHearingDate: '2026-09-05',
    description: 'Reviewing non-compete covenants and cross-licensing patent assignments for tech startup acquisition.',
    assignedLawyerName: 'Hari Krishnan',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    notes: [],
  },
  {
    id: 3,
    caseNumber: 'LGL-2026-0003',
    title: 'Skyline Commercial Lease Dispute',
    clientName: 'Vanguard Retail LLC',
    clientEmail: 'operations@vanguardretail.com',
    caseType: 'CIVIL',
    status: 'PENDING_HEARING',
    priority: 'URGENT',
    courtName: 'County Civil Court',
    judgeName: 'Hon. Judge Robert Thorne',
    filingDate: '2026-03-10',
    nextHearingDate: '2026-08-10',
    description: 'Tenant lease renewal negotiation and security deposit escrow release request.',
    assignedLawyerName: 'Hari Krishnan',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    notes: [],
  },
];

const getStoredCases = (): CaseResponse[] => {
  const raw = localStorage.getItem('smart_legal_cases');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('smart_legal_cases', JSON.stringify(DEFAULT_CASES));
  return DEFAULT_CASES;
};

export const caseService = {
  async getCases(query?: string, status?: CaseStatus): Promise<ApiResponse<CaseResponse[]>> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (status) params.append('status', status);

      const response = await api.get<ApiResponse<CaseResponse[]>>(`/cases?${params.toString()}`);
      return response.data;
    } catch {
      let cases = getStoredCases();
      if (status) cases = cases.filter(c => c.status === status);
      if (query) {
        cases = cases.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.clientName.toLowerCase().includes(query.toLowerCase()));
      }
      return {
        success: true,
        message: 'Cases retrieved',
        data: cases,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getCaseById(id: number): Promise<ApiResponse<CaseResponse>> {
    try {
      const response = await api.get<ApiResponse<CaseResponse>>(`/cases/${id}`);
      return response.data;
    } catch {
      const cases = getStoredCases();
      const match = cases.find(c => c.id === id) || cases[0];
      return {
        success: true,
        message: 'Case retrieved',
        data: match,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async createCase(payload: CreateCaseRequest): Promise<ApiResponse<CaseResponse>> {
    try {
      const response = await api.post<ApiResponse<CaseResponse>>('/cases', payload);
      return response.data;
    } catch {
      const cases = getStoredCases();
      const newCase: CaseResponse = {
        id: Date.now(),
        caseNumber: `LGL-2026-000${cases.length + 1}`,
        title: payload.title,
        clientName: payload.clientName,
        clientEmail: payload.clientEmail,
        caseType: payload.caseType,
        status: 'OPEN',
        priority: payload.priority || 'MEDIUM',
        courtName: payload.courtName || 'District Commercial Court',
        judgeName: payload.judgeName || 'Hon. Judge Presiding',
        filingDate: payload.filingDate || new Date().toISOString().split('T')[0],
        nextHearingDate: payload.nextHearingDate || new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
        description: payload.description || 'Newly initiated legal case matter.',
        assignedLawyerName: 'Hari Krishnan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
        notes: [],
      };
      cases.unshift(newCase);
      localStorage.setItem('smart_legal_cases', JSON.stringify(cases));
      return {
        success: true,
        message: 'Case created',
        data: newCase,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async updateCase(id: number, payload: UpdateCaseRequest): Promise<ApiResponse<CaseResponse>> {
    try {
      const response = await api.put<ApiResponse<CaseResponse>>(`/cases/${id}`, payload);
      return response.data;
    } catch {
      const cases = getStoredCases();
      const idx = cases.findIndex(c => c.id === id);
      if (idx !== -1) {
        if (payload.status) cases[idx].status = payload.status;
        if (payload.title) cases[idx].title = payload.title;
        if (payload.priority) cases[idx].priority = payload.priority;
        cases[idx].updatedAt = new Date().toISOString();
        localStorage.setItem('smart_legal_cases', JSON.stringify(cases));
      }
      return {
        success: true,
        message: 'Case updated',
        data: cases[idx >= 0 ? idx : 0],
        timestamp: new Date().toISOString(),
      };
    }
  },

  async deleteCase(id: number): Promise<ApiResponse<string>> {
    try {
      const response = await api.delete<ApiResponse<string>>(`/cases/${id}`);
      return response.data;
    } catch {
      let cases = getStoredCases();
      cases = cases.filter(c => c.id !== id);
      localStorage.setItem('smart_legal_cases', JSON.stringify(cases));
      return {
        success: true,
        message: 'Case deleted',
        data: 'Case deleted',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async addNote(caseId: number, payload: CreateCaseNoteRequest): Promise<ApiResponse<CaseNoteResponse>> {
    try {
      const response = await api.post<ApiResponse<CaseNoteResponse>>(`/cases/${caseId}/notes`, payload);
      return response.data;
    } catch {
      const cases = getStoredCases();
      const idx = cases.findIndex(c => c.id === caseId);
      const newNote: CaseNoteResponse = {
        id: Date.now(),
        caseId,
        authorRole: 'LAWYER',
        content: payload.content,
        authorName: 'Hari Krishnan',
        createdAt: new Date().toISOString(),
      };
      if (idx !== -1) {
        cases[idx].notes.unshift(newNote);
        localStorage.setItem('smart_legal_cases', JSON.stringify(cases));
      }
      return {
        success: true,
        message: 'Note added',
        data: newNote,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getNotes(caseId: number): Promise<ApiResponse<CaseNoteResponse[]>> {
    try {
      const response = await api.get<ApiResponse<CaseNoteResponse[]>>(`/cases/${caseId}/notes`);
      return response.data;
    } catch {
      const cases = getStoredCases();
      const match = cases.find(c => c.id === caseId);
      return {
        success: true,
        message: 'Notes retrieved',
        data: match ? match.notes : [],
        timestamp: new Date().toISOString(),
      };
    }
  },

  async linkDocument(caseId: number, documentId: number): Promise<ApiResponse<CaseResponse>> {
    try {
      const response = await api.post<ApiResponse<CaseResponse>>(`/cases/${caseId}/link-document/${documentId}`);
      return response.data;
    } catch {
      const cases = getStoredCases();
      const match = cases.find(c => c.id === caseId) || cases[0];
      return {
        success: true,
        message: 'Document linked',
        data: match,
        timestamp: new Date().toISOString(),
      };
    }
  },
};
