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
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="twelve columns">
            <h1>📊 Gestione Classifica</h1>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user.isAdmin) {
    return null;
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="row">
        <div className="twelve columns">
          <h1>📊 Gestione Classifica</h1>
          <p className="lead">Gestisci tavoli, task e punteggi</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="row">
        <div className="twelve columns">
          <button
            className={`button ${activeTab === 'tables' ? 'button-primary' : ''}`}
            onClick={() => setActiveTab('tables')}
            style={{ marginRight: '1rem' }}
          >
            🏆 Tavoli
          </button>
          <button
            className={`button ${activeTab === 'tasks' ? 'button-primary' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Task
          </button>
        </div>
      </div>

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <>
          <div className="row" style={{ marginTop: '2rem' }}>
            <div className="twelve columns">
              <h3>Gestione Tavoli</h3>
              
              {/* Create new table form */}
              <form onSubmit={handleCreateTable} style={{ marginBottom: '2rem' }}>
                <div className="row">
                  <div className="eight columns">
                    <input
                      type="text"
                      placeholder="Nome nuovo tavolo"
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      className="u-full-width"
                    />
                  </div>
                  <div className="four columns">
                    <button type="submit" className="button button-primary u-full-width">
                      Aggiungi Tavolo
                    </button>
                  </div>
                </div>
              </form>

              {/* Tables list */}
              <table className="u-full-width">
                <thead>
                  <tr>
                    <th>Tavolo</th>
                    <th>Punteggio</th>
                    <th>Partecipanti</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <tr key={table.id}>
                      <td>{table.name}</td>
                      <td>
                        <input
                          type="number"
                          value={table.score}
                          onChange={(e) => handleUpdateTable(table, parseInt(e.target.value) || 0)}
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>{table._count.users}</td>
                      <td>
                        <button
                          className="button"
                          style={{ fontSize: '0.8em' }}
                          onClick={() => setEditingTable(table)}
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
        </>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <>
          <div className="row" style={{ marginTop: '2rem' }}>
            <div className="twelve columns">
              <h3>Gestione Task</h3>
              
              {/* Create new task form */}
              <form onSubmit={handleCreateTask} style={{ marginBottom: '2rem' }}>
                <div className="row">
                  <div className="six columns">
                    <input
                      type="text"
                      placeholder="Descrizione task"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="u-full-width"
                    />
                  </div>
                  <div className="three columns">
                    <input
                      type="number"
                      placeholder="Punteggio"
                      value={newTaskScore}
                      onChange={(e) => setNewTaskScore(e.target.value)}
                      className="u-full-width"
                    />
                  </div>
                  <div className="three columns">
                    <button type="submit" className="button button-primary u-full-width">
                      Aggiungi Task
                    </button>
                  </div>
                </div>
              </form>

              {/* Tasks list */}
              <table className="u-full-width">
                <thead>
                  <tr>
                    <th>Descrizione</th>
                    <th>Punteggio</th>
                    <th>Stato</th>
                    <th>Completamenti</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.description}</td>
                      <td style={{ color: task.score >= 0 ? 'green' : 'red' }}>
                        {task.score >= 0 ? '+' : ''}{task.score}
                      </td>
                      <td>
                        <span style={{ color: task.isActive ? 'green' : 'red' }}>
                          {task.isActive ? '✅ Attivo' : '❌ Disattivo'}
                        </span>
                      </td>
                      <td>{task._count.submissions}</td>
                      <td>
                        <button
                          className={`button ${task.isActive ? '' : 'button-primary'}`}
                          style={{ fontSize: '0.8em', marginRight: '0.5rem' }}
                          onClick={() => handleToggleTask(task)}
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
        </>
      )}

      <div className="row" style={{ marginTop: '2rem' }}>
        <div className="twelve columns">
          <Link href="/admin" className="button">
            ← Torna al Pannello Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
