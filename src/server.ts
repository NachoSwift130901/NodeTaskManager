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

app.use(express.json());
app.use(cors());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/tasks', getAllTasksController)
app.post('/tasks', createTaskController)
app.put('/tasks/:id', markTaskDoneController)
app.delete('/tasks/:id', deleteTaskController)

app.get('/projects', getProjectsController)
app.post('/projects', createProjectController)
app.put('/projects', updateProjectController)
app.delete('/projects/:id', deleteProjectController)

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: "Invalid JSON format" });
    return;
  }
  next(err);
};
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
});
