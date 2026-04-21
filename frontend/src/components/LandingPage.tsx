import React from 'react';

export function LandingPage({ onDashboardLaunch }: { onDashboardLaunch: () => void }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 40px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
      
      {/* Hero Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <h1 style={{ fontSize: '80px', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1', textTransform: 'uppercase' }}>
          Deployment<br />Governance.
        </h1>
        <p className="dim-text" style={{ fontSize: '20px', lineHeight: '1.6', maxWidth: '700px', fontWeight: '400', color: 'var(--text-dim)' }}>
          Sentinel is an automated gatekeeper. It evaluates software releases against strict corporate policies before they are allowed to reach production. 
        </p>
        <div style={{ marginTop: '24px' }}>
          <button 
            className="btn-invert"
            onClick={onDashboardLaunch}
            style={{ 
              padding: '16px 32px', 
              fontWeight: '600', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              fontSize: '15px', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}
          >
            Launch Console
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      </div>

      {/* Why We Need It */}
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Why is this needed?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-dim)' }}>
              In fast-moving software companies, engineers push code dozens of times a day. But humans make mistakes. Someone might deploy an untested "draft" version to production, use a personal email address, or forget to write release notes. 
            </p>
          </div>
          <div>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-dim)' }}>
              If bad code reaches production, servers crash and users get angry. Sentinel sits right in the middle as an absolute barrier. It acts as an automated, emotionless "Brain" that reads the deployment details and enforces the rules before anything actually happens.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works (The Flow) */}
      <div style={{ borderTop: '1px dashed var(--border-hi)', paddingTop: '80px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>The Core Workflow</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--border)', border: '1px solid var(--border)' }}>
          
          <div style={{ background: 'var(--bg)', padding: '40px', display: 'flex', gap: '32px' }}>
            <div style={{ fontSize: '64px', fontWeight: '800', lineHeight: '0.8', color: 'var(--border-hi)', fontFamily: 'var(--mono)' }}>01</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>The Submission</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: '1.6', maxWidth: '600px' }}>
                A developer fills out the request form in the UI. They provide specific details: The name of the service, the environment (Staging vs Production), the version tag, and their execution manifest (Release notes).
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', padding: '40px', display: 'flex', gap: '32px' }}>
            <div style={{ fontSize: '64px', fontWeight: '800', lineHeight: '0.8', color: 'var(--border-hi)', fontFamily: 'var(--mono)' }}>02</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>The Policy Engine (The Brain)</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: '1.6', maxWidth: '600px' }}>
                The backend receives the data and runs it through a gauntlet of strict business rules:<br/><br/>
                <strong style={{color:'var(--text)'}}>• Rule 1:</strong> Is it an authorized corporate email? (No @gmail.com).<br/>
                <strong style={{color:'var(--text)'}}>• Rule 2:</strong> Are the release notes longer than 20 characters?<br/>
                <strong style={{color:'var(--text)'}}>• Rule 3:</strong> Is this going to Production? If so, flag it for Manual Review.
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', padding: '40px', display: 'flex', gap: '32px' }}>
            <div style={{ fontSize: '64px', fontWeight: '800', lineHeight: '0.8', color: 'var(--border-hi)', fontFamily: 'var(--mono)' }}>03</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>The Final Verdict</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: '1.6', maxWidth: '600px' }}>
                The request is definitively categorized into one of three strict states: <strong style={{color:'var(--green)'}}>APPROVED</strong>, <strong style={{color:'var(--yellow)'}}>MANUAL_REVIEW</strong>, or <strong style={{color:'var(--red)'}}>REJECTED</strong>. Every single decision is permanently burned into the database for telemetry tracking.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* The Bettr Evaluation Proof */}
      <div style={{ borderTop: '1px dashed var(--border-hi)', paddingTop: '80px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Engineering Architecture</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--bg)', padding: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--border-hi)' }}>01_</span> Interface Safety
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: '1.6' }}>
              Payloads are guarded by strict backend Python schemas (Pydantic). Invalid data blocks are rejected natively before touching the engine, preventing silent server crashes.
            </p>
          </div>

          <div style={{ background: 'var(--bg)', padding: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--border-hi)' }}>02_</span> State Machine
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: '1.6' }}>
              A rigorous deterministic lifecycle. Nodes are locked across transitions to prevent race conditions or untracked state mutations in the system.
            </p>
          </div>

          <div style={{ background: 'var(--bg)', padding: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--border-hi)' }}>03_</span> Telemetry Trail
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: '1.6' }}>
              Every granular transition made by the Policy Engine builds an indisputable permanent database footprint. Exact violation rules are cleanly exposed to the UI.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
