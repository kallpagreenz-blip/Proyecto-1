'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Leaf, ShieldCheck, Globe, ArrowRight, BarChart3, Users, Sprout } from 'lucide-react';
import { MOCK_PROJECTS, PLATFORM_STATS, getLocalProjects, Project } from '@/lib/mock-data';
import ProjectCard from '@/components/ProjectCard';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ value, label, prefix = '', suffix = '', icon }: { value: number; label: string; prefix?: string; suffix?: string; icon: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div 
      ref={ref} 
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(22, 163, 74, 0.1)',
        padding: '32px 24px',
        borderRadius: '16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ color: 'var(--verde-500)', marginBottom: '16px', background: 'rgba(22, 163, 74, 0.1)', padding: '16px', borderRadius: '50%' }}>
        {icon}
      </div>
      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, fontFeatureSettings: '"tnum"', letterSpacing: '-0.03em' }}>
        {prefix}{count >= 1000 ? (count / 1000).toFixed(count >= 100000 ? 0 : 1) + 'K' : count}{suffix}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
    </motion.div>
  );
}

// Float Animation Component for Hero elements
const FloatingCard = ({ children, delay = 0, x, y, rotate = 0 }: { children: React.ReactNode, delay?: number, x: string, y: string, rotate?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: x, y: parseInt(y) + 50 }}
    animate={{ opacity: 1, scale: 1, x: x, y: parseInt(y) }}
    transition={{ duration: 1, delay, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      padding: '20px',
      color: 'white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 20
    }}
  >
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay }}>
      {children}
    </motion.div>
  </motion.div>
);

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  useEffect(() => {
    setProjects([...getLocalProjects(), ...MOCK_PROJECTS]);
  }, []);

  const featuredProjects = projects.slice(0, 3);
  const allProjectsCount = projects.filter(p => ['activo', 'buscando'].includes(p.status)).length;

  return (
    <div style={{ paddingTop: '68px', overflowX: 'hidden' }}>
      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-68px', /* Pull behind navbar */
        paddingTop: '68px',
        background: '#0a1612' // Dark fallback
      }}>
        {/* Parallax Background */}
        <motion.div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("/img/crops_premium.png") center/cover no-repeat', // Changed to our new generated image
          y: heroY,
          scale: 1.05,
          zIndex: 0,
        }} />

        {/* Cinematic Gradient Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(10,22,18,0.95) 0%, rgba(10,22,18,0.6) 50%, rgba(10,22,18,0.3) 100%)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(22,163,74,0.15) 0%, transparent 40%)',
          zIndex: 2
        }} />

        <div className="container" style={{ position: 'relative', padding: '0 24px', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Text Content */}
            <motion.div 
              style={{ maxWidth: '680px' }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', 
                  background: 'rgba(22, 163, 74, 0.2)', padding: '8px 16px', borderRadius: '100px',
                  border: '1px solid rgba(22, 163, 74, 0.4)', color: '#4ade80', marginBottom: '24px', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase'
                }}
              >
                <Globe size={16} /> Plataforma de Inversión Agrícola Activa
              </motion.div>
              
              <h1 className="font-display hero-title-main" style={{
                fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '24px',
                color: 'white',
              }}>
                Tus <span style={{ color: '#4ade80' }}>inversiones</span> <br/>
                cultivan el <span style={{ fontStyle: 'italic', fontWeight: 400 }}>futuro</span>.
              </h1>

              <p className="hero-subtitle" style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
                marginBottom: '48px',
                maxWidth: '580px',
                fontWeight: 400
              }}>
                Conectamos el esfuerzo de los productores andinos con capital inteligente global. Obtén retornos anuales de 15–35% mientras transformas el agro peruano.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <Link href="/inversor/registro" style={{ textDecoration: 'none' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(74, 222, 128, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="hero-cta-btn"
                    style={{ 
                      background: 'var(--verde-500)', border: 'none', color: 'white', 
                      padding: '18px 36px', fontSize: '1.05rem', borderRadius: '8px',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px'
                    }}
                  >
                    Quiero Invertir <ArrowRight size={20} />
                  </motion.button>
                </Link>
                <Link href="/agricultor/evaluacion" style={{ textDecoration: 'none' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    className="hero-cta-btn"
                    style={{ 
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', 
                      color: 'white', padding: '18px 36px', fontSize: '1.05rem', borderRadius: '8px',
                      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Soy Agricultor
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Decorative Floating UI Elements (Visible on larger screens) */}
            <div className="hero-decorations" style={{ position: 'relative', width: '400px', height: '500px', display: 'none' }}>
              {/* Mediante CSS podemos hacer <style> at bottom para el display */}
              <FloatingCard x="150%" y="-40" rotate={-5} delay={0.5}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(74,222,128,0.2)', padding: '12px', borderRadius: '12px' }}><TrendingUp color="#4ade80" /></div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>TIR Estimada</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>24% - 32%</p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard x="80%" y="180" rotate={3} delay={0.8}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src="/img/farmer_premium.png" alt="Farmer" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #4ade80' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Cultivo de Quinua</p>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Financiado en 48h</p>
                    </div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard x="200%" y="300" rotate={-2} delay={1.1}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Rendimiento</p>
                  <div style={{ width: '160px', height: '40px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                     {[30, 45, 60, 80, 100].map((h, i) => (
                       <motion.div key={i} 
                         initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 1.5 + (i*0.1), duration: 0.5 }}
                         style={{ flex: 1, background: 'linear-gradient(to top, #16a34a, #4ade80)', borderRadius: '4px 4px 0 0' }} 
                       />
                     ))}
                  </div>
                </div>
              </FloatingCard>
            </div>

          </div>
        </div>

        {/* CSS Scoped para esconder las decoraciones en móviles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media(min-width: 1024px) {
            .hero-decorations { display: block !important; }
          }
          @media(max-width: 768px) {
            .hero-title-main { font-size: 2.8rem !important; }
            .hero-subtitle { font-size: 1rem !important; margin-bottom: 32px !important; }
            .hero-cta-btn { padding: 14px 28px !important; font-size: 0.95rem !important; width: 100%; justify-content: center; }
          }
        `}} />
      </section>

      {/* STATS SECTION */}
      <section className="section" style={{ background: 'var(--background)', position: 'relative', zIndex: 10, marginTop: '-50px', paddingTop: '0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            <StatCounter value={PLATFORM_STATS.activeProjects} label="Proyectos Activos" icon={<TrendingUp size={32} />} />
            <StatCounter value={PLATFORM_STATS.investors} label="Inversionistas Globales" icon={<Globe size={32} />} />
            <StatCounter value={380000} label="Capital Desplegado" prefix="$" icon={<BarChart3 size={32} />} />
            <StatCounter value={PLATFORM_STATS.familiesImpacted} label="Familias Beneficiadas" icon={<Users size={32} />} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: 'var(--background)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: 'var(--verde-500)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Flujo Transparente</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>El Ecosistema Agrocapital</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
            {/* Farmer flow */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} style={{ background: 'var(--surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(201, 132, 44, 0.1)', padding: '12px', borderRadius: '12px' }}><Leaf color="var(--tierra-500)" size={28} /></div>
                <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Ciclo del Agricultor</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {[
                  { step: '01', title: 'ONBOARDING IA', desc: 'Registro digital geo-referenciado y validación de parcela mediante satélites en < 5 minutos.' },
                  { step: '02', title: 'EVALUACIÓN DE RIESGO', desc: 'Algoritmos perfilan el potencial agronómico, proyectan rendimientos y asignan un score crediticio.' },
                  { step: '03', title: 'FONDEO DE CAMPAÑA', desc: 'Acceso a capital productivo para insumos, tecnología y jornales, sin usura.' },
                  { step: '04', title: 'COSECHA Y VENTA', desc: 'Conexión con mercados formales para asegurar precio justo y pagar a inversores.' },
                ].map((item, i) => (
                  <div key={item.step} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
                    {i !== 3 && <div style={{ position: 'absolute', top: '40px', left: '16px', width: '2px', height: 'calc(100% - 10px)', background: 'var(--border)' }} />}
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--tierra-500)', background: 'var(--background)', border: '2px solid var(--border)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, zIndex: 1 }}>
                      {item.step}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.95rem', letterSpacing: '0.05em', color: 'var(--text)' }}>{item.title}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Investor flow */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} style={{ background: 'var(--surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'rgba(22, 163, 74, 0.1)', padding: '12px', borderRadius: '12px' }}><TrendingUp color="var(--verde-500)" size={28} /></div>
                <h3 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Ciclo del Inversor</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
                {[
                  { step: '01', title: 'DISCOVERY', desc: 'Exploración de portafolio con métricas claras: TIR proyectada, ROI de campaña y riesgo validado.' },
                  { step: '02', title: 'ALOCACIÓN DE CAPITAL', desc: 'Inversión digital y segura en múltiples proyectos para diversificar riesgo agrícola.' },
                  { step: '03', title: 'TRAZABILIDAD', desc: 'Seguimiento por satélite y reportes fotográficos de cómo crecen los cultivos financiados.' },
                  { step: '04', title: 'RETORNO LÍQUIDO', desc: 'Acreditación del capital + rentabilidad tras la comercialización de la cosecha en mercado.' },
                ].map((item, i) => (
                  <div key={item.step} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
                    {i !== 3 && <div style={{ position: 'absolute', top: '40px', left: '16px', width: '2px', height: 'calc(100% - 10px)', background: 'var(--border)' }} />}
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--verde-500)', background: 'var(--background)', border: '2px solid var(--border)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, zIndex: 1 }}>
                      {item.step}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.95rem', letterSpacing: '0.05em', color: 'var(--text)' }}>{item.title}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RISK REDUCTION SECTION */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: 'var(--verde-500)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Seguridad de Inversión</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Tu inversión, respaldada en cada paso
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            {[
              { icon: <ShieldCheck size={32} />, title: 'Plan de negocio real', copy: 'Cada proyecto pasa por un análisis de viabilidad. Si no es rentable, sugerimos alternativas antes de publicarlo.' },
              { icon: <Leaf size={32} />, title: 'Insumos certificados', copy: 'Conectamos al agricultor con proveedores verificados. El capital se invierte en calidad desde el primer día.' },
              { icon: <BarChart3 size={32} />, title: 'Acompañamiento técnico', copy: 'Especialistas monitorean el avance productivo y corrigen desviaciones antes de que afecten el retorno.' },
              { icon: <Users size={32} />, title: 'Conexión con compradores', copy: 'Facilitamos el acceso a compradores formales para que la cosecha se venda al mejor precio posible.' },
            ].map((card, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card" style={{ padding: '32px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '20px' }}
              >
                <div style={{ color: 'var(--verde-500)', marginBottom: '20px' }}>{card.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px' }}>{card.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{card.copy}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/como-funciona" style={{ textDecoration: 'none', color: 'var(--verde-500)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Conoce cómo funciona nuestro modelo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section" style={{ background: 'var(--background)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}
          >
            <div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--verde-500)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Sprout size={18} /> Proyectos Destacados
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                Donde la rentabilidad<br />encuentra el propósito.
              </h2>
            </div>
            <Link href="/proyectos" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ x: 5 }}
                className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
              >
                Ver {allProjectsCount} proyectos <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {featuredProjects.map((project, idx) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA FINAL WITH NEW FARMER IMAGE */}
      <section className="section" style={{
        position: 'relative',
        background: '#0a1612', // Fallback
        overflow: 'hidden',
        color: 'white'
      }}>
        {/* Cinematic gradient and image background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url("/img/farmer_premium.png") center 30%/cover no-repeat',
          opacity: 0.4,
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(8,30,16,0.9) 0%, rgba(10,35,20,0.8) 50%, rgba(20,50,25,0.7) 100%)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center', zIndex: 10, padding: '40px 0' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            style={{ maxWidth: '700px', margin: '0 auto' }}
          >
            <ShieldCheck size={48} color="#4ade80" style={{ margin: '0 auto 24px' }} />
            <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
               Cosecha <span style={{ color: '#4ade80' }}>utilidades.</span> <br/>
               Inyecta <span style={{ fontStyle: 'italic', fontWeight: 400 }}>vida.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '48px', fontSize: '1.2rem', lineHeight: 1.7, fontWeight: 400 }}>
              Sé parte del vehículo de financiamiento rural más avanzado de Latinoamérica. 
              El campo necesita liquidez; tu cartera necesita rentabilidad auténtica protegida contra la inflación.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/proyectos" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{
                  background: 'var(--verde-500)', border: 'none', color: 'white', padding: '18px 40px', 
                  fontSize: '1rem', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  Explorar Portafolio <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/agricultor/registro" style={{ textDecoration: 'none' }}>
                <motion.button whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }} style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', 
                  padding: '18px 40px', fontSize: '1rem', borderRadius: '8px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase'
                }}>
                  Solicitar Capital
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

