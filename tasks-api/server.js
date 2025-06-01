const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  getAllTasks,
  createTask,
  markTaskDone,
  deleteTask
} = require('./taskController');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.get('/tasks', getAllTasks);
app.post('/tasks', createTask);
app.put('/tasks/:id', markTaskDone);
app.delete('/tasks/:id', deleteTask);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
