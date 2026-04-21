import React, { useState } from 'react';
import { apiClient } from '../api/client';

interface Props {
  onSuccess: () => void;
}

export function DeploymentForm({ onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [environment, setEnvironment] = useState('staging');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const res = await apiClient.submitDeployment({
        title, version_tag: version, environment, requested_by: email, release_notes: notes
      });

      if (!res.success) {
        setError(res.error?.details?.length ? res.error.details.join('\n') : res.error?.message || 'Submission failed');
        return;
      }
      
      setTitle(''); setVersion(''); setEnvironment('staging'); setEmail(''); setNotes('');
      onSuccess();
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle: React.CSSProperties = { marginBottom: '24px' };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: 'var(--text-dim)',
    marginBottom: '8px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <div style={{ padding: '32px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '40px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
        System Payload
      </div>
      
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Service Title</label>
        <input className="stark-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Auth Gateway" />
      </div>
      
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Version Tag</label>
        <input className="stark-input" value={version} onChange={e => setVersion(e.target.value)} placeholder="v1.0.0" />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Target Context</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {(['staging', 'production'] as const).map(env => (
            <div 
              key={env}
              onClick={() => setEnvironment(env)}
              className={environment === env ? 'btn-invert' : 'dashed-panel'}
              style={{
                textAlign: 'center', padding: '12px 0', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.1s'
              }}
            >
              {env}
            </div>
          ))}
        </div>
      </div>
      
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Authorized Operator</label>
        <input className="stark-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@company.com" />
      </div>
      
      <div style={{ ...inputGroupStyle, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label style={labelStyle}>Execution Manifest</label>
        <textarea className="stark-input" style={{ resize: 'vertical', flex: 1, minHeight: '80px' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Awaiting configuration input..." />
      </div>
      
      <button 
        className="btn-invert"
        disabled={loading} 
        onClick={handleSubmit}
        style={{
           width: '100%', marginTop: 'auto', padding: '16px', fontSize: '13px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'center'
        }}
      >
        {loading ? 'Transmitting...' : 'Initiate Sequence'}
      </button>

      {error && (
        <div className="dashed-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid var(--red)', color: 'var(--red)', fontSize: '13px', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
          <div style={{textTransform:'uppercase', fontSize:'11px', fontWeight:'700', marginBottom:'4px'}}>Lockout Imposed</div>
          {error}
        </div>
      )}
    </div>
  );
}
