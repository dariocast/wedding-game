'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Submission {
  id: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
  task: {
    title: string;
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

interface FilterOptions {
  table: string;
  fileType: string;
  task: string;
  dateRange: string;
  scoreRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function GalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    table: '',
    fileType: '',
    task: '',
    dateRange: '',
    scoreRange: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Derived data for filter options
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [availableTasks, setAvailableTasks] = useState<string[]>([]);

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
    
    const currentIndex = filteredSubmissions.findIndex(s => s.id === selectedSubmission.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredSubmissions.length - 1;
    } else {
      newIndex = currentIndex < filteredSubmissions.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedSubmission(filteredSubmissions[newIndex]);
  }, [selectedSubmission, filteredSubmissions]);

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
  }, [modalOpen, navigateModal]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
      
      // Extract unique values for filter options
      const tables = [...new Set(data.map((s: Submission) => s.user.table.name))] as string[];
      const tasks = [...new Set(data.map((s: Submission) => s.task.description))] as string[];
      setAvailableTables(tables);
      setAvailableTasks(tasks);
      
      // Initialize filtered submissions
      setFilteredSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort submissions
  const applyFilters = useCallback(() => {
    let filtered = [...submissions];

    // Filter by table
    if (filters.table) {
      filtered = filtered.filter(s => s.user.table.name === filters.table);
    }

    // Filter by file type
    if (filters.fileType) {
      filtered = filtered.filter(s => s.fileType === filters.fileType);
    }

    // Filter by task
    if (filters.task) {
      filtered = filtered.filter(s => s.task.description === filters.task);
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(s => new Date(s.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(s => new Date(s.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(s => new Date(s.createdAt) >= filterDate);
          break;
      }
    }

    // Filter by score range
    if (filters.scoreRange) {
      switch (filters.scoreRange) {
        case 'positive':
          filtered = filtered.filter(s => s.task.score > 0);
          break;
        case 'negative':
          filtered = filtered.filter(s => s.task.score < 0);
          break;
        case 'high':
          filtered = filtered.filter(s => s.task.score >= 20);
          break;
        case 'medium':
          filtered = filtered.filter(s => s.task.score >= 10 && s.task.score < 20);
          break;
        case 'low':
          filtered = filtered.filter(s => s.task.score > 0 && s.task.score < 10);
          break;
      }
    }

    // Sort submissions
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'score':
          aValue = a.task.score;
          bValue = b.task.score;
          break;
        case 'table':
          aValue = a.user.table.name;
          bValue = b.user.table.name;
          break;
        case 'user':
          aValue = a.user.username;
          bValue = b.user.username;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSubmissions(filtered);
  }, [submissions, filters]);

  // Apply filters when submissions or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      table: '',
      fileType: '',
      task: '',
      dateRange: '',
      scoreRange: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Update filter
  const updateFilter = (key: keyof FilterOptions, value: string | 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
          <p style={{ color: 'var(--secondary-color)', fontSize: '1.1rem' }}>
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
          color: 'var(--primary-color)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Guarda tutte le foto e i video caricati dai partecipanti al D&R Wedding Quest! 📸💕
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Filter Controls */}
      {submissions.length > 0 && (
        <div className="card-wedding mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 style={{ 
              color: 'var(--primary-color)', 
              fontSize: '1.5rem', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔍 Filtri & Ordinamento
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-wedding-outline"
              style={{ fontSize: '0.9rem', padding: '8px 16px' }}
            >
              {showFilters ? '🔼 Nascondi' : '🔽 Mostra'} Filtri
            </button>
          </div>

          {showFilters && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.05), rgba(0, 126, 167, 0.02))',
              border: '1px solid rgba(0, 167, 225, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              {/* Filter Grid */}
              <div className="grid-wedding-3 mb-3">
                {/* Table Filter */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    🏆 Tavolo
                  </label>
                  <select
                    value={filters.table}
                    onChange={(e) => updateFilter('table', e.target.value)}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="">Tutti i tavoli</option>
                    {availableTables.map(table => (
                      <option key={table} value={table}>{table}</option>
                    ))}
                  </select>
                </div>

                {/* File Type Filter */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    📁 Tipo Media
                  </label>
                  <select
                    value={filters.fileType}
                    onChange={(e) => updateFilter('fileType', e.target.value)}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="">Tutti i tipi</option>
                    <option value="image">📷 Solo Foto</option>
                    <option value="video">🎥 Solo Video</option>
                  </select>
                </div>

                {/* Task Filter */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    📋 Task
                  </label>
                  <select
                    value={filters.task}
                    onChange={(e) => updateFilter('task', e.target.value)}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="">Tutti i task</option>
                    {availableTasks.map(task => (
                      <option key={task} value={task}>
                        {task.length > 30 ? `${task.substring(0, 30)}...` : task}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second Row of Filters */}
              <div className="grid-wedding-4 mb-3">
                {/* Date Range Filter */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    📅 Periodo
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => updateFilter('dateRange', e.target.value)}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="">Tutte le date</option>
                    <option value="today">Oggi</option>
                    <option value="week">Ultima settimana</option>
                    <option value="month">Ultimo mese</option>
                  </select>
                </div>

                {/* Score Range Filter */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    🎯 Punteggio
                  </label>
                  <select
                    value={filters.scoreRange}
                    onChange={(e) => updateFilter('scoreRange', e.target.value)}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="">Tutti i punteggi</option>
                    <option value="positive">✅ Positivi</option>
                    <option value="negative">❌ Negativi</option>
                    <option value="high">🏆 Alti (≥20)</option>
                    <option value="medium">🥈 Medi (10-19)</option>
                    <option value="low">🥉 Bassi (1-9)</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    📊 Ordina per
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="date">📅 Data</option>
                    <option value="score">🎯 Punteggio</option>
                    <option value="table">🏆 Tavolo</option>
                    <option value="user">👤 Utente</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    🔄 Direzione
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                    className="input-wedding"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <option value="desc">⬇️ Decrescente</option>
                    <option value="asc">⬆️ Crescente</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center" style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                  📊 Mostrando <strong>{filteredSubmissions.length}</strong> di <strong>{submissions.length}</strong> submission
                </div>
                <button
                  onClick={resetFilters}
                  className="btn-wedding-secondary"
                  style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                >
                  🔄 Reset Filtri
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gallery Content */}
      {filteredSubmissions.length === 0 && submissions.length > 0 ? (
        <div className="card-wedding text-center">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block' }}>🔍</span>
          </div>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
            Nessun Risultato
          </h3>
          <p style={{ color: 'var(--secondary-color)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Non ci sono submission che corrispondono ai filtri selezionati.<br />
            Prova a modificare i criteri di ricerca.
          </p>
          <button onClick={resetFilters} className="btn-wedding-primary">
            🔄 Reset Filtri
          </button>
        </div>
      ) : submissions.length === 0 ? (
        <div className="card-wedding text-center">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block' }}>📷</span>
          </div>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
            Galleria Vuota
          </h3>
          <p style={{ color: 'var(--secondary-color)', marginBottom: '2rem', fontSize: '1.1rem' }}>
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
              <strong>📊 {filteredSubmissions.length} Submission</strong><br />
              <span style={{ color: 'var(--secondary-color)' }}>
                {filteredSubmissions.length !== submissions.length 
                  ? `Filtrate da ${submissions.length} totali`
                  : 'Momenti condivisi nel D&R Wedding Quest'
                }
              </span>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid-wedding grid-wedding-3">
            {filteredSubmissions.map((submission, index) => (
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
                      <div style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600' }}>
                        Task Completato! ✅<br />
                        <small style={{ color: 'var(--primary-color)' }}>File caricato con successo</small>
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
                    color: 'var(--primary-color)'
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
                    color: 'var(--primary-color)', 
                    marginBottom: '0.25rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.3',
                    fontWeight: '700'
                  }}>
                    {submission.task.title}
                  </h4>
                  <p style={{ 
                    color: 'var(--secondary-color)', 
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.3',
                    opacity: 0.9
                  }}>
                    {submission.task.description}
                  </p>
                  
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
                  <div style={{ fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>👤 {submission.user.username}</strong>
                    </p>
                    <p style={{ margin: '0.25rem 0', color: 'var(--primary-color)' }}>
                      🏆 {submission.user.table.name}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: 'var(--secondary-color)', fontSize: '0.8rem' }}>
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
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
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
            {filteredSubmissions.length > 1 && (
              <>
                <button
                  onClick={() => navigateModal('prev')}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
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
                    background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
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
                margin: '0 0 0.5rem 0', 
                fontSize: '1.6rem',
                color: 'var(--primary-color)',
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: '700'
              }}>
                {selectedSubmission.task.title}
              </h3>
              <p style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '1.1rem',
                color: 'var(--secondary-color)',
                lineHeight: '1.4',
                opacity: 0.9
              }}>
                {selectedSubmission.task.description}
              </p>
              
              <div className="grid-wedding-2" style={{ gap: '1.5rem', fontSize: '1rem' }}>
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>🏆 Tavolo:</span>
                    <br />
                    <strong style={{ color: 'var(--primary-color)' }}>{selectedSubmission.user.table.name}</strong>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>👤 Utente:</span>
                    <br />
                    <strong style={{ color: 'var(--primary-color)' }}>{selectedSubmission.user.username}</strong>
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>🎯 Punteggio:</span>
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
                    <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>📅 Data:</span>
                    <br />
                    <strong style={{ color: 'var(--primary-color)' }}>
                      {formatDate(selectedSubmission.createdAt)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Indicator */}
            {filteredSubmissions.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(0, 167, 225, 0.3)'
                }}
              >
                {filteredSubmissions.findIndex(s => s.id === selectedSubmission.id) + 1} / {filteredSubmissions.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
