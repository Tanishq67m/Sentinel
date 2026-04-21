import React, { useState, useEffect } from 'react';
import { useDeployments } from './hooks/useDeployments';
import { DeploymentForm } from './components/DeploymentForm';
import { RequestCard } from './components/RequestCard';
import { AuditPanel } from './components/AuditPanel';
import { LandingPage } from './components/LandingPage';

const SentinelShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6V11C3 16.5 6.8 21.4 12 23C17.2 21.4 21 16.5 21 11V6L12 2Z" stroke="var(--text)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 2L12 23" stroke="var(--text)" strokeWidth="2"/>
  </svg>
);

export default function App() {
  const { deployments, refresh } = useDeployments();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Custom History Router
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (currentPath === '/' || currentPath === '') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="noise-overlay" />
        <header style={{ padding: '32px 40px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SentinelShield />
            <span style={{ fontWeight: '800', letterSpacing: '-0.02em', fontSize: '18px', textTransform: 'uppercase' }}>Sentinel</span>
          </div>
        </header>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <LandingPage onDashboardLaunch={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  // Dashboard Layout
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 360px) minmax(360px, 420px) 1fr', gridTemplateRows: '64px 1fr', height: '100vh', overflow: 'hidden' }}>
      <div className="noise-overlay" />
      <header style={{ gridColumn: '1 / -1', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px', padding: '0 24px', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <SentinelShield />
          <span style={{ fontWeight: '800', letterSpacing: '-0.02em', fontSize: '16px', color: 'var(--text)', textTransform: 'uppercase' }}>Sentinel</span>
        </div>
        <div style={{ width: '1px', height: '16px', background: 'var(--border-hi)' }}></div>
        <span style={{ fontSize: '12px', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '500' }}>Policy Engine Console</span>
      </header>

      {/* Col 1: Form */}
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
        <DeploymentForm onSuccess={refresh} />
      </div>

      {/* Col 2: Feed */}
      <div style={{ overflowY: 'auto', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0' }}>
          <div style={{ padding: '24px', fontSize: '11px', fontWeight: '700', color: 'var(--text-mute)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Execution Feed</div>
          
          {deployments.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-mute)', fontSize: '13px', marginTop: '60px' }}>
              No operations logged.
            </div>
          ) : (
            deployments.map((r) => (
              <RequestCard 
                key={r.id} 
                request={r} 
                isSelected={selectedId === r.id} 
                onSelect={setSelectedId} 
              />
            ))
          )}
        </div>
      </div>

      {/* Col 3: Audit Detail */}
      <div style={{ overflowY: 'auto' }}>
        <AuditPanel requestId={selectedId} />
      </div>
      
    </div>
  );
}
