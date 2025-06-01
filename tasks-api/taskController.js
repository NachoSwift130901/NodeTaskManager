const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'tasks.json')

function loadTasks() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

function getAllTasks(req, res) {
    const tasks = loadTasks();
    res.json(tasks);
}

function createTask(req, res) {
    const tasks = loadTasks();
    const newTask = {
        id: Date.now().toString(),
        description: req.body.description,
        completed: false
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
}

function markTaskDone(req, res) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    task.completed = true;
    saveTasks(tasks);
    res.json(task);
}

function deleteTask(req, res) {
    let tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
    const deleted = tasks.splice(index, 1);
    saveTasks(tasks);
    res.json(deleted[0]);
}

module.exports = {
    getAllTasks,
    createTask,
    markTaskDone,
    deleteTask
};