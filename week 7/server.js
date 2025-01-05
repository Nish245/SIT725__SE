const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const taskController = require('./controller/controller');
const taskModel = require('./models/model');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Database connection
taskModel.connectDB();

// Routes
app.get('/api/tasks/:status?', async (req, res) => {
    const tasks = await taskModel.getTasksByStatus(req.params.status || 'active');
    res.json({ data: tasks });
});

app.post('/api/task', async (req, res) => {
    const task = req.body;
    const result = await taskModel.addTask(task);
    const newTask = { ...task, _id: result.insertedId, status: 'active' };
    io.emit('taskAdded', newTask); // Notify clients about the new task
    res.status(201).json({ message: 'Task added successfully', data: newTask });
});

app.put('/api/task/complete/:id', async (req, res) => {
    const id = req.params.id;
    await taskModel.updateTask(id, { status: 'completed' });
    io.emit('taskUpdated', { id, status: 'completed' }); // Notify clients about the task update
    res.status(200).json({ message: 'Task marked as completed' });
});

app.delete('/api/task/:id', async (req, res) => {
    const id = req.params.id;
    await taskModel.updateTask(id, { status: 'deleted' });
    io.emit('taskDeleted', id); // Notify clients about the task deletion
    res.status(200).json({ message: 'Task marked as deleted' });
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit random numbers every second
    const intervalId = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 100);
        console.log(`Emitting random number: ${randomNumber}`); // Logs in the terminal
        socket.emit('randomNumber', randomNumber); // Sends to the client
    }, 1000);

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        clearInterval(intervalId);
    });
});

if (require.main === module) {
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;
