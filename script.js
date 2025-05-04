// Sélection des éléments
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Charger les tâches depuis le localStorage au chargement
document.addEventListener('DOMContentLoaded', displayTasks);

// Ajouter une tâche
if (taskForm) {
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const priority = document.getElementById('priority').value;

        if (title === '') {
            alert('Veuillez entrer un titre pour la tâche.');
            return;
        }

        const task = {
            id: Date.now(),
            title,
            date,
            time,
            priority,
            completed: false
        };

        saveTask(task);
        addTaskToDOM(task);
        taskForm.reset();
    });
}

// Sauvegarder une tâche dans localStorage
function saveTask(task) {
    let tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Récupérer toutes les tâches
function getTasks() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

// Afficher les tâches
function displayTasks() {
    const tasks = getTasks();
    if (!taskList) return;

    // Vérifie la page actuelle
    const isCompletedPage = window.location.href.includes('taches_terminees');
    const isPendingPage = window.location.href.includes('taches_restantes');

    tasks.forEach(task => {
        if (isCompletedPage && task.completed) {
            addTaskToDOM(task);
        } else if (isPendingPage && !task.completed) {
            addTaskToDOM(task);
        } else if (!isCompletedPage && !isPendingPage) {
            addTaskToDOM(task);
        }
    });
}

// Ajouter une tâche dans le DOM
function addTaskToDOM(task) {
    if (!taskList) return;

    const li = document.createElement('li');
    li.classList.add(`priority-${task.priority.toLowerCase()}`);
    li.innerHTML = `
        <span>
            <strong>${task.title}</strong> - ${task.date} ${task.time} (${task.priority})
        </span>
        <div class="status-icons">
            <select class="task-status">
                <option value="not-completed" ${!task.completed ? 'selected' : ''}>Pas fait</option>
                <option value="completed" ${task.completed ? 'selected' : ''}>Fait</option>
            </select>
        </div>
    `;

    li.querySelector('.task-status').addEventListener('change', (e) => {
        const newStatus = e.target.value;
        task.completed = newStatus === 'completed';
        saveTask(task);
        location.reload(); // Recharge la page pour mettre à jour la liste
    });

    taskList.appendChild(li);
}

// Marquer une tâche comme terminée
function markAsCompleted(id) {
    let tasks = getTasks();
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload(); // Recharge la page pour mettre à jour la liste
}

function markAsNotCompleted(id) {
    let tasks = getTasks();
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
}

// Supprimer une tâche
function deleteTask(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload(); // Recharge la page pour mettre à jour la liste
}
