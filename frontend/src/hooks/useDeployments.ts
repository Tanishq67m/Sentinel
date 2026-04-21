import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { DeploymentRequest } from '../types';

export function useDeployments() {
  const [deployments, setDeployments] = useState<DeploymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeployments = useCallback(async () => {
    try {
      const res = await apiClient.getDeployments();
      if (res.success && res.data) {
        setDeployments(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch deployments:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5000);
    return () => clearInterval(interval);
  }, [fetchDeployments]);

  return { deployments, loading, refresh: fetchDeployments };
}
