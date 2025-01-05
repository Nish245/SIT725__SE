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
        console.error('MongoDB connection failed:', error.message);
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
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid Task ID');
        }
        const objectId = new ObjectId(id);
        return await collection.updateOne(
            { _id: objectId },
            { $set: updatedFields }
        );
    } catch (error) {
        console.error('Error in updateTask:', error.message);
        throw error;
    }
}

module.exports = {
    connectDB,
    getTasksByStatus,
    addTask,
    updateTask
};
