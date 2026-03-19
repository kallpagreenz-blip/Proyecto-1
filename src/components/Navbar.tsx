'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/proyectos', label: 'PROYECTOS' },
    { href: '/como-funciona', label: 'CÓMO FUNCIONA' },
    { href: '/impacto', label: 'IMPACTO' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      borderBottom: pathname === '/' && !user ? 'none' : '1px solid var(--border)',
      background: pathname === '/' && !user ? 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)' : 'rgba(14, 26, 20, 0.95)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            AgroCapital
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hide-mobile">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'white',
              opacity: isActive(link.href) ? 1 : 0.7,
              background: 'transparent',
              transition: 'opacity 0.2s',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs / User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!user ? (
            <>
              <Link href="/login" style={{ 
                textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginRight: '8px'
              }}>
                INICIAR SESIÓN
              </Link>
              <Link href="/agricultor/registro" style={{ 
                textDecoration: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' 
              }}>
                AGRICULTOR
              </Link>
              <Link href="/inversor/registro" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  background: 'transparent', border: '1px solid white', color: 'white', 
                  padding: '6px 14px', fontSize: '0.75rem', borderRadius: '4px',
                  fontWeight: 600, letterSpacing: '0.1em', cursor: 'pointer'
                }}>
                  INVERTIR
                </button>
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right', lineHeight: 1 }}>
                <p style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{user?.name}</p>
                <p style={{ color: 'var(--verde-400)', fontSize: '0.65rem', textTransform: 'uppercase', marginTop: '2px' }}>{user?.role}</p>
              </div>
              <Link href={user?.role === 'agricultor' ? '/agricultor/dashboard' : '/inversor/dashboard'} style={{ textDecoration: 'none' }}>
                <button style={{ 
                  background: 'var(--verde-600)', border: 'none', color: 'white', 
                  padding: '6px 14px', fontSize: '0.75rem', borderRadius: '4px',
                  fontWeight: 600, letterSpacing: '0.1em', cursor: 'pointer'
                }}>
                  DASHBOARD
                </button>
              </Link>
              <button onClick={logout} style={{ 
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', 
                fontSize: '0.65rem', cursor: 'pointer', padding: '0'
              }}>
                SALIR
              </button>
            </div>
          )}
          
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', paddingLeft: '8px' }}>ADMIN</span>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
