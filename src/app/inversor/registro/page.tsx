'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';

function InversorRegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('proyecto');
  const linkedProject = MOCK_PROJECTS.find(p => p.id === projectId);

  const [form, setForm] = useState({ name: '', email: '', country: '', linkedin: '', phone: '', password: '' });
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const { register } = useAuth();
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Create a unique user object
      const newUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name: form.name,
        email: form.email,
        role: 'inversor' as const
      };
      
      // Save and Login via custom register function
      register(newUser);
      
      setStep(2);
    }, 1500);
  };

  const COUNTRIES = ['España', 'Estados Unidos', 'Japón', 'Alemania', 'Perú', 'Colombia', 'Chile', 'Argentina', 'México', 'Reino Unido', 'Francia', 'Suiza', 'Canadá', 'Australia', 'Brasil', 'Otro'];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ padding: '60px 24px', display: 'flex', gap: '60px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Left: Context */}
        <div style={{ maxWidth: '400px' }}>
          <div className="badge badge-verde" style={{ marginBottom: '20px' }}>💼 Portal de Inversores</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '16px' }}>
            Invierte con<br />
            <span className="text-gradient-terre">propósito y retorno</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '28px' }}>
            Accede a proyectos agrícolas verificados en Perú con retornos del 14–38% anual 
            e impacto medible en familias rurales.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '📊', text: 'Análisis financiero completo (ROI, TIR, VAN)' },
              { icon: '🌾', text: 'Historias de impacto verificadas por IA' },
              { icon: '📅', text: 'Reunión directa con el agricultor' },
              { icon: '🌍', text: 'Impacto ESG medible y reportado' },
            ].map(item => (
              <div key={item.icon} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
          {linkedProject && (
            <div className="card" style={{ marginTop: '28px', padding: '18px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}>Registrándote para invertir en:</p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.8rem' }}>{linkedProject.crop.emoji}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{linkedProject.farmerName}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{linkedProject.crop.name} · ROI {linkedProject.roiEstimated}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {step === 1 ? (
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px' }}>Crear cuenta de inversor</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="label">Nombre completo *</label>
                  <input className="input" placeholder="Tu nombre completo" value={form.name} onChange={e => updateForm('name', e.target.value)} />
                </div>
                <div>
                  <label className="label">Correo electrónico *</label>
                  <input className="input" type="email" placeholder="tu@correo.com" value={form.email} onChange={e => updateForm('email', e.target.value)} />
                </div>
                <div>
                  <label className="label">País *</label>
                  <select className="input" value={form.country} onChange={e => updateForm('country', e.target.value)}>
                    <option value="">Selecciona tu país</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">LinkedIn (opcional)</label>
                  <input className="input" placeholder="linkedin.com/in/tu-perfil" value={form.linkedin} onChange={e => updateForm('linkedin', e.target.value)} />
                </div>
                <div>
                  <label className="label">Celular *</label>
                  <input className="input" placeholder="+1 999 000 000" value={form.phone} onChange={e => updateForm('phone', e.target.value)} />
                </div>
                <div>
                  <label className="label">Contraseña *</label>
                  <input className="input" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => updateForm('password', e.target.value)} />
                </div>
                <button className="btn-primary" style={{ padding: '14px', justifyContent: 'center', marginTop: '8px' }}
                  disabled={!form.name || !form.email || !form.country || !form.phone || form.password.length < 8 || loading}
                  onClick={handleSubmit}>
                  <span>{loading ? '⏳ Creando cuenta...' : '✅ Crear cuenta gratuita'}</span>
                </button>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Al registrarte aceptas nuestros{' '}
                  <a href="#" style={{ color: 'var(--verde-400)' }}>términos de uso</a> y{' '}
                  <a href="#" style={{ color: 'var(--verde-400)' }}>política de privacidad</a>.
                </p>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '12px' }}>
                ¡Bienvenido, {form.name.split(' ')[0]}!
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '28px' }}>
                Tu cuenta de inversor fue creada. Revisa tu email ({form.email}) para confirmación.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn-primary" style={{ padding: '14px', justifyContent: 'center' }} onClick={() => router.push('/inversor/dashboard')}>
                  <span>💼 Ir a mi dashboard</span>
                </button>
                <Link href="/proyectos" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    🌱 Ver proyectos
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InversorRegistro() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>}>
      <InversorRegistroContent />
    </Suspense>
  );
}
