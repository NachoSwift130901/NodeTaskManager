import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import {
  getAllTasksController,
  createTaskController,
  markTaskDoneController,
  deleteTaskController,
} from './controllers/taskController';

import {
  getProjectsController,
  createProjectController,
  updateProjectController,
  deleteProjectController
} from './controllers/projectController'


const app = express()
const PORT = 3000

app.use(cors());
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/tasks', getAllTasksController)
app.post('/tasks', createTaskController)
app.put('/tasks/:id', markTaskDoneController)
app.delete('/tasks/:id', deleteTaskController)

app.get('/projects', getProjectsController)
app.post('/projects', createProjectController)
app.put('/projects', updateProjectController)
app.delete('/projects/:id', deleteProjectController)


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
});
