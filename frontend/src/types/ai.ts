export interface KeyClause {
  name: string;
  status: string;
  excerpt: string;
  analysis: string;
}

export interface AiAnalysisResponse {
  id: number;
  documentId: number;
  documentTitle: string;
  summary: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyClauses: KeyClause[];
  missingClauses: string[];
  potentialRisks: string[];
  recommendations: string[];
  importantDates: string[];
  partiesInvolved: string[];
  partyObligations: Record<string, string[]>;
  createdAt: string;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  timestamp: string;
}

export interface AiDashboardStats {
  totalDocuments: number;
  documentsAnalyzed: number;
  averageRiskScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  recentAnalyses: AiAnalysisResponse[];
}
