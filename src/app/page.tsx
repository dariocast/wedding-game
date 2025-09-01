'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  userCount: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>💒</span>
        </div>
        <h1 className="heading-wedding">D&R Wedding Quest</h1>
        <h2 className="subheading-wedding" style={{ marginBottom: '2rem' }}>Dario & Roberta</h2>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--wedding-prussian)', 
          maxWidth: '600px', 
          margin: '0 auto 3rem auto',
          lineHeight: '1.8'
        }}>
          Benvenuti alla nostra quest matrimoniale interattiva! 💕<br />
          Completate i task, caricate foto e video, e competete con il vostro tavolo per vincere premi speciali!
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Main Content Grid */}
      <div className="grid-wedding grid-wedding-2">
        {/* Leaderboard Card */}
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
              🏆 Classifica Tavoli
            </h3>
          </div>
          
          {loading ? (
            <div className="text-center p-4">
              <div className="animate-float">
                <span style={{ fontSize: '2rem' }}>⏳</span>
              </div>
              <p style={{ color: 'var(--wedding-cerulean)', marginTop: '1rem' }}>
                Caricamento classifica...
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
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600' }}>Pos.</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Tavolo</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600' }}>Punti</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600' }}>👥</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((table, index) => (
                    <tr key={table.id} style={{ 
                      borderBottom: '1px solid rgba(0, 167, 225, 0.1)',
                      backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: index === 0 ? 'var(--wedding-picton)' : 'var(--wedding-prussian)'
                      }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        fontWeight: index === 0 ? '700' : '500',
                        color: 'var(--wedding-black)'
                      }}>
                        {table.name}
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: 'var(--wedding-cerulean)'
                      }}>
                        {table.score}
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        textAlign: 'center',
                        color: 'var(--wedding-prussian)'
                      }}>
                        {table.userCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions Card */}
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
              🚀 Inizia a Giocare
            </h3>
          </div>
          
          {status === 'loading' ? (
            <div className="text-center p-4">
              <div className="animate-float">
                <span style={{ fontSize: '2rem' }}>⏳</span>
              </div>
              <p style={{ color: 'var(--wedding-cerulean)', marginTop: '1rem' }}>
                Caricamento...
              </p>
            </div>
          ) : session ? (
            <div>
              <div className="wedding-badge" style={{ 
                width: '100%', 
                justifyContent: 'center', 
                marginBottom: '2rem',
                padding: '1rem',
                fontSize: '1rem'
              }}>
                <div className="text-center">
                  <strong>Benvenuto, {session.user.username}! 👋</strong><br />
                  <span style={{ color: 'var(--wedding-cerulean)' }}>
                    Tavolo: {session.user.tableName}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link href="/tasks" className="btn-wedding-primary w-full block text-center mb-2">
                  📋 Vedi Tutti i Task
                </Link>

                <Link href="/gallery" className="btn-wedding-secondary w-full block text-center mb-2">
                  🖼️ Galleria Foto/Video
                </Link>

                {session.user.isAdmin && (
                  <Link href="/admin" className="btn-wedding-outline w-full block text-center mb-2">
                    ⚙️ Pannello Admin
                  </Link>
                )}

                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="btn-wedding-outline w-full"
                  style={{ marginTop: '1rem' }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid-wedding-2 mb-3">
                <Link href="/auth/login" className="btn-wedding-primary text-center block">
                  💍 Accedi
                </Link>
                <Link href="/auth/register" className="btn-wedding-secondary text-center block">
                  ✨ Registrati
                </Link>
              </div>
              
              <div className="space-y-2" style={{ marginTop: '2rem' }}>
                <Link href="/tasks" className="btn-wedding-outline w-full block text-center mb-2">
                  📋 Vedi Tutti i Task
                </Link>

                <Link href="/gallery" className="btn-wedding-outline w-full block text-center">
                  🖼️ Galleria Foto/Video
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="card-wedding" style={{ marginTop: '3rem' }}>
        <h3 className="text-center" style={{ 
          color: 'var(--wedding-prussian)', 
          fontSize: '2rem', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          📱 Come Funziona
        </h3>
        
        <div className="grid-wedding grid-wedding-3">
          <div className="text-center">
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              1️⃣
            </div>
            <h4 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
              Registrati
            </h4>
            <p style={{ color: 'var(--wedding-black)', lineHeight: '1.6' }}>
              Scegli il tuo username e seleziona il tavolo (squadra) per iniziare l&apos;avventura
            </p>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--wedding-cerulean), var(--wedding-prussian))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              2️⃣
            </div>
            <h4 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
              Completa i Task
            </h4>
            <p style={{ color: 'var(--wedding-black)', lineHeight: '1.6' }}>
              Carica foto o video per completare i task divertenti e guadagna punti per il tuo tavolo
            </p>
          </div>
          
          <div className="text-center">
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--wedding-prussian), var(--wedding-picton))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              3️⃣
            </div>
            <h4 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
              Vinci Premi
            </h4>
            <p style={{ color: 'var(--wedding-black)', lineHeight: '1.6' }}>
              Il tavolo con più punti vince il D&R Wedding Quest e riceve premi speciali!
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Hearts */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="flex justify-center items-center space-x-2">
          <span className="animate-float" style={{ fontSize: '2rem', animationDelay: '0s' }}>💕</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0.3s' }}>✨</span>
          <span className="animate-float" style={{ fontSize: '2rem', animationDelay: '0.6s' }}>💍</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0.9s' }}>🎉</span>
          <span className="animate-float" style={{ fontSize: '2rem', animationDelay: '1.2s' }}>💕</span>
        </div>
      </div>
    </div>
  );
}
