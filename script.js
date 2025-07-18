document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');
    const apiUrl = 'https://mi-servidor.vercel.app/api/tasks';

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
            li.dataset.id = task._id;
            
            taskList.appendChild(li);
        });
    }

    // Función para cargar las tareas desde el Back-End
    async function loadTasks() {
        try {
            // Hacemos una solicitud GET a nuestra API
            const response = await fetch(apiUrl);
            const tasks = await response.json();

             // --- AGREGA ESTA LÍNEA ---
            console.log('Datos recibidos de la API:', tasks); 
            // ------------------------

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

            // **ACTUALIZACIÓN OPTIMISTA: Mostramos la tarea inmediatamente**
            const tempId = Date.now(); // Creamos un ID temporal
            const li = document.createElement('li');
            li.textContent = newTask.text;
            li.dataset.id = tempId;
            taskList.appendChild(li);
            taskInput.value = '';

            try {
                // Hacemos una solicitud POST a nuestra API para añadir la tarea
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTask)
                });

                if (response.ok) {
                    // Si la solicitud fue exitosa, volvemos a cargar la lista
                    taskInput.value = '';
                    loadTasks();
                } else {
                    // Si la solicitud falla, borramos la tarea que añadimos
                    document.querySelector(`li[data-id="${tempId}"]`).remove();
                    console.error('Error al añadir la tarea, por favor, intente de nuevo.');
                }

            } catch (error) {
                // Si hay un error, borramos la tarea
                document.querySelector(`li[data-id="${tempId}"]`).remove();
                console.error('Error al añadir la tarea:', error);
            }
        }
    }

    // Función para eliminar una tarea en el Back-End
    async function deleteTask(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadTasks(); // Volvemos a cargar la lista para actualizar
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    }

    // Función para actualizar el estado 'completado' de una tarea
    async function updateTaskStatus(id, completed) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed })
            });
            if (response.ok) {
                loadTasks(); // Volvemos a cargar la lista
            }
        } catch (error) {
            console.error('Error al actualizar el estado de la tarea:', error);
        }
    }

    // Eventos (ya conocidos, pero ahora con la lógica de la API)
    addButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Delegación de eventos para las acciones de la tarea
    taskList.addEventListener('click', async (e) => {
        // Usamos .closest('li') para encontrar el elemento <li> padre
        const li = e.target.closest('li');
        if (!li) return; // Si el clic no fue dentro de un <li>, salimos

        const id = li.dataset.id; // Obtenemos el ID del atributo data-id
        
        if (e.target.tagName === 'LI') {
            // Lógica para marcar como completado
            const completed = !li.classList.contains('completed');
            try {
                await updateTaskStatus(id, completed);
            } catch (error) {
                console.error('Error al actualizar el estado:', error);
            }
        } else if (e.target.tagName === 'SPAN') {
            // Lógica para eliminar
            try {
                await deleteTask(id);
            } catch (error) {
                console.error('Error al eliminar la tarea:', error);
            }
        }
    });

    // Cargamos las tareas al iniciar la página
    loadTasks();
});