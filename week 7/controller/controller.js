const taskModel = require('../models/model');
const responseHandler = require('../views/responsehandler');

// Fetch tasks
async function getTasks(req, res) {
    const status = req.params.status || 'active';
    const tasks = await taskModel.getTasksByStatus(status);
    responseHandler.successResponse(res, 200, tasks, 'Tasks retrieved successfully');
}

// Add a new task
async function addTask(req, res) {
    const { title, description, priority } = req.body;
    if (!title) {
        return responseHandler.errorResponse(res, 400, 'Title is required');
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
        if (result.matchedCount === 0) {
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
        if (result.matchedCount === 0) {
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
    deleteTask
};
