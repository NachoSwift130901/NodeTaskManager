import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Task } from './types';

const filePath = path.join(__dirname, '..', 'tasks.json');

function loadTasks(): Task[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as Task[];
}

function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export function getAllTasks(req: Request, res: Response) {
  res.json(loadTasks());
}

export function createTask(req: Request, res: Response) {
  const tasks = loadTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    description: req.body.description,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
}

export function markTaskDone(req: Request<{ id: string }>, res: Response<Task | { error: string }>): void {
  try {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    task.completed = true;
    saveTasks(tasks);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export function deleteTask(req: Request<{ id: string }>, res: Response<Task | { error: string }>): void {
  try {
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    const deleted = tasks.splice(index, 1)[0];
    saveTasks(tasks);
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
