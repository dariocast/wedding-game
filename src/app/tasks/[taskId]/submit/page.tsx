'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Task {
  id: string;
  description: string;
  score: number;
}

export default function SubmitTaskPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const taskId = params.taskId as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const tasks = await response.json();
        const currentTask = tasks.find((t: Task) => t.id === taskId);
        if (currentTask) {
          setTask(currentTask);
        } else {
          setError('Task non trovato');
        }
      }
    } catch {
      setError('Errore nel caricamento del task');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verifica il tipo di file
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Seleziona un file immagine o video valido');
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Seleziona un file prima di inviare');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('userId', session!.user.id);
      formData.append('file', selectedFile);

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(true);
        console.log('Submission successful:', result);
        
        // Reindirizza alla lista task dopo 2 secondi
        setTimeout(() => {
          window.location.href = '/tasks';
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Errore durante l\'invio');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setSubmitting(false);
    }
  };

  // Verifica autenticazione
  if (status === 'loading') {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📤 Completa Task</h1>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📤 Completa Task</h1>
            <div className="alert alert-error">
              <strong>Accesso richiesto</strong><br />
              Devi accedere per completare i task.
            </div>
            <Link href="/auth/login" className="button button-primary">
              Accedi
            </Link>
            <Link href="/" className="button" style={{ marginLeft: '1rem' }}>
              ← Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📤 Completa Task</h1>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📤 Completa Task</h1>
            <div className="alert alert-error">
              <strong>Errore:</strong> {error}
            </div>
            <Link href="/tasks" className="button">
              ← Torna ai Task
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>🎉 Task Completato!</h1>
            <div className="alert alert-success">
              <strong>Congratulazioni!</strong> Hai completato il task con successo!
            </div>
            <p>Il tuo file è stato caricato e i punti sono stati assegnati al tuo tavolo.</p>
            
            <div style={{ marginTop: '2rem' }}>
              <Link href="/tasks" className="button">
                ← Vedi Altri Task
              </Link>
              <Link href="/" className="button button-primary" style={{ marginLeft: '1rem' }}>
                🏠 Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="twelve columns">
          <h1>📤 Completa Task</h1>
          
          {task && (
            <div className="row" style={{ marginBottom: '2rem' }}>
              <div className="twelve columns">
                <h3>{task.description}</h3>
                <p>
                  Punteggio: <strong style={{ color: task.score >= 0 ? 'green' : 'red' }}>
                    {task.score >= 0 ? '+' : ''}{task.score}
                  </strong>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="twelve columns">
                <label htmlFor="file">Seleziona Foto o Video</label>
                <input
                  type="file"
                  id="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="u-full-width"
                  required
                />
                <p className="help-text">
                  Accettiamo file immagine (JPG, PNG, GIF) e video (MP4, MOV, AVI)
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

            <div className="row" style={{ marginTop: '2rem' }}>
              <div className="twelve columns">
                <button
                  type="submit"
                  className="button button-primary u-full-width"
                  disabled={!selectedFile || submitting}
                >
                  {submitting ? 'Invio in corso...' : 'Completa Task'}
                </button>
              </div>
            </div>
          </form>

          <div className="row" style={{ marginTop: '2rem' }}>
            <div className="twelve columns">
              <Link href="/tasks" className="button">
                ← Torna ai Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
