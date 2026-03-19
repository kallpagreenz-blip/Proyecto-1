'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ComoFuncionaPage() {
  const [activeFarmerStep, setActiveFarmerStep] = useState<number | null>(1);
  const [activeInvestorStep, setActiveInvestorStep] = useState<number | null>(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const farmerSteps = [
    { n: 1, title: 'Regístrate gratis', desc: 'Solo necesitas tu nombre y número de celular. Sin documentos complejos ni historial crediticio.', icon: '📱' },
    { n: 2, title: 'Ubica tu terreno', desc: 'Selecciona tu departamento o usa el GPS para ubicar tu parcela y cuántas hectáreas tienes disponibles.', icon: '📍' },
    { n: 3, title: 'Análisis de cultivo', desc: 'Basado en tu zona, el sistema sugiere el cultivo ideal mostrando rendimientos, costos y precios actualizados.', icon: '🌱' },
    { n: 4, title: 'Define tu meta', desc: 'Indica cuánto capital necesitas y en qué lo vas a invertir de manera transparente.', icon: '🎯' },
    { n: 5, title: 'Tu historia con IA', desc: 'Cuéntanos sobre ti. La IA convierte tu historia en una narrativa que enamora a los inversores.', icon: '✍️' },
    { n: 6, title: 'Conecta e invierte', desc: 'Tu proyecto se pública. Los inversores te apoyan, agendan reuniones y financian tu trabajo.', icon: '🤝' },
  ];

  const investorSteps = [
    { n: 1, title: 'Explora oportunidades', desc: 'Navega proyectos reales con métricas claras (ROI, TIR, VAN) generadas por nuestro motor financiero.', icon: '🔍' },
    { n: 2, title: 'Evalúa con datos', desc: 'Revisa proyecciones de gasto, rentabilidad y precios de mercado para cada cultivo propuesto.', icon: '📊' },
    { n: 3, title: 'Crea tu cuenta', desc: 'Regístrate en 2 minutos con un proceso seguro y minimalista.', icon: '✅' },
    { n: 4, title: 'Agenda una reunión', desc: 'Conoce al agricultor cara a cara mediante videollamada antes de tomar una decisión de inversión.', icon: '📅' },
    { n: 5, title: 'Invierte de forma segura', desc: 'Coordina el desembolso a través de nuestros canales y formaliza tu apoyo directamente a tierra firme.', icon: '🌍' },
    { n: 6, title: 'Sigue tu impacto', desc: 'Monitorea métricas como familias apoyadas, kilogramos de alimento generado y progreso de tu portafolio.', icon: '📱' },
  ];

  const faqs = [
    { q: '¿Cuánto es el retorno esperado para el inversor?', a: 'Entre 10% y 38% anual dependiendo del cultivo y el plazo del proyecto. Cada proyecto muestra su TIR estimada basada en proyecciones del mercado agrícola real.' },
    { q: '¿Cuál es el mínimo de inversión?', a: 'En la etapa MVP, el monto se coordina directamente. Más adelante habilitaremos micro-crowdlending desde 50 USD para masificar el acceso.' },
    { q: '¿El agricultor paga algo?', a: 'El registro y análisis de su parcela es 100% gratuito. AgroCapital únicamente aplica una comisión de éxito financiera del 3–5% al momento del cierre de la inversión.' },
    { q: '¿Los datos financieros son reales?', a: 'Los indicadores se generan mediante un motor de simulación paramétrico que toma rendimientos históricos reales por región y precios referenciales de Perú.' },
  ];

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface-2)', padding: '80px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
           <p style={{ color: 'var(--tierra-500)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Transparencia Absoluta</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: '24px' }}>
            ¿Cómo funciona la plataforma?
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.8, fontSize: '1.1rem' }}>
            Conectamos agricultores que necesitan capital de trabajo con inversores que buscan rentabilidad e impacto medible. Procesos limpios y claros.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px' }}>
          
          {/* Farmer interactive column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <img src="/img/potato_harvest_aesthetic_1773866034246.png" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} alt="Farmer UI" />
              <h2 style={{ fontWeight: 700, fontSize: '1.4rem' }}>Para Agricultores</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {farmerSteps.map(item => (
                <div key={item.n} 
                  onMouseEnter={() => setActiveFarmerStep(item.n)}
                  style={{ 
                    display: 'flex', gap: '20px', padding: '20px', 
                    background: activeFarmerStep === item.n ? 'var(--surface-2)' : 'transparent',
                    border: '1px solid', borderColor: activeFarmerStep === item.n ? 'var(--tierra-500)' : 'transparent',
                    borderRadius: '16px', transition: 'all 0.3s ease', cursor: 'pointer'
                  }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: activeFarmerStep === item.n ? 'var(--tierra-600)' : 'var(--surface-3)',
                    color: activeFarmerStep === item.n ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    {item.n}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: activeFarmerStep === item.n ? 'var(--tierra-400)' : 'var(--text-primary)' }}>
                       {item.title}
                    </h3>
                    <div style={{ 
                      maxHeight: activeFarmerStep === item.n ? '100px' : '0', 
                      opacity: activeFarmerStep === item.n ? 1 : 0, 
                      overflow: 'hidden', transition: 'all 0.4s ease' 
                    }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/agricultor/registro" style={{ textDecoration: 'none', display: 'block', marginTop: '32px' }}>
              <button className="btn-tierra" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
                Registrar nuevo proyecto
              </button>
            </Link>
          </div>

          {/* Investor interactive column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--capital-700), var(--capital-500))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem' }}>
                📈
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.4rem' }}>Para Inversores</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {investorSteps.map(item => (
                <div key={item.n} 
                  onMouseEnter={() => setActiveInvestorStep(item.n)}
                  style={{ 
                    display: 'flex', gap: '20px', padding: '20px', 
                    background: activeInvestorStep === item.n ? 'var(--surface-2)' : 'transparent',
                    border: '1px solid', borderColor: activeInvestorStep === item.n ? 'var(--capital-500)' : 'transparent',
                    borderRadius: '16px', transition: 'all 0.3s ease', cursor: 'pointer'
                  }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: activeInvestorStep === item.n ? 'var(--capital-600)' : 'var(--surface-3)',
                    color: activeInvestorStep === item.n ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}>
                    {item.n}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: activeInvestorStep === item.n ? 'var(--capital-400)' : 'var(--text-primary)' }}>
                       {item.title}
                    </h3>
                    <div style={{ 
                      maxHeight: activeInvestorStep === item.n ? '100px' : '0', 
                      opacity: activeInvestorStep === item.n ? 1 : 0, 
                      overflow: 'hidden', transition: 'all 0.4s ease' 
                    }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/inversor/registro" style={{ textDecoration: 'none', display: 'block', marginTop: '32px' }}>
              <button className="btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
                <span>Crear cuenta y explorar</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Interactive FAQ */}
        <div style={{ marginTop: '100px', maxWidth: '720px', margin: '100px auto 0' }}>
          <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '40px', textAlign: 'center' }}>Preguntas frecuentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: activeFaq === i ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <p style={{ fontWeight: 600, fontSize: '1.05rem', color: activeFaq === i ? 'var(--capital-400)' : 'var(--text-primary)' }}>
                    {faq.q}
                  </p>
                  <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', transition: 'transform 0.3s', transform: activeFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
                <div style={{ 
                  maxHeight: activeFaq === i ? '200px' : '0',
                  opacity: activeFaq === i ? 1 : 0,
                  transition: 'all 0.3s ease',
                  padding: activeFaq === i ? '0 24px 24px 24px' : '0 24px'
                }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
