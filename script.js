document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // Función para renderizar las tareas en la interfaz
    function renderTasks(tasks) {
        // Limpiamos la lista actual
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            
            // Si la tarea está completada, le añadimos la clase 'completed'
            if (task.completed) {
                li.classList.add('completed');
            }
            
            const span = document.createElement('span');
            span.textContent = "\u00d7";
            li.appendChild(span);
            
            // Añadimos el ID como un atributo para futuras acciones
            li.dataset.id = task.id;
            
            taskList.appendChild(li);
        });
    }

    // Función para cargar las tareas desde el Back-End
    async function loadTasks() {
        try {
            // Hacemos una solicitud GET a nuestra API
            const response = await fetch('https://mi-servidor.vercel.app/');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    }

    // Función para añadir una nueva tarea al Back-End
    async function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = { text: taskText, completed: false };
            try {
                // Hacemos una solicitud POST a nuestra API para añadir la tarea
                const response = await fetch('https://mi-servidor.vercel.app/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTask)
                });

                if (response.ok) {
                    // Si la solicitud fue exitosa, volvemos a cargar la lista
                    taskInput.value = '';
                    loadTasks();
                }
            } catch (error) {
                console.error('Error al añadir la tarea:', error);
            }
        }
    }

    // Eventos (ya conocidos, pero ahora con la lógica de la API)
    addButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Delegación de eventos para marcar como completado y eliminar
    taskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle('completed');
        } else if (e.target.tagName === 'SPAN') {
            e.target.parentElement.remove();
        }
    });

    // Cargamos las tareas al iniciar la página
    loadTasks();
});