import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { Task } from '../models/types';


export function getAllTasks(req: Request, res: Response<Task[] | { error: string }>): void {
  try {
    const tasks = taskService.getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tasks' });
  }
}

export function createTask(req: Request<{}, {}, Pick<Task, 'description'>>, res: Response<Task | { error: string }>): void {
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

export function markTaskDone(req: Request<{ id: string }>, res: Response<Task | { error: string }>): void {
  try {
    const task = taskService.markTaskDone(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export function deleteTask(req: Request<{ id: string }>, res: Response<Task | { error: string }>): void {
  try {
    const deleted = taskService.removeTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}