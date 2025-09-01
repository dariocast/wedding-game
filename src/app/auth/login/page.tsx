'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Username o password non validi');
      } else {
        // Login riuscito, reindirizza alla home
        router.push('/');
        router.refresh();
      }
          } catch {
        setError('Errore durante il login');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>💍</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Benvenuto
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--primary-color)', 
          maxWidth: '500px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Accedi al tuo account per partecipare al Wedding Quest di Dario & Roberta! 💕
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Login Form Card */}
      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        <div className="card-wedding">
          <div className="text-center mb-3">
            <h2 style={{ 
              color: 'var(--primary-color)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              🔐 Accedi
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="mb-3">
              <label 
                htmlFor="username" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--primary-color)', 
                  fontWeight: '600' 
                }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-wedding"
                placeholder="Inserisci il tuo username"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--primary-color)', 
                  fontWeight: '600' 
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-wedding"
                placeholder="Inserisci la tua password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-3">
                <div style={{
                  background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#dc3545',
                  textAlign: 'center'
                }}>
                  <strong>⚠️ Errore:</strong> {error}
                </div>
              </div>
            )}

            <div className="mb-3">
              <button
                type="submit"
                className="btn-wedding-primary w-full"
                disabled={loading}
                style={{ 
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span>
                    <span className="animate-float" style={{ marginRight: '0.5rem' }}>⏳</span>
                    Accesso in corso...
                  </span>
                ) : (
                  <span>
                    💍 Accedi
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Links Section */}
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
              Non hai un account?
            </p>
            <Link href="/auth/register" className="btn-wedding-secondary w-full block text-center mb-2">
              ✨ Registrati
            </Link>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0, 167, 225, 0.2)' }}>
              <Link href="/" className="btn-wedding-outline w-full block text-center">
                ← Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="flex justify-center items-center space-x-2">
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0s' }}>💕</span>
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>✨</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>💍</span>
        </div>
      </div>
    </div>
  );
}
