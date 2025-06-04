import { Request, Response } from 'express';
import * as projectService from '../services/projectService'
import { Project } from '../models/Project';

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a list of projects
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Failed to load projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export function getProjectsController(req: Request, res: Response<Project[] | { error: string }>) {
    try {
        const projects = projectService.getProjects()
        res.json(projects)
    } catch (error) {
        res.status(500).json({ error: 'Failed to load projects' });
    }
}

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags:
 *     - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         name: Project created
 */
export function createProjectController(req: Request<{}, {}, Pick<Project, 'name'>>, res: Response<Project | { error: string }>) {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Project name is required' });
            return;
        }
        const newProject = projectService.addProject(name);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
}

/**
 * @swagger
 * /projects:
 *   put:
 *     summary: Update an existing project
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The id of the project
 *               name:
 *                 type: string
 *                 description: The new name of the project
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       400:
 *         description: Bad request, missing project ID or name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Failed to update project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export function updateProjectController(req: Request<{}, {}, Pick<Project, 'id' | 'name'>>, res: Response<Project | { error: string }>): void {
    const { id, name} = req.body;
    if (!id || !name) {
        res.status(400).json({ error: 'Project ID and name are required' })
        return
    }
    const updatedProject: Project = { id,name,};

    try {
        const project = projectService.updateProject(updatedProject);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
}