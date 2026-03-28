'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { REGIONS, Region, calcFinancials, saveLocalProject, Project } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface FormData {
  name: string;
  phone: string;
  department: string;
  province: string;
  hectares: number;
  selectedRegion: Region | null;
  selectedCropIndex: number;
  amountNeeded: number;
  investmentPurpose: string;
  storyText: string;
  generatedStory: string;
  isGenerating: boolean;
}

const ALL_DEPARTMENTS = [
  'Amazonas', 'Ancash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco',
  'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 'Loreto',
  'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

function getRegionFromDept(dept: string): Region {
  const costaNorte = ['Piura', 'La Libertad', 'Lambayeque', 'Tumbes', 'Ancash'];
  const costaSur = ['Ica', 'Arequipa', 'Moquegua', 'Tacna', 'Lima', 'Callao'];
  const selvaAlta = ['San Martín', 'Amazonas', 'Cajamarca'];
  const selvaBaja = ['Ucayali', 'Loreto', 'Madre de Dios'];
  if (costaNorte.includes(dept)) return 'costa-norte';
  if (costaSur.includes(dept)) return 'costa-sur';
  if (selvaAlta.includes(dept)) return 'selva-alta';
  if (selvaBaja.includes(dept)) return 'selva-baja';
  return 'sierra'; // Default for the rest in the Andes
}

function simulateAIStory(name: string, crop: string, hectares: number, region: string, text: string): string {
  const templates = [
    `Me llamo ${name} y trabajo ${hectares} hectáreas de ${crop} en ${region}. ${text.slice(0, 100)}...

Durante años he cultivado esta tierra con mis propias manos, aprendiendo de cada temporada, de cada cosecha buena y de las malas también. Lo que más me enseñó el campo es que la constancia siempre da frutos — a veces pequeños, a veces grandes, pero siempre reales.

Hoy busco dar el siguiente paso. Con financiamiento puedo mejorar mis herramientas, certificarme y llegar a mercados que valoren lo que produzco. No pido un favor — ofrezco una inversión real con tierra real y trabajo real detrás.

Con tu apoyo, puedo demostrar que el campo peruano tiene mucho más que dar. Mis hijos y los hijos de mis vecinos verán que vale la pena quedarse y sembrar. Ese es el futuro que quiero construir.`,
  ];
  return templates[0];
}

export default function CrearProyecto() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const { user } = useAuth();
  
  const [form, setForm] = useState<FormData>({
    name: user?.name || '', 
    phone: user?.phone || '', 
    department: '', province: '', hectares: 0,
    selectedRegion: null, selectedCropIndex: 0, amountNeeded: 0, investmentPurpose: '',
    storyText: '', generatedStory: '', isGenerating: false,
  });

  useEffect(() => {
    if (user && !form.name) {
      setForm(prev => ({ ...prev, name: user.name || '', phone: user.phone || '' }));
    }
  }, [user]);
  const [isLocating, setIsLocating] = useState(false);

  const updateForm = (updates: Partial<FormData>) => setForm(prev => ({ ...prev, ...updates }));

  const handleLocationDetection = () => {
    setIsLocating(true);
    setTimeout(() => {
      const detectedDept = 'Cusco';
      updateForm({ department: detectedDept, selectedRegion: getRegionFromDept(detectedDept), province: 'Quispicanchi' });
      setIsLocating(false);
    }, 2000);
  };

  const handleDeptSelect = (dept: string) => {
    updateForm({ department: dept, selectedRegion: getRegionFromDept(dept), selectedCropIndex: 0 });
  };

  const handleGenerateStory = () => {
    updateForm({ isGenerating: true });
    const region = REGIONS[form.selectedRegion!];
    const crop = region.crops[form.selectedCropIndex];
    setTimeout(() => {
      const story = simulateAIStory(form.name, crop.name, form.hectares, region.name, form.storyText);
      updateForm({ generatedStory: story, isGenerating: false });
    }, 2500);
  };

  const handlePublish = () => {
    if (!form.selectedRegion) return;
    const region = REGIONS[form.selectedRegion];
    const crop = region.crops[form.selectedCropIndex];
    const fin = calcFinancials(form.hectares, crop);
    
    const newProject: Project = {
      id: `proj-created-${Date.now()}`,
      farmerId: user?.id || `farmer-new-${Date.now()}`,
      farmerName: user?.name || form.name,
      farmerPhoto: user?.photo || '/img/andean_farmer_portrait_1773865948608.png', 
      farmerAge: 40,
      farmerYearsExperience: 10,
      region: form.selectedRegion,
      department: form.department,
      province: form.province,
      lat: -12.0464, lng: -77.0428,
      hectares: form.hectares,
      crop: crop,
      story: form.generatedStory,
      storyShort: form.generatedStory.substring(0, 120) + '...',
      status: 'en-revision',
      amountNeeded: form.amountNeeded || fin.investmentNeeded,
      amountRaised: 0,
      roiEstimated: fin.roi,
      tirEstimated: fin.tir,
      vanEstimated: fin.van,
      incomeGross: fin.incomeGross,
      operatingCosts: fin.operatingCosts,
      netProfit: fin.netProfit,
      returnMonths: crop.returnMonths,
      investorsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['Nuevo', 'Pendiente de Revisión'],
      familyMembers: 4,
      previousProduction: 'Sin datos',
      investmentPurpose: form.investmentPurpose,
      coverImage: crop.image, 
      hasPurchaseOrders: false
    };

    saveLocalProject(newProject);
    router.push('/agricultor/dashboard');
  };

  const selectedCrops = form.selectedRegion ? REGIONS[form.selectedRegion].crops : [];
  const selectedCrop = selectedCrops[form.selectedCropIndex];
  const financials = form.selectedRegion && selectedCrop && form.hectares > 0
    ? calcFinancials(form.hectares, selectedCrop) : null;

  const STEPS = ['Contacto', 'Ubicación', 'Cultivo', 'Finanzas', 'Historia', 'Revisión', 'Viabilidad', 'Publicar'];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', padding: '88px 24px 60px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '8px' }}>
            Registra tu proyecto agrícola
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Proceso asegurado · Evaluamos tu potencial real</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px' }}>
          {STEPS.map((label, i) => {
            const stepNum = (i + 1) as Step;
            const isActive = stepNum === step;
            const isCompleted = stepNum < step;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 500, fontSize: '0.8rem', transition: 'all 0.3s',
                    background: isCompleted ? 'var(--capital-600)' : isActive ? 'var(--surface-3)' : 'transparent',
                    border: `1px solid ${isCompleted ? 'var(--capital-500)' : isActive ? 'var(--text-primary)' : 'var(--border)'}`,
                    color: isCompleted ? 'white' : isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    {isCompleted ? '✓' : stepNum}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: isCompleted ? 'var(--text-primary)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '1px', background: isCompleted ? 'var(--capital-600)' : 'var(--border)', margin: '0 8px', marginBottom: '20px', transition: 'background 0.3s' }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: '36px' }}>
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px' }}>
                Datos de contacto del proyecto
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="label">¿Quién lidera este proyecto? *</label>
                  <input className="input" placeholder="Ej: Juan Pérez Quispe" value={form.name} onChange={e => updateForm({ name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Número de celular de contacto *</label>
                  <input className="input" placeholder="999 000 000" value={form.phone} maxLength={9}
                    onChange={e => updateForm({ phone: e.target.value.replace(/\D/g, '') })} />
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '32px', padding: '14px 28px' }}
                disabled={!form.name || form.phone.length !== 9}
                onClick={() => setStep(2)}>
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Ubicación del terreno</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Esto determina qué cultivos son viables financieramente en tu zona.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label className="label">Selección en el mapa interactivo</label>
                  <div style={{
                    height: '240px', borderRadius: '12px', border: '1px solid var(--border)',
                    position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop")',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)'
                  }}>
                    {isLocating && (
                      <div style={{
                        position: 'absolute', width: '100%', height: '100%', background: 'rgba(22, 163, 74, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                      }}>
                        <div style={{
                          width: '60px', height: '60px', borderRadius: '50%', border: '3px solid white',
                          borderTopColor: 'transparent', animation: 'spin 1s linear infinite'
                        }} />
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                      </div>
                    )}
                    {form.department && !isLocating && (
                      <div className="animate-fade-in-up" style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>📍</div>
                        <div style={{ background: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '4px' }}>
                          {form.province ? `${form.province}, ` : ''}{form.department}
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="btn-outline" onClick={handleLocationDetection} disabled={isLocating} style={{ justifyContent: 'center', padding: '16px', fontWeight: 600 }}>
                    {isLocating ? 'Conectando con satélite...' : '🎯 Usar mi ubicación actual (Automático)'}
                  </button>
                </div>

                <div className="divider" style={{ margin: '8px 0' }}>ó ingresa manualmente</div>

                <div>
                  <label className="label">Departamento *</label>
                  <select className="input" value={form.department} onChange={e => handleDeptSelect(e.target.value)} style={{ padding: '14px' }}>
                    <option value="">Selecciona tu departamento</option>
                    {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Provincia / Distrito</label>
                  <input className="input" placeholder="Ej: Quispicanchi" value={form.province} onChange={e => updateForm({ province: e.target.value })} />
                </div>
                
                <div>
                  <label className="label">Tamaño del terreno (Hectáreas) *</label>
                  <input className="input" type="number" placeholder="Ej: 4.5" min="0.1" max="500" step="0.1"
                    value={form.hectares || ''} onChange={e => updateForm({ hectares: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>Volver</button>
                <button className="btn-primary" style={{ padding: '14px 28px' }}
                  disabled={!form.department || form.hectares <= 0}
                  onClick={() => setStep(3)}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Análisis de cultivo ideal</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Basado en tu región ({form.department}) y tus {form.hectares} hectáreas, nuestro sistema sugiere:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {selectedCrops.map((crop, i) => (
                  <div key={i} onClick={() => updateForm({ selectedCropIndex: i })} style={{
                    borderRadius: '12px', border: '1px solid', overflow: 'hidden',
                    borderColor: form.selectedCropIndex === i ? 'var(--capital-500)' : 'var(--border)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: form.selectedCropIndex === i ? 'rgba(40,151,98,0.05)' : 'var(--surface)'
                  }}>
                    <div style={{ height: '140px', backgroundImage: `url('${crop.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,26,20,0.9) 0%, transparent 100%)' }} />
                       <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                         <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white', letterSpacing: '0.05em' }}>{crop.name.toUpperCase()}</span>
                         <span className="badge badge-verde" style={{ fontSize: '0.85rem', padding: '6px 10px' }}>TIR {crop.tirMin}–{crop.tirMax}%</span>
                       </div>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>{crop.description}</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--surface-2)', padding: '16px', borderRadius: '8px' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Campaña</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{crop.durationMonths} meses</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Rend. m²</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>{crop.yieldSqm} kg</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Gastos/Ha</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>S/. {crop.initialCostAvg.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-ghost" onClick={() => setStep(2)}>Volver</button>
                <button className="btn-primary" style={{ padding: '14px 28px' }} onClick={() => setStep(4)}>
                  Continuar con {selectedCrop?.name}
                </button>
              </div>
            </div>
          )}

          {step === 4 && financials && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Necesidades de financiamiento</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Proyectado: <strong>${financials.investmentNeeded.toLocaleString()} USD</strong>.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="label">Monto requerido (USD) *</label>
                  <input className="input" type="number" value={form.amountNeeded || ''} 
                    onChange={e => updateForm({ amountNeeded: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="label">¿Uso de fondos? *</label>
                  <textarea className="input" rows={4} value={form.investmentPurpose} onChange={e => updateForm({ investmentPurpose: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="btn-ghost" onClick={() => setStep(3)}>Volver</button>
                <button className="btn-primary" style={{ padding: '14px 28px' }} 
                  disabled={form.amountNeeded <= 0 || form.investmentPurpose.length < 10}
                  onClick={() => setStep(5)}>
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Tu historia</h2>
              <textarea className="input" rows={6} value={form.storyText} onChange={e => updateForm({ storyText: e.target.value })} />
              <button className="btn-outline" style={{ marginTop: '16px', width: '100%' }}
                disabled={form.storyText.trim().length === 0 || form.isGenerating} onClick={handleGenerateStory}>
                {form.isGenerating ? 'Generando...' : 'IA: Pulir historia'}
              </button>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn-ghost" onClick={() => setStep(4)}>Volver</button>
                {form.generatedStory && <button className="btn-primary" onClick={() => setStep(6)}>Continuar</button>}
              </div>
            </div>
          )}

          {step === 6 && financials && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px' }}>Revisión final</h2>
              <div style={{ background: 'var(--surface-2)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <p style={{ fontWeight: 700 }}>{selectedCrop?.name}</p>
                <p>${form.amountNeeded.toLocaleString()} USD · ROI {financials.roi}%</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-ghost" onClick={() => setStep(5)}>Volver</button>
                <button className="btn-primary" onClick={() => setStep(7)}>Evaluar Viabilidad</button>
              </div>
            </div>
          )}

          {step === 7 && financials && (
            <div className="animate-fade-in-up">
              <div style={{ textAlign: 'center' }}>
                <div className={`badge ${financials.roi >= 15 ? 'badge-verde' : 'badge-oro'}`} style={{ padding: '10px 20px', marginBottom: '24px' }}>
                  {financials.roi >= 15 ? '✅ Proyecto Viable' : '⚠️ Revisión Recomendada'}
                </div>
                <p style={{ marginBottom: '32px' }}>{financials.roi >= 15 ? 'Tu proyecto cumple con creces.' : 'Te sugerimos ajustar tu plan.'}</p>
                <button className="btn-primary" onClick={() => setStep(8)}>Continuar</button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
              <h2 style={{ fontWeight: 700, marginBottom: '24px' }}>¡Todo listo!</h2>
              <button className="btn-primary" onClick={handlePublish}>Publicar y ver Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
