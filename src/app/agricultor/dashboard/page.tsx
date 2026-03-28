'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS, getLocalProjects, Project } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Sprout, LayoutDashboard, LogOut, TrendingUp, 
  ShieldCheck, CheckCircle2, Award, Zap, MessageSquare, 
  Sparkles, Eye, Users, Bell, ChevronRight, MapPin, 
  Camera, Upload, X, Info, Target
} from 'lucide-react';

export default function AgricultorDashboard() {
  const [activeTab, setActiveTab] = useState<'proyecto' | 'mensajes' | 'visitas'>('proyecto');
  const { user, logout } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<any>(null);
  
  useEffect(() => {
    const allProjects = [...getLocalProjects(), ...MOCK_PROJECTS];
    const userProj = allProjects.find(p => p.farmerId === user?.id);
    
    if (userProj) {
      setProject(userProj);
    } else {
      const temp = localStorage.getItem('temp_project');
      if (temp) {
        const parsed = JSON.parse(temp);
        const mockProj: any = {
          id: 'temp-123',
          farmerId: 'temp',
          farmerName: parsed.name || 'Productor',
          department: parsed.region === 'costa' ? 'Ica' : parsed.region === 'sierra' ? 'Junín' : 'San Martín',
          province: 'Central',
          region: parsed.region,
          crop: { name: parsed.cropName || 'Cultivo', emoji: '🌱' },
          hectares: parsed.hectares,
          amountNeeded: 5000 * parsed.hectares,
          amountRaised: 0,
          investorsCount: 0,
          roiEstimated: 18,
          tirEstimated: 22,
          vanEstimated: 1500,
          incomeGross: 12000,
          netProfit: 4500,
          story: parsed.story || 'Mi historia agrícola...',
          status: 'buscando',
          startDate: new Date().toISOString()
        };
        setProject(mockProj);
      }
    }
  }, [user]);

  const getStepFromStatus = (project: any) => {
    if (!project) return 0;
    const pct = Math.round((project.amountRaised / project.amountNeeded) * 100) || 0;
    
    if (project.status === 'completado') return 8;
    if (project.status === 'financiado') return 3;
    if (project.status === 'activo' || project.status === 'buscando') {
      if (pct >= 100) return 2;
      if (pct > 0) return 1;
      return 0;
    }
    return 0;
  };

  const pct = project ? Math.round((project.amountRaised / project.amountNeeded) * 100) || 0 : 0;
  const currentStep = getStepFromStatus(project);

  const TIMELINE_STAGES = [
    { id: 1, title: 'Proyecto publicado', icon: '🚀', action: 'Ver perfil público', description: 'Tu proyecto ya es visible para inversores de todo el mundo.' },
    { id: 2, title: 'Inversión recibida', icon: '💰', action: 'Ver inversores', description: 'Has comenzado a recibir respaldo de la comunidad.' },
    { id: 3, title: 'Plan de negocio finalizado', icon: '📝', action: 'Ver plan técnico', description: 'Todos los detalles técnicos han sido validados.' },
    { id: 4, title: 'Insumos adquiridos', icon: '📦', action: 'Subir facturas', description: 'Compra de semillas y herramientas autorizada.' },
    { id: 5, title: 'Asesor técnico asignado', icon: '👨‍🔬', action: 'Contactar asesor', description: 'Un experto te acompañará en el proceso.' },
    { id: 6, title: 'Seguimiento en curso', icon: '📈', action: 'Subir reporte semanal', description: 'Registra el crecimiento de tu cultivo.' },
    { id: 7, title: 'Cosecha proyectada', icon: '🌾', action: 'Registrar inicio', description: 'El momento más esperado está cerca.' },
    { id: 8, title: 'Comprador conectado', icon: '🤝', action: 'Ver contrato', description: 'Asegurando la venta de tu producción.' },
    { id: 9, title: 'Proyecto completado', icon: '🏆', action: 'Ver resumen final', description: '¡Objetivo cumplido! Retorno distribuido.' },
  ];

  const getMilestoneInfo = () => {
    if (project?.status === 'en-revision') {
      return {
        title: 'En Revisión Técnica',
        desc: 'Estamos validando tu plan de negocio. Recibirás una respuesta en menos de 24h.',
        action: 'Revisar mi Plan'
      };
    }
    if (pct < 100) {
      return {
        title: 'Atraer Inversores',
        desc: 'Completa tu perfil con fotos de tu terreno para aumentar el interés en un 40%.',
        action: 'Subir Evidencia'
      };
    }
    return {
      title: 'Preparar Campaña',
      desc: '¡Meta alcanzada! Pronto recibirás los fondos para iniciar la compra de insumos.',
      action: 'Ver Siguiente Paso'
    };
  };

  const milestone = getMilestoneInfo();

  const handleRegisterProgress = (stage: any) => {
    setSelectedStage(stage);
    setShowUploadModal(true);
  };

  return (
    <div className="dashboard-container" style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Gamified Header */}
      <div className="dashboard-header" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '24px 0', position: 'sticky', top: '68px', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--verde-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(34,197,94,0.3)', flexShrink: 0 }}>
                <Award size={32} color="white" />
              </div>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>Nivel: Productor Emergente</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '100%', background: 'var(--verde-500)' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>350 / 1000 XP</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Racha</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                  <Zap size={14} fill="#f59e0b" /> <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>4 días</span>
                </div>
              </div>
              <button onClick={() => logout()} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                <LogOut size={14} /> Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {project ? (
          <>
            {/* Próximo Hito Card & Summary */}
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <motion.div 
                   className="summary-card"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                >
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div className="crop-emoji" style={{ fontSize: '4.5rem' }}>{project.crop.emoji}</div>
                    <div>
                      <h2 className="crop-title" style={{ fontWeight: 930, fontSize: '2.4rem', marginBottom: '4px', letterSpacing: '-0.02em' }}>{project.crop.name}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} /> {project.department} · {project.hectares} Ha
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* PROXIMO HITO CARD */}
                <motion.div 
                  className="milestone-card"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    background: 'linear-gradient(135deg, var(--verde-600), var(--verde-700))', 
                    padding: '32px', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(21, 128, 61, 0.2)'
                  }}
                >
                  <Sparkles className="hide-mobile" style={{ position: 'absolute', top: 20, right: 20, opacity: 0.3 }} size={40} />
                  <p style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '16px', opacity: 0.9 }}>Próximo Hito Crítico</p>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>{milestone.title}</h3>
                  <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '20px', lineHeight: 1.4 }}>{milestone.desc}</p>
                  <button className="btn-primary" style={{ background: 'white', color: 'var(--verde-700)', border: 'none', width: '100%', padding: '12px', fontWeight: 800 }}>
                    {milestone.action === 'Subir Evidencia' ? <Camera size={18} /> : <ChevronRight size={18} />} {milestone.action}
                  </button>
                </motion.div>
            </div>

            {/* Quick stats & Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {/* Progress Card */}
              <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, var(--surface), rgba(34,197,94,0.02))' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Inversión Alcanzada</p>
                      <h3 style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--verde-500)', lineHeight: 1 }}>{pct}%</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2px' }}>$ {project.amountRaised.toLocaleString()}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>meta $ {project.amountNeeded.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="progress-bar" style={{ height: '20px', borderRadius: '10px', background: 'var(--border)' }}>
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                      className="progress-fill" style={{ borderRadius: '10px', background: 'linear-gradient(90deg, var(--verde-500), var(--verde-300))' }} 
                    />
                 </div>
              </div>

              {/* Activity Mini Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Visitas', value: '124', icon: <Eye size={24} />, color: '#a78bfa' },
                  { label: 'Interesados', value: '8', icon: <Users size={24} />, color: '#60a5fa' },
                  { label: 'Mensajes', value: '3', icon: <MessageSquare size={24} />, color: '#f59e0b' },
                  { label: 'XP Ganada', value: '+350', icon: <Sparkles size={24} />, color: '#22c55e' },
                ].map(item => (
                  <div key={item.label} className="stat-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ color: item.color, marginBottom: '12px' }}>{item.icon}</div>
                    <p style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2px' }}>{item.value}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GAMIFIED TIMELINE SECTION */}
            <div className="card" style={{ padding: '48px', marginBottom: '40px', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', zIndex: 0 }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                  <h2 style={{ fontWeight: 900, fontSize: '2.4rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Target color="var(--verde-500)" size={36} /> Tu Ruta de Crecimiento
                  </h2>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--verde-600)', background: 'rgba(34,197,94,0.08)', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.2)' }}>
                    {currentStep + 1} / 9 Etapas
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  {TIMELINE_STAGES.map((stage, i) => {
                    const isCompleted = i < currentStep;
                    const isCurrent = i === currentStep;
                    const isFuture = i > currentStep;

                    return (
                      <motion.div 
                        key={stage.id}
                        whileHover={{ scale: 1.02, translateY: -8 }}
                        style={{
                          padding: '32px', borderRadius: '32px', border: `3px solid ${isCurrent ? 'var(--verde-500)' : isCompleted ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                          background: isCurrent ? 'rgba(34,197,94,0.04)' : isCompleted ? '#f0fdf4' : 'var(--surface-2)',
                          position: 'relative', opacity: isFuture ? 0.6 : 1,
                          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', 
                          boxShadow: isCurrent ? '0 15px 40px rgba(34,197,94,0.12)' : 'none',
                          display: 'flex', flexDirection: 'column', height: '100%'
                        }}
                      >
                        {isCompleted && (
                          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                            <CheckCircle2 size={28} color="var(--verde-500)" />
                          </div>
                        )}
                        {isCurrent && (
                          <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                            <div style={{ width: '16px', height: '16px', background: 'var(--verde-500)', borderRadius: '50%', boxShadow: '0 0 15px var(--verde-500)', animation: 'pulse 2s infinite' }} />
                          </div>
                        )}
                        
                        <div style={{ fontSize: '3.5rem', marginBottom: '24px' }}>{stage.icon}</div>
                        <h4 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '8px', color: isCurrent ? 'var(--verde-700)' : 'inherit', lineHeight: 1.2 }}>{stage.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: isCurrent ? 'var(--verde-600)' : 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
                          {stage.description}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: isCurrent ? 'var(--verde-600)' : 'var(--text-muted)', fontWeight: 700, marginBottom: '24px' }}>
                          {isCompleted ? 'Logrado' : isCurrent ? 'Acción Requerida' : 'Próximamente'}
                        </p>
                        
                        <div style={{ marginTop: 'auto' }}>
                          <button 
                            onClick={() => handleRegisterProgress(stage)}
                            disabled={isFuture && !isCurrent}
                            className={isCurrent ? 'btn-primary' : 'btn-outline'} 
                            style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 800, borderRadius: '16px' }}
                          >
                            {stage.action}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px' }}>Aún no tienes un plan de negocio</h2>
             <Link href="/agricultor/crear-proyecto">
               <button className="btn-primary" style={{ padding: '20px 50px', fontSize: '1.2rem', fontWeight: 900 }}>Evaluar mi primer proyecto</button>
             </Link>
          </div>
        )}
      </div>

      {/* UPLOAD MODAL SIMULATION */}
      <AnimatePresence>
        {showUploadModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ background: 'var(--surface)', width: '100%', maxWidth: '550px', borderRadius: '40px', padding: '48px', position: 'relative', border: '1px solid var(--border)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}
            >
              <button onClick={() => setShowUploadModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--surface-2)', border: 'none', borderRadius: '50%', padding: '12px', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{selectedStage?.icon}</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>{selectedStage?.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Carga evidencia de esta etapa para validar tu avance e informar a tus inversores.</p>
              </div>

              <div style={{ border: '3px dashed var(--border)', borderRadius: '32px', padding: '48px', textAlign: 'center', background: 'var(--surface-2)', cursor: 'pointer', marginBottom: '32px' }}>
                <Upload size={48} color="var(--verde-500)" style={{ marginBottom: '16px' }} />
                <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>Arrastra fotos o documentos aquí</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>PNG, JPG o PDF hasta 10MB</p>
              </div>

              <button 
                className="btn-primary" 
                onClick={() => setShowUploadModal(false)}
                style={{ width: '100%', padding: '20px', fontSize: '1.1rem', fontWeight: 900, borderRadius: '20px' }}
              >
                Confirmar Registro de Avance (+50 XP)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .crop-emoji { fontSize: 3.5rem !important; }
          .crop-title { fontSize: 1.8rem !important; }
          .summary-card { padding: 24px !important; }
          .milestone-card { padding: 24px !important; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 640px) {
          .dashboard-header .container { padding: 0 16px; }
          .stat-card { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
