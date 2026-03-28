'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS, MOCK_INVESTORS, PLATFORM_STATS, Project, getLocalProjects } from '@/lib/mock-data';

type KanbanColumn = 'buscando' | 'en-revision' | 'activo' | 'financiado' | 'completado';
const COLUMNS: { key: KanbanColumn; label: string; color: string }[] = [
  { key: 'buscando', label: 'Buscando', color: 'var(--tierra-400)' },
  { key: 'en-revision', label: 'En revisión', color: '#a78bfa' },
  { key: 'activo', label: 'Activo', color: 'var(--verde-400)' },
  { key: 'financiado', label: 'Financiado', color: '#60a5fa' },
  { key: 'completado', label: 'Completado', color: 'var(--text-muted)' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'proyectos' | 'usuarios' | 'kpis'>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  useEffect(() => {
    setProjects([...getLocalProjects(), ...MOCK_PROJECTS]);
  }, []);

  const projectsByStatus: Record<KanbanColumn, Project[]> = {
    buscando: projects.filter(p => p.status === 'buscando'),
    'en-revision': projects.filter(p => p.status === 'en-revision'),
    activo: projects.filter(p => p.status === 'activo'),
    financiado: projects.filter(p => p.status === 'financiado'),
    completado: projects.filter(p => p.status === 'completado'),
  };

  const totalRaised = projects.reduce((acc, p) => acc + p.amountRaised, 0);
  const totalGoal = projects.reduce((acc, p) => acc + p.amountNeeded, 0);
  const conversionRate = Math.round((projects.filter(p => p.status === 'financiado').length / projects.length) * 100) || 0;

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '4px' }}>🌱 Panel Admin — AgroCapital</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Vista interna del equipo AgroCapital</p>
            </div>
            <span className="badge badge-verde">Admin access</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Quick KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {[
            { label: 'Proyectos total', value: projects.length.toString(), icon: '🌱', color: 'var(--verde-400)' },
            { label: 'Inversores', value: MOCK_INVESTORS.length.toString(), icon: '💼', color: 'var(--tierra-400)' },
            { label: 'Fondos recaudados', value: `$${Math.round(totalRaised / 1000)}K`, icon: '💰', color: '#60a5fa' },
            { label: 'Meta total', value: `$${Math.round(totalGoal / 1000)}K`, icon: '🎯', color: 'var(--texto-muted)', sub: 'USD' },
            { label: 'Financiados (%)', value: `${conversionRate}%`, icon: '✅', color: 'var(--verde-400)' },
          ].map(item => (
            <div key={item.label} className="stat-card" style={{ padding: '18px' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{item.icon}</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: item.color }}>{item.value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
          {[
            { key: 'kanban', label: '📋 Kanban' },
            { key: 'proyectos', label: '📊 Proyectos' },
            { key: 'usuarios', label: '👥 Usuarios' },
            { key: 'kpis', label: '📈 KPIs' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
              padding: '10px 18px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--verde-400)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab.key ? 'var(--verde-500)' : 'transparent'}`,
              fontSize: '0.875rem', transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* KANBAN */}
        {activeTab === 'kanban' && (
          <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))', gap: '16px', minWidth: '900px' }}>
              {COLUMNS.map(col => (
                <div key={col.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: col.color }}>{col.label}</span>
                    <span style={{ marginLeft: 'auto', background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '99px' }}>
                      {projectsByStatus[col.key].length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projectsByStatus[col.key].map(p => (
                      <div key={p.id} className="kanban-card" onClick={() => setSelectedProject(p)}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{ fontSize: '1.4rem' }}>{p.crop.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3 }}>{p.farmerName}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>{p.crop.name} · {p.department}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span>${p.amountRaised.toLocaleString()} / ${p.amountNeeded.toLocaleString()}</span>
                          <span style={{ color: 'var(--verde-400)', fontWeight: 600 }}>ROI {p.roiEstimated}%</span>
                        </div>
                        <div className="progress-bar" style={{ marginTop: '8px', height: '4px' }}>
                          <div className="progress-fill" style={{ width: `${Math.min(Math.round((p.amountRaised / p.amountNeeded) * 100), 100)}%` }} />
                        </div>
                      </div>
                    ))}
                    {projectsByStatus[col.key].length === 0 && (
                      <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border)', borderRadius: '10px' }}>
                        Sin proyectos
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROYECTOS TABLE */}
        {activeTab === 'proyectos' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 100px 180px 140px', padding: '12px 20px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', gap: '12px' }}>
              {['Agricultor', 'Cultivo', 'Inversión', 'Plan Negocio', 'ROI', 'Estado / Alertas', 'Acciones'].map(h => (
                <span key={h} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {projects.map(p => {
              const planProgress = p.status === 'financiado' ? 85 : p.status === 'activo' ? 40 : 10;
              const isDelayed = p.status === 'activo' && p.amountRaised < p.amountNeeded * 0.5;

              return (
                <div key={p.id} className="table-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 100px 180px 140px', gap: '12px', background: isDelayed ? 'rgba(239, 68, 68, 0.02)' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.farmerName}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.department} · {p.hectares} Ha</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem' }}>{p.crop.emoji} {p.crop.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>${p.amountRaised.toLocaleString()}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>meta ${p.amountNeeded.toLocaleString()}</p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Avance</span>
                      <span>{planProgress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: '6px' }}>
                      <div className="progress-fill" style={{ width: `${planProgress}%`, background: planProgress > 70 ? 'var(--verde-500)' : 'var(--oro-500)' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--verde-400)' }}>{p.roiEstimated}%</span>
                  <div>
                    <span className={`badge ${p.status === 'activo' ? 'badge-verde' : p.status === 'buscando' ? 'badge-tierra' : p.status === 'financiado' ? 'badge-blue' : 'badge-verde'}`} style={{ fontSize: '0.7rem', width: 'fit-content', marginBottom: '4px' }}>
                      {p.status}
                    </span>
                    {isDelayed && (
                      <div style={{ color: '#ef4444', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                         ⚠️ Alerta: Desviación
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button className="btn-primary" style={{ padding: '6px', fontSize: '0.7rem', background: isDelayed ? '#ef4444' : 'var(--verde-600)', width: '100%' }}>
                      {isDelayed ? 'Acción Correctiva' : 'Seguimiento'}
                    </button>
                    <button className="btn-ghost" style={{ padding: '4px', fontSize: '0.7rem', width: '100%' }} onClick={() => setSelectedProject(p)}>Detalles</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* USUARIOS */}
        {activeTab === 'usuarios' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>👨‍🌾 Agricultores registrados ({MOCK_PROJECTS.length})</h3>
              <div className="card" style={{ overflow: 'hidden' }}>
                {MOCK_PROJECTS.map(p => (
                  <div key={p.id} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.4rem' }}>{p.crop.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.farmerName}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.department}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{p.crop.name}</span>
                    <span style={{ fontSize: '0.875rem' }}>{p.hectares} Ha</span>
                    <span className={`badge ${p.status === 'activo' ? 'badge-verde' : 'badge-tierra'}`} style={{ width: 'fit-content', fontSize: '0.7rem' }}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>💼 Inversores registrados ({MOCK_INVESTORS.length})</h3>
              <div className="card" style={{ overflow: 'hidden' }}>
                {MOCK_INVESTORS.map(inv => (
                  <div key={inv.id} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{inv.email}</p>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>🌍 {inv.country}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--verde-400)' }}>${inv.totalInvested.toLocaleString()}</span>
                    <span style={{ fontSize: '0.875rem' }}>{inv.projectsCount} proyectos</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        {activeTab === 'kpis' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>📈 KPIs de la plataforma — MVP Fase 1</h3>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                    {['KPI', 'Meta Mes 3', 'Meta Mes 6', 'Actual (simulado)', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kpi: 'Proyectos agrícolas publicados', m3: '30', m6: '100', actual: MOCK_PROJECTS.length.toString(), ok: true },
                    { kpi: 'Inversores registrados', m3: '15', m6: '60', actual: '23', ok: true },
                    { kpi: 'Inversiones cerradas', m3: '5', m6: '25', actual: '1', ok: false },
                    { kpi: 'Monto total invertido (USD)', m3: '$25,000', m6: '$150,000', actual: '$55,000', ok: true },
                    { kpi: 'Tasa conversión (visita→inversión)', m3: '8%', m6: '12%', actual: '6.5%', ok: false },
                    { kpi: 'NPS inversor', m3: '>40', m6: '>60', actual: '47', ok: true },
                    { kpi: 'NPS agricultor', m3: '>50', m6: '>70', actual: '58', ok: true },
                    { kpi: 'Reuniones agendadas / proyecto', m3: '1.5 prom.', m6: '2.5 prom.', actual: '1.8', ok: true },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{row.kpi}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{row.m3}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{row.m6}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{row.actual}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${row.ok ? 'badge-verde' : 'badge-tierra'}`}>
                          {row.ok ? '✅ On track' : '⚠️ Below target'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Project detail modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setSelectedProject(null); }}>
          <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '32px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedProject(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>{selectedProject.farmerName}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
              {selectedProject.crop.emoji} {selectedProject.crop.name} · {selectedProject.department} · {selectedProject.hectares} Ha
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
                <span>Mover a Activo</span>
              </button>
              <Link href={`/proyectos/${selectedProject.id}`} style={{ textDecoration: 'none' }}>
                <button className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.875rem' }}>Ver proyecto →</button>
              </Link>
            </div>
            <div>
              <label className="label" style={{ marginBottom: '8px' }}>📝 Nota interna (solo equipo)</label>
              <textarea className="input" rows={4} style={{ resize: 'vertical' }} placeholder="Agregar nota interna sobre este proyecto..." />
              <button className="btn-ghost" style={{ marginTop: '10px', fontSize: '0.85rem' }}>Guardar nota</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
