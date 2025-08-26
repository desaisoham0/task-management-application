import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get tasks for the authenticated user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { title, description } = req.body;
  // The authenticateToken middleware sets req.user to the logged-in user's ID
  // @ts-ignore
  const userId = req.user;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, is_complete, user_id) VALUES ($1, $2, false, $3) RETURNING *',
      [title, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { title, description, isComplete } = req.body;
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, is_complete = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, isComplete, id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user;
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router;
