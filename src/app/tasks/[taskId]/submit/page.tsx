'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { compressFile, CompressionResult } from '../../../../utils/fileCompression';

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
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [compressing, setCompressing] = useState(false);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCompressedFile(null);
      setCompressionInfo(null);
      setError(null);
      
      // Verifica il tipo di file
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError('Seleziona un\'immagine o un video');
        setSelectedFile(null);
        return;
      }

      // Comprimi automaticamente il file
      setCompressing(true);
      try {
        const result = await compressFile(file);
        
        if (result.success && result.file) {
          setCompressedFile(result.file);
          setCompressionInfo(result);
        } else {
          setError(result.error || 'Errore durante la compressione');
          setSelectedFile(null);
        }
      } catch (error) {
        console.error('Compression error:', error);
        setError('Errore durante la compressione del file');
        setSelectedFile(null);
      } finally {
        setCompressing(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Seleziona un file prima di inviare');
      return;
    }

    if (!compressedFile) {
      setError('File in compressione, attendi...');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('userId', session!.user.id);
      formData.append('file', compressedFile); // Usa il file compresso

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
                  Accettiamo file immagine (JPG, PNG, GIF) e video (MP4, MOV, AVI). 
                  I file vengono automaticamente compressi per ottimizzare lo storage.
                </p>
              </div>
            </div>

            {/* Stato compressione */}
            {compressing && (
              <div className="row">
                <div className="twelve columns">
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f0f8ff', 
                    border: '1px solid #b3d9ff', 
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}>
                    <p>🔄 Comprimendo file...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Informazioni compressione */}
            {compressionInfo && selectedFile && (
              <div className="row">
                <div className="twelve columns">
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#f0fff0', 
                    border: '1px solid #90ee90', 
                    borderRadius: '4px'
                  }}>
                    <h6>✅ File Ottimizzato per Storage</h6>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      <p><strong>File originale:</strong> {selectedFile.name} ({(compressionInfo.originalSize / 1024 / 1024).toFixed(2)} MB)</p>
                      <p><strong>File ottimizzato:</strong> {(compressionInfo.compressedSize / 1024).toFixed(0)} KB</p>
                      {compressionInfo.compressionRatio > 0 && (
                        <p><strong>Spazio risparmiato:</strong> {compressionInfo.compressionRatio.toFixed(1)}%</p>
                      )}
                      <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                        💾 Ottimizzato per il nostro storage limitato!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  disabled={!selectedFile || !compressedFile || submitting || compressing}
                >
                  {compressing ? 'Comprimendo...' : submitting ? 'Invio in corso...' : 'Completa Task'}
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
