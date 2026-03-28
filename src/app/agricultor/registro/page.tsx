'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User as UserIcon, Phone, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function FarmerSignup() {
  const router = useRouter();
  const { register, checkDni } = useAuth();
  
  const [formData, setFormData] = useState({
    dni: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos numéricos.';
    } else if (checkDni(formData.dni)) {
      newErrors.dni = 'Este DNI ya tiene una cuenta registrada.';
    }

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Ingresa tu nombre completo.';
    }

    if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'El celular debe tener 9 dígitos.';
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
        id: `farmer-${Date.now()}`,
        name: formData.name,
        dni: formData.dni,
        phone: formData.phone,
        password: formData.password, // In real app, hash this before sending
        role: 'agricultor' as const,
        status: 'activo' as const,
        registeredAt: new Date().toISOString()
      };

      register(newUser);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push('/agricultor/dashboard');
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
            Tu cuenta ha sido creada con éxito. Ya puedes crear tu primer proyecto.
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
      <div className="signup-hero" style={{ 
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--verde-900), #064e3b)' 
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,78,59,0.9), transparent)' }} />
        
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', color: 'white' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <ShieldCheck size={48} style={{ marginBottom: '32px', color: 'var(--verde-400)' }} />
            <h2 className="font-display" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Empodera tu <br />esfuerzo agrícola.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '440px' }}>
              Únete a la red que conecta a productores andinos con capital global para transformar el campo peruano.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '8px' }}>Registro de Agricultor</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Crea tu cuenta única para gestionar tus proyectos.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* DNI */}
            <div style={{ position: 'relative' }}>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} /> Número de DNI (8 dígitos)
              </label>
              <input 
                className={`input ${errors.dni ? 'error' : ''}`}
                placeholder="00000000"
                maxLength={8}
                value={formData.dni}
                onChange={e => setFormData({ ...formData, dni: e.target.value.replace(/\D/g, '') })}
                style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}
              />
              {errors.dni && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {errors.dni}
                </motion.p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserIcon size={16} /> Nombre completo
              </label>
              <input 
                className={`input ${errors.name ? 'error' : ''}`}
                placeholder="Ej: Feliciano Quispe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> Número de celular (9 dígitos)
              </label>
              <input 
                className={`input ${errors.phone ? 'error' : ''}`}
                placeholder="999000000"
                maxLength={9}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              />
              {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.phone}</p>}
            </div>

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
                <Lock size={16} /> Confirmar contraseña
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

            <button 
              className="btn-primary" 
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '16px', justifyContent: 'center', marginTop: '12px' }}
            >
              {isSubmitting ? 'Procesando...' : 'Crear mi cuenta'} <ArrowRight size={20} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
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
