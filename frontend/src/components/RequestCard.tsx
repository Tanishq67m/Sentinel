import React from 'react';
import { DeploymentRequest } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  request: DeploymentRequest;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function RequestCard({ request, isSelected, onSelect }: Props) {
  return (
    <div 
      className="interactive-card"
      style={{
        background: isSelected ? 'var(--text)' : 'transparent',
        color: isSelected ? 'var(--bg)' : 'var(--text)',
      }}
      onClick={() => onSelect(request.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.02em' }}>
          {request.title}
        </div>
        <StatusBadge status={request.status} />
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span className="mute-text" style={{ fontSize: '11px', fontFamily: 'var(--mono)', border: '1px solid var(--border-hi)', padding: '2px 6px', color: isSelected ? '#555' : 'var(--text-mute)' }}>
          {request.version_tag}
        </span>
        <span className="dim-text" style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', color: isSelected ? '#333' : 'var(--text-dim)' }}>
          {request.environment}
        </span>
        <span className="dim-text" style={{ fontSize: '12px', fontWeight: '500', color: isSelected ? '#333' : 'var(--text-dim)' }}>
          {request.requested_by.split('@')[0]}
        </span>
      </div>
    </div>
  );
}
