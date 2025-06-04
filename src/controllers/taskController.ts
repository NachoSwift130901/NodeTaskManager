import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { Task } from '../models/types';

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *     - Tasks
 *     responses:
 *       200:
 *         description: Task list
 */
export function getAllTasksController(req: Request, res: Response<Task[] | { error: string }>): void {
  try {
    const tasks = taskService.getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tasks' });
  }
}

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *     - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
export function createTaskController(req: Request<{}, {}, Pick<Task, 'description'>>, res: Response<Task | { error: string }>): void {
  try {
    const { description } = req.body;
    if (!description) {
      res.status(400).json({ error: 'Descripción requerida' });
      return;
    }
    const newTask = taskService.createTask(description);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
}

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Mark task completed
 *     tags:
 *     - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task completed
 *       404:
 *         description: Tarea not completed
 */
export function markTaskDoneController(req: Request<{ id: string }>, res: Response<Task | { error: string }>): void {
  try {
    const task = taskService.markTaskDone(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags:
 *     - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
export function deleteTaskController(req: Request<{ id: string }>, res: Response<Task | { error: string }>): void {
  try {
    const deleted = taskService.removeTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}