const taskModel = require('../models/model');
const responseHandler = require('../views/responsehandler');

// Get tasks by status
async function getTasks(req, res) {
    const status = req.params.status || 'active';
    try {
        const tasks = await taskModel.getTasksByStatus(status);
        responseHandler.successResponse(res, 200, tasks, `${status} tasks fetched successfully`);
    } catch (error) {
        responseHandler.errorResponse(res, 500, 'Failed to fetch tasks');
    }
}

// Add a new task
async function addTask(req, res) {
    try {
        const task = req.body;
        const result = await taskModel.addTask(task);
        responseHandler.successResponse(res, 201, result, 'Task added successfully');
    } catch (error) {
        responseHandler.errorResponse(res, 500, 'Failed to add task');
    }
}

// Edit a task
async function updateTask(req, res) {
    try {
        const id = req.params.id;
        const updatedFields = req.body;
        const result = await taskModel.updateTask(id, updatedFields);

        if (result.matchedCount === 0) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }
        responseHandler.successResponse(res, 200, null, 'Task updated successfully');
    } catch (error) {
        responseHandler.errorResponse(res, 500, 'Failed to update task');
    }
}

// Mark task as completed
async function completeTask(req, res) {
    try {
        const id = req.params.id;
        const result = await taskModel.updateTask(id, { status: 'completed' });
        if (result.matchedCount === 0) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }
        responseHandler.successResponse(res, 200, null, 'Task marked as completed');
    } catch (error) {
        responseHandler.errorResponse(res, 500, 'Failed to mark task as completed');
    }
}

// Soft delete a task
async function deleteTask(req, res) {
    try {
        const id = req.params.id;
        const result = await taskModel.updateTask(id, { status: 'deleted' });
        if (result.matchedCount === 0) {
            return responseHandler.errorResponse(res, 404, 'Task not found');
        }
        responseHandler.successResponse(res, 200, null, 'Task marked as deleted');
    } catch (error) {
        responseHandler.errorResponse(res, 500, 'Failed to delete task');
    }
}

module.exports = {
    getTasks,
    addTask,
    completeTask,
    deleteTask,
    updateTask
};