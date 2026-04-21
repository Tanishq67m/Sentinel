import { ApiResponse, CreateDeploymentPayload, DeploymentRequest } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = {
  getDeployments: async (): Promise<ApiResponse<DeploymentRequest[]>> => {
    const res = await fetch(`${API_BASE}/api/deployments`);
    return res.json();
  },

  getDeployment: async (id: string): Promise<ApiResponse<DeploymentRequest>> => {
    const res = await fetch(`${API_BASE}/api/deployments/${id}`);
    return res.json();
  },

  submitDeployment: async (payload: CreateDeploymentPayload): Promise<ApiResponse<DeploymentRequest>> => {
    const res = await fetch(`${API_BASE}/api/deployments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
};
