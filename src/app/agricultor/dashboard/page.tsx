'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';

export default function AgricultorDashboard() {
  const [activeTab, setActiveTab] = useState<'proyecto' | 'mensajes' | 'visitas'>('proyecto');
  const { user } = useAuth();
  
  // Find project owned by this user, or fallback to first one for demo if no user/project
  const userProject = MOCK_PROJECTS.find(p => p.farmerId === user?.id) || MOCK_PROJECTS[0];
  const project = userProject;
  const pct = Math.round((project.amountRaised / project.amountNeeded) * 100);

  const MESSAGES = [
    { from: 'Equipo AgroCapital', time: '2h', msg: 'Tu proyecto fue aprobado y ahora es visible públicamente. ¡Felicitaciones!', type: 'admin' },
    { from: 'Elena R. (Inversora, España)', time: '5h', msg: 'Hola, leí tu historia y me pareció muy interesante tu proyecto de papa nativa. ¿Podríamos agendar una reunión esta semana?', type: 'investor' },
    { from: 'James C. (Inversor, EE.UU.)', time: '1d', msg: 'Excelente perfil. ¿Tienes certificación orgánica o está en proceso?', type: 'investor' },
  ];

  const TIMELINE_STAGES = [
    { id: 1, title: 'Proyecto publicado', status: 'completado', date: '10 Mar' },
    { id: 2, title: 'Inversión recibida', status: 'completado', date: '14 Mar' },
    { id: 3, title: 'Plan de negocio finalizado', status: 'completado', date: '16 Mar' },
    { id: 4, title: 'Insumos adquiridos', status: 'en-curso', date: 'Hoy' },
    { id: 5, title: 'Asesor técnico asignado', status: 'pendiente', date: 'Próximamente', advisor: { name: 'Ing. Carlos Ruiz', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop', phone: '+51987654321' } },
    { id: 6, title: 'Seguimiento en curso', status: 'pendiente', sub: 'Semana 1 de 16' },
    { id: 7, title: 'Cosecha proyectada', status: 'pendiente', date: 'Jul 2026' },
    { id: 8, title: 'Comprador conectado', status: 'pendiente' },
    { id: 9, title: 'Proyecto completado ✓', status: 'pendiente' },
  ];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--verde-700), var(--capital-600))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid var(--border-light)' }}>
              {user?.photo ? <img src={user.photo} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : '👨‍🌾'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '4px' }}>Bienvenido, {user?.name || 'Agricultor'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>🌾 {project.crop.name} · {project.department}, {project.province} · {project.hectares} Ha</p>
            </div>
            <div>
              <span className="badge badge-verde" style={{ padding: '8px 16px' }}>
                <span className="status-dot activo" />
                Proyecto activo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Financiamiento', value: `${pct}%`, sub: `$${project.amountRaised.toLocaleString()} de $${project.amountNeeded.toLocaleString()}`, icon: '💰', color: 'var(--verde-400)' },
            { label: 'Inversores', value: project.investorsCount.toString(), sub: 'interesados', icon: '💼', color: 'var(--tierra-400)' },
            { label: 'Visitas a tu perfil', value: '47', sub: 'últimos 7 días', icon: '👁️', color: '#a78bfa' },
            { label: 'Mensajes', value: '3', sub: 'sin leer', icon: '💬', color: 'var(--oro-400)' },
          ].map(item => (
            <div key={item.label} className="stat-card">
              <p style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{item.icon}</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.value}</p>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>{item.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontWeight: 700 }}>Estado de financiamiento</h3>
            <span style={{ fontWeight: 700, color: 'var(--verde-400)', fontSize: '1.1rem' }}>{pct}%</span>
          </div>
          <div className="progress-bar" style={{ height: '12px', marginBottom: '10px' }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>$5,780 financiados</span>
            <span>Meta: $8,500 USD</span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <Link href={`/proyectos/${project.id}`} style={{ textDecoration: 'none' }}>
              <button className="btn-outline" style={{ fontSize: '0.85rem' }}>Ver mi proyecto público →</button>
            </Link>
          </div>
        </div>

        {/* PROGRESS TIMELINE SECTION */}
        <div className="card" style={{ padding: '32px', marginBottom: '36px', background: 'linear-gradient(to bottom right, var(--surface), rgba(22,163,74,0.02))' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🚀</span> Tu ruta de crecimiento
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {TIMELINE_STAGES.map((stage, i) => {
              const isLast = i === TIMELINE_STAGES.length - 1;
              const isCompleted = stage.status === 'completado';
              const isInProgress = stage.status === 'en-curso';
              
              return (
                <div key={stage.id} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                  {/* Connector line */}
                  {!isLast && (
                    <div style={{ 
                      position: 'absolute', left: '15px', top: '30px', bottom: '-10px', width: '2px', 
                      background: isCompleted ? 'var(--verde-400)' : 'var(--border)', 
                      zIndex: 0, opacity: isCompleted ? 1 : 0.5 
                    }} />
                  )}
                  
                  {/* Icon/Dot */}
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, zIndex: 1,
                    background: isCompleted ? 'var(--verde-500)' : isInProgress ? 'white' : 'var(--background)',
                    border: `2px solid ${isCompleted ? 'var(--verde-400)' : isInProgress ? 'var(--verde-400)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isInProgress ? '0 0 15px rgba(34,197,94,0.3)' : 'none'
                  }}>
                    {isCompleted ? (
                      <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800 }}>✓</span>
                    ) : (
                      <div style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        background: isInProgress ? 'var(--verde-500)' : 'var(--text-muted)',
                        animation: isInProgress ? 'pulse 2s infinite' : 'none'
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: isLast ? 0 : '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h4 style={{ 
                        fontWeight: isCompleted || isInProgress ? 700 : 500, 
                        color: isCompleted ? 'var(--text-primary)' : isInProgress ? 'var(--verde-600)' : 'var(--text-muted)',
                        fontSize: '1.05rem' 
                      }}>
                        {stage.title}
                      </h4>
                      {stage.date && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stage.date}</span>
                      )}
                    </div>
                    {stage.sub && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stage.sub}</p>
                    )}

                    {/* Technical Advisor Expansion (Step 5 example) */}
                    {stage.id === 5 && (
                      <div className="animate-fade-in" style={{ 
                        marginTop: '16px', background: 'var(--surface-2)', borderRadius: '16px', 
                        padding: '16px', display: 'flex', gap: '16px', alignItems: 'center',
                        border: '1px solid var(--border)'
                      }}>
                        <img src={stage.advisor?.photo} alt={stage.advisor?.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stage.advisor?.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Asesor Técnico Asignado</p>
                        </div>
                        <a href={`https://wa.me/${stage.advisor?.phone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <button className="btn-primary" style={{ padding: '8px 16px', gap: '8px', background: '#25D366' }}>
                            <span style={{ fontSize: '1.2rem' }}>💬</span> Contactar
                          </button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <style>{`
            @keyframes pulse {
              0% { transform: scale(0.95); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.7; }
              100% { transform: scale(0.95); opacity: 1; }
            }
          `}</style>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '1px' }}>
          {(['proyecto', 'mensajes', 'visitas'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab ? 'var(--verde-400)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--verde-500)' : 'transparent'}`,
              textTransform: 'capitalize', fontSize: '0.9rem', transition: 'all 0.2s'
            }}>
              {tab === 'proyecto' ? '📋 Mi proyecto' : tab === 'mensajes' ? `💬 Mensajes (3)` : '📊 Visitas'}
            </button>
          ))}
        </div>

        {activeTab === 'proyecto' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Story */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📖 Mi historia (IA generada)</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '16px' }}>
                {project.story.split('\n\n')[0]}...
              </p>
              <button className="btn-ghost" style={{ fontSize: '0.85rem' }}>✏️ Editar historia</button>
            </div>
            {/* Financials */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📊 Indicadores del proyecto</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'ROI Estimado', value: `${project.roiEstimated}%`, color: 'var(--verde-400)' },
                  { label: 'TIR Anual', value: `${project.tirEstimated}%`, color: 'var(--tierra-400)' },
                  { label: 'VAN', value: `$${project.vanEstimated.toLocaleString()}`, color: 'var(--text-primary)' },
                  { label: 'Ingreso bruto est.', value: `S/. ${project.incomeGross.toLocaleString()}` },
                  { label: 'Utilidad neta est.', value: `S/. ${project.netProfit.toLocaleString()}` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color || 'var(--text-primary)', fontSize: '0.9rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mensajes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {MESSAGES.map((msg, i) => (
              <div key={i} className="card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: msg.type === 'admin' ? 'var(--verde-800)' : 'var(--surface-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>
                  {msg.type === 'admin' ? '🌱' : '💼'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.from}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Hace {msg.time}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{msg.msg}</p>
                  <div style={{ marginTop: '10px' }}>
                    <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>Responder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'visitas' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>📊 Historial de visitas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { day: 'Hoy', visits: 8, from: 'España, EE.UU., Perú' },
                { day: 'Ayer', visits: 12, from: 'Japón, Alemania, España' },
                { day: 'Hace 2 días', visits: 6, from: 'Colombia, Chile, España' },
                { day: 'Hace 3 días', visits: 9, from: 'EE.UU., Francia, Perú' },
                { day: 'Hace 4 días', visits: 4, from: 'Suiza, Reino Unido' },
                { day: 'Hace 5 días', visits: 8, from: 'Japón, EE.UU., España' },
              ].map((item, i) => (
                <div key={i} className="table-row" style={{ gridTemplateColumns: '120px 60px 1fr', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.day}</span>
                  <span style={{ fontWeight: 700, color: 'var(--verde-400)' }}>{item.visits}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>desde {item.from}</span>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
              * Solo se muestra origen del país, sin datos personales de los visitantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
