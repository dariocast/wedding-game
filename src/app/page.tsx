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
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="twelve columns">
          <h1>🎉 Wedding Game - Dario & Roberta</h1>
          <p className="lead">
            Benvenuti al gioco interattivo per il nostro matrimonio! 
            Completa i task, carica foto e video, e compete con il tuo tavolo per vincere!
          </p>
        </div>
      </div>

      <div className="row">
        <div className="six columns">
          <h3>🏆 Classifica Tavoli</h3>
          <div className="u-full-width">
            {loading ? (
              <p>Caricamento classifica...</p>
            ) : (
              <table className="u-full-width">
                <thead>
                  <tr>
                    <th>Posizione</th>
                    <th>Tavolo</th>
                    <th>Punteggio</th>
                    <th>Partecipanti</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((table, index) => (
                    <tr key={table.id}>
                      <td>{index + 1}°</td>
                      <td>{table.name}</td>
                      <td>{table.score}</td>
                      <td>{table.userCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="six columns">
          <h3>🚀 Inizia a Giocare</h3>
          
          {status === 'loading' ? (
            <p>Caricamento...</p>
          ) : session ? (
            <div>
              <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                <strong>Benvenuto, {session.user.username}!</strong><br />
                Tavolo: {session.user.tableName}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <a href="/tasks" className="button button-primary u-full-width">
                  📋 Vedi Tutti i Task
                </a>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <a href="/gallery" className="button u-full-width">
                  🖼️ Galleria Foto/Video
                </a>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Link href="/admin" className="button u-full-width">
                  ⚙️ Pannello Admin
                </Link>
              </div>

              <div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="button u-full-width"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="row">
                <div className="six columns">
                  <a href="/auth/login" className="button button-primary u-full-width">
                    Accedi
                  </a>
                </div>
                <div className="six columns">
                  <a href="/auth/register" className="button u-full-width">
                    Registrati
                  </a>
                </div>
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                <a href="/tasks" className="button button-primary u-full-width">
                  📋 Vedi Tutti i Task
                </a>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <a href="/gallery" className="button u-full-width">
                  🖼️ Galleria Foto/Video
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row" style={{ marginTop: '3rem' }}>
        <div className="twelve columns">
          <h3>📱 Come Funziona</h3>
          <div className="row">
            <div className="four columns">
              <h5>1. Registrati</h5>
              <p>Scegli il tuo username e seleziona il tavolo (squadra)</p>
            </div>
            <div className="four columns">
              <h5>2. Completa i Task</h5>
              <p>Carica foto o video per completare i task e guadagna punti</p>
            </div>
            <div className="four columns">
              <h5>3. Vinci</h5>
              <p>Il tavolo con più punti vince il Wedding Game!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
