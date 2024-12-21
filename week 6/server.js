const express = require('express');
const taskController = require('./controller/controller');
const taskModel = require('./models/model');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Database connection
taskModel.connectDB();

// Routes
app.get('/api/tasks/:status?', taskController.getTasks);
app.post('/api/task', taskController.addTask);
app.put('/api/task/complete/:id', taskController.completeTask);
app.delete('/api/task/:id', taskController.deleteTask);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app; // Export for testing
