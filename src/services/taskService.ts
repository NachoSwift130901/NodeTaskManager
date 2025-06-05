import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Task } from '../models/task';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient()

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

export async function createTask(description: string, idProject: string): Promise<Task> {
  try {
    // Check if the project exists before creating the task
    const project = await prisma.project.findUnique({
      where: { id: idProject },
    });
    if (!project) {
      throw new Error('Project id does not exist');
    }

    const createdTask = await prisma.task.create({
      data: {
        description,
        idProject,
      },
    });
    return createdTask;
  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof Error && error.message === 'Project id does not exist') {
      throw error;
    }
    throw new Error('Database operation failed');
  }
}

export async function markTaskDone(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
      where: { id: id },
    });
    if (!task) {
      throw new Error('Task id does not exist');
    }
  try {
    const taskDone = await prisma.task.update({
      where: { id },
      data: { completed: true },
    });
    return taskDone;
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(id: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
      where: { id: id },
    });
    if (!task) {
      throw new Error('Task id does not exist');
    }
  try {
    const deletedtask = await prisma.task.delete({
      where: { id },
    });
    return deletedtask;
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Failed to delete task');
  }
}