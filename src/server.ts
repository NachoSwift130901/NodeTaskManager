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
  markTaskNotDoneController,
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

const apiRouter = express.Router();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


apiRouter.get('/tasks', getAllTasksController)
apiRouter.post('/tasks', createTaskController)
apiRouter.put('/tasks/mark-done/:id', markTaskDoneController)
apiRouter.put('/tasks/mark-not-done/:id', markTaskNotDoneController)
apiRouter.delete('/tasks/:id', deleteTaskController)

apiRouter.get('/projects', getProjectsController)
apiRouter.post('/projects', createProjectController)
apiRouter.put('/projects', updateProjectController)
apiRouter.delete('/projects/:id', deleteProjectController)

app.use('/api', apiRouter);

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
