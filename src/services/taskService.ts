import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Task } from '../models/types';

const filePath = path.join(__dirname, '..', 'tasks.json');

function loadTasks(): Task[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as Task[];
}

function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export function getTasks(): Task[] {
  return loadTasks();
}

export function createTask(description: string): Task  {
  const tasks = loadTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    description: description,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function markTaskDone(id: string): Task | null {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  task.completed = true;
  saveTasks(tasks);
  return task;
}

export function removeTask(id: string): Task | null {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  const deleted = tasks.splice(index, 1)[0];
  saveTasks(tasks);
  return deleted;
}
