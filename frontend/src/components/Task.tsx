import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  description?: string;
  is_complete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(newTitle, newDescription);
      setNewTitle('');
      setNewDescription('');
      fetchTasks();
    } catch (error) {
      alert('Error creating task');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
  
    try {
      const updatedTask = {
        ...editingTask,
        title: editTitle,
        description: editDescription
      };
      await updateTask(editingTask.id, updatedTask);
      setTasks(tasks.map(t => 
        t.id === editingTask.id ? updatedTask : t
      ));
      setEditingTask(null);
    } catch (error) {
      alert('Error updating task');
    }
  };

  const handleUpdate = async (task: Task) => {
    try {
      const updatedTask = { 
        ...task, 
        is_complete: !task.is_complete 
      };
      await updateTask(task.id, updatedTask);
      setTasks(tasks.map(t => 
        t.id === task.id ? updatedTask : t
      ));
    } catch (error) {
      alert('Error updating task');
      await fetchTasks();
    }
  };
  
  const filteredTasks = tasks
  .filter(task => {
    switch (filter) {
      case 'active':
        return !task.is_complete;
      case 'completed':
        return task.is_complete;
      default:
        return true;
    }
  })
  .sort((a, b) => {
    if (a.is_complete === b.is_complete) {
      return 0; 
    }
    return a.is_complete ? 1 : -1; 
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      alert('Error deleting task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    console.log('Current filter:', filter);
    console.log('Tasks:', tasks);
    console.log('Filtered Tasks:', filteredTasks);
  }, [filter, tasks, filteredTasks]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h2">Task Manager</h2>
        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
      </div>
      <div className="row">
        {/* Add Task Form - Left Side */}
        <div className="col-md-4 mb-4">
          <div className="card p-3 shadow-sm h-100">
            <h4 className="mb-3">Add a New Task</h4>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-dark w-100">
                Add Task
              </button>
            </form>
          </div>
        </div>
  
        {/* Task List - Right Side */}
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            <div className="btn-group mb-3" role="group">
              <button 
                type="button" 
                className={`btn btn-outline-secondary ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                type="button" 
                className={`btn btn-outline-secondary ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                type="button" 
                className={`btn btn-outline-secondary ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            <ul className="list-group">
              {filteredTasks.map(task => (
                <li key={task.id} className="list-group-item">
                  {editingTask?.id === task.id ? (
                    <form onSubmit={handleEditSubmit} className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                      />
                      <button type="submit" className="btn btn-success btn-sm">
                        Save
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingTask(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <input 
                          type="checkbox"
                          checked={task.is_complete}
                          onChange={() => handleUpdate(task)}
                          className="form-check-input me-2"
                        />
                        <span className={task.is_complete ? 'text-decoration-line-through' : ''}>
                          {task.title}
                          {task.description && ` - ${task.description}`}
                        </span>
                      </div>
                      <div className="btn-group">
                        <button 
                          onClick={() => {
                            setEditingTask(task);
                            setEditTitle(task.title);
                            setEditDescription(task.description || '');
                          }} 
                          className="btn btn-outline-info btn-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)} 
                          className="btn btn-outline-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;