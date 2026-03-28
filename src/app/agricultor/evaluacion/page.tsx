'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Leaf, BarChart3, ShieldCheck, CheckCircle2, 
  TrendingUp, Phone, User, MapPin, MessageSquare, 
  Globe, Sparkles, ChevronRight, Info
} from 'lucide-react';
import Link from 'next/link';
import { REGIONS, calcFinancials, CropData } from '@/lib/mock-data';

const STEPS = [
  { id: 1, label: 'Identificación', icon: <User size={18} /> },
  { id: 2, label: 'Tu Terreno', icon: <MapPin size={18} /> },
  { id: 3, label: 'Mercado', icon: <Globe size={18} /> },
  { id: 4, label: 'Tu Historia', icon: <MessageSquare size={18} /> },
  { id: 5, label: 'Viabilidad', icon: <TrendingUp size={18} /> },
  { id: 6, label: 'Hoja de Ruta', icon: <Sparkles size={18} /> },
];

export default function ProjectEvaluation() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [data, setData] = useState({
    name: '',
    phone: '',
    hectares: 1,
    region: 'sierra' as keyof typeof REGIONS,
    cropName: '',
    story: '',
  });

  const selectedRegion = REGIONS[data.region];
  const selectedCrop = selectedRegion.crops.find(c => c.name === data.cropName) || selectedRegion.crops[0];
  const financials = calcFinancials(data.hectares, selectedCrop);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handlePublish = () => {
    localStorage.setItem('temp_project', JSON.stringify({ ...data, status: 'publicado', progress: 15 }));
    router.push('/agricultor/dashboard');
  };

  return (
    <div className="eval-container" style={{ paddingTop: '68px', minHeight: '100vh', background: 'var(--background)', display: 'flex' }}>
      
      {/* Sidebar / Top Stepper */}
      <div className="stepper-sidebar" style={{ 
        width: '300px', background: 'var(--surface)', borderRight: '1px solid var(--border)', 
        padding: '40px 24px', position: 'fixed', height: 'calc(100vh - 68px)', left: 0, top: '68px',
        display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50
      }}>
        <h2 className="hide-mobile" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
          Progreso de Evaluación
        </h2>
        <div className="stepper-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={`stepper-item ${step === s.id ? 'active' : ''}`} style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
              background: step === s.id ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
              color: step === s.id ? 'var(--verde-600)' : step > s.id ? 'var(--verde-500)' : 'var(--text-muted)',
              fontWeight: step >= s.id ? 700 : 500,
              transition: 'all 0.3s',
              position: 'relative'
            }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: step > s.id ? 'var(--verde-500)' : 'transparent',
                borderColor: step > s.id ? 'var(--verde-500)' : step === s.id ? 'var(--verde-500)' : 'var(--border)',
                color: step > s.id ? 'white' : 'inherit'
              }}>
                {step > s.id ? <CheckCircle2 size={16} /> : s.icon}
              </div>
              <span className="step-label" style={{ fontSize: '0.9rem' }}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className="step-line-vertical" style={{ position: 'absolute', left: '31px', top: '44px', width: '2px', height: '12px', background: step > s.id ? 'var(--verde-500)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="hide-mobile" style={{ marginTop: 'auto', padding: '20px', background: 'var(--surface-2)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Info size={24} color="var(--verde-500)" />
            Al completar estos pasos, los inversores tendrán toda la información necesaria para financiarte.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="eval-content" style={{ marginLeft: '300px', flex: 1, padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {/* STEP 1: IDENTIFICACIÓN */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h1 style={{ fontWeight: 900, fontSize: '2.8rem', marginBottom: '12px', lineHeight: 1.1 }}>Comencemos con tu futuro</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>Queremos conocerte para impulsarte. Solo necesitamos lo básico.</p>

                <div className="card" style={{ padding: '40px' }}>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <label className="label">Tu Nombre y Apellidos</label>
                      <input 
                        className="input" placeholder="Ej: Feliciano Quispe" 
                        value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="label">Tu número de Celular</label>
                      <input 
                        className="input" placeholder="999000000" maxLength={9}
                        value={data.phone} onChange={e => setData({...data, phone: e.target.value.replace(/\D/g, '')})}
                      />
                    </div>
                    <button 
                      className="btn-primary" onClick={nextStep} 
                      disabled={!data.name || data.phone.length < 9}
                      style={{ padding: '20px', justifyContent: 'center', marginTop: '10px', fontSize: '1.1rem' }}
                    >
                      Siguiente: Ubicación <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TERRENO */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 style={{ fontWeight: 900, fontSize: '2.8rem', marginBottom: '12px' }}>¿Dónde cultivas?</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>Esta información nos ayuda a sugerir cultivos ideales.</p>
                
                <div className="card" style={{ padding: '40px' }}>
                  <div style={{ display: 'grid', gap: '40px' }}>
                    <div>
                      <label className="label">Región Principal</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {Object.entries(REGIONS).map(([key, reg]) => (
                          <button 
                            key={key}
                            onClick={() => setData({ ...data, region: key as any, cropName: '' })}
                            style={{
                              padding: '20px', borderRadius: '20px', border: `3px solid ${data.region === key ? 'var(--verde-500)' : 'var(--border)'}`,
                              background: data.region === key ? 'rgba(34, 197, 94, 0.05)' : 'none',
                              cursor: 'pointer', transition: 'all 0.2s', fontWeight: 800, fontSize: '1rem',
                              textAlign: 'center'
                            }}
                          >
                            {reg.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">Extensión del Terreno</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'var(--surface-2)', padding: '32px', borderRadius: '24px' }}>
                        <input 
                          type="range" min="0.5" max="20" step="0.5"
                          value={data.hectares}
                          onChange={e => setData({ ...data, hectares: parseFloat(e.target.value) })}
                          style={{ flex: 1, accentColor: 'var(--verde-500)' }}
                        />
                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--verde-500)', minWidth: '120px', textAlign: 'right' }}>
                          {data.hectares} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Ha</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                    <button className="btn-outline" onClick={prevStep} style={{ flex: 1, padding: '18px' }}>Atrás</button>
                    <button className="btn-primary" onClick={nextStep} style={{ flex: 2, justifyContent: 'center', padding: '18px' }}>Continuar <ArrowRight size={20} /></button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MERCADO */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 style={{ fontWeight: 900, fontSize: '2.8rem', marginBottom: '8px' }}>Análisis de Mercado</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>Recomendaciones premium para {selectedRegion.name}.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                  {selectedRegion.crops.map(crop => (
                    <button 
                      key={crop.name}
                      onClick={() => setData({...data, cropName: crop.name})}
                      style={{
                        padding: '32px', borderRadius: '32px', border: `3px solid ${data.cropName === crop.name ? 'var(--verde-500)' : 'var(--border)'}`,
                        background: data.cropName === crop.name ? 'rgba(34, 197, 94, 0.05)' : 'var(--surface)',
                        textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s', position: 'relative'
                      }}
                    >
                      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{crop.emoji}</div>
                      <h3 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '8px' }}>{crop.name}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>{crop.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--oro-600)', fontWeight: 700, fontSize: '0.85rem' }}>
                        <TrendingUp size={16} /> Alta demanda global
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="btn-outline" onClick={prevStep} style={{ flex: 1 }}>Atrás</button>
                  <button className="btn-primary" onClick={nextStep} disabled={!data.cropName} style={{ flex: 2, justifyContent: 'center' }}>
                    Siguiente: Tu Historia <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: HISTORIA */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h1 style={{ fontWeight: 900, fontSize: '2.8rem', marginBottom: '12px' }}>Cuéntanos tu historia</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>Los inversores quieren saber quién está detrás de la cosecha.</p>

                <div className="card" style={{ padding: '40px' }}>
                  <textarea 
                    className="input" rows={8} 
                    placeholder="Ej: Soy agricultor de tercera generación... Mi meta es exportar quinua orgánica a Europa..."
                    value={data.story} onChange={e => setData({...data, story: e.target.value})}
                    style={{ resize: 'none', fontSize: '1.2rem', lineHeight: 1.6, padding: '24px' }}
                  />
                  
                  <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                    <button className="btn-outline" onClick={prevStep} style={{ flex: 1 }}>Atrás</button>
                    <button className="btn-primary" onClick={nextStep} disabled={data.story.length < 20} style={{ flex: 2, justifyContent: 'center' }}>
                      Ver Viabilidad Financiera <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: VIABILIDAD */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                <h1 style={{ fontWeight: 900, fontSize: '2.8rem', marginBottom: '8px' }}>Proyecciones de Éxito</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>Basado en {data.hectares} Ha de {data.cropName} en {selectedRegion.name}.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                   <div className="card" style={{ padding: '32px', border: '3px solid var(--verde-500)', background: 'linear-gradient(135deg, var(--surface), rgba(34,197,94,0.05))' }}>
                      <p style={{ fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '12px' }}>Rentabilidad Estimada</p>
                      <p style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--verde-600)', lineHeight: 1 }}>{financials.roi}%</p>
                      <p style={{ marginTop: '20px', fontSize: '1rem', color: 'var(--text-secondary)' }}>Retorno proyectado sobre capital.</p>
                   </div>
                   <div className="card" style={{ padding: '32px' }}>
                      <p style={{ fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '12px' }}>Utilidad Neta Esperada</p>
                      <p style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>S/. {financials.netProfit.toLocaleString()}</p>
                      <div style={{ marginTop: '20px', display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Ventas brutas</span>
                            <span style={{ fontWeight: 700 }}>S/. {financials.incomeGross.toLocaleString()}</span>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Costos operativos</span>
                            <span style={{ fontWeight: 700, color: '#ef4444' }}>- S/. {financials.operatingCosts.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="card" style={{ padding: '32px', background: 'var(--surface-2)', textAlign: 'center', marginBottom: '40px' }}>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>Inversión Requerida</p>
                  <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--verde-600)' }}>$ {financials.investmentNeeded.toLocaleString()} <span style={{ fontSize: '1rem' }}>USD</span></p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="btn-outline" onClick={prevStep} style={{ flex: 1 }}>Atrás</button>
                  <button className="btn-primary" onClick={nextStep} style={{ flex: 3, justifyContent: 'center', fontSize: '1.2rem', padding: '24px' }}>
                    Finalizar y Ver Hoja de Ruta <Sparkles size={24} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: HOJA DE RUTA (ROADMAP) */}
            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <h1 style={{ fontWeight: 900, fontSize: '3.2rem', marginBottom: '12px', lineHeight: 1 }}>Tu Plan Maestro</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem' }}>Esta es la secuencia técnica que te llevará a una gran cosecha.</p>
                </div>

                <div className="card" style={{ padding: '48px', marginBottom: '48px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {[
                      { title: 'Proyecto publicado', icon: '🚀' },
                      { title: 'Inversión recibida', icon: '💰' },
                      { title: 'Plan de negocio finalizado', icon: '📝' },
                      { title: 'Insumos adquiridos', icon: '📦' },
                      { title: 'Asesor técnico asignado', icon: '👨‍🔬' },
                      { title: 'Seguimiento en curso', icon: '📈' },
                      { title: 'Cosecha proyectada', icon: '🌾' },
                      { title: 'Comprador conectado', icon: '🤝' },
                      { title: 'Proyecto completado', icon: '🏆' },
                    ].map((s, i) => (
                      <div key={i} style={{ 
                        padding: '24px', borderRadius: '24px', border: `2px solid ${i === 0 ? 'var(--verde-500)' : 'var(--border)'}`,
                        background: i === 0 ? 'rgba(34, 197, 94, 0.05)' : 'var(--surface-2)',
                        textAlign: 'center', opacity: i === 0 ? 1 : 0.6
                      }}>
                        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{s.icon}</div>
                        <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>{s.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                  <button className="btn-primary" onClick={handlePublish} style={{ padding: '28px', fontSize: '1.4rem', justifyContent: 'center' }}>
                    🚀 Publicar mi Proyecto a Inversores
                  </button>
                  <button className="btn-outline" onClick={() => router.push('/')} style={{ fontSize: '1.1rem' }}>
                    Guardar para después
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .label {
          display: block;
          font-weight: 800;
          font-size: 1rem;
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        .input {
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          border: 2px solid var(--border);
          background: var(--surface);
          font-family: inherit;
          font-size: 1.1rem;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: var(--verde-500);
          box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.1);
        }
        @media (max-width: 1024px) {
          .eval-container { flex-direction: column; }
          .stepper-sidebar { 
            width: 100% !important; 
            height: auto !important; 
            position: relative !important; 
            top: 0 !important;
            padding: 20px !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .stepper-items { 
            flex-direction: row !important; 
            overflow-x: auto; 
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
          }
          .stepper-item { 
            padding: 8px 12px !important; 
            flex-shrink: 0;
            background: none !important;
          }
          .step-label { display: none; }
          .step-line-vertical { display: none; }
          .hide-mobile { display: none; }
          .eval-content { 
            margin-left: 0 !important; 
            padding: 32px 20px !important; 
          }
        }
      `}</style>
    </div>
  );
}
