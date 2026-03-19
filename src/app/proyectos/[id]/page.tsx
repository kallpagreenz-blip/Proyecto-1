'use client';
import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS, generateMeetingLink, recordInvestment } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const project = MOCK_PROJECTS.find(p => p.id === id);

  console.log('Project detail routing debug:', { id, projectFound: !!project });

  if (!project) return notFound();

  const pct = Math.round((project.amountRaised / project.amountNeeded) * 100);
  const remaining = project.amountNeeded - project.amountRaised;

  return <ProjectDetailClient project={project} pct={pct} remaining={remaining} />;
}

function ProjectDetailClient({ project, pct, remaining }: any) {
  const router = useRouter();
  const { user } = useAuth();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingBooked, setMeetingBooked] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  const [investing, setInvesting] = useState(false);
  const [investAmount, setInvestAmount] = useState(1000);
  const [investSuccess, setInvestSuccess] = useState(false);

  const handleInvest = () => {
    if (!user || user.role !== 'inversor') {
      router.push(`/inversor/registro?proyecto=${project.id}`);
      return;
    }
    setInvesting(true);
    setTimeout(() => {
      recordInvestment(user.id, project.id, investAmount);
      setInvesting(false);
      setInvestSuccess(true);
      // Auto-redirect to dashboard after success
      setTimeout(() => router.push('/inversor/dashboard'), 2000);
    }, 1500);
  };

  const handleBookMeeting = () => {
    if (!meetingDate || !meetingTime) return;
    const link = generateMeetingLink();
    setMeetingLink(link);
    setMeetingBooked(true);
  };

  const investmentData = [
    { name: 'Semillas/Insumos', value: project.amountNeeded * 0.35, fill: 'var(--verde-400)' },
    { name: 'Mano de Obra', value: project.amountNeeded * 0.40, fill: 'var(--tierra-400)' },
    { name: 'Logística/Tecnología', value: project.amountNeeded * 0.25, fill: '#3b82f6' },
  ];

  const financialTable = [
    { label: 'VAN (Valor Actual Neto)', value: `$${project.vanEstimated.toLocaleString()} USD`, desc: 'Valor del proyecto a hoy' },
    { label: 'TIR (Tasa Interna Retorno)', value: `${project.tirEstimated}%`, desc: 'Rentabilidad anual esperada' },
    { label: 'ROI (Retorno Inversión)', value: `${project.roiEstimated}%`, desc: 'Ganancia sobre lo invertido' },
    { label: 'Plazo Estimado', value: `${project.returnMonths} meses`, desc: 'Tiempo de retorno de capital' },
  ];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '400px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={project.coverImage || '/img/placeholder-crop.jpg'} 
          alt="Portada del proyecto" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))',
          display: 'flex', alignItems: 'flex-end', paddingBottom: '60px'
        }}>
          <div className="container">
            <Link href="/proyectos" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '20px', display: 'inline-block', opacity: 0.8 }}>
              ← Volver a proyectos
            </Link>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <img src={project.farmerPhoto} alt={project.farmerName} style={{
                width: '120px', height: '120px', borderRadius: '50%',
                objectFit: 'cover', border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }} />
              <div style={{ color: 'white' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {project.farmerName}
                </h1>
                <div style={{ display: 'flex', gap: '16px', fontSize: '1.1rem', opacity: 0.9 }}>
                  <span>📍 {project.province}, {project.department}</span>
                  <span>🌿 {project.crop.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '48px', paddingBottom: '100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '48px', alignItems: 'start' }}>
          {/* LEFT COLUMN */}
          <div>
            {/* Project Overview */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              {project.tags.map((tag: string) => (
                <span key={tag} className="badge badge-verde" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>{tag}</span>
              ))}
              {project.hasPurchaseOrders && (
                <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'var(--verde-600)', color: 'white' }}>
                  📋 Orden de Compra Confirmada
                </span>
              )}
            </div>

            {/* Story Section */}
            <div className="card" style={{ padding: '40px', marginBottom: '32px', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                📖 Nuestra Historia
              </h2>
              <div style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                {project.story.split('\n\n').map((para: string, i: number) => (
                  <p key={i} style={{ marginBottom: '20px' }}>{para}</p>
                ))}
              </div>
            </div>

            {/* Purchase Orders Section */}
            {project.hasPurchaseOrders && (
              <div className="card" style={{ padding: '32px', marginBottom: '32px', border: '2px solid var(--verde-400)', background: 'rgba(22,163,74,0.03)' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>📜</div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--verde-400)', marginBottom: '4px' }}>
                      Venta Asegurada
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                      Este proyecto ya cuenta con una <strong>Orden de Compra en firme</strong> por el 80% de la producción estimada, 
                      lo que reduce significativamente el riesgo comercial para el inversor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Dashboard */}
            <div className="card" style={{ padding: '40px', marginBottom: '32px', borderRadius: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '32px' }}>📊 Análisis Económico-Financiero</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '48px' }}>
                {/* Indicators Table */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-muted)' }}>Métricas Clave</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {financialTable.map(item => (
                      <div key={item.label} style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--verde-400)' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Distribution Chart */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-muted)' }}>Destino de Fondos</h3>
                  <div style={{ height: '240px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={investmentData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {investmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Profitability Projection Chart */}
              <div style={{ padding: '24px', background: 'var(--surface-2)', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>Proyección de Flujo de Caja (S/.)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Costos Op.', value: project.operatingCosts, fill: '#ef4444' },
                      { name: 'Utilidad Neta', value: project.netProfit, fill: '#22c55e' },
                      { name: 'Ingreso Bruto', value: project.incomeGross, fill: '#3b82f6' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `S/.${v/1000}k`} />
                      <Tooltip 
                        contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* NEW: Backing Stepper Section */}
            <div className="card" style={{ 
              padding: '40px', marginBottom: '32px', borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(245,158,11,0.03) 100%)',
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ fontSize: '1.8rem' }}>🛡️</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Respaldo AgroCapital</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px', position: 'relative' }}>
                {[
                  { icon: '📋', title: 'Plan Validado', desc: 'Evaluación de viabilidad y plan de inversión definido.' },
                  { icon: '🌾', title: 'Insumos Certificados', desc: 'Proveedores verificados de semillas e insumos.' },
                  { icon: '👨‍🌾', title: 'Asesoría Activa', desc: 'Especialista acompaña todo el ciclo productivo.' },
                  { icon: '🤝', title: 'Conexión Comercial', desc: 'Facilitamos compradores para maximizar ventas.' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      width: '44px', height: '44px', borderRadius: '50%', background: 'white', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '2px solid var(--verde-400)'
                    }}>
                      {step.icon}
                    </div>
                    <div style={{ paddingRight: '8px' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{step.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
                {/* Connecting Line (Dashed) */}
                <div style={{ 
                  position: 'absolute', top: '22px', left: '22px', right: '22px', height: '2px', 
                  borderTop: '2px dashed var(--verde-200)', zIndex: 0, opacity: 0.5 
                }} className="hide-mobile" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Sidebar */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Funding Card */}
            <div className="card" style={{ padding: '32px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Financiamiento Actual</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--verde-400)' }}>
                    ${project.amountRaised.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    / ${project.amountNeeded.toLocaleString()}
                  </span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{pct}% Recaudado</span>
                    <span style={{ color: 'var(--text-muted)' }}>{project.investorsCount} inversores</span>
                  </div>
                  <div className="progress-bar" style={{ height: '12px', borderRadius: '6px' }}>
                    <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, borderRadius: '6px' }} />
                  </div>
                </div>
              </div>

              {!investSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {user?.role === 'inversor' && (
                    <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: '12px', marginBottom: '8px' }}>
                      <label className="label" style={{ marginBottom: '8px', fontSize: '0.8rem' }}>Monto a invertir (USD)</label>
                      <input 
                        type="number" className="input" step="500" min="500"
                        value={investAmount} onChange={e => setInvestAmount(Number(e.target.value))}
                        style={{ fontSize: '1.2rem', fontWeight: 700 }}
                      />
                    </div>
                  )}
                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '1.1rem', borderRadius: '16px' }}
                    onClick={handleInvest}
                    disabled={investing}
                  >
                    <span>{investing ? '⏳ Procesando...' : user?.role === 'inversor' ? '🎯 Confirmar Inversión' : '🚀 Invertir Ahora'}</span>
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '16px' }}
                    onClick={() => setShowMeetingModal(true)}
                  >
                    📅 Agendar con el Agricultor
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(22,163,74,0.1)', borderRadius: '16px', border: '1px solid var(--verde-400)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '10px' }}>🎉</p>
                  <h4 style={{ fontWeight: 700, color: 'var(--verde-400)', marginBottom: '4px' }}>¡Inversión exitosa!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Agregando ${investAmount.toLocaleString()} a tu cartera...</p>
                </div>
              )}
            </div>

            {/* Impact sidebar */}
            <div className="card" style={{ padding: '28px', borderRadius: '24px', background: 'var(--surface-2)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Tu Impacto Social</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>👨‍👩‍👧‍👦</span>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700 }}>FAMILIA DE {project.familyMembers} PERSONAS</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Impacto directo en calidad de vida</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌾</span>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700 }}>{project.hectares} HA SOSTENIBLES</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Promoviendo agricultura responsable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Modal reuse */}
      {showMeetingModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowMeetingModal(false); }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '40px', position: 'relative', borderRadius: '32px' }}>
            <button
              onClick={() => setShowMeetingModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}
            >✕</button>

            {!meetingBooked ? (
              <>
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '12px' }}>📅 Conecta con el Campo</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.6 }}>
                  Programa una videollamada de 15 min con <strong>{project.farmerName}</strong> para resolver tus dudas técnicas o comerciales.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="label" style={{ fontWeight: 600 }}>Selecciona una Fecha</label>
                    <input type="date" className="input" value={meetingDate} onChange={e => setMeetingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="label" style={{ fontWeight: 600 }}>Horario Disponible</label>
                    <select className="input" value={meetingTime} onChange={e => setMeetingTime(e.target.value)}>
                      <option value="">Selecciona un bloque horario</option>
                      {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                        <option key={t} value={t}>{t} (Hora de Lima)</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn-primary" style={{ padding: '16px', justifyContent: 'center', borderRadius: '16px' }} onClick={handleBookMeeting}>
                    <span>✅ Enviar Solicitud</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🌱</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '12px' }}>¡Cita Confirmada!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.6 }}>
                  Hemos enviado una invitación a tu correo para el {meetingDate} a las {meetingTime}.
                </p>
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px', fontWeight: 600 }}>GOOGLE MEET LINK:</p>
                  <a href={meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--verde-400)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
                    🔗 Unirse a la Reunión
                  </a>
                </div>
                <button className="btn-primary" style={{ padding: '12px 32px', justifyContent: 'center', borderRadius: '16px' }} onClick={() => setShowMeetingModal(false)}>
                  <span>Cerrar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
