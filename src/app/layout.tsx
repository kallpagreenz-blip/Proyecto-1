import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroCapital — Invierte en quien alimenta al mundo",
  description: "Plataforma de crowdlending agroindustrial que conecta pequeños y medianos productores agropecuarios del Perú con inversores internacionales.",
  keywords: "crowdlending, agricultura, inversión, impacto social, Perú, agro",
  openGraph: {
    title: "AgroCapital — Invierte en quien alimenta al mundo",
    description: "Conectamos el campo con el capital global. Financiamiento productivo para agricultores peruanos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)', padding: '48px 0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--verde-600), var(--capital-600))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🌱</div>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>AgroCapital</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                  "Invierte en quien alimenta al mundo."
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Plataforma</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Proyectos', 'Cómo funciona', 'Impacto', 'Para agricultores'].map(item => (
                    <li key={item}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Legal</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['Términos y condiciones', 'Política de privacidad', 'Riesgos de inversión', 'Contáctanos'].map(item => (
                    <li key={item}><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Contacto</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>hola@agrocapital.pe</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Lima, Perú</p>
                </div>
              </div>
            </div>
            <div className="divider" style={{ margin: '40px 0 24px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 AgroCapital. Todos los derechos reservados.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>MVP — Fase 1 | Perú 🇵🇪</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
