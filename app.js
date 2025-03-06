// Definir la clase Tarea
class Tarea {
    constructor(nombre) {
        this.nombre = nombre;
        this.completa = false;
    }

    // Método para cambiar el estado de la tarea (completa o incompleta)
    completar() {
        this.completa = !this.completa;
    }

    // Método para editar el nombre de la tarea
    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

// Definir la clase GestorDeTareas
class GestorDeTareas {
    constructor() {
        // Cargar tareas desde localStorage si existen
        this.tareas = this.cargarTareas();
    }

    // Método para cargar las tareas desde localStorage
    cargarTareas() {
        const tareasGuardadas = localStorage.getItem('tareas');
        if (tareasGuardadas) {
            const tareasParsed = JSON.parse(tareasGuardadas);
            // Convertir cada tarea almacenada en objeto Tarea
            return tareasParsed.map(tareaData => {
                const tarea = new Tarea(tareaData.nombre);
                tarea.completa = tareaData.completa;
                return tarea;
            });
        }
        return [];
    }

    // Método para guardar las tareas en localStorage
    guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    // Método para agregar una tarea
    agregarTarea(nombre) {
        const tarea = new Tarea(nombre);
        this.tareas.push(tarea);
        this.guardarTareas();
        this.render();
    }

    // Método para eliminar una tarea
    eliminarTarea(index) {
        this.tareas.splice(index, 1);
        this.guardarTareas();
        this.render();
    }

    // Método para editar una tarea
    editarTarea(index, nuevoNombre) {
        this.tareas[index].editar(nuevoNombre);
        this.guardarTareas();
        this.render();
    }

    // Método para cambiar el estado de una tarea (completar o incompletar)
    completarTarea(index) {
        this.tareas[index].completar();
        this.guardarTareas();
        this.render();
    }

    // Método para renderizar las tareas en el DOM
    render() {
        const listaTareas = document.getElementById('lista-tareas');
        listaTareas.innerHTML = ''; // Limpiar la lista antes de renderizar

        this.tareas.forEach((tarea, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="task-container">
                    <span class="task-name" style="text-decoration: ${tarea.completa ? 'line-through' : 'none'}">${tarea.nombre}</span>
                    <div class="button-container">
                        <button class="editar">Editar</button>
                        <button class="delete">Eliminar</button>
                        <button class="completar">${tarea.completa ? 'Marcar Incompleta' : 'Marcar Completa'}</button>
                    </div>
                </div>

            `;

            // Botón de eliminar
            li.querySelector('.delete').addEventListener('click', () => {
                this.eliminarTarea(index);
            });

            // Botón de editar
            li.querySelector('.editar').addEventListener('click', () => {
                const nuevoNombre = prompt("Edita tu tarea", tarea.nombre);
                if (nuevoNombre && nuevoNombre.trim() !== "") {
                    this.editarTarea(index, nuevoNombre);
                }
            });

            // Botón de completar
            li.querySelector('.completar').addEventListener('click', () => {
                this.completarTarea(index);
            });

            listaTareas.appendChild(li);
        });
    }
}

// Inicializar el gestor de tareas
const gestorDeTareas = new GestorDeTareas();

// Obtener los elementos del DOM
const agregarTareaBtn = document.getElementById('agregar-tarea');
const nuevaTareaInput = document.getElementById('nueva-tarea');

// Función para agregar una tarea
function agregarTarea() {
    const tareaTexto = nuevaTareaInput.value.trim();
    if (tareaTexto !== "") {
        gestorDeTareas.agregarTarea(tareaTexto);
        nuevaTareaInput.value = ''; // Limpiar el campo de entrada
    }
}

// Evento para agregar tarea al presionar el botón
agregarTareaBtn.addEventListener('click', agregarTarea);

// Evento para agregar tarea al presionar Enter
nuevaTareaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarTarea();
    }
});

// Renderizar las tareas al cargar la página
gestorDeTareas.render();
