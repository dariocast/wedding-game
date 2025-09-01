'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Table {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tableId, setTableId] = useState('');
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables');
      if (response.ok) {
        const data = await response.json();
        setTables(data);
        if (data.length > 0) {
          setTableId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validazioni
    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          tableId,
        }),
      });

      if (response.ok) {
        // Registrazione riuscita, reindirizza al login
        router.push('/auth/login?message=registration-success');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Errore durante la registrazione');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>✨</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Unisciti a Noi
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--wedding-prussian)', 
          maxWidth: '500px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Crea il tuo account per partecipare al D&R Wedding Quest di Dario & Roberta! 💕
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Registration Form Card */}
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card-wedding">
          <div className="text-center mb-3">
            <h2 style={{ 
              color: 'var(--wedding-prussian)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              📝 Registrati
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="mb-3">
              <label 
                htmlFor="username" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--wedding-prussian)', 
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
                placeholder="Scegli un username unico"
                required
                disabled={loading}
                minLength={3}
              />
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--wedding-cerulean)', 
                marginTop: '0.25rem',
                fontStyle: 'italic'
              }}>
                💡 Almeno 3 caratteri, sarà visibile agli altri giocatori
              </p>
            </div>

            <div className="mb-3">
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--wedding-prussian)', 
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
                placeholder="Crea una password sicura"
                required
                disabled={loading}
                minLength={6}
              />
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--wedding-cerulean)', 
                marginTop: '0.25rem',
                fontStyle: 'italic'
              }}>
                🔒 Almeno 6 caratteri per la sicurezza
              </p>
            </div>

            <div className="mb-3">
              <label 
                htmlFor="confirmPassword" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--wedding-prussian)', 
                  fontWeight: '600' 
                }}
              >
                Conferma Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-wedding"
                placeholder="Ripeti la password"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label 
                htmlFor="table" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: 'var(--wedding-prussian)', 
                  fontWeight: '600' 
                }}
              >
                Seleziona il tuo Tavolo
              </label>
              <select
                id="table"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="input-wedding"
                required
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </select>
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--wedding-cerulean)', 
                marginTop: '0.25rem',
                fontStyle: 'italic'
              }}>
                🏆 Il tavolo rappresenta la tua squadra nel gioco
              </p>
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
                    Registrazione in corso...
                  </span>
                ) : (
                  <span>
                    ✨ Registrati
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Links Section */}
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
              Hai già un account?
            </p>
            <Link href="/auth/login" className="btn-wedding-secondary w-full block text-center mb-2">
              💍 Accedi
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
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>🎉</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>✨</span>
        </div>
      </div>
    </div>
  );
}
