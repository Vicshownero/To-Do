document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    saveTask(task);
    displayTask(task);
    taskInput.value = "";
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTask(task) {
    const taskList = document.getElementById("taskList");
    const li = document.createElement("li");
    li.classList.add(task.completed ? "completed" : "pending");
    li.innerHTML = `
        <span onclick="toggleTask(this)" class="${task.completed ? "completed" : ""}">${task.text}</span>
        <button onclick="deleteTask(this)" class="delete">Delete</button>
        ${task.completed ? '<button onclick="undoTask(this)" class="undo">Undo</button>' : ""}
    `;
    taskList.appendChild(li);
}

function toggleTask(element) {
    const taskText = element.textContent;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find(t => t.text === taskText);
    task.completed = !task.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    element.classList.toggle("completed");
    element.classList.toggle("pending");
    filterTasks("all");
}

function deleteTask(button) {
    const taskText = button.previousElementSibling.textContent;
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    button.parentElement.remove();
}

function undoTask(button) {
    const taskText = button.previousElementSibling.previousElementSibling.textContent;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find(t => t.text === taskText);
    task.completed = false;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    filterTasks("all");
}

function filterTasks(type) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        if (type === "all" || (type === "completed" && task.completed) || (type === "pending" && !task.completed)) {
            displayTask(task);
        }
    });
}

function clearCompleted() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter(t => !t.completed);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    filterTasks("all");
}
