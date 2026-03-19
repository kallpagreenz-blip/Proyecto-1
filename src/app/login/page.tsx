'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = (email: string) => {
    const userBuffer = login(email);
    if (userBuffer) {
      if (userBuffer.role === 'agricultor') router.push('/agricultor/dashboard');
      else if (userBuffer.role === 'inversor') router.push('/inversor/dashboard');
      else router.push('/admin/dashboard');
    } else {
      setError('Usuario no encontrado');
    }
  };

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px', borderRadius: '24px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.75rem', fontWeight: 800 }}>Bienvenido</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Selecciona una cuenta para probar</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MOCK_USERS.map(user => (
            <button 
              key={user.id}
              onClick={() => handleLogin(user.email)}
              style={{
                padding: '16px', borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--surface-2)', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--verde-400)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--verde-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                {user.name[0]}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--verde-400)', textTransform: 'uppercase' }}>{user.role}</p>
              </div>
            </button>
          ))}
        </div>

        {error && <p style={{ color: 'red', marginTop: '16px', textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
        
        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>¿No tienes cuenta? <a href="/inversor/registro" style={{ color: 'var(--verde-400)', textDecoration: 'none', fontWeight: 600 }}>Regístrate</a></p>
        </div>
      </div>
    </div>
  );
}
