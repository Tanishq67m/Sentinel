import { ApiResponse, CreateDeploymentPayload, DeploymentRequest } from '../types';

export const apiClient = {
  getDeployments: async (): Promise<ApiResponse<DeploymentRequest[]>> => {
    const res = await fetch('/api/deployments');
    return res.json();
  },

  getDeployment: async (id: string): Promise<ApiResponse<DeploymentRequest>> => {
    const res = await fetch(`/api/deployments/${id}`);
    return res.json();
  },

  submitDeployment: async (payload: CreateDeploymentPayload): Promise<ApiResponse<DeploymentRequest>> => {
    const res = await fetch('/api/deployments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
};
