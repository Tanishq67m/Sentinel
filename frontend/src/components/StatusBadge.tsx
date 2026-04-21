import React from 'react';
import { DeploymentStatus } from '../types';

export function StatusBadge({ status }: { status: DeploymentStatus }) {
  let style: React.CSSProperties = {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: '9999px',
    border: '1px solid',
    whiteSpace: 'nowrap',
    textTransform: 'capitalize'
  };

  switch (status) {
    case 'APPROVED':
      style = { ...style, background: 'var(--green-bg)', color: 'var(--green)', borderColor: 'rgba(52, 211, 153, 0.2)' };
      break;
    case 'REJECTED':
      style = { ...style, background: 'var(--red-bg)', color: 'var(--red)', borderColor: 'rgba(248, 113, 113, 0.2)' };
      break;
    case 'VALIDATING':
      style = { ...style, background: 'var(--purple-bg)', color: 'var(--purple)', borderColor: 'rgba(167, 139, 250, 0.2)' };
      break;
    case 'MANUAL_REVIEW':
      style = { ...style, background: 'var(--yellow-bg)', color: 'var(--yellow)', borderColor: 'rgba(251, 191, 36, 0.2)' };
      break;
    default:
      style = { ...style, background: 'var(--surface-hover)', color: 'var(--text-dim)', borderColor: 'var(--border)' };
      break;
  }

  return <span style={style}>{status.replace('_', ' ').toLowerCase()}</span>;
}
