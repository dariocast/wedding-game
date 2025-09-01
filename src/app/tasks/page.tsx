'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  score: number;
  isActive: boolean;
}

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        // Se non c'è sessione, mostra tutti i task
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } else {
        // Se c'è sessione, mostra solo i task disponibili (non completati)
        const response = await fetch(`/api/tasks/available?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch available tasks');
        }
        const data = await response.json();
        setTasks(data.availableTasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📋</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Task Disponibili
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div className="animate-float">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
          </div>
          <p style={{ color: 'var(--wedding-cerulean)', fontSize: '1.1rem' }}>
            Caricamento task...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📋</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Task Disponibili
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div style={{
            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            borderRadius: '8px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
            <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>Errore di Caricamento</h3>
            <p style={{ color: '#dc3545', marginBottom: '2rem' }}>{error}</p>
            <button 
              className="btn-wedding-primary" 
              onClick={fetchTasks}
            >
              🔄 Riprova
            </button>
          </div>
          
          <Link href="/" className="btn-wedding-outline">
            ← Torna alla Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📋</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Task Disponibili
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--primary-color)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          {session ? (
            <>Completa questi task per guadagnare punti per il tuo tavolo! 🏆</>
          ) : (
            <>Ecco tutti i task disponibili nel D&R Wedding Quest! Registrati per partecipare! 💕</>
          )}
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* User Info */}
      {session && (
        <div className="wedding-badge" style={{ 
          width: '100%', 
          maxWidth: '400px',
          margin: '0 auto 2rem auto',
          justifyContent: 'center', 
          padding: '1rem',
          fontSize: '1rem'
        }}>
          <div className="text-center">
            <strong>👋 {session.user.username}</strong><br />
            <span style={{ color: 'var(--wedding-cerulean)' }}>
              Tavolo: {session.user.tableName}
            </span>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <div className="card-wedding text-center">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block' }}>🎯</span>
          </div>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
            {session ? 'Ottimo Lavoro!' : 'Nessun Task Disponibile'}
          </h3>
          <p style={{ color: 'var(--wedding-cerulean)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            {session ? (
              'Hai completato tutti i task disponibili! Controlla più tardi per nuove sfide.'
            ) : (
              'Al momento non ci sono task disponibili. Torna più tardi!'
            )}
          </p>
          <Link href="/" className="btn-wedding-primary">
            🏠 Torna alla Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid-wedding grid-wedding-2">
            {tasks.map((task, index) => (
              <div key={task.id} className="card-wedding" style={{ 
                animationDelay: `${index * 0.1}s`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Task Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
                  color: 'white',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {index + 1}
                </div>

                {/* Task Content */}
                <div style={{ paddingRight: '3rem' }}>
                  <h3 style={{ 
                    color: 'var(--primary-color)', 
                    marginBottom: '0.5rem',
                    fontSize: '1.4rem',
                    lineHeight: '1.3',
                    fontWeight: '700'
                  }}>
                    {task.title}
                  </h3>
                  <p style={{ 
                    color: 'var(--wedding-cerulean)', 
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    lineHeight: '1.4',
                    opacity: 0.9
                  }}>
                    {task.description}
                  </p>
                  
                  {/* Score Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: task.score >= 0 
                      ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))'
                      : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
                    border: task.score >= 0 
                      ? '1px solid rgba(40, 167, 69, 0.3)'
                      : '1px solid rgba(220, 53, 69, 0.3)',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '1.1rem', 
                      marginRight: '0.5rem' 
                    }}>
                      {task.score >= 0 ? '🏆' : '⚠️'}
                    </span>
                    <span style={{ 
                      fontWeight: '600',
                      color: task.score >= 0 ? '#28a745' : '#dc3545'
                    }}>
                      {task.score >= 0 ? '+' : ''}{task.score} punti
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link 
                  href={`/tasks/${task.id}/submit`}
                  className="btn-wedding-primary w-full text-center block"
                  style={{ marginTop: '1rem' }}
                >
                  🎯 Completa Task
                </Link>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link href="/" className="btn-wedding-outline">
              ← Torna alla Home
            </Link>
          </div>
        </>
      )}

      {/* Decorative Elements */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="flex justify-center items-center space-x-2">
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0s' }}>🎯</span>
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>✨</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>🏆</span>
        </div>
      </div>
    </div>
  );
}
