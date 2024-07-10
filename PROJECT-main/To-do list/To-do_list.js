document.addEventListener('DOMContentLoaded', init);

function init() {
    load();
}

function load() {
    // Load tasks from Web Storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Display tasks
    const taskList = document.getElementById('task_list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const tl = document.createElement('tl');
        tl.textContent = task;
        taskList.appendChild(tl);
    }); 
}

function addTask() {
    const newTaskEntry = document.getElementById('new_task');
    const newTask = newTaskEntry.value.trim();

    if (newTask !== '') {
        // Get tasks from Web Storage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Add new task
        tasks.push(newTask);

        // Save updated task list to Web Storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        load();
    }
}

function clearList() {
    // Clear tasks
    localStorage.removeItem('tasks');

    // Reload list
    load();
};