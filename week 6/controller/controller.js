const taskModel = require('../models/model');
const responseHandler = require('../views/responsehandler');

// Fetch tasks
async function getTasks(req, res) {
    const status = req.params.status || 'active';
    const tasks = await taskModel.getTasksByStatus(status);
    responseHandler.successResponse(res, 200, tasks, 'Tasks retrieved successfully');
}

// Add a new task (or multiple tasks)
async function addTask(req, res) {
    const tasks = req.body; // Handles both single and bulk insertion

    if (Array.isArray(tasks)) {
        // Bulk validation for each task
        for (let task of tasks) {
            if (!task.title || !task.description || !task.priority) {
                return responseHandler.errorResponse(res, 400, 'All fields are required in each task');
            }
            if (task.title.length > 100) { // Restrict title length
                return responseHandler.errorResponse(res, 400, 'Title is too long (max 100 characters)');
            }
        }

        const result = await taskModel.addBulkTasks(tasks);
        return responseHandler.successResponse(res, 201, result, 'Tasks added successfully');
    }

    // Single task validation
    const { title, description, priority } = tasks;
    if (!title || !description || !priority) {
        return responseHandler.errorResponse(res, 400, 'All fields (title, description, priority) are required');
    }
    if (title.length > 100) { // Prevent overly long titles
        return responseHandler.errorResponse(res, 400, 'Title is too long (max 100 characters)');
    }

    const result = await taskModel.addTask({ title, description, priority });
    responseHandler.successResponse(res, 201, result, 'Task added successfully');
}

// Mark a task as completed
async function completeTask(req, res) {
    try {
        const id = req.params.id;

        if (!id || !require('mongodb').ObjectId.isValid(id)) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }

        const result = await taskModel.updateTask(id, { status: 'completed' });

        if (!result || result.matchedCount === 0) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }

        responseHandler.successResponse(res, 200, null, 'Task marked as completed');
    } catch (error) {
        console.error('Error in completeTask:', error.message);
        responseHandler.errorResponse(res, 500, 'Server error');
    }
}

// Soft delete a task
async function deleteTask(req, res) {
    try {
        const id = req.params.id;

        if (!id || !require('mongodb').ObjectId.isValid(id)) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }

        const result = await taskModel.updateTask(id, { status: 'deleted' });

        if (!result || result.matchedCount === 0) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }

        responseHandler.successResponse(res, 200, null, 'Task marked as deleted');
    } catch (error) {
        console.error('Error in deleteTask:', error.message);
        responseHandler.errorResponse(res, 500, 'Server error');
    }
}

module.exports = {
    getTasks,
    addTask,
    completeTask,
    deleteTask,
};
