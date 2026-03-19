'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS, PLATFORM_STATS } from '@/lib/mock-data';

function useCountUp(target: number, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t: number;
    const step = (timestamp: number) => {
      if (!t) t = timestamp;
      const prog = Math.min((timestamp - t) / 2000, 1);
      setCount(Math.round((1 - Math.pow(1 - prog, 3)) * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, start]);
  return count;
}

export default function ImpactoPage() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const familias = useCountUp(PLATFORM_STATS.familiesImpacted, visible);
  const fondos = useCountUp(380000, visible);
  const proyectos = useCountUp(MOCK_PROJECTS.length, visible);
  const toneladas = useCountUp(1250, visible);

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, rgba(22,163,74,0.06) 100%)',
        borderBottom: '1px solid var(--border)', padding: '72px 0 60px', textAlign: 'center'
      }}>
        <div className="container">
          <span className="badge badge-verde" style={{ marginBottom: '20px' }}>🌍 Impacto real y medible</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '20px' }}>
            Cada sol invertido<br /><span className="text-gradient-verde">alimenta al mundo</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
            AgroCapital no es solo inversión financiera — es una apuesta por un futuro donde el campo peruano 
            es próspero, sostenible y conectado con los mercados globales que lo merecen.
          </p>
        </div>
      </div>

      {/* Impact counters */}
      <div ref={ref} className="section" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              { value: familias, label: 'Familias rurales impactadas', icon: '👨‍👩‍👧‍👦', color: 'var(--verde-400)' },
              { value: proyectos, label: 'Proyectos agrícolas activos', icon: '🌱', color: 'var(--tierra-400)' },
              { value: `$${(fondos / 1000).toFixed(0)}K`, label: 'USD canalizados al campo', icon: '💰', color: '#60a5fa', isString: true },
              { value: `${toneladas.toLocaleString()}`, label: 'Toneladas de alimento generado', icon: '🥗', color: 'var(--oro-400)', isString: true },
            ].map((item, i) => (
              <div key={i} className="stat-card">
                <p style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: item.color, lineHeight: 1 }}>
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '6px' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SDG section */}
      <div className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>
              Impacto alineado con los ODS
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              Nuestros proyectos contribuyen directamente a los Objetivos de Desarrollo Sostenible de la ONU.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { ods: 'ODS 1', title: 'Fin de la pobreza', desc: 'Financiamiento productivo para agricultores rurales sin acceso al sistema bancario formal.', icon: '🏡', color: '#eb1c2d' },
              { ods: 'ODS 2', title: 'Hambre cero', desc: 'Mejora de la producción agrícola y acceso a mercados de valor, aumentando la seguridad alimentaria regional.', icon: '🌾', color: '#dda63a' },
              { ods: 'ODS 8', title: 'Trabajo digno', desc: 'Creación y formalización de empleos rurales con tecnología y asesoría técnica especializada.', icon: '💼', color: '#a21942' },
              { ods: 'ODS 10', title: 'Reducción de desigualdades', desc: 'Democratización del acceso al capital, quebrando el ciclo de exclusión del pequeño agricultor.', icon: '⚖️', color: '#dd1367' },
              { ods: 'ODS 13', title: 'Acción climática', desc: 'Fomento de prácticas agrícolas sostenibles y cultivos con menor huella de carbono.', icon: '🌱', color: '#3f7e44' },
              { ods: 'ODS 17', title: 'Alianzas globales', desc: 'Conexión del agricultor peruano con inversores internacionales comprometidos con ESG.', icon: '🌍', color: '#19486a' },
            ].map(item => (
              <div key={item.ods} className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, background: item.color, color: 'white', padding: '2px 8px', borderRadius: '4px' }}>{item.ods}</span>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>{item.title}</p>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stories section */}
      <div className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '40px', textAlign: 'center' }}>
            Historias que mueven al mundo
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {MOCK_PROJECTS.slice(0, 4).map(p => (
              <div key={p.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '2.5rem' }}>{p.crop.emoji}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.farmerName}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {p.department} · {p.hectares} Ha</p>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '14px' }}>
                  &ldquo;{p.storyShort}&rdquo;
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--verde-400)', fontWeight: 600 }}>ROI {p.roiEstimated}%</span>
                  <Link href={`/proyectos/${p.id}`} style={{ color: 'var(--verde-400)', textDecoration: 'none', fontWeight: 600 }}>Ver proyecto →</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/proyectos" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <span>🌱 Ver todos los proyectos</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
