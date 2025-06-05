import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Project } from '../models/project';
import { PrismaClient } from '../generated/prisma';


const filePath = path.join(__dirname, '..', 'projects.json');

const prisma = new PrismaClient()

function loadProjects(): Project[] {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as Project[];
}

function saveProjects(projects: Project[]): void {
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2))
}


export async function getProjects(): Promise<Project[]> {
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                name: 'asc', // Optional: sort by name alphabetically
            },
        });
        return projects;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw new Error('Failed to fetch projects from database');
    }
}

export async function addProject(project: string): Promise<Project> {
    try {
        const createdProject = await prisma.project.create({
            data: {
                name: project,
            },
        });
        return createdProject;
    } catch (error) {
        console.error('Failed to create project:', error);
        throw new Error('Database operation failed');
    }
}

export async function updateProject(id: string, name: string): Promise<Project | null> {

    // Check if the project exists before creating the task
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    if (!project) {
      throw new Error('Project id does not exist');
    }
    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data: { name: name },
        });
        return updatedProject;
    } catch (error) {
        console.error('Failed to update project:', error);
        throw new Error('Database operation failed');
    }
}

export function deleteProject(id: string): Project | null {
    const projects = loadProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    const deletedProject = projects.splice(index, 1)[0];
    saveProjects(projects);
    return deletedProject;
}
