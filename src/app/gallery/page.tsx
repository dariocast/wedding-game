'use client';

import { useState, useEffect } from 'react';
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

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>🖼️ Galleria Foto/Video</h1>
            <p>Caricamento galleria...</p>
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
            <h1>🖼️ Galleria Foto/Video</h1>
            <div className="alert alert-error">
              <strong>Errore:</strong> {error}
            </div>
            <button 
              className="button button-primary" 
              onClick={fetchSubmissions}
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
          <h1>🖼️ Galleria Foto/Video</h1>
          <p className="lead">
            Guarda tutte le foto e i video caricati dai partecipanti al Wedding Game!
          </p>
        </div>
      </div>

      <div className="row">
        <div className="twelve columns">
          {submissions.length === 0 ? (
            <div className="alert alert-info">
              <strong>Nessuna submission ancora!</strong>
              <p>Completa i task per vedere le prime foto e video nella galleria.</p>
              <Link href="/tasks" className="button button-primary" style={{ marginTop: '1rem' }}>
                Vai ai Task
              </Link>
            </div>
          ) : (
            <div className="row">
              {submissions.map((submission) => (
                <div key={submission.id} className="four columns" style={{ marginBottom: '2rem' }}>
                  <div style={{ border: '1px solid #e1e1e1', borderRadius: '4px', padding: '1rem' }}>
                    {submission.fileType === 'image' ? (
                      <img
                        src={submission.fileUrl}
                        alt={submission.task.description}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : (
                      <video
                        src={submission.fileUrl}
                        controls
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    )}
                    
                    {/* Fallback per file non caricabili */}
                    <div style={{ display: 'none', width: '100%', height: '200px', backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                      <span style={{ color: '#666' }}>
                        {submission.fileType === 'image' ? '🖼️' : '🎥'} File non disponibile
                      </span>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <h6>{submission.task.description}</h6>
                      <p style={{ fontSize: '0.9em', color: '#666' }}>
                        <strong>Punteggio:</strong> {submission.task.score >= 0 ? '+' : ''}{submission.task.score}
                      </p>
                      <p style={{ fontSize: '0.8em', color: '#999' }}>
                        <strong>Da:</strong> {submission.user.username} ({submission.user.table.name})
                      </p>
                      <p style={{ fontSize: '0.8em', color: '#999' }}>
                        {formatDate(submission.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
