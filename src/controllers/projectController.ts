import e, { Request, Response } from 'express';
import * as projectService from '../services/projectService'
import { Project } from '../models/project';

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
export async function getProjectsController(req: Request, res: Response<Project[] | { error: string }>) {
    try {
        const projects = await projectService.getProjects()
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
export async function createProjectController(req: Request<{}, {}, Pick<Project, 'name'>>, res: Response<Project | { error: string }>) {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Project name is required' });
            return;
        }
        const newProject = await projectService.addProject(name);
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
 *       404:
 *         description: Project not found
 *       400:
 *         description: Bad request, missing project ID or name
 *       500:
 *         description: Failed to update project
 */
export async function updateProjectController(req: Request<{}, {}, Pick<Project, 'id' | 'name'>>, res: Response<Project | { error: string }>): Promise<void> {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).json({ error: 'Project ID and name are required' })
        return
    }

    try {
        const project = await projectService.updateProject(id, name);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Database operation failed';
        const status = message === 'Project id does not exist' ? 400 : 500;

        res.status(status).json({ error: message });
    }
}


/**
 *  @swagger
 * /projects/{id}:
 *   delete:
 *      summary: Delete a project by ID
 *      tags:
 *      - Projects
 *      parameters:  
 *          - in: path
 *            name: id
 *            required: true
 *            description: The ID of the project to delete
 *      responses:
 *          200:
 *              description: Project deleted successfully
 *          404:
 *              description: Project not found
 *          500: 
 *              description: Failed to delete project
 * */
export function deleteProjectController(req: Request<{ id: string }>, res: Response<Project | { error: string }>) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Project ID is required' });
        return;
    }
    try {
        const deletedProject = projectService.deleteProject(id);
        if (!deletedProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(deletedProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
}