import { Request, Response } from 'express';
import * as projectService from '../services/projectService'
import { Project } from '../models/project';

export function getProjects(req: Request, res: Response<Project[] | { error: string }>) {
    try {
        const projects = projectService.getProjects()
        res.json(projects)
    } catch (error) {
        res.status(500).json({ error: 'Failed to load projects' });
    }
}