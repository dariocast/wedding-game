'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
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
    } catch (err) {
      setError('Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="six columns offset-by-three">
          <h1>🔐 Accedi</h1>
          <p className="lead">
            Accedi al tuo account per partecipare al Wedding Game!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="twelve columns">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="u-full-width"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="row">
              <div className="twelve columns">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="u-full-width"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="row">
                <div className="twelve columns">
                  <div className="alert alert-error">
                    <strong>Errore:</strong> {error}
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <div className="twelve columns">
                <button
                  type="submit"
                  className="button button-primary u-full-width"
                  disabled={loading}
                >
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </button>
              </div>
            </div>
          </form>

          <div className="row" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div className="twelve columns">
              <p>
                Non hai un account?{' '}
                <Link href="/auth/register" className="button">
                  Registrati
                </Link>
              </p>
            </div>
          </div>

          <div className="row" style={{ marginTop: '2rem' }}>
            <div className="twelve columns">
              <Link href="/" className="button">
                ← Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
