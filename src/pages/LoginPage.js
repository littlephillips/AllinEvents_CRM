import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { C } from '../utils/helpers';
import { Card, Input, Btn } from '../components/UI';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${C.navy} 0%, #2a3d24 50%, #1a2f15 100%)`,
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', background: 'rgba(255,210,63,0.04)',
        top: -100, right: -100, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', background: 'rgba(40,103,240,0.06)',
        bottom: -50, left: -50, pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 70, height: 70, borderRadius: 18,
            background: C.yellow,
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 900, color: C.navy,
            boxShadow: '0 8px 24px rgba(255,210,63,0.35)',
          }}>A</div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
            All-in Events
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', margin: '6px 0 0', fontSize: 14 }}>
            CRM Admin Portal
          </p>
        </div>

        {/* Form card */}
        <Card style={{ padding: 36 }}>
          <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: C.text }}>
            Sign in to your account
          </h2>

          {error && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              color: '#991b1b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@allinevents.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div style={{ marginTop: 8 }}>
              <Btn type="submit" color="yellow" size="lg" disabled={loading}>
                {loading ? '⏳ Signing in...' : '🔑 Sign In'}
              </Btn>
            </div>
          </form>
        </Card>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 20 }}>
          Secured by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
