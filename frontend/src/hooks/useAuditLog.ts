import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { DeploymentRequest } from '../types';

export function useAuditLog(requestId: string | null) {
  const [deployment, setDeployment] = useState<DeploymentRequest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId) {
      setDeployment(null);
      return;
    }

    let isMounted = true;
    const fetchAudit = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getDeployment(requestId);
        if (res.success && res.data && isMounted) {
          setDeployment(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch deployment audit log:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAudit();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  return { deployment, loading };
}
