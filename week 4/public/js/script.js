$(document).ready(function () {
    // Initialize Materialize select
    $('select').formSelect();

    // Fetch all tasks and display them
    function loadTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => {
                if (data.statusCode === 200) {
                    $('#task-section').html(''); 
                    data.data.forEach(task => {
                        $('#task-section').append(`
                            <div class="col s12 m6">
                                <div class="card">
                                    <div class="card-content">
                                        <span class="card-title">${task.title}</span>
                                        <p>${task.description}</p>
                                        <p><strong>Priority:</strong> ${task.priority}</p>
                                    </div>
                                    <div class="card-action">
                                        <button class="btn red" onclick="deleteTask('${task._id}')">Delete</button>
                                        ${task.status !== 'completed' ? `<button class="btn green" onclick="markAsCompleted('${task._id}')">Mark as Completed</button>` : ''}
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                }
            });
    }

    loadTasks();

    // Add a new task
    $('#taskForm').submit(function (e) {
        e.preventDefault();
        const newTask = {
            title: $('#title').val(),
            description: $('#description').val(),
            priority: $('#priority').val(),
            completed: false
        };

        fetch('/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
            .then(response => response.json())
            .then(data => {
                if (data.statusCode === 201) {
                    alert('Task added successfully!');
                    loadTasks();
                    $('#taskForm')[0].reset();
                }
            });
    });

    // Delete a task
    window.deleteTask = function (id) {
        fetch(`/api/task/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.statusCode === 200) {
                    alert('Task deleted successfully!');
                    loadTasks();
                }
            });
    };

    // Mark a task as completed
    window.markAsCompleted = function (id) {
        fetch(`/api/task/${id}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                if (data.statusCode === 200) {
                    alert('Task marked as completed!');
                    loadTasks();
                }
            });
    };
});
