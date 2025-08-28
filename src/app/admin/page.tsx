'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Submission {
  id: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
  task: {
    description: string;
    score: number;
  };
  user: {
    username: string;
    table: {
      name: string;
    };
  };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // TODO: Verificare se l'utente è admin
    if (session && status === 'authenticated') {
      fetchSubmissions();
    }
  }, [session, status, router]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa submission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Rimuovi la submission dalla lista locale
        setSubmissions(submissions.filter(s => s.id !== submissionId));
      } else {
        alert('Errore durante l\'eliminazione');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  const toggleGamePause = async () => {
    try {
      const response = await fetch('/api/admin/game-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: gamePaused ? 'resume' : 'pause',
        }),
      });

      if (response.ok) {
        setGamePaused(!gamePaused);
      } else {
        alert('Errore durante il cambio di stato del gioco');
      }
    } catch (error) {
      console.error('Error toggling game state:', error);
      alert('Errore durante il cambio di stato del gioco');
    }
  };

  if (status === 'loading') {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>⚙️ Pannello Amministrazione</h1>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Redirect gestito da useEffect
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="twelve columns">
          <h1>⚙️ Pannello Amministrazione</h1>
          <p className="lead">
            Gestisci il Wedding Game e monitora le attività dei partecipanti
          </p>
        </div>
      </div>

      <div className="row">
        <div className="six columns">
          <h3>🎮 Controllo del Gioco</h3>
          <div className="row">
            <div className="twelve columns">
              <button
                onClick={toggleGamePause}
                className={`button u-full-width ${gamePaused ? 'button-primary' : 'button-danger'}`}
              >
                {gamePaused ? '▶️ Riavvia Gioco' : '⏸️ Pausa Gioco'}
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <Link href="/admin/leaderboard" className="button u-full-width">
              📊 Gestisci Classifica
            </Link>
          </div>
        </div>

        <div className="six columns">
          <h3>📊 Statistiche</h3>
          <div className="row">
            <div className="six columns">
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <h4>{submissions.length}</h4>
                <p>Submission Totali</p>
              </div>
            </div>
            <div className="six columns">
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <h4>{new Set(submissions.map(s => s.user.username)).size}</h4>
                <p>Partecipanti Attivi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: '2rem' }}>
        <div className="twelve columns">
          <h3>📋 Tutte le Submission</h3>
          
          {loading ? (
            <p>Caricamento submission...</p>
          ) : submissions.length === 0 ? (
            <div className="alert alert-info">
              <strong>Nessuna submission ancora!</strong>
              <p>I partecipanti devono completare i task per vedere le submission qui.</p>
            </div>
          ) : (
            <div className="u-full-width">
              <table className="u-full-width">
                <thead>
                  <tr>
                    <th>Utente</th>
                    <th>Tavolo</th>
                    <th>Task</th>
                    <th>Punteggio</th>
                    <th>Data</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.user.username}</td>
                      <td>{submission.user.table.name}</td>
                      <td>{submission.task.description}</td>
                      <td style={{ color: submission.task.score >= 0 ? 'green' : 'red' }}>
                        {submission.task.score >= 0 ? '+' : ''}{submission.task.score}
                      </td>
                      <td>{new Date(submission.createdAt).toLocaleDateString('it-IT')}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteSubmission(submission.id)}
                          className="button button-danger"
                          style={{ fontSize: '0.8em' }}
                        >
                          🗑️ Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  );
}
