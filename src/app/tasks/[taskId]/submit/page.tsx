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
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📤</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Completa Task
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div className="animate-float">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
          </div>
          <p style={{ color: 'var(--wedding-cerulean)', fontSize: '1.1rem' }}>
            Caricamento...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔐</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Accesso Richiesto
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
            <h3 style={{ color: '#ffc107', marginBottom: '1rem' }}>Accesso Necessario</h3>
            <p style={{ color: 'var(--wedding-prussian)', marginBottom: '2rem' }}>
              Devi accedere per completare i task del Wedding Game!
            </p>
          </div>
          
          <div className="grid-wedding-2 mb-3">
            <Link href="/auth/login" className="btn-wedding-primary text-center block">
              💍 Accedi
            </Link>
            <Link href="/" className="btn-wedding-outline text-center block">
              🏠 Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📤</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Completa Task
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

  if (error && !task) {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📤</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Completa Task
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
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>❌</span>
            <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>Task Non Trovato</h3>
            <p style={{ color: '#dc3545', marginBottom: '2rem' }}>{error}</p>
          </div>
          
          <Link href="/tasks" className="btn-wedding-primary">
            ← Torna ai Task
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🎉</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Task Completato!
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div style={{
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))',
            border: '1px solid rgba(40, 167, 69, 0.3)',
            borderRadius: '8px',
            padding: '3rem 2rem',
            marginBottom: '2rem'
          }}>
            <div className="animate-float" style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '4rem', display: 'block' }}>🏆</span>
            </div>
            <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>Congratulazioni!</h3>
            <p style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem', fontSize: '1.1rem' }}>
              Hai completato il task con successo!
            </p>
            <p style={{ color: 'var(--wedding-cerulean)' }}>
              Il tuo file è stato caricato e i punti sono stati assegnati al tuo tavolo.
            </p>
          </div>
          
          <div className="grid-wedding-2">
            <Link href="/tasks" className="btn-wedding-secondary text-center block">
              📋 Altri Task
            </Link>
            <Link href="/" className="btn-wedding-primary text-center block">
              🏠 Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📤</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Completa Task
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--wedding-prussian)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Carica la tua foto o video per completare questo task! 📸
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Task Info Card */}
      {task && (
        <div className="card-wedding" style={{ marginBottom: '2rem' }}>
          <div className="text-center">
            <h2 style={{ 
              color: 'var(--wedding-prussian)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              lineHeight: '1.4'
            }}>
              {task.description}
            </h2>
            
            {/* Score Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              background: task.score >= 0 
                ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))'
                : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
              border: task.score >= 0 
                ? '1px solid rgba(40, 167, 69, 0.3)'
                : '1px solid rgba(220, 53, 69, 0.3)',
              fontSize: '1.2rem'
            }}>
              <span style={{ marginRight: '0.5rem' }}>
                {task.score >= 0 ? '🏆' : '⚠️'}
              </span>
              <span style={{ 
                fontWeight: '700',
                color: task.score >= 0 ? '#28a745' : '#dc3545'
              }}>
                {task.score >= 0 ? '+' : ''}{task.score} punti
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Card */}
      <div className="card-wedding">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label 
              htmlFor="file" 
              style={{ 
                display: 'block', 
                marginBottom: '1rem', 
                color: 'var(--wedding-prussian)', 
                fontWeight: '600',
                fontSize: '1.1rem'
              }}
            >
              📸 Seleziona Foto o Video
            </label>
            <input
              type="file"
              id="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="input-wedding"
              required
              style={{ 
                padding: '1rem',
                border: '2px dashed rgba(0, 167, 225, 0.3)',
                backgroundColor: 'rgba(0, 167, 225, 0.05)',
                cursor: 'pointer'
              }}
            />
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--wedding-cerulean)', 
              marginTop: '0.5rem',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              💡 Accettiamo immagini (JPG, PNG, GIF) e video (MP4, MOV, AVI)<br />
              I file vengono automaticamente ottimizzati per il nostro storage
            </p>
          </div>

          {/* Compression Status */}
          {compressing && (
            <div className="mb-3">
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.1), rgba(0, 167, 225, 0.05))',
                border: '1px solid rgba(0, 167, 225, 0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div className="animate-float" style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>🔄</span>
                </div>
                <p style={{ color: 'var(--wedding-cerulean)', fontWeight: '600' }}>
                  Ottimizzando il file...
                </p>
              </div>
            </div>
          )}

          {/* Compression Info */}
          {compressionInfo && selectedFile && (
            <div className="mb-3">
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))',
                border: '1px solid rgba(40, 167, 69, 0.3)',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <div className="text-center mb-2">
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
                  <h4 style={{ color: '#28a745', marginBottom: '1rem' }}>File Ottimizzato!</h4>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: 'var(--wedding-prussian)' }}>
                  <div className="grid-wedding-2" style={{ gap: '1rem', textAlign: 'center' }}>
                    <div>
                      <strong>📁 File Originale:</strong><br />
                      {selectedFile.name}<br />
                      <span style={{ color: 'var(--wedding-cerulean)' }}>
                        {(compressionInfo.originalSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <div>
                      <strong>⚡ File Ottimizzato:</strong><br />
                      {(compressionInfo.compressedSize / 1024).toFixed(0)} KB<br />
                      {compressionInfo.compressionRatio > 0 && (
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                          -{compressionInfo.compressionRatio.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '1rem', 
                    color: '#28a745', 
                    fontWeight: 'bold' 
                  }}>
                    💾 Perfetto per il nostro storage limitato!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-3">
              <div style={{
                background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>⚠️</span>
                <strong style={{ color: '#dc3545' }}>Errore:</strong>
                <p style={{ color: '#dc3545', marginTop: '0.5rem' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mb-3">
            <button
              type="submit"
              className="btn-wedding-primary w-full"
              disabled={!selectedFile || !compressedFile || submitting || compressing}
              style={{ 
                opacity: (!selectedFile || !compressedFile || submitting || compressing) ? 0.6 : 1,
                cursor: (!selectedFile || !compressedFile || submitting || compressing) ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                padding: '1rem'
              }}
            >
              {compressing ? (
                <span>
                  <span className="animate-float" style={{ marginRight: '0.5rem' }}>🔄</span>
                  Ottimizzando...
                </span>
              ) : submitting ? (
                <span>
                  <span className="animate-float" style={{ marginRight: '0.5rem' }}>📤</span>
                  Invio in corso...
                </span>
              ) : (
                <span>
                  🎯 Completa Task
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Back Button */}
        <div className="text-center" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0, 167, 225, 0.2)' }}>
          <Link href="/tasks" className="btn-wedding-outline">
            ← Torna ai Task
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="flex justify-center items-center space-x-2">
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0s' }}>📸</span>
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>✨</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>🎯</span>
        </div>
      </div>
    </div>
  );
}
