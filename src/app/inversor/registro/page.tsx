'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, User as UserIcon, Mail, Globe, 
  Phone, Linkedin, Lock, ArrowRight, CheckCircle2, 
  AlertCircle, TrendingUp, BarChart3, Users 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { MOCK_PROJECTS } from '@/lib/mock-data';

const COUNTRIES = [
  'España', 'Estados Unidos', 'Japón', 'Alemania', 'Perú', 'Colombia', 'Chile', 
  'Argentina', 'México', 'Reino Unido', 'Francia', 'Suiza', 'Canadá', 
  'Australia', 'Brasil', 'Italia', 'Países Bajos', 'Singapur', 'Otro'
];

function InversorRegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, checkEmail } = useAuth();
  
  const projectId = searchParams.get('proyecto');
  const linkedProject = MOCK_PROJECTS.find(p => p.id === projectId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    linkedin: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.trim().length < 3) {
      newErrors.name = 'Ingresa tu nombre completo.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    } else if (checkEmail(formData.email)) {
      newErrors.email = 'Este correo ya tiene una cuenta registrada.';
    }

    if (!formData.country) {
      newErrors.country = 'Selecciona tu país de residencia.';
    }

    if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Ingresa un número de celular válido.';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newUser = {
        id: `inv-${Date.now()}`,
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        country: formData.country,
        linkedin: formData.linkedin || undefined,
        password: formData.password, // Simulated hash
        role: 'inversor' as const,
        status: 'activo' as const,
        registeredAt: new Date().toISOString()
      };

      register(newUser);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push('/inversor/dashboard');
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '24px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: '400px' }}
        >
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={48} color="var(--verde-500)" />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '16px' }}>¡Bienvenido!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Tu cuenta ha sido creada. Prepárate para explorar proyectos con alto impacto y retorno.
          </p>
          <div style={{ width: '40px', height: '4px', background: 'var(--verde-500)', borderRadius: '2px', margin: '0 auto', animation: 'progress 2s linear' }} />
        </motion.div>
        <style>{`
          @keyframes progress {
            from { width: 0; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
      {/* Visual Side */}
      <div className="signup-hero" style={{ 
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #064e3b, #022c22)' 
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url("https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,44,34,0.9), transparent)' }} />
        
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', color: 'white' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="badge badge-verde" style={{ marginBottom: '24px', background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>💼 Portal de Inversores</div>
            <h2 className="font-display" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '32px', letterSpacing: '-0.02em' }}>
              Capital con <br />corazón andino.
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
              {[
                { icon: <TrendingUp size={24} />, title: 'Retorno Atractivo', sub: 'Proyecciones de 15% a 35% anual.' },
                { icon: <BarChart3 size={24} />, title: 'Datos Verificados', sub: 'Indicadores financieros auditados por IA.' },
                { icon: <Users size={24} />, title: 'Impacto Real', sub: 'Mejoramos la vida de familias rurales.' },
              ].map((feature, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>{feature.icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem' }}>{feature.title}</p>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{feature.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {linkedProject && (
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundImage: `url('${linkedProject.crop.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inversión Sugerida</p>
                  <p style={{ fontWeight: 700 }}>{linkedProject.crop.name} · {linkedProject.farmerName}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%', maxWidth: '480px' }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '8px' }}>Únete como Inversor</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Accede a oportunidades exclusivas de inversión agrícola.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserIcon size={16} /> Nombre completo
              </label>
              <input 
                className={`input ${errors.name ? 'error' : ''}`}
                placeholder="Ej: Elena Rodríguez"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Correo electrónico
              </label>
              <input 
                className={`input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                 <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.email}
                 </motion.p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Country */}
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} /> País
                </label>
                <select 
                  className={`input ${errors.country ? 'error' : ''}`}
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  style={{ padding: '14px' }}
                >
                  <option value="">Selecciona...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.country}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} /> Celular
                </label>
                <input 
                  className={`input ${errors.phone ? 'error' : ''}`}
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.phone}</p>}
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Linkedin size={16} /> LinkedIn (opcional)
              </label>
              <input 
                className="input"
                placeholder="linkedin.com/in/tu-perfil"
                value={formData.linkedin}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Password */}
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} /> Contraseña
                </label>
                <input 
                  className={`input ${errors.password ? 'error' : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} /> Confirmar
                </label>
                <input 
                  className={`input ${errors.confirmPassword ? 'error' : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.confirmPassword}</p>}
              </div>
            </div>

            <button 
              className="btn-primary" 
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '16px', justifyContent: 'center', marginTop: '12px' }}
            >
              {isSubmitting ? 'Registrando...' : 'Empezar a Invertir'} <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ¿Ya tienes una cuenta? <Link href="/login" style={{ color: 'var(--verde-500)', fontWeight: 700, textDecoration: 'none' }}>Inicia sesión</Link>
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .error {
          border-color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.02);
        }
        .signup-hero {
          display: none;
        }
        @media (min-width: 1024px) {
          .signup-hero {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}

export default function InversorRegistro() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>}>
      <InversorRegistroContent />
    </Suspense>
  );
}
