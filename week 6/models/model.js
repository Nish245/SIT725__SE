const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017';
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

// Add multiple tasks at once (Bulk Insert)
async function addBulkTasks(tasks) {
    try {
        return await collection.insertMany(tasks);
    } catch (error) {
        console.error('Error in bulk insert:', error.message);
        throw error;
    }
}

// Update task details with error handling
async function updateTask(id, updatedFields) {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid Task ID');
        }
        const objectId = new ObjectId(id);
        const result = await collection.updateOne(
            { _id: objectId },
            { $set: updatedFields }
        );

        return result;
    } catch (error) {
        console.error('Error in updateTask:', error.message);
        throw error;
    }
}

module.exports = {
    connectDB,
    getTasksByStatus,
    addTask,
    addBulkTasks,
    updateTask,
};
