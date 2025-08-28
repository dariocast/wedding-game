'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Table {
  id: string;
  name: string;
  score: number;
  users: Array<{
    id: string;
    username: string;
    createdAt: string;
  }>;
  _count: {
    users: number;
  };
}

interface Task {
  id: string;
  description: string;
  score: number;
  isActive: boolean;
  _count: {
    submissions: number;
  };
}

export default function AdminLeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tables' | 'tasks'>('tables');

  // Form states
  const [newTableName, setNewTableName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskScore, setNewTaskScore] = useState('');
  // const [editingTable, setEditingTable] = useState<Table | null>(null);
  // const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session && status === 'authenticated') {
      if (!session.user.isAdmin) {
        router.push('/');
        return;
      }
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [tablesRes, tasksRes] = await Promise.all([
        fetch('/api/admin/tables'),
        fetch('/api/admin/tasks')
      ]);

      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(tablesData);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    try {
      const response = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTableName }),
      });

      if (response.ok) {
        setNewTableName('');
        fetchData();
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDescription.trim() || !newTaskScore) return;

    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newTaskDescription,
          score: parseInt(newTaskScore),
        }),
      });

      if (response.ok) {
        setNewTaskDescription('');
        setNewTaskScore('');
        fetchData();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTable = async (table: Table, newScore: number) => {
    try {
      const response = await fetch('/api/admin/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: table.id,
          score: newScore,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const response = await fetch('/api/admin/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          isActive: !task.isActive,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="animate-fade-in">
        <section className="text-center mb-4">
          <div className="animate-float" style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📊</span>
          </div>
          <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Gestione Avanzata
          </h1>
          <div className="wedding-divider"></div>
        </section>

        <div className="card-wedding text-center">
          <div className="animate-float">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⏳</span>
          </div>
          <p style={{ color: 'var(--wedding-cerulean)', fontSize: '1.1rem' }}>
            Caricamento pannello gestione...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user.isAdmin) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <div className="animate-float" style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>📊</span>
        </div>
        <h1 className="heading-wedding" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
          Gestione Avanzata
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--wedding-prussian)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Gestisci tavoli, task e punteggi del Wedding Game! 🎯
        </p>
        <div className="wedding-divider"></div>
      </section>

      {/* Tab Navigation */}
      <div className="text-center mb-4">
        <div style={{ 
          display: 'inline-flex', 
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '8px',
          border: '1px solid rgba(0, 167, 225, 0.2)',
          boxShadow: '0 4px 15px rgba(0, 167, 225, 0.1)'
        }}>
          <button
            className={activeTab === 'tables' ? 'btn-wedding-primary' : 'btn-wedding-outline'}
            onClick={() => setActiveTab('tables')}
            style={{ 
              marginRight: '8px',
              fontSize: '1rem',
              padding: '12px 24px'
            }}
          >
            🏆 Tavoli
          </button>
          <button
            className={activeTab === 'tasks' ? 'btn-wedding-primary' : 'btn-wedding-outline'}
            onClick={() => setActiveTab('tasks')}
            style={{ 
              fontSize: '1rem',
              padding: '12px 24px'
            }}
          >
            📋 Task
          </button>
        </div>
      </div>

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="card-wedding">
          <div className="text-center mb-3">
            <h3 style={{ 
              color: 'var(--wedding-prussian)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              🏆 Gestione Tavoli
            </h3>
          </div>
          
          {/* Create Table Form */}
          <form onSubmit={handleCreateTable} className="mb-4">
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 167, 225, 0.1), rgba(0, 126, 167, 0.05))',
              border: '1px solid rgba(0, 167, 225, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
                ➕ Aggiungi Nuovo Tavolo
              </h4>
              <div className="grid-wedding-2" style={{ gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--wedding-prussian)', 
                    fontWeight: '600' 
                  }}>
                    Nome Tavolo
                  </label>
                  <input
                    type="text"
                    placeholder="es. Tavolo degli Sposi"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="input-wedding"
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="btn-wedding-primary w-full">
                    🏆 Crea Tavolo
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Tables List */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, var(--wedding-picton), var(--wedding-cerulean))',
                  color: 'white'
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>🏆 Tavolo</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>🎯 Punteggio</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>👥 Partecipanti</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>⚡ Azioni</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table, index) => (
                  <tr key={table.id} style={{ 
                    borderBottom: '1px solid rgba(0, 167, 225, 0.1)',
                    backgroundColor: index % 2 === 0 ? 'rgba(0, 167, 225, 0.02)' : 'transparent'
                  }}>
                    <td style={{ 
                      padding: '16px', 
                      fontWeight: '600',
                      color: 'var(--wedding-prussian)'
                    }}>
                      {table.name}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={table.score}
                        onChange={(e) => handleUpdateTable(table, parseInt(e.target.value) || 0)}
                        style={{
                          width: '100px',
                          padding: '8px',
                          border: '2px solid rgba(0, 167, 225, 0.3)',
                          borderRadius: '6px',
                          textAlign: 'center',
                          fontWeight: '700',
                          color: 'var(--wedding-prussian)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)'
                        }}
                      />
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      color: 'var(--wedding-cerulean)',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      {table._count.users}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, var(--wedding-cerulean), var(--wedding-prussian))',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => console.log('Edit table:', table.name)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        ✏️ Modifica
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="card-wedding">
          <div className="text-center mb-3">
            <h3 style={{ 
              color: 'var(--wedding-prussian)', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              📋 Gestione Task
            </h3>
          </div>
          
          {/* Create Task Form */}
          <form onSubmit={handleCreateTask} className="mb-4">
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 126, 167, 0.1), rgba(0, 52, 89, 0.05))',
              border: '1px solid rgba(0, 126, 167, 0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: 'var(--wedding-prussian)', marginBottom: '1rem' }}>
                ➕ Aggiungi Nuovo Task
              </h4>
              <div className="grid-wedding-3" style={{ gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--wedding-prussian)', 
                    fontWeight: '600' 
                  }}>
                    Descrizione Task
                  </label>
                  <input
                    type="text"
                    placeholder="es. Scatta una foto con gli sposi"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="input-wedding"
                    required
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: 'var(--wedding-prussian)', 
                    fontWeight: '600' 
                  }}>
                    Punteggio
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newTaskScore}
                    onChange={(e) => setNewTaskScore(e.target.value)}
                    className="input-wedding"
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="btn-wedding-primary w-full">
                    📋 Crea Task
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Tasks List */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, var(--wedding-cerulean), var(--wedding-prussian))',
                  color: 'white'
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>📋 Descrizione</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>🎯 Punti</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>🔄 Stato</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>✅ Completati</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>⚡ Azioni</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id} style={{ 
                    borderBottom: '1px solid rgba(0, 167, 225, 0.1)',
                    backgroundColor: index % 2 === 0 ? 'rgba(0, 167, 225, 0.02)' : 'transparent'
                  }}>
                    <td style={{ 
                      padding: '16px',
                      color: 'var(--wedding-black)',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {task.description}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: task.score >= 0 ? '#28a745' : '#dc3545'
                    }}>
                      {task.score >= 0 ? '+' : ''}{task.score}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        background: task.isActive 
                          ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05))'
                          : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05))',
                        border: task.isActive 
                          ? '1px solid rgba(40, 167, 69, 0.3)'
                          : '1px solid rgba(220, 53, 69, 0.3)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: task.isActive ? '#28a745' : '#dc3545'
                      }}>
                        {task.isActive ? '✅ Attivo' : '❌ Disattivo'}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      textAlign: 'center',
                      color: 'var(--wedding-cerulean)',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      {task._count.submissions}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        className={task.isActive ? 'btn-wedding-secondary' : 'btn-wedding-primary'}
                        onClick={() => handleToggleTask(task)}
                        style={{ 
                          fontSize: '0.9rem',
                          padding: '8px 16px'
                        }}
                      >
                        {task.isActive ? '⏸️ Disattiva' : '▶️ Attiva'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <Link href="/admin" className="btn-wedding-outline">
          ← Torna al Pannello Admin
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="flex justify-center items-center space-x-2">
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '0s' }}>📊</span>
          <span className="animate-float" style={{ fontSize: '1rem', animationDelay: '0.5s' }}>⚙️</span>
          <span className="animate-float" style={{ fontSize: '1.5rem', animationDelay: '1s' }}>🏆</span>
        </div>
      </div>
    </div>
  );
}
