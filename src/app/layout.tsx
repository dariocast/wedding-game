import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import './globals.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Wedding Game - Dario & Roberta",
  description: "Un'esperienza interattiva elegante per celebrare il matrimonio di Dario e Roberta con foto, video e sfide divertenti per gli ospiti.",
  keywords: "matrimonio, gioco, wedding, interattivo, foto, video, ospiti, Dario, Roberta",
  authors: [{ name: "Wedding Game Team" }],
  openGraph: {
    title: "Wedding Game - Dario & Roberta",
    description: "Un'esperienza interattiva elegante per celebrare il matrimonio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          {/* Wedding Background Pattern */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--wedding-radial)',
            opacity: 0.03,
            zIndex: -1
          }}></div>
          
          {/* Navigation Header */}
          <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 167, 225, 0.1)',
            boxShadow: '0 2px 10px rgba(0, 52, 89, 0.05)'
          }}>
            <div className="container-wedding">
              <div className="flex justify-between items-center" style={{ height: '70px' }}>
                <div className="flex items-center space-x-2">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 167, 225, 0.3)'
                  }}>
                    <span style={{ fontSize: '20px' }}>💒</span>
                  </div>
                  <h1 className="font-elegant" style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean), var(--wedding-prussian))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Wedding Game
                  </h1>
                </div>
                
                {/* Decorative Hearts */}
                <div className="hidden md:flex items-center space-x-2">
                  <span className="animate-float" style={{ fontSize: '1.2rem', animationDelay: '0s' }}>💕</span>
                  <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>✨</span>
                  <span className="animate-float" style={{ fontSize: '1.2rem', animationDelay: '1s' }}>💍</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="container-wedding" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '2rem', paddingBottom: '2rem' }}>
            {children}
          </main>
          
          {/* Footer */}
          <footer className="card-wedding-dark" style={{ margin: '0', borderRadius: '0', marginTop: '4rem' }}>
            <div className="container-wedding">
              <div className="text-center">
                <div className="flex justify-center items-center space-x-2 mb-2">
                  <span style={{ fontSize: '1.5rem' }}>💕</span>
                  <span className="font-elegant" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Wedding Game</span>
                  <span style={{ fontSize: '1.5rem' }}>💕</span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Un&apos;esperienza matrimoniale indimenticabile per Dario & Roberta
                </p>
                <div className="wedding-divider" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3))' }}></div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Creato con ❤️ per celebrare l&apos;amore
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
