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

export function getProjectById(id: string): Project | null {
    const projects = loadProjects();
    return projects.find(p => p.id === id) || null;
}

export function updateProject(updatedProject: Project): Project | null {
    const projects = loadProjects();
    const index = projects.findIndex(p => p.id === updatedProject.id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updatedProject };
    saveProjects(projects);
    return projects[index];
}

export function deleteProject(id: string): Project | null {
    const projects = loadProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    const deletedProject = projects.splice(index, 1)[0];
    saveProjects(projects);
    return deletedProject;
}
