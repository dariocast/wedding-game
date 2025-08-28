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
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>⚙️</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Pannello Admin
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div className="animate-float">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
          </div>
          <p style={{ color: 'var(--wedding-cerulean)', fontSize: '1.1rem' }}>
            Caricamento pannello amministrazione...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Redirect gestito da useEffect
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>⚙️</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Pannello Admin
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--wedding-prussian)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Gestisci il Wedding Game e monitora le attività dei partecipanti! 👑
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Admin Controls Grid */}
      <div className="grid-wedding grid-wedding-2 mb-4">
        {/* Game Control Card */}
        <div className="card-wedding">
          <div className="text-center mb-3">
            <h3 style={{ 
              color: 'var(--wedding-prussian)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              🎮 Controllo Gioco
            </h3>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={toggleGamePause}
              className={gamePaused ? 'btn-wedding-primary w-full' : 'btn-wedding-secondary w-full'}
              style={{ 
                fontSize: '1.1rem',
                padding: '1rem'
              }}
            >
              {gamePaused ? '▶️ Riavvia Gioco' : '⏸️ Pausa Gioco'}
            </button>
            
            <Link 
              href="/admin/leaderboard" 
              className="btn-wedding-outline w-full block text-center"
              style={{ marginTop: '1rem' }}
            >
              📊 Gestisci Classifica & Task
            </Link>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="card-wedding">
          <div className="text-center mb-3">
            <h3 style={{ 
              color: 'var(--wedding-prussian)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              📊 Statistiche Live
            </h3>
          </div>
          
          <div className="grid-wedding-2" style={{ gap: '1rem' }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.1), rgba(0, 126, 167, 0.05))',
              border: '1px solid rgba(0, 167, 225, 0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: 'var(--wedding-picton)',
                marginBottom: '0.5rem'
              }}>
                {submissions.length}
              </div>
              <p style={{ color: 'var(--wedding-prussian)', fontWeight: '600', margin: 0 }}>
                📤 Submission Totali
              </p>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, rgba(0, 126, 167, 0.1), rgba(0, 52, 89, 0.05))',
              border: '1px solid rgba(0, 126, 167, 0.2)',
              borderRadius: '12px'
            }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: 'var(--wedding-cerulean)',
                marginBottom: '0.5rem'
              }}>
                {new Set(submissions.map(s => s.user.username)).size}
              </div>
              <p style={{ color: 'var(--wedding-prussian)', fontWeight: '600', margin: 0 }}>
                👥 Partecipanti Attivi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Management */}
      <div className="card-wedding">
        <div className="text-center mb-3">
          <h3 style={{ 
            color: 'var(--wedding-prussian)', 
            fontSize: '1.8rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            📋 Gestione Submission
          </h3>
        </div>
        
        {loading ? (
          <div className="text-center p-4">
            <div className="animate-float">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
            </div>
            <p style={{ color: 'var(--wedding-cerulean)' }}>
              Caricamento submission...
            </p>
          </div>
        ) : submissions.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.1), rgba(0, 126, 167, 0.05))',
            border: '1px solid rgba(0, 167, 225, 0.3)',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
            <h4 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>Nessuna Submission</h4>
            <p style={{ color: 'var(--wedding-cerulean)' }}>
              I partecipanti devono completare i task per vedere le submission qui.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
                  color: 'white'
                }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>👤 Utente</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>🏆 Tavolo</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>📋 Task</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>🎯 Punti</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>📅 Data</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>⚡ Azioni</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={submission.id} style={{ 
                    borderBottom: '1px solid rgba(0, 167, 225, 0.1)',
                    backgroundColor: index % 2 === 0 ? 'rgba(0, 167, 225, 0.02)' : 'transparent'
                  }}>
                    <td style={{ 
                      padding: '12px', 
                      fontWeight: '600',
                      color: 'var(--wedding-prussian)'
                    }}>
                      {submission.user.username}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      color: 'var(--wedding-cerulean)',
                      fontWeight: '500'
                    }}>
                      {submission.user.table.name}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      color: 'var(--wedding-black)',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {submission.task.description}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      fontWeight: '700',
                      color: submission.task.score >= 0 ? '#28a745' : '#dc3545'
                    }}>
                      {submission.task.score >= 0 ? '+' : ''}{submission.task.score}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      color: 'var(--wedding-cerulean)',
                      fontSize: '0.9rem'
                    }}>
                      {new Date(submission.createdAt).toLocaleDateString('it-IT')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        style={{
                          background: 'linear-gradient(135deg, #dc3545, #c82333)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
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

      {/* Back Button */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <Link href="/" className="btn-wedding-outline">
          ← Torna alla Home
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="flex justify-center items-center space-x-2">
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0s' }}>⚙️</span>
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>👑</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>📊</span>
        </div>
      </div>
    </div>
  );
}
