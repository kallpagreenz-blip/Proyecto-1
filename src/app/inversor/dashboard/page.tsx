'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS, MOCK_INVESTORS, getLocalInvestments } from '@/lib/mock-data';
import ProjectCard from '@/components/ProjectCard';
import { useAuth } from '@/hooks/useAuth';

export default function InversorDashboard() {
  const [activeTab, setActiveTab] = useState<'cartera' | 'explorar' | 'impacto' | 'reuniones'>('cartera');
  const { user } = useAuth();
  
  // 1. Get local investments for THIS user
  const localInvestments = getLocalInvestments(user?.id || '');
  
  // 2. Identify if we should show "Demo" data (if user is one of the mock ones)
  const isMockUser = MOCK_INVESTORS.find(i => i.email === user?.email);
  
  // 3. Derived stats
  let portfolio: any[] = [];
  let totalInvested = 0;
  let familiesSupported = 0;
  let hectaresFinanced = 0;
  let foodGeneratedKg = 0;
  let country = 'Global';
  let badges: string[] = ['Pionero'];

  if (isMockUser) {
    // Show mock data for Elena/Kenji/James
    const investor = isMockUser;
    portfolio = MOCK_PROJECTS.slice(0, investor.projectsCount).map(p => ({
      ...p,
      amountThisUser: Math.round(investor.totalInvested / investor.projectsCount)
    }));
    totalInvested = investor.totalInvested;
    familiesSupported = investor.familiesSupported;
    hectaresFinanced = investor.hectaresFinanced;
    foodGeneratedKg = investor.foodGeneratedKg;
    country = investor.country;
    badges = investor.badges;
  } else {
    // Show REAL local data for new unique accounts
    portfolio = localInvestments.map(inv => {
      const p = MOCK_PROJECTS.find(proj => proj.id === inv.projectId);
      return p ? { ...p, amountThisUser: inv.amount } : null;
    }).filter(Boolean);
    
    totalInvested = localInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    familiesSupported = portfolio.reduce((sum, p) => sum + p.familyMembers, 0);
    hectaresFinanced = portfolio.reduce((sum, p) => sum + p.hectares, 0);
    foodGeneratedKg = hectaresFinanced * 1500; // rough estimate
    country = 'Inversor Registrado';
    if (totalInvested > 0) badges.push('Impacto Real');
  }

  const expectedReturn = Math.round(totalInvested * 0.28);
  
  const MEETINGS = [
    { project: MOCK_PROJECTS[0], date: '2026-03-22', time: '10:00', farmer: MOCK_PROJECTS[0].farmerName, link: 'https://meet.google.com/abc-defg-hij', status: 'confirmada' },
  ];

  const ALL_BADGES = [
    { icon: '🌱', name: 'Pionero', desc: 'Primera inversión realizada', earned: true },
    { icon: '🌾', name: 'Impacto Real', desc: '1+ proyecto financiado', earned: totalInvested > 0 },
    { icon: '🏆', name: 'x3 Proyectos', desc: '3 proyectos financiados', earned: portfolio.length >= 3 },
    { icon: '🌍', name: 'Top Impacto', desc: 'Top 10 inversores por impacto', earned: isMockUser ? true : false },
    { icon: '💎', name: 'x10 Proyectos', desc: '10 proyectos financiados', earned: portfolio.length >= 10 },
    { icon: '🚀', name: 'Champion', desc: '$100K+ invertido en total', earned: totalInvested >= 100000 },
  ];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--capital-700), var(--verde-700))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '3px solid var(--border-light)' }}>
              💼
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '4px' }}>Bienvenido, {user?.name || 'Inversor'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>🌍 {country} · Inversor de impacto activo</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {badges.map(b => (
                <span key={b} className="badge badge-oro">{ALL_BADGES.find(x => x.name === b)?.icon} {b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Key stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total invertido', value: `$${totalInvested.toLocaleString()}`, sub: 'USD', icon: '💰', color: 'var(--verde-400)' },
            { label: 'Retorno esperado', value: `$${expectedReturn.toLocaleString()}`, sub: 'USD este año', icon: '📈', color: 'var(--tierra-400)' },
            { label: 'Proyectos', value: portfolio.length.toString(), sub: 'activos', icon: '🌱', color: '#a78bfa' },
            { label: 'Familias apoyadas', value: familiesSupported.toString(), sub: 'familias', icon: '👨‍👩‍👧‍👦', color: 'var(--oro-400)' },
          ].map(item => (
            <div key={item.label} className="stat-card">
              <p style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{item.icon}</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: item.color }}>{item.value}</p>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>{item.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { key: 'cartera', label: '💼 Mi cartera' },
            { key: 'explorar', label: '🔍 Explorar proyectos' },
            { key: 'impacto', label: '🌍 Mi impacto' },
            { key: 'reuniones', label: '📅 Reuniones' },
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

        {/* TAB: Cartera */}
        {activeTab === 'cartera' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.1rem' }}>
              Proyectos en mi cartera ({portfolio.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {portfolio.map((project: any) => {
                const investedAmount = project.amountThisUser || 0;
                const expectedRet = Math.round(investedAmount * (project.roiEstimated / 100));
                return (
                  <div key={project.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '2rem' }}>{project.crop.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '1rem' }}>{project.farmerName}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>📍 {project.department} · {project.crop.name}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, color: 'var(--verde-400)', fontSize: '1.1rem' }}>${investedAmount.toLocaleString()}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>invertido</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, color: 'var(--tierra-400)', fontSize: '1.1rem' }}>+${expectedRet.toLocaleString()}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>retorno est.</p>
                      </div>
                      <div>
                        <span className={`badge ${project.status === 'activo' ? 'badge-verde' : project.status === 'financiado' ? 'badge-blue' : 'badge-tierra'}`}>
                          <span className={`status-dot ${project.status}`} style={{ width: '6px', height: '6px' }} />
                          {project.status === 'activo' ? 'Activo' : project.status === 'financiado' ? 'Financiado' : 'Completado'}
                        </span>
                      </div>
                      <Link href={`/proyectos/${project.id}`} style={{ textDecoration: 'none' }}>
                        <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 14px' }}>Ver →</button>
                      </Link>
                    </div>
                    <div style={{ marginTop: '14px' }}>
                      <div className="progress-bar" style={{ height: '6px' }}>
                        <div className="progress-fill" style={{ width: `${Math.round((project.amountRaised / project.amountNeeded) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: Explorar */}
        {activeTab === 'explorar' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.1rem' }}>
              Proyectos disponibles para inversión
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {MOCK_PROJECTS.filter(p => p.status === 'buscando' || p.status === 'activo').map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {/* TAB: Impacto */}
        {activeTab === 'impacto' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Impact summary */}
            <div className="card" style={{ padding: '28px', gridColumn: 'span 1' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🌍 Tu impacto global</h3>
              {[
                { icon: '👨‍👩‍👧‍👦', label: 'Familias apoyadas', value: familiesSupported.toString() },
                { icon: '🌾', label: 'Hectáreas financiadas', value: `${hectaresFinanced} Ha` },
                { icon: '🥗', label: 'Alimento generado (est.)', value: `${(foodGeneratedKg / 1000).toFixed(0)} toneladas` },
                { icon: '🌱', label: 'CO₂ capturado (est.)', value: `${(hectaresFinanced * 2.5).toFixed(1)} ton/año` },
                { icon: '💼', label: 'Empleos rurales generados', value: `${Math.ceil(familiesSupported * 1.5)} personas` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.icon} {item.label}</span>
                  <span style={{ fontWeight: 800, color: 'var(--verde-400)', fontSize: '1rem' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🏅 Mis insignias</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {ALL_BADGES.map((b: any) => (
                  <div key={b.name} style={{
                    textAlign: 'center', padding: '14px', borderRadius: '10px',
                    background: b.earned ? 'rgba(245,158,11,0.08)' : 'var(--surface-2)',
                    border: `1px solid ${b.earned ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                    opacity: b.earned ? 1 : 0.5
                  }}>
                    <p style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{b.icon}</p>
                    <p style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '4px' }}>{b.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: 1.4 }}>{b.desc}</p>
                    {!b.earned && <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '4px' }}>🔒 Bloqueado</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Reuniones */}
        {activeTab === 'reuniones' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Reuniones agendadas</h3>
            {MEETINGS.map((m, i) => (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '2rem' }}>{m.project.crop.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700 }}>{m.farmer}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.project.crop.name} · {m.project.department}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--verde-400)' }}>📅 {m.date}</span>
                      <span style={{ color: 'var(--verde-400)' }}>🕐 {m.time} Lima</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span className="badge badge-verde">✓ Confirmada</span>
                    <a href={m.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        <span>🎥 Unirse a Meet</span>
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
