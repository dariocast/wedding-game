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
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="six columns offset-by-three">
          <h1>📝 Registrati</h1>
          <p className="lead">
            Crea il tuo account per partecipare al Wedding Game!
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
                  minLength={3}
                />
                <p className="help-text">
                  Scegli un username unico di almeno 3 caratteri
                </p>
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
                  minLength={6}
                />
                <p className="help-text">
                  La password deve essere di almeno 6 caratteri
                </p>
              </div>
            </div>

            <div className="row">
              <div className="twelve columns">
                <label htmlFor="confirmPassword">Conferma Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="u-full-width"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="row">
              <div className="twelve columns">
                <label htmlFor="table">Seleziona il tuo Tavolo</label>
                <select
                  id="table"
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="u-full-width"
                  required
                  disabled={loading}
                >
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </select>
                <p className="help-text">
                  Il tavolo rappresenta la tua squadra nel gioco
                </p>
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
                  {loading ? 'Registrazione in corso...' : 'Registrati'}
                </button>
              </div>
            </div>
          </form>

          <div className="row" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div className="twelve columns">
              <p>
                Hai già un account?{' '}
                <Link href="/auth/login" className="button">
                  Accedi
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
