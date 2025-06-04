import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Task } from '../models/task';
import { PrismaClient } from '../generated/prisma';

const filePath = path.join(__dirname, '..', 'tasks.json');

const prisma = new PrismaClient()

function loadTasks(): Task[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as Task[];
}

function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export async function getTasks(): Promise<Task[]> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc', // Optional: sort by newest first
      },
    });
    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw new Error('Failed to fetch tasks from database');
  }
}

export async function createTask(description: string): Promise<Task> {
  const newTask = {
    id: Date.now().toString(),
    description,
    completed: false,
    createdAt: new Date(),
  };

  try {
    const createdTask = await prisma.task.create({
      data: {
        id: newTask.id,
        description: newTask.description,
        completed: newTask.completed,
        createdAt: newTask.createdAt,
      },
    });
    return createdTask;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw new Error('Database operation failed');
  }
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
