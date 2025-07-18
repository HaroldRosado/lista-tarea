document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const li = document.createElement('li');
            li.textContent = taskText;

            const span = document.createElement('span');
            span.textContent = "\u00d7";
            li.appendChild(span);
            
            taskList.appendChild(li);
            taskInput.value = '';
            
            // Llamar a la función para guardar los datos
            saveData();
        }
    }

    // 1. Conectar la función al evento de clic del botón
    addButton.addEventListener('click', addTask);

    // 2. Permitir añadir tareas al presionar Enter
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // 3. Delegación de eventos para marcar como completado y eliminar
    taskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle('completed');
            // Llamar a la función para guardar los datos
            saveData();
        } else if (e.target.tagName === 'SPAN') {
            e.target.parentElement.remove();
            // Llamar a la función para guardar los datos
            saveData();
        }
    });

    // ==========================================
    // 4. Lógica de persistencia con localStorage
    // ==========================================

    // Función para guardar los datos en el localStorage
    function saveData() {
        // Guardamos todo el HTML de la lista de tareas
        localStorage.setItem("data", taskList.innerHTML);
    }

    // Función para mostrar los datos guardados
    function showTask() {
        // Obtenemos el HTML guardado
        const savedData = localStorage.getItem("data");
        if (savedData) {
            // Si hay datos, los insertamos en la lista
            taskList.innerHTML = savedData;
        }
    }

    // Llamar a la función para mostrar las tareas al cargar la página
    showTask();

});