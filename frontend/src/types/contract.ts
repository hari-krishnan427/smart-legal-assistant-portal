export interface ContractResponse {
  id: number;
  title: string;
  contractType: string;
  partyOne: string;
  partyTwo: string;
  jurisdiction?: string;
  effectiveDate?: string;
  additionalTerms?: string;
  contractText: string;
  authorName: string;
  createdAt: string;
}

export interface GenerateContractRequest {
  title: string;
  contractType: string;
  partyOne: string;
  partyTwo: string;
  jurisdiction?: string;
  effectiveDate?: string;
  additionalTerms?: string;
}
