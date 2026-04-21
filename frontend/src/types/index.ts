export type DeploymentStatus = 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'PENDING';
export type Environment = 'staging' | 'production';

export interface AuditLog {
  id: string;
  request_id: string;
  old_status: DeploymentStatus | 'NONE';
  new_status: DeploymentStatus;
  reason: string;
  actor: string;
  timestamp: string;
}

export interface DeploymentRequest {
  id: string;
  title: string;
  environment: Environment | string;
  release_notes: string;
  requested_by: string;
  version_tag: string;
  status: DeploymentStatus;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  audit_log?: AuditLog[];
}

export interface CreateDeploymentPayload {
  title: string;
  version_tag: string;
  environment: string;
  requested_by: string;
  release_notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    details: string[];
  } | null;
}
