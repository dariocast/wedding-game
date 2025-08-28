'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Task {
  id: string;
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
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📋 Task Disponibili</h1>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📋 Task Disponibili</h1>
            <div className="alert alert-error">
              <strong>Errore:</strong> {error}
            </div>
            <button 
              className="button button-primary" 
              onClick={fetchTasks}
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="twelve columns">
          <h1>📋 Task Disponibili</h1>
          <p className="lead">
            Completa questi task per guadagnare punti per il tuo tavolo!
          </p>
        </div>
      </div>

      <div className="row">
        <div className="twelve columns">
          {tasks.length === 0 ? (
            <div className="alert alert-info">
              <strong>Nessun task disponibile al momento.</strong>
              <p>Controlla più tardi per nuovi task!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="row" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e1e1e1', borderRadius: '4px' }}>
                <div className="nine columns">
                  <h5>{task.description}</h5>
                  <p>
                    Punteggio: <strong style={{ color: task.score >= 0 ? 'green' : 'red' }}>
                      {task.score >= 0 ? '+' : ''}{task.score}
                    </strong>
                  </p>
                </div>
                <div className="three columns">
                  <a 
                    className="button button-primary u-full-width" 
                    href={`/tasks/${task.id}/submit`}
                  >
                    Completa
                  </a>
                </div>
              </div>
            ))
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
