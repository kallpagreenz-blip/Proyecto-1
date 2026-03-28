'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
        <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.75rem', fontWeight: 800 }}>Acceso a AgroCapital</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Selecciona tu camino o usa un perfil de prueba</p>
        
        {/* Primary entry points */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <Link href="/agricultor/evaluacion" style={{ flex: 1, textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '16px 8px', fontSize: '0.85rem', flexDirection: 'column', gap: '8px', height: 'auto' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍🌾</span>
              <span style={{ fontWeight: 800 }}>Soy Agricultor: <br/>Evaluar Proyecto</span>
            </button>
          </Link>
          <Link href="/inversor/registro" style={{ flex: 1, textDecoration: 'none' }}>
            <button className="btn-outline" style={{ width: '100%', padding: '16px 8px', fontSize: '0.85rem', flexDirection: 'column', gap: '8px', height: 'auto', border: '2px solid var(--verde-500)', color: 'var(--verde-400)' }}>
              <span style={{ fontSize: '1.5rem' }}>💼</span>
              <span style={{ fontWeight: 800 }}>Soy Inversor: <br/>Empezar a Invertir</span>
            </button>
          </Link>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border)', zIndex: 0 }} />
          <span style={{ position: 'relative', background: 'var(--surface)', padding: '0 12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>O usa un perfil demo</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Iniciar como Agricultor', role: 'agricultor', color: 'var(--verde-600)', icon: '👨‍🌾', email: 'feliciano@campo.com' },
            { label: 'Iniciar como Inversor', role: 'inversor', color: 'var(--tierra-600)', icon: '💼', email: 'elena@inversion.com' },
            { label: 'Iniciar como Admin', role: 'admin', color: 'var(--verde-800)', icon: '⚙️', email: 'admin@agrocapital.pe' },
          ].map(btn => (
            <button 
              key={btn.role}
              onClick={() => handleLogin(btn.email)}
              style={{
                padding: '20px', borderRadius: '16px', border: '1px solid var(--border)',
                background: 'var(--surface-2)', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s',
                width: '100%'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = btn.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: btn.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {btn.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '2px' }}>{btn.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo: Acceso inmediato {btn.role}</p>
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
