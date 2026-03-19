'use client';
import Link from 'next/link';
import { Project } from '@/lib/mock-data';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const pct = Math.round((project.amountRaised / project.amountNeeded) * 100);
  const statusLabels: Record<string, { label: string; color: string }> = {
    'activo': { label: 'Activo', color: 'verde' },
    'buscando': { label: 'Buscando inversión', color: 'tierra' },
    'financiado': { label: 'Financiado', color: 'blue' },
    'completado': { label: 'Completado', color: 'muted' },
    'en-revision': { label: 'En revisión', color: 'purple' },
  };
  const status = statusLabels[project.status] || statusLabels['activo'];

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
      {/* Cover Image Section */}
      <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={project.coverImage || '/img/placeholder-crop.jpg'} 
          alt="Vista del campo" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {/* Purchase Order Badge */}
        {project.hasPurchaseOrders && (
          <div style={{ 
            position: 'absolute', top: '12px', right: '12px', 
            background: 'var(--verde-600)', color: 'white', 
            padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', 
            fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            📋 Con Orden de Compra
          </div>
        )}
        <div style={{ 
          position: 'absolute', bottom: '0', left: '0', right: '0', 
          height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' 
        }} />
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header - Human focus */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <img src={project.farmerPhoto} alt={project.farmerName} style={{
            width: '50px', height: '50px', borderRadius: '50%',
            objectFit: 'cover', flexShrink: 0, border: '2px solid var(--verde-400)'
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2, marginBottom: '2px' }} className="truncate">
              {project.farmerName}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              📍 {project.department} · {project.crop.name}
            </p>
          </div>
          <div>
            <span className={`badge badge-${status.color === 'blue' ? 'blue' : status.color === 'verde' ? 'verde' : 'tierra'}`} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
              <span className={`status-dot ${project.status}`} style={{ width: '5px', height: '5px' }} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Financial highlights - Balanced design */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px', background: 'var(--surface-2)', borderRadius: '12px', padding: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--verde-400)' }}>{project.roiEstimated}%</p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROI est.</p>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--tierra-400)' }}>{project.tirEstimated}%</p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIR anual</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{project.returnMonths}m</p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Retorno</p>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              ${project.amountRaised.toLocaleString()} / ${project.amountNeeded.toLocaleString()}
            </span>
            <span style={{ fontWeight: 700, color: pct >= 100 ? 'var(--verde-400)' : 'var(--text-primary)' }}>
              {pct}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: '6px' }}>
            <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        </div>

        {/* Story Snippet - Minimalist */}
        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          fontStyle: 'italic'
        }}>
          "{project.storyShort}"
        </p>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: '8px' }}>
        <Link href={`/proyectos/${project.id}`} style={{ textDecoration: 'none', flex: 1.2 }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
            <span>Ver Proyecto</span>
          </button>
        </Link>
        <Link href={`/inversor/registro?proyecto=${project.id}`} style={{ textDecoration: 'none', flex: 1 }}>
          <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
            Invest
          </button>
        </Link>
      </div>
    </div>
  );
}
