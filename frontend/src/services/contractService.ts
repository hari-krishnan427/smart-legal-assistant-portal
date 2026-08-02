import api from './api';
import type { ApiResponse } from '../types/api';
import type { ContractResponse, GenerateContractRequest } from '../types/contract';

const generateContractText = (req: GenerateContractRequest): string => {
  return `================================================================================
                               ${req.title.toUpperCase()}
================================================================================

This ${req.contractType} ("Agreement") is executed and made effective as of ${req.effectiveDate || new Date().toISOString().split('T')[0]}, 
by and between:

PARTIES:
1. ${req.partyOne} ("First Party / Disclosing Party")
2. ${req.partyTwo} ("Second Party / Receiving Party")

RECITALS:
WHEREAS, the parties desire to enter into a binding relationship governed by the legal covenants, definitions, and representations set forth below;

NOW, THEREFORE, in consideration of mutual promises and covenants, the parties agree as follows:

1. DEFINITIONS & SCOPE OF ENGAGEMENT
   1.1 "Confidential Information" shall include all proprietary materials, trade secrets, business strategies, technical specifications, customer data, and source code disclosed by either Party.
   1.2 Scope: Party B agrees to provide professional legal services and deliverables to Party A in strict compliance with applicable statutory codes.

2. OBLIGATIONS & SPECIAL COVENANTS
   2.1 ${req.additionalTerms || 'Both parties covenant to act in good faith and maintain standard duty of care.'}
   2.2 Non-Disclosure: The Receiving Party agrees to hold all Confidential Information in strict confidence and shall not disclose it to any third party without express written consent.

3. TERM & TERMINATION
   3.1 Term: This Agreement commences on ${req.effectiveDate || new Date().toISOString().split('T')[0]} and remains in full force until terminated.
   3.2 Termination for Convenience: Either Party may terminate this Agreement by delivering thirty (30) days advance written notice.

4. GOVERNING LAW & JURISDICTION
   This Agreement shall be governed by, construed, and enforced in accordance with the laws of ${req.jurisdiction || 'Courts of Competent Jurisdiction'}.

IN WITNESS WHEREOF, the Parties have executed this ${req.title} as of the Effective Date.

--------------------------------------------------------------------------------
FIRST PARTY: ${req.partyOne}
By: ___________________________
Title: Authorized Signatory
Date: ${req.effectiveDate || new Date().toISOString().split('T')[0]}

--------------------------------------------------------------------------------
SECOND PARTY: ${req.partyTwo}
By: ___________________________
Title: Authorized Signatory
Date: ${req.effectiveDate || new Date().toISOString().split('T')[0]}
================================================================================`;
};

const getStoredContracts = (): ContractResponse[] => {
  const raw = localStorage.getItem('smart_legal_contracts');
  return raw ? JSON.parse(raw) : [];
};

export const contractService = {
  async generateContract(payload: GenerateContractRequest): Promise<ApiResponse<ContractResponse>> {
    try {
      const response = await api.post<ApiResponse<ContractResponse>>('/contracts/generate', payload);
      return response.data;
    } catch {
      const text = generateContractText(payload);
      const newContract: ContractResponse = {
        id: Date.now(),
        title: payload.title,
        contractType: payload.contractType,
        partyOne: payload.partyOne,
        partyTwo: payload.partyTwo,
        jurisdiction: payload.jurisdiction || 'Jurisdiction of Competent Courts',
        effectiveDate: payload.effectiveDate || new Date().toISOString().split('T')[0],
        additionalTerms: payload.additionalTerms || '',
        contractText: text,
        authorName: 'Hari Krishnan',
        createdAt: new Date().toISOString(),
      };
      const contracts = getStoredContracts();
      contracts.unshift(newContract);
      localStorage.setItem('smart_legal_contracts', JSON.stringify(contracts));
      return {
        success: true,
        message: 'Contract generated successfully',
        data: newContract,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getUserContracts(): Promise<ApiResponse<ContractResponse[]>> {
    try {
      const response = await api.get<ApiResponse<ContractResponse[]>>('/contracts');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Contracts retrieved',
        data: getStoredContracts(),
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getContractById(id: number): Promise<ApiResponse<ContractResponse>> {
    try {
      const response = await api.get<ApiResponse<ContractResponse>>(`/contracts/${id}`);
      return response.data;
    } catch {
      const contracts = getStoredContracts();
      const match = contracts.find(c => c.id === id) || contracts[0];
      return {
        success: true,
        message: 'Contract retrieved',
        data: match,
        timestamp: new Date().toISOString(),
      };
    }
  },

  async downloadContract(id: number, filename: string) {
    try {
      const response = await api.get(`/contracts/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.endsWith('.txt') ? filename : `${filename}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      const contracts = getStoredContracts();
      const match = contracts.find(c => c.id === id);
      const text = match ? match.contractText : `Sample legal contract text for ${filename}`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.endsWith('.txt') ? filename : `${filename}.txt`);
      document.body.appendChild(link);
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  },

  async deleteContract(id: number): Promise<ApiResponse<string>> {
    try {
      const response = await api.delete<ApiResponse<string>>(`/contracts/${id}`);
      return response.data;
    } catch {
      let contracts = getStoredContracts();
      contracts = contracts.filter(c => c.id !== id);
      localStorage.setItem('smart_legal_contracts', JSON.stringify(contracts));
      return {
        success: true,
        message: 'Contract deleted',
        data: 'Contract deleted',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
