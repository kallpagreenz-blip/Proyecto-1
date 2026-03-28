'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS, getLocalProjects, Project, generateMeetingLink, recordInvestment } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowLeft, MapPin, TrendingUp, Calendar, Users, 
  ShieldCheck, CheckCircle2, Info, Target, Sparkles,
  Camera, Briefcase, DollarSign, PieChart as PieIcon,
  BarChart as BarChartIcon, Leaf
} from 'lucide-react';

export default function ProjectDetail({ params }: { params: any }) {
  const unwrappedParams = React.use(params) as { id: string };
  const id = unwrappedParams.id;
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = [...getLocalProjects(), ...MOCK_PROJECTS];
    let found = all.find(p => p.id === id);
    
    if (!found) {
      const temp = localStorage.getItem('temp_project');
      if (temp) {
        const parsed = JSON.parse(temp);
        if (id === 'temp-123' || id === parsed.id) {
          found = {
            id: 'temp-123',
            farmerId: 'temp',
            farmerName: parsed.name || 'Productor',
            farmerAge: 42,
            farmerYearsExperience: 15,
            province: 'Central',
            department: parsed.region === 'costa' ? 'Ica' : parsed.region === 'sierra' ? 'Junín' : 'San Martín',
            region: parsed.region,
            crop: { 
              name: parsed.cropName || 'Cultivo', 
              emoji: '🌱',
              image: '', yieldMin: 0, yieldMax: 0, yieldSqm: 0, priceFarm: 0, priceWholesale: 0, priceInt: 0, durationMonths: 0, costs: [] 
            } as any,
            hectares: parsed.hectares,
            amountNeeded: 5000 * parsed.hectares,
            amountRaised: 0,
            investorsCount: 0,
            roiEstimated: 18,
            tirEstimated: 22,
            vanEstimated: 1500,
            incomeGross: 12000,
            operatingCosts: 7500,
            netProfit: 4500,
            story: parsed.story || 'Mi historia agrícola...',
            status: 'buscando',
            tags: ['Emergente', 'Nacional'],
            familyMembers: 4,
            returnMonths: 8,
            farmerPhoto: 'https://images.unsplash.com/photo-1595033048555-23eede91d8ac?q=80&w=200&auto=format&fit=crop',
            socialImpact: { families: 4, hectares: parsed.hectares },
            hasPurchaseOrders: true,
            roadmap: [
              { stage: 'Preparación de Suelo', status: 'pending' },
              { stage: 'Siembra Directa', status: 'pending' },
              { stage: 'Abonado Etapa 1', status: 'pending' },
              { stage: 'Control de Plagas', status: 'pending' },
              { stage: 'Floración', status: 'pending' },
              { stage: 'Formación de Fruto', status: 'pending' },
              { stage: 'Pre-Cosecha', status: 'pending' },
              { stage: 'Cosecha Selectiva', status: 'pending' },
              { stage: 'Post-Cosecha y Venta', status: 'pending' },
            ]
          } as any;
        }
      }
    }
    
    setProject(found || null);
    setLoading(false);
  }, [id]);

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Cargando...</div>;
  if (!project) return notFound();

  const pct = Math.round((project.amountRaised / project.amountNeeded) * 100) || 0;
  const remaining = Math.max(0, project.amountNeeded - project.amountRaised);

  return <ProjectDetailClient project={project} pct={pct} remaining={remaining} />;
}

function ProjectDetailClient({ project, pct, remaining }: any) {
  const router = useRouter();
  const { user } = useAuth();
  const [investing, setInvesting] = useState(false);
  const [investAmount, setInvestAmount] = useState(1000);
  const [investSuccess, setInvestSuccess] = useState(false);

  const investmentData = [
    { name: 'Insumos', value: project.amountNeeded * 0.45, fill: 'var(--verde-400)' },
    { name: 'Mano de Obra', value: project.amountNeeded * 0.35, fill: 'var(--tierra-400)' },
    { name: 'Tecnología', value: project.amountNeeded * 0.20, fill: '#3b82f6' },
  ];

  const ROADMAP = [
    { title: 'Proyecto publicado', icon: '🚀', status: 'done' },
    { title: 'Inversión recibida', icon: '💰', status: 'pending' },
    { title: 'Plan de negocio finalizado', icon: '📝', status: 'pending' },
    { title: 'Insumos adquiridos', icon: '📦', status: 'pending' },
    { title: 'Asesor técnico asignado', icon: '👨‍🔬', status: 'pending' },
    { title: 'Seguimiento en curso', icon: '📈', status: 'pending' },
    { title: 'Cosecha proyectada', icon: '🌾', status: 'pending' },
    { title: 'Comprador conectado', icon: '🤝', status: 'pending' },
    { title: 'Proyecto completado', icon: '🏆', status: 'pending' },
  ];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Hero Header */}
      <div className="project-hero" style={{ position: 'relative', height: '450px', background: '#0a1612', overflow: 'hidden' }}>
        <img src={project.coverImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200'} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--background))' }} />
        <div className="container" style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '100%', padding: '0 24px' }}>
          <Link href="/proyectos" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
            <ArrowLeft size={20} /> <span className="hide-mobile">Volver a proyectos</span>
          </Link>
          <div className="hero-flex" style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <img className="farmer-img" src={project.farmerPhoto} style={{ width: '140px', height: '140px', borderRadius: '32px', border: '4px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', objectFit: 'cover' }} />
            <div style={{ color: 'white' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="badge badge-verde">AGRO-VERIFICADO</span>
                {project.hasPurchaseOrders && <span className="badge badge-purple" style={{ background: '#7c3aed' }}>CON ORDEN DE COMPRA</span>}
              </div>
              <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '8px' }}>{project.farmerName}</h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} /> {project.department} · {project.crop.emoji} {project.crop.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '48px', paddingBottom: '100px' }}>
        <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '48px' }}>
          
          {/* Main Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Story Card */}
            <div className="card" style={{ padding: '48px', borderRadius: '32px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Sparkles color="var(--verde-500)" /> El Proyecto en Detalle
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
                {project.story}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '24px', textAlign: 'center' }}>
                  <Users size={32} color="var(--verde-500)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{project.familyMembers}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Familiares</p>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '24px', textAlign: 'center' }}>
                  <Target size={32} color="var(--verde-500)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{project.hectares} Ha</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Extensión</p>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '24px', textAlign: 'center' }}>
                  <Calendar size={32} color="var(--verde-500)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{project.returnMonths} m</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Plazo</p>
                </div>
              </div>
            </div>

            {/* FINANCIALS PANEL */}
            <div className="card" style={{ padding: '48px', borderRadius: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>📊 Análisis Financiero</h2>
                <span style={{ padding: '8px 20px', background: 'rgba(34,197,94,0.1)', color: 'var(--verde-600)', borderRadius: '99px', fontWeight: 800, fontSize: '0.9rem' }}>
                  SCORE: A+
                </span>
              </div>

              <div className="financial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--verde-500)' }}>{project.roiEstimated}%</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ROI (Retorno s/Capital)</p>
                    </div>
                    <TrendingUp size={24} color="var(--verde-500)" />
                  </div>
                  <div style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--tierra-600)' }}>{project.tirEstimated}%</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TIR (Tasa Interna Anual)</p>
                    </div>
                    <BarChartIcon size={24} color="var(--tierra-600)" />
                  </div>
                  <div style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>S/. {project.netProfit.toLocaleString()}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Utilidad Neta Proyectada</p>
                    </div>
                    <DollarSign size={24} />
                  </div>
                </div>

                <div className="chart-container" style={{ background: 'var(--surface-2)', padding: '32px', borderRadius: '32px' }}>
                   <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase' }}>Inversión Requerida</h3>
                   <div style={{ height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={investmentData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {investmentData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                   </div>
                </div>
              </div>

              {/* Cost Structure Table */}
              <div style={{ marginTop: '40px', border: '1px solid var(--border)', borderRadius: '24px', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 800 }}>Rubro de Inversión</th>
                      <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 800 }}>Monto (USD)</th>
                    </tr>
                  </thead>
                   <tbody>
                    {[
                      { item: 'Semillas y Almácigos', amount: project.amountNeeded * 0.2 },
                      { item: 'Fertilizantes y Abonos', amount: project.amountNeeded * 0.25 },
                      { item: 'Preparación de Terreno', amount: project.amountNeeded * 0.15 },
                      { item: 'Mano de Obra (Campaña)', amount: project.amountNeeded * 0.3 },
                      { item: 'Seguimiento Técnico', amount: project.amountNeeded * 0.1 },
                    ].map(row => (
                      <tr key={row.item} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '16px 24px', fontSize: '1rem' }}>{row.item}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 800 }}>$ {row.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'rgba(34,197,94,0.02)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 800 }}>TOTAL META</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 900 }}>$ {project.amountNeeded.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROADMAP / SEQUENCE */}
            <div className="card" style={{ padding: '48px', borderRadius: '32px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px' }}>📍 Hoja de Ruta del Proyecto</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {ROADMAP.map((step: any, idx) => (
                  <div key={idx} style={{ 
                    padding: '24px', borderRadius: '24px', border: `2px solid ${idx === 0 ? 'var(--verde-500)' : 'var(--border)'}`,
                    background: idx === 0 ? 'rgba(34, 197, 94, 0.05)' : 'var(--surface-2)',
                    textAlign: 'center', opacity: idx === 0 || idx === 1 ? 1 : 0.6
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{step.icon}</div>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.2 }}>{step.title}</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '8px', color: idx === 0 ? 'var(--verde-600)' : 'var(--text-muted)' }}>
                      {idx === 0 ? '✅ Completado' : '⏳ Pendiente'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '32px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Financia este proyecto</p>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--verde-500)' }}>$ {project.amountRaised.toLocaleString()}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ $ {project.amountNeeded.toLocaleString()}</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 700 }}>
                    <span>{pct}% Financiado</span>
                    <span>{project.investorsCount} Inversores</span>
                   </div>
                   <div style={{ height: '14px', borderRadius: '7px', background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--verde-500), var(--verde-300))' }} />
                   </div>
                </div>
              </div>

              {!investSuccess ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                   <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>TU INVERSIÓN (USD)</label>
                    <input type="number" className="input" defaultValue={1000} style={{ fontSize: '1.4rem', fontWeight: 900 }} />
                   </div>
                   <button 
                    onClick={() => { setInvesting(true); setTimeout(() => setInvestSuccess(true), 2000); }}
                    className="btn-primary" 
                    style={{ padding: '20px', borderRadius: '20px', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900 }}
                  >
                    {investing ? 'Procesando...' : '💰 Invertir Ahora'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIR Estimada: {project.tirEstimated}%</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(34,197,94,0.1)', padding: '24px', borderRadius: '20px', textAlign: 'center', border: '2px solid var(--verde-500)' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</p>
                  <h4 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--verde-700)' }}>¡Inversión Iniciada!</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Te redirigiremos a tu dashboard para el seguimiento.</p>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '32px', borderRadius: '32px', background: 'var(--surface-2)' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>Respaldo AgroCapital</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <ShieldCheck color="var(--verde-500)" size={24} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contrato Digital Firmado</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Leaf color="var(--verde-500)" size={24} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Insumos Verificados</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <CheckCircle2 color="var(--verde-500)" size={24} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Seguro Agrario Incluido</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .project-hero { height: auto !important; padding-top: 40px; padding-bottom: 40px; }
          .project-hero .container { position: relative !important; bottom: 0 !important; left: 0 !important; transform: none !important; }
          .hero-flex { gap: 20px !important; }
          .farmer-img { width: 100px !important; height: 100px !important; border-radius: 20px !important; }
          .hero-title { fontSize: 2.2rem !important; }
          .project-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .financial-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
