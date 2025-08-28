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
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🖼️</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Galleria Matrimoniale
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div className="animate-float">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
          </div>
          <p style={{ color: 'var(--wedding-cerulean)', fontSize: '1.1rem' }}>
            Caricamento galleria...
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
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🖼️</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Galleria Matrimoniale
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
              onClick={fetchSubmissions}
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
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🖼️</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Galleria Matrimoniale
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--wedding-prussian)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Guarda tutte le foto e i video caricati dai partecipanti al Wedding Game! 📸💕
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Gallery Content */}
      {submissions.length === 0 ? (
        <div className="card-wedding text-center">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block' }}>📷</span>
          </div>
          <h3 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
            Galleria Vuota
          </h3>
          <p style={{ color: 'var(--wedding-cerulean)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Non ci sono ancora foto o video nella galleria.<br />
            Completa i task per vedere le prime submission!
          </p>
          <Link href="/tasks" className="btn-wedding-primary">
            📋 Vai ai Task
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Badge */}
          <div className="wedding-badge" style={{ 
            width: '100%', 
            maxWidth: '300px',
            margin: '0 auto 3rem auto',
            justifyContent: 'center', 
            padding: '1rem',
            fontSize: '1rem'
          }}>
            <div className="text-center">
              <strong>📊 {submissions.length} Submission</strong><br />
              <span style={{ color: 'var(--wedding-cerulean)' }}>
                Momenti condivisi nel Wedding Game
              </span>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid-wedding grid-wedding-3">
            {submissions.map((submission, index) => (
              <div key={submission.id} className="card-wedding" style={{ 
                animationDelay: `${index * 0.1}s`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Media Container */}
                <div 
                  style={{ 
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.1), rgba(0, 126, 167, 0.05))'
                  }}
                  onClick={() => openModal(submission)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {submission.fileUrl.startsWith('data:image/svg+xml') ? (
                    // SVG Placeholder
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={submission.fileUrl}
                      alt={submission.task.description}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  ) : submission.fileUrl.includes('placeholder') || submission.fileUrl.includes('via.placeholder.com') ? (
                    // Custom Placeholder
                    <div style={{ 
                      width: '100%', 
                      height: '200px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.1), rgba(0, 126, 167, 0.05))',
                      border: '2px dashed rgba(0, 167, 225, 0.3)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        {submission.fileType === 'image' ? '📷' : '🎥'}
                      </div>
                      <div style={{ color: 'var(--wedding-cerulean)', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600' }}>
                        Task Completato! ✅<br />
                        <small style={{ color: 'var(--wedding-prussian)' }}>File caricato con successo</small>
                      </div>
                    </div>
                  ) : submission.fileType === 'image' ? (
                    // Real Image
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={submission.fileUrl}
                      alt={submission.task.description}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : (
                    // Video
                    <video
                      src={submission.fileUrl}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  )}
                  
                  {/* Fallback */}
                  <div style={{ 
                    display: 'none', 
                    width: '100%', 
                    height: '200px', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
                    color: 'var(--wedding-prussian)'
                  }}>
                    <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {submission.fileType === 'image' ? '🖼️' : '🎥'}
                    </span>
                    <span style={{ fontSize: '0.9rem' }}>File non disponibile</span>
                  </div>

                  {/* Media Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {submission.fileType === 'image' ? '📷' : '🎥'}
                  </div>

                  {/* Click Indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0, 167, 225, 0.9)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    🔍 Clicca per espandere
                  </div>
                </div>

                {/* Submission Info */}
                <div>
                  <h4 style={{ 
                    color: 'var(--wedding-prussian)', 
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.3'
                  }}>
                    {submission.task.description}
                  </h4>
                  
                  {/* Score Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '15px',
                    background: submission.task.score >= 0 
                      ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))'
                      : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
                    border: submission.task.score >= 0 
                      ? '1px solid rgba(40, 167, 69, 0.3)'
                      : '1px solid rgba(220, 53, 69, 0.3)',
                    fontSize: '0.8rem',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{ marginRight: '0.25rem' }}>
                      {submission.task.score >= 0 ? '🏆' : '⚠️'}
                    </span>
                    <span style={{ 
                      fontWeight: '600',
                      color: submission.task.score >= 0 ? '#28a745' : '#dc3545'
                    }}>
                      {submission.task.score >= 0 ? '+' : ''}{submission.task.score} punti
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div style={{ fontSize: '0.85rem', color: 'var(--wedding-cerulean)' }}>
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>👤 {submission.user.username}</strong>
                    </p>
                    <p style={{ margin: '0.25rem 0', color: 'var(--wedding-prussian)' }}>
                      🏆 {submission.user.table.name}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: 'var(--wedding-cerulean)', fontSize: '0.8rem' }}>
                      📅 {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>
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
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0s' }}>📸</span>
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>💕</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>🎥</span>
        </div>
      </div>

      {/* Wedding Modal */}
      {modalOpen && selectedSubmission && (
        <div className="modal-wedding" onClick={closeModal}>
          {/* Modal Content */}
          <div
            className="modal-content-wedding"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 167, 225, 0.2)',
              maxWidth: '95vw',
              maxHeight: '95vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0, 167, 225, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>

            {/* Navigation Buttons */}
            {submissions.length > 1 && (
              <>
                <button
                  onClick={() => navigateModal('prev')}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, var(--wedding-cerulean), var(--wedding-prussian))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '55px',
                    height: '55px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 126, 167, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => navigateModal('next')}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, var(--wedding-cerulean), var(--wedding-prussian))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '55px',
                    height: '55px',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 1001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 126, 167, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ›
                </button>
              </>
            )}

            {/* Media Content */}
            <div style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh'
            }}>
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
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 52, 89, 0.1)'
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
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 52, 89, 0.1)'
                  }}
                />
              )}
            </div>

            {/* Submission Info */}
            <div style={{ 
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.05), rgba(0, 126, 167, 0.02))',
              borderTop: '1px solid rgba(0, 167, 225, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '1.5rem',
                color: 'var(--wedding-prussian)',
                fontFamily: 'Playfair Display, Georgia, serif'
              }}>
                {selectedSubmission.task.description}
              </h3>
              
              <div className="grid-wedding-2" style={{ gap: '1.5rem', fontSize: '1rem' }}>
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--wedding-cerulean)', fontWeight: '600' }}>🏆 Tavolo:</span>
                    <br />
                    <strong style={{ color: 'var(--wedding-prussian)' }}>{selectedSubmission.user.table.name}</strong>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--wedding-cerulean)', fontWeight: '600' }}>👤 Utente:</span>
                    <br />
                    <strong style={{ color: 'var(--wedding-prussian)' }}>{selectedSubmission.user.username}</strong>
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--wedding-cerulean)', fontWeight: '600' }}>🎯 Punteggio:</span>
                    <br />
                    <span style={{ 
                      color: selectedSubmission.task.score >= 0 ? '#28a745' : '#dc3545', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {selectedSubmission.task.score >= 0 ? '+' : ''}{selectedSubmission.task.score} punti
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--wedding-cerulean)', fontWeight: '600' }}>📅 Data:</span>
                    <br />
                    <strong style={{ color: 'var(--wedding-prussian)' }}>
                      {formatDate(selectedSubmission.createdAt)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Indicator */}
            {submissions.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(0, 167, 225, 0.3)'
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
