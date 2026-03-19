'use client';
import { useState } from 'react';
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

export default function AgricultorRegistro() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', department: '', province: '', hectares: 0,
    selectedRegion: null, selectedCropIndex: 0, amountNeeded: 0, investmentPurpose: '',
    storyText: '', generatedStory: '', isGenerating: false,
  });
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

  const { user } = useAuth();

  const handlePublish = () => {
    if (!form.selectedRegion) return;
    const region = REGIONS[form.selectedRegion];
    const crop = region.crops[form.selectedCropIndex];
    const fin = calcFinancials(form.hectares, crop);
    
    // Default mock project creation to save in local storage
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
      coverImage: crop.image, // Default to crop image
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
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '8px' }}>
            Registra tu proyecto agrícola
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Proceso asegurado · Evaluamos tu potencial real</p>
        </div>

        {/* Step indicator */}
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

        {/* Step Content */}
        <div className="card" style={{ padding: '36px' }}>
          {/* STEP 1: Registro */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px' }}>
                Datos de contacto
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="label">Nombre completo *</label>
                  <input className="input" placeholder="Ej: Juan Pérez Quispe" value={form.name} onChange={e => updateForm({ name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Número de celular (9 dígitos) *</label>
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

          {/* STEP 2: Ubicación */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Ubicación del terreno</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Esto determina qué cultivos son viables financieramente en tu zona.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label className="label">Selección en el mapa interactivo</label>
                  {/* Simulated Map UI */}
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
                  <label className="label">Departamento (25 Regiones del Perú) *</label>
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

          {/* STEP 3: Cultivo */}
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

                      <div className="divider" style={{ margin: '20px 0' }} />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--tierra-500)', fontWeight: 600, textTransform: 'uppercase' }}>Precio Chacra</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>S/. {crop.priceFarm.toFixed(2)}</p>
                        </div>
                        <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Mayorista</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>S/. {crop.priceWholesale.toFixed(2)}</p>
                        </div>
                        <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
                          <p style={{ fontSize: '0.7rem', color: 'var(--verde-600)', fontWeight: 600, textTransform: 'uppercase' }}>Internacional</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px', color: 'var(--verde-500)' }}>${crop.priceIntl.toFixed(2)}</p>
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

          {/* STEP 4: Necesidades Financieras (V2 New) */}
          {step === 4 && financials && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Necesidades de financiamiento</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                El modelo proyecta que necesitarás financiar aproximadamente <strong>${financials.investmentNeeded.toLocaleString()} USD</strong>. Puedes ajustar el monto y explicar el uso.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="label">Monto requerido (USD) *</label>
                  <input className="input" type="number" 
                    placeholder={`Ej: ${financials.investmentNeeded}`} 
                    value={form.amountNeeded || ''} 
                    onChange={e => updateForm({ amountNeeded: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="label">¿En qué invertirás este capital? (Desglose) *</label>
                  <textarea className="input" rows={4} style={{ resize: 'vertical' }}
                    placeholder="Ej: Semillas certificadas (30%), Mano de obra local (40%), Fertilizantes orgánicos (30%)"
                    value={form.investmentPurpose} onChange={e => updateForm({ investmentPurpose: e.target.value })} />
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

          {/* STEP 5: Historia */}
          {step === 5 && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Tu historia para los inversores</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.7 }}>
                Cuéntanos sobre ti, tu tierra y tus sueños. Nuestra IA organizará tu historia en una narrativa atractiva.
              </p>
              <div>
                <textarea className="input" rows={6} style={{ resize: 'vertical' }}
                  placeholder="Cuéntanos cuánto tiempo llevas cultivando, cuáles son tus sueños... Habla desde el corazón."
                  value={form.storyText} onChange={e => updateForm({ storyText: e.target.value })} />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button className="btn-outline" style={{ padding: '14px 28px', width: '100%', justifyContent: 'center' }}
                  disabled={form.storyText.trim().length === 0 || form.isGenerating}
                  onClick={handleGenerateStory}>
                  {form.isGenerating ? 'Generando historia...' : 'Refinar historia con IA'}
                </button>
              </div>
              {form.generatedStory && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px' }}>
                    {form.generatedStory.split('\n\n').map((para, i) => (
                      <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '12px', fontSize: '0.9rem' }}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn-ghost" onClick={() => setStep(4)}>Volver</button>
                {form.generatedStory && (
                  <button className="btn-primary" style={{ padding: '14px 28px' }} onClick={() => setStep(6)}>
                    Continuar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Proyecto generado */}
          {step === 6 && financials && (
            <div className="animate-fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '8px' }}>Tu proyecto está listo</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Verifica los indicadores financieros de tu pitch antes de enviarlo.
              </p>
              <div style={{ background: 'var(--surface-2)', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundImage: `url('${selectedCrop?.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{form.name} — {selectedCrop?.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{form.department} · {form.hectares} Ha · ${form.amountNeeded.toLocaleString()} USD</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'ROI Estimado', value: `${financials.roi}%`, color: 'var(--verde-400)' },
                    { label: 'TIR Anual', value: `${financials.tir}%`, color: 'var(--tierra-400)' },
                    { label: 'VAN Estimado', value: `$${financials.van.toLocaleString()} USD`, color: 'var(--text-primary)' },
                    { label: 'Plazo retorno', value: `${selectedCrop?.returnMonths} meses`, color: 'var(--text-primary)' },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '16px', background: 'var(--surface-3)', borderRadius: '8px' }}>
                      <p style={{ color: item.color, fontWeight: 700, fontSize: '1.1rem' }}>{item.value}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-ghost" onClick={() => setStep(5)}>Volver</button>
                <button className="btn-primary" style={{ padding: '14px 28px' }} onClick={() => setStep(7)}>
                  Evaluar Viabilidad
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Evaluación de Viabilidad (NEW) */}
          {step === 7 && financials && (
            <div className="animate-fade-in-up">
              {financials.roi >= 15 && financials.tir >= 10 ? (
                /* ESTADO A — Viable */
                <div style={{ textAlign: 'center' }}>
                  <div className="badge badge-verde" style={{ padding: '10px 20px', fontSize: '1rem', marginBottom: '24px' }}>
                    ✅ Proyecto Viable
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: '16px' }}>¡Excelente oportunidad!</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px', fontSize: '1.1rem' }}>
                    Tu proyecto de <strong>{selectedCrop?.name}</strong> presenta indicadores financieros robustos. 
                    Tanto el ROI de {financials.roi}% como la TIR de {financials.tir}% superan nuestros estándares de viabilidad, 
                    lo que lo hace muy atractivo para inversores profesionales.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button className="btn-ghost" onClick={() => setStep(6)}>Revisar datos</button>
                    <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={() => setStep(8)}>
                      Continuar y publicar proyecto
                    </button>
                  </div>
                </div>
              ) : (
                /* ESTADO B — No Viable */
                <div>
                  <div className="badge badge-oro" style={{ padding: '10px 20px', fontSize: '1rem', marginBottom: '24px', background: '#fbbf24', color: '#78350f' }}>
                    ⚠️ Te sugerimos considerar otras opciones
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: '16px' }}>Análisis de optimización</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
                    Basado en tus condiciones actuales, este cultivo/plan presenta un retorno estimado ({financials.roi}%) 
                    por debajo del umbral recomendado para asegurar el éxito financiero y atraer inversión rápida.
                  </p>
                  
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>🌟 Alternativas sugeridas para {form.department}:</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                    {selectedCrops
                      .filter(c => c.name !== selectedCrop?.name)
                      .slice(0, 2)
                      .map(altCrop => (
                        <div key={altCrop.name} className="card" style={{ padding: '16px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{altCrop.emoji}</span>
                             <span className="badge badge-verde" style={{ fontSize: '0.75rem' }}>ROI {calcFinancials(1, altCrop).roi}%+</span>
                          </div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{altCrop.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Campaña: {altCrop.durationMonths} meses</p>
                        </div>
                      ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn-primary" style={{ padding: '16px', justifyContent: 'center' }} onClick={() => setStep(3)}>
                      🔍 Explorar alternativas
                    </button>
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', fontStyle: 'italic' }}>
                        * Disclaimer: Al continuar de todas formas, el proyecto entrará en revisión manual extendida y los inversores verán una advertencia de riesgo moderado.
                      </p>
                      <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--text-muted)' }} onClick={() => setStep(8)}>
                        Continuar de todas formas
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Confirmación */}
          {step === 8 && (
            <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: '16px' }}>
                ¡Proyecto enviado a revisión!
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
                Tu proyecto <strong>{form.name}</strong> está siendo validado por nuestro equipo. 
                Serás notificado cuando esté visible en el portal público para recibir inversión.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={handlePublish}>
                  Entrar a mi panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
