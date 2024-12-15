const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let collection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        collection = client.db('TaskManager').collection('Tasks');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed', error);
    }
}

// Fetch tasks by status
async function getTasksByStatus(status) {
    return await collection.find({ status }).toArray();
}

// Add a new task
async function addTask(task) {
    task.status = 'active';
    return await collection.insertOne(task);
}

// Update task details
async function updateTask(id, updatedFields) {
    return await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFields }
    );
}

module.exports = {
    connectDB,
    getTasksByStatus,
    addTask,
    updateTask
};
