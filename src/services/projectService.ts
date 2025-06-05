import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Project } from '../models/project';


const filePath = path.join(__dirname, '..', 'projects.json');

function loadProjects(): Project[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as Project[];
}

function saveProjects(projects: Project[]): void {
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2))
}


export function getProjects(): Project[] {
    return loadProjects()
}

export function addProject(project: string): Project {
    const projects = loadProjects();
    const newProject: Project = {
        name: project,
        id: Date.now().toString() // Generate a unique ID based on timestamp
    };
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
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
