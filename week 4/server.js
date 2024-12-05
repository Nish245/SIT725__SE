const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const uri = "mongodb://localhost:27017";
const port = process.env.PORT || 3000;
let collection;

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Connection
const client = new MongoClient(uri);
async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db('TaskManager').collection('Tasks');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed', error);
    }
}

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API to get all active tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await collection.find({ status: 'active' }).toArray();
        res.json({ statusCode: 200, data: tasks, message: 'Get active tasks successful' });
    } catch (error) {
        res.json({ statusCode: 500, message: 'Failed to get tasks' });
    }
});

// API to add a new task
app.post('/api/task', async (req, res) => {
    try {
        const task = { ...req.body, status: 'active' }; // Default status is 'active'
        const result = await collection.insertOne(task);
        res.json({ statusCode: 201, data: result, message: 'Task added successfully' });
    } catch (error) {
        res.json({ statusCode: 500, message: 'Failed to add task' });
    }
});

// API to mark a task as deleted
app.delete('/api/task/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'deleted' } }
        );
        res.json({ statusCode: 200, message: 'Task marked as deleted' });
    } catch (error) {
        res.json({ statusCode: 500, message: 'Failed to delete task' });
    }
});

// API to mark a task as completed
app.put('/api/task/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'completed' } }
        );
        res.json({ statusCode: 200, message: 'Task marked as completed' });
    } catch (error) {
        res.json({ statusCode: 500, message: 'Failed to update task' });
    }
});

// API to get completed tasks
app.get('/api/tasks/completed', async (req, res) => {
    try {
        const tasks = await collection.find({ status: 'completed' }).toArray();
        res.json({ statusCode: 200, data: tasks, message: 'Get completed tasks successful' });
    } catch (error) {
        res.json({ statusCode: 500, message: 'Failed to get completed tasks' });
    }
});

// API to get deleted tasks
app.get('/api/tasks/deleted', async (req, res) => {
    try {
        const tasks = await collection.find({ status: 'deleted' }).toArray();
        res.json({ statusCode: 200, data: tasks, message: 'Get deleted tasks successful' });
    } catch (error) {
        res.json({ statusCode: 500, message: 'Failed to get deleted tasks' });
    }
});

// Start server and MongoDB connection
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    runDBConnection();
});
