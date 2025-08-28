'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const openModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setModalOpen(true);
    // Previeni lo scroll del body quando il modal è aperto
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSubmission(null);
    // Ripristina lo scroll del body
    document.body.style.overflow = 'unset';
  };

  const navigateModal = useCallback((direction: 'prev' | 'next') => {
    if (!selectedSubmission) return;
    
    const currentIndex = submissions.findIndex(s => s.id === selectedSubmission.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : submissions.length - 1;
    } else {
      newIndex = currentIndex < submissions.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedSubmission(submissions[newIndex]);
  }, [selectedSubmission, submissions]);

  // Gestione tasti keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateModal('prev');
          break;
        case 'ArrowRight':
          navigateModal('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, selectedSubmission, submissions]);

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
                    {submission.fileUrl.startsWith('data:image/svg+xml') ? (
                      // Mostra SVG embedded direttamente
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={submission.fileUrl}
                        alt={submission.task.description}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'contain', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }}
                        onClick={() => openModal(submission)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    ) : submission.fileUrl.includes('placeholder') || submission.fileUrl.includes('via.placeholder.com') ? (
                      // Mostra placeholder personalizzato per file mock
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        border: '2px dashed #dee2e6'
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                          {submission.fileType === 'image' ? '📷' : '🎥'}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '0.9rem', textAlign: 'center' }}>
                          Task Completato!<br />
                          <small>File caricato con successo</small>
                        </div>
                      </div>
                    ) : submission.fileType === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={submission.fileUrl}
                        alt={submission.task.description}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }}
                        onClick={() => openModal(submission)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
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
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onClick={() => openModal(submission)}
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

      {/* Modal per visualizzare immagini/video in grande */}
      {modalOpen && selectedSubmission && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={closeModal}
        >
          {/* Contenuto del modal */}
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pulsante chiudi */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>

            {/* Pulsanti navigazione */}
            {submissions.length > 1 && (
              <>
                <button
                  onClick={() => navigateModal('prev')}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => navigateModal('next')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ›
                </button>
              </>
            )}

            {/* Contenuto media */}
            <div style={{ position: 'relative' }}>
              {selectedSubmission.fileType === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedSubmission.fileUrl}
                  alt={selectedSubmission.task.description}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '70vh',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              ) : (
                <video
                  src={selectedSubmission.fileUrl}
                  controls
                  autoPlay
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '70vh',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              )}
            </div>

            {/* Informazioni submission */}
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                {selectedSubmission.task.description}
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Tavolo:</strong> {selectedSubmission.user.table.name}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Utente:</strong> {selectedSubmission.user.username}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Punteggio:</strong> 
                  <span style={{ color: selectedSubmission.task.score >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {selectedSubmission.task.score >= 0 ? '+' : ''}{selectedSubmission.task.score}
                  </span>
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Data:</strong> {new Date(selectedSubmission.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>

            {/* Indicatore posizione */}
            {submissions.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                }}
              >
                {submissions.findIndex(s => s.id === selectedSubmission.id) + 1} / {submissions.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
