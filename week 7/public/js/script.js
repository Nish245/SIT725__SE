document.addEventListener('DOMContentLoaded', () => {
    const taskSection = document.getElementById('task-section');
    const form = document.getElementById('taskForm');
    const modal = document.getElementById('editTaskModal');
    let editTaskId = null;

    // Initialize Materialize components
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('select'));

    // Socket.IO connection
    const socket = io();

    // Listen for random number from server
    socket.on('randomNumber', (number) => {
        console.log(`Random Number (from server): ${number}`); // Logs in the browser console
    });

    // Function to load tasks dynamically
    function loadTasks() {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                taskSection.innerHTML = ''; // Clear the section
                data.data.forEach(task => {
                    taskSection.innerHTML += `
                        <div class="col s12 m6 l4">
                            <div class="card">
                                <div class="card-content">
                                    <span class="card-title">${task.title}</span>
                                    <p>${task.description}</p>
                                    <p><strong>Priority:</strong> ${task.priority}</p>
                                    <p><strong>Status:</strong> ${task.status}</p>
                                </div>
                                <div class="card-action">
                                    <button class="btn red waves-effect" onclick="deleteTask('${task._id}')">Delete</button>
                                    ${task.status === 'active' ? `
                                    <button class="btn green waves-effect" onclick="markAsCompleted('${task._id}')">Complete</button>` : ''}
                                    <button class="btn blue waves-effect" onclick="openEditModal('${task._id}', '${task.title}', '${task.description}', '${task.priority}')">Edit</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            });
    }

    // Add a new task
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
        };

        fetch('/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        }).then(() => {
            form.reset();
            M.FormSelect.init(document.querySelectorAll('select'));
            loadTasks();
        });
    });

    // Mark task as completed
    window.markAsCompleted = (id) => {
        fetch(`/api/task/complete/${id}`, { method: 'PUT' })
            .then(() => loadTasks());
    };

    // Delete a task
    window.deleteTask = (id) => {
        fetch(`/api/task/${id}`, { method: 'DELETE' })
            .then(() => loadTasks());
    };

    // Open Edit Modal
    window.openEditModal = (id, title, description, priority) => {
        editTaskId = id;
        document.getElementById('edit-title').value = title;
        document.getElementById('edit-description').value = description;
        document.getElementById('edit-priority').value = priority;

        M.updateTextFields();
        M.FormSelect.init(document.querySelectorAll('select'));
        const instance = M.Modal.getInstance(modal);
        instance.open();
    };

    // Save Edited Task
    document.getElementById('saveEditBtn').addEventListener('click', () => {
        const updatedTask = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            priority: document.getElementById('edit-priority').value
        };

        fetch(`/api/task/edit/${editTaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        }).then(() => {
            const instance = M.Modal.getInstance(modal);
            instance.close();
            loadTasks();
        });
    });

    // Initial load
    loadTasks();
});
