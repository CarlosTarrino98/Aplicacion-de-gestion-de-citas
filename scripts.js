// Esta sección de código se ejecuta cuando se carga completamente el documento HTML.
document.addEventListener('DOMContentLoaded', (event) => {
    establecerFechaMinima(); //Establece condiciones en las fechas y el horario
    cargarCitas(); // Carga y muestra las citas existentes.

    // Agrega un evento al enviar el formulario.
    const form = document.getElementById('formCita');
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita el comportamiento por defecto de envío del formulario.
        if (validarFormulario()) { // Verifica si el formulario es válido.
            guardarCita(); // Guarda la cita si el formulario es válido.
        }
    });
});

//Establece condiciones en las fechas y el horario
function establecerFechaMinima() {
    var today = new Date(); // Obtiene la fecha y hora actual.
    var dd = String(today.getDate()).padStart(2, '0'); // Obtiene el día actual y lo formatea con dos dígitos.
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // Obtiene el mes actual (0-11) y lo ajusta a formato (1-12) con dos dígitos.
    var yyyy = today.getFullYear(); // Obtiene el año actual.

    var fechaActual = yyyy + '-' + mm + '-' + dd;

    document.getElementById('fecha').setAttribute('min', fechaActual); // Establece la fecha mínima para la fecha 
    document.getElementById('fechaNacimiento').setAttribute('max', fechaActual); // Establece la fecha máxima para la fecha de nacimiento
    
    // Restringe el rango de horas seleccionables
    document.getElementById('hora').setAttribute('min', '08:00');
    document.getElementById('hora').setAttribute('max', '20:00');
}

// Función para cargar y mostrar todas las citas guardadas.
function cargarCitas() {
    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    let cuerpoTabla = document.querySelector('#tablaCitas tbody');
    cuerpoTabla.innerHTML = '';

    if (citas.length === 0) {
        // Si no hay citas, muestra una fila con el mensaje "Dato vacío"
        let fila = cuerpoTabla.insertRow();
        let celda = fila.insertCell();
        celda.colSpan = 10; //Asume un total de 10 columnas
        celda.textContent = "Dato vacío";
        celda.className = 'dato-vacio'; // Se agrega una clase para poder identificar esta fila
    } else {
        // Si hay citas, muestra cada una en la tabla
        citas.forEach((cita, index) => {
            let fila = cuerpoTabla.insertRow();

            // Añade la celda para el número de orden
            fila.insertCell().textContent = index + 1;

            // Añade las celdas para los demás datos de la cita
            fila.insertCell().textContent = cita.fecha;
            fila.insertCell().textContent = cita.hora;
            fila.insertCell().textContent = cita.nombre;
            fila.insertCell().textContent = cita.apellidos;
            fila.insertCell().textContent = cita.dni;
            fila.insertCell().textContent = cita.telefono;
            fila.insertCell().textContent = cita.fechaNacimiento;
            fila.insertCell().textContent = cita.observaciones;

            // Añade las celdas para las acciones (editar/eliminar)
            let tdAcciones = fila.insertCell();

            //Botón editar
            let btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'editar';
            btnEditar.onclick = function () { editarCita(cita.id); };
            tdAcciones.appendChild(btnEditar);
            
            //Botón eliminar
            let btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'eliminar';
            btnEliminar.onclick = function () { eliminarCita(cita.id); };
            tdAcciones.appendChild(btnEliminar);
        });
    }
}


// Esta función valida los campos del formulario antes de guardar una cita.
function validarFormulario() {
    let valido = true;

    // Aquí se realizan múltiples validaciones para cada campo:
    // Validación para el nombre
    const nombre = document.getElementById('nombre').value;
    if (nombre.trim() === '') {
        mostrarError('nombre', 'El nombre es obligatorio');
        valido = false;
    } else {
        limpiarError('nombre');
    }

    // Validación para el DNI
    const dni = document.getElementById('dni').value;
    const regexDNI = /^[0-9]{8}[A-Z]$/;
    if (!regexDNI.test(dni)) {
        mostrarError('dni', 'El DNI no es válido (debe tener 8 números seguidos de una letra mayúscula)');
        valido = false;
    } else {
        limpiarError('dni');
    }

    // Validación para los apellidos
    const apellidos = document.getElementById('apellidos').value;
    if (apellidos.trim() === '') {
        mostrarError('apellidos', 'Los apellidos son obligatorios');
        valido = false;
    } else {
        limpiarError('apellidos');
    }

    // Validación para el teléfono
    const telefono = document.getElementById('telefono').value;
    const regexTelefono = /^[0-9]{9}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarError('telefono', 'El teléfono no es válido (debe tener 9 dígitos)');
        valido = false;
    } else {
        limpiarError('telefono');
    }

    // Validación para la fecha: asegurándose de que no sea en el pasado
    const fechaCita = document.getElementById('fecha').value;
    const fechaActual = new Date();
    // Establecer tiempo a 00:00:00 para comparar solo la fecha
    fechaActual.setHours(0, 0, 0, 0);
    // Convertir la fecha del input a un objeto Date para comparación
    const fechaSeleccionada = new Date(fechaCita);

    if (!fechaCita) {
        mostrarError('fecha', 'La fecha es obligatoria');
        valido = false;
    } else if (fechaSeleccionada < fechaActual) {
        mostrarError('fecha', 'La fecha de la cita no puede ser en el pasado');
        valido = false;
    } else {
        limpiarError('fecha');
    }

    // Validación para la hora
    const hora = document.getElementById('hora').value;
    if (!hora) {
        mostrarError('hora', 'La hora es obligatoria');
        valido = false;
    } else {
        limpiarError('hora');
    }

    // Validación para la fecha de nacimiento
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    if (!fechaNacimiento) {
        mostrarError('fechaNacimiento', 'La fecha de nacimiento es obligatoria');
        valido = false;
    } else {
        limpiarError('fechaNacimiento');
    }

    return valido;
}

// Función para mostrar un mensaje de error cerca de un campo del formulario.
function mostrarError(campo, mensaje) {
    const elemento = document.getElementById(campo);
    const divError = document.createElement('div');
    divError.textContent = mensaje;
    divError.className = 'error';
    if (!elemento.nextSibling) {
        elemento.parentNode.insertBefore(divError, elemento.nextSibling);
    }
}

// Función para eliminar un mensaje de error existente.
function limpiarError(campo) {
    const elemento = document.getElementById(campo);
    if (elemento.nextSibling && elemento.nextSibling.className === 'error') {
        elemento.parentNode.removeChild(elemento.nextSibling);
    }
}

// función que limpie el formulario al enviar la cita
function limpiarFormulario() {
    document.getElementById('idCita').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('fechaNacimiento').value = '';
    document.getElementById('observaciones').value = '';
}

// Función para guardar una cita en el almacenamiento local del navegador.
function guardarCita() {   
    const idCita = document.getElementById('idCita').value;
    const cita = {
        id: idCita || new Date().getTime(),
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        dni: document.getElementById('dni').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        observaciones: document.getElementById('observaciones').value
    };

    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    const indice = idCita ? citas.findIndex(c => c.id === idCita) : -1;

    if (indice > -1) {
        citas[indice] = cita; // Actualiza la cita existente
        alert("Cita modificada correctamente"); // Mensaje de confirmación
    } else {
        citas.push(cita); // Agrega una nueva cita
        alert("Cita guardada correctamente"); // Mensaje de confirmación
    }
    
    localStorage.setItem('citas', JSON.stringify(citas));
    cargarCitas();
    limpiarFormulario(); // Limpia el formulario después de guardar la cita

    // Restablecer la visibilidad de los botones
    document.getElementById('btnGuardar').style.display = 'block';
    document.getElementById('btnModificar').style.display = 'none';
    btnGuardar.style.display = 'block';
    btnGuardar.style.margin = 'auto';
}

// Función para cargar los datos de una cita en el formulario para su edición.
function editarCita(idCita) {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const citaAEditar = citas.find(cita => cita.id === idCita);

    if (citaAEditar) {
        document.getElementById('fecha').value = citaAEditar.fecha;
        document.getElementById('hora').value = citaAEditar.hora;
        document.getElementById('nombre').value = citaAEditar.nombre;
        document.getElementById('apellidos').value = citaAEditar.apellidos;
        document.getElementById('dni').value = citaAEditar.dni;
        document.getElementById('telefono').value = citaAEditar.telefono;
        document.getElementById('fechaNacimiento').value = citaAEditar.fechaNacimiento;
        document.getElementById('observaciones').value = citaAEditar.observaciones;

        // Guardar el ID de la cita en un campo oculto
        document.getElementById('idCita').value = idCita;

        // Ocultar el botón de Guardar y mostrar el de Modificar
        document.getElementById('btnGuardar').style.display = 'none';
        document.getElementById('btnModificar').style.display = 'block';
        btnModificar.style.display = 'block';
        btnModificar.style.margin = 'auto';
    }
}


// Función para eliminar una cita del almacenamiento local.
function eliminarCita(idCita) {
    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas = citas.filter(cita => cita.id !== idCita);
    localStorage.setItem('citas', JSON.stringify(citas));
    cargarCitas();
    alert("Cita eliminada correctamente"); // Mensaje de confirmación
}
