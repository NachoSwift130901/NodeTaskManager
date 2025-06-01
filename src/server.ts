import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  getAllTasks,
  createTask,
  markTaskDone,
  deleteTask
} from './controllers/taskController';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', getAllTasks);
app.post('/tasks', createTask);
app.put('/tasks/:id', markTaskDone); 
app.delete('/tasks/:id', deleteTask);


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
