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

