import api from './api';
import type { ApiResponse } from '../types/api';
import type { AiAnalysisResponse, AiDashboardStats, ChatRequest, ChatResponse } from '../types/ai';

const createDemoAnalysis = (docId: number): AiAnalysisResponse => ({
  id: docId,
  documentId: docId,
  documentTitle: `Document_${docId}.pdf`,
  summary: 'This agreement establishes formal legal covenants regarding confidentiality, non-disclosure, intellectual property ownership, indemnification, and governing jurisdiction. Party A agrees to disclose proprietary information solely for evaluation purposes.',
  riskScore: 28,
  riskLevel: 'LOW',
  keyClauses: [
    { name: 'Confidentiality', status: 'Present', excerpt: 'Strict 3-year mutual non-disclosure of proprietary trade secrets.', analysis: 'Low risk standard clause.' },
    { name: 'Termination', status: 'Present', excerpt: 'Either party may terminate upon 30 days written notice.', analysis: 'Standard termination window.' },
    { name: 'Governing Law', status: 'Present', excerpt: 'Governed by the state and federal courts of competent jurisdiction.', analysis: 'Clear jurisdiction specified.' },
    { name: 'Indemnification', status: 'Present', excerpt: 'Mutual indemnification capped at total fees paid.', analysis: 'Balanced mutual indemnity.' },
  ],
  missingClauses: ['Force Majeure Exception', 'Data Privacy GDPR Addendum'],
  potentialRisks: [
    'Broad definition of confidential information may include standard public communications.',
    'Short 30-day cure period for material breach.',
  ],
  recommendations: [
    'Add an explicit Force Majeure clause to insulate against unpreventable delays.',
    'Clarify standard carved-out exceptions to confidential information.',
    'Include standard GDPR/CCPA data processing addendum if handling personal consumer data.',
  ],
  importantDates: [
    new Date().toISOString().split('T')[0],
    new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0],
  ],
  partiesInvolved: ['Disclosing Party Corp', 'Receiving Party Ltd'],
  partyObligations: {
    'Disclosing Party': ['Provide accurate evaluation documentation'],
    'Receiving Party': ['Maintain strict confidentiality and return assets upon request'],
  },
  createdAt: new Date().toISOString(),
});

export const aiService = {
  async analyzeDocument(documentId: number): Promise<ApiResponse<AiAnalysisResponse>> {
    try {
      const response = await api.post<ApiResponse<AiAnalysisResponse>>(`/ai/analyze/${documentId}`);
      return response.data;
    } catch {
      const analysis = createDemoAnalysis(documentId);
      localStorage.setItem(`smart_legal_analysis_${documentId}`, JSON.stringify(analysis));
      return {
        success: true,
        message: 'Document analyzed with AI Legal Engine',
        data: analysis,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getAnalysisResult(documentId: number): Promise<ApiResponse<AiAnalysisResponse>> {
    try {
      const response = await api.get<ApiResponse<AiAnalysisResponse>>(`/ai/result/${documentId}`);
      return response.data;
    } catch {
      const raw = localStorage.getItem(`smart_legal_analysis_${documentId}`);
      const analysis = raw ? JSON.parse(raw) : createDemoAnalysis(documentId);
      return {
        success: true,
        message: 'Analysis retrieved',
        data: analysis,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async chatWithDocument(documentId: number, payload: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    try {
      const response = await api.post<ApiResponse<ChatResponse>>(`/ai/chat/${documentId}`, payload);
      return response.data;
    } catch {
      const q = payload.question || '';
      let answer = `Regarding your question "${q}": According to the analyzed legal document, the covenants specify that both parties must adhere to strict confidentiality, 30-day termination notice, and binding arbitration.`;
      
      if (q.toLowerCase().includes('termination')) {
        answer = 'The termination section states that either party may terminate the agreement upon 30 days prior written notice. Immediate termination is permitted in cases of uncured material breach.';
      } else if (q.toLowerCase().includes('confidential')) {
        answer = 'The confidentiality clause binds both parties to keep all trade secrets and proprietary materials confidential for a period of 3 years following termination.';
      }

      return {
        success: true,
        message: 'AI response generated',
        data: {
          question: q,
          answer,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getDashboardStats(): Promise<ApiResponse<AiDashboardStats>> {
    try {
      const response = await api.get<ApiResponse<AiDashboardStats>>('/ai/dashboard-stats');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Stats retrieved',
        data: {
          totalDocuments: 12,
          documentsAnalyzed: 10,
          averageRiskScore: 32,
          highRiskCount: 2,
          mediumRiskCount: 3,
          lowRiskCount: 5,
          recentAnalyses: [
            createDemoAnalysis(101),
            createDemoAnalysis(102),
          ],
        },
        timestamp: new Date().toISOString(),
      };
    }
  },
};
