import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { Task } from '../models/task';

/**
 * @swagger
 * /api/tasks/getTasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *     - Tasks
 *     responses:
 *       200:
 *         description: Task list
 */
export async function getAllTasksController(req: Request, res: Response<Task[] | { error: string }>): Promise<void> {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tasks' });
  }
}

/**
 * @swagger
 * /api/tasks/addTask:
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
 *               - idProject
 *             properties:
 *               description:
 *                 type: string
 *               idProject:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *        description: Bad request, missing required fields
 */
export async function createTaskController(req: Request<{}, {}, Pick<Task, 'description' | 'idProject'>>, res: Response<Task | { error: string }>): Promise<void> {
  try {
    const { description, idProject } = req.body;
    if (!description || !idProject) {
      res.status(400).json({ error: 'Description and idProject are required' });
      return;
    }
    const newTask = await taskService.createTask(description, idProject);
    res.status(201).json(newTask);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database operation failed';

    const status = message === 'Project id does not exist' ? 400 : 500;

    res.status(status).json({ error: message });
  }
}

/**
 * @swagger
 * /api/tasks/mark-done:
 *   put:
 *     summary: Mark task completed
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task completed
 *       404:
 *         description: Tarea not completed
 */
export async function markTaskDoneController(req: Request<{}, {}, Pick<Task, 'id'>>, res: Response<Task | { error: string }>): Promise<void> {
  try {
    if (!req.body.id) {
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }
    const task = await taskService.markTaskDone(req.body.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database operation failed';
    const status = message === 'Task id does not exist' ? 400 : 500;

    res.status(status).json({ error: message });
  }
}

/**
 * @swagger
 * /api/tasks/mark-not-done:
 *   put:
 *     summary: Mark task not completed
 *     tags:
 *     - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task marked as not done
 *       404:
 *         description: Task not found
 */
export async function markTaskNotDoneController(req:Request<{}, {}, Pick<Task, 'id'>>, res: Response<Task | { error: string }>): Promise<void> {
  try {
    if (!req.body.id) {
      res.status(400).json({ error: 'Task ID is required' });
      return;
    }
    const task = await taskService.markTaskNotDone(req.body.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database operation failed';
    const status = message === 'Task id does not exist' ? 400 : 500;

    res.status(status).json({ error: message });
  }
}

/**
 * @swagger
 * /api/tasks/delete:
 *   delete:
 *     summary: Delete task
 *     tags:
 *     - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
export async function deleteTaskController(req: Request<{}, {}, Pick<Task, 'id'>>, res: Response<Task | { error: string }>): Promise<void> {
  try {
    const deleted = await taskService.deleteTask(req.body.id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(deleted);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database operation failed';
    const status = message === 'Task id does not exist' ? 400 : 500;

    res.status(status).json({ error: message });
  }
}