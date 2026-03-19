'use client';
import { useState, useEffect } from 'react';
import { MOCK_PROJECTS, getLocalProjects, REGIONS, Region, Project } from '@/lib/mock-data';
import ProjectCard from '@/components/ProjectCard';

const STATUS_LABELS: Record<string, string> = {
  all: 'Todos',
  activo: 'Activos',
  buscando: 'Buscando inversión',
  financiado: 'Financiados',
  completado: 'Completados',
};

export default function ProyectosPage() {
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'roi' | 'monto' | 'progreso' | 'fecha'>('fecha');
  const [search, setSearch] = useState('');

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  useEffect(() => {
    setProjects([...getLocalProjects(), ...MOCK_PROJECTS]);
  }, []);

  const filtered = projects
    .filter(p => regionFilter === 'all' || p.region === regionFilter)
    .filter(p => cropFilter === 'all' || p.crop.name === cropFilter)
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.farmerName.toLowerCase().includes(q) ||
        p.crop.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'roi': return b.roiEstimated - a.roiEstimated;
        case 'monto': return b.amountNeeded - a.amountNeeded;
        case 'progreso': return (b.amountRaised / b.amountNeeded) - (a.amountRaised / a.amountNeeded);
        case 'fecha': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, rgba(22,163,74,0.05) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 0 40px'
      }}>
        <div className="container">
          <p style={{ color: 'var(--verde-400)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Plataforma de inversión
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '12px' }}>
            Proyectos disponibles
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.7 }}>
            Explora proyectos agrícolas verificados con análisis financiero completo. 
            Todos incluyen ROI estimado, historia del productor e indicadores de impacto.
          </p>

          {/* Search */}
          <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              className="input"
              style={{ maxWidth: '360px' }}
              placeholder="🔍 Buscar por agricultor, cultivo o región..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Region */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', ...Object.keys(REGIONS)].map(r => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                style={{
                  padding: '7px 14px', borderRadius: '8px', border: '1px solid',
                  borderColor: regionFilter === r ? 'var(--verde-600)' : 'var(--border)',
                  background: regionFilter === r ? 'rgba(22,163,74,0.12)' : 'transparent',
                  color: regionFilter === r ? 'var(--verde-400)' : 'var(--text-muted)',
                  fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {r === 'all' ? '🗺️ Todas las regiones' : REGIONS[r as Region].name}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            className="input"
            style={{ maxWidth: '220px', cursor: 'pointer' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Crop Filter */}
          <select
            className="input"
            style={{ maxWidth: '200px', cursor: 'pointer' }}
            value={cropFilter}
            onChange={e => setCropFilter(e.target.value)}
          >
            <option value="all">🌱 Todos los cultivos</option>
            {Array.from(new Set(projects.map(p => p.crop.name))).sort().map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="input"
            style={{ maxWidth: '200px', cursor: 'pointer' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="fecha">Más recientes</option>
            <option value="roi">Mayor ROI</option>
            <option value="monto">Mayor inversión</option>
            <option value="progreso">Más financiados</option>
          </select>

          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: 'auto' }}>
            {filtered.length} proyecto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🌾</p>
            <p style={{ fontSize: '1.1rem' }}>No se encontraron proyectos con esos filtros.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
