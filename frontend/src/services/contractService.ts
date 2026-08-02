import api from './api';
import type { ApiResponse } from '../types/api';
import type { ContractResponse, GenerateContractRequest } from '../types/contract';

export const contractService = {
  async generateContract(payload: GenerateContractRequest): Promise<ApiResponse<ContractResponse>> {
    const response = await api.post<ApiResponse<ContractResponse>>('/contracts/generate', payload);
    return response.data;
  },

  async getUserContracts(): Promise<ApiResponse<ContractResponse[]>> {
    const response = await api.get<ApiResponse<ContractResponse[]>>('/contracts');
    return response.data;
  },

  async getContractById(id: number): Promise<ApiResponse<ContractResponse>> {
    const response = await api.get<ApiResponse<ContractResponse>>(`/contracts/${id}`);
    return response.data;
  },

  async downloadContract(id: number, filename: string) {
    const response = await api.get(`/contracts/${id}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.txt') ? filename : `${filename}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async deleteContract(id: number): Promise<ApiResponse<string>> {
    const response = await api.delete<ApiResponse<string>>(`/contracts/${id}`);
    return response.data;
  },
};
