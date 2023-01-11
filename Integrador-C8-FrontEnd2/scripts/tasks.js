// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const jwt = cargarToken();

if(!jwt) {
  location.replace('/');
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.querySelector('#closeApp');
  const formCrearTarea = document.querySelector('.nueva-tarea');
  const inputTarea = document.querySelector('#nuevaTarea');
  const contenedorPendientes = document.querySelector('.tareas-pendientes')
  const contenedorFinalizadas = document.querySelector('.tareas-terminadas')
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    
    const confirma = confirm('Seguro que quiere cerrar sesion?');
    if(confirma) {
      localStorage.removeItem('jwt');
      location.replace('/');
    }
    
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const parrafo = document.getElementById('nombre_usuario');
    
    const URL = 'https://ctd-todo-api.herokuapp.com/v1/users/getMe'
    const config = {
      method: 'GET',
      headers: {
        authorization: jwt,
      }
    }

    fetch(URL, config).then( res => {return res.json()})
    .then( data => {
      const { firstName, lastName } = data;
      parrafo.textContent = firstName + ' ' +lastName;
    })


  };

  obtenerNombreUsuario();


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
    const URL = 'https://ctd-todo-api.herokuapp.com/v1/tasks'
    const config = {
      method: 'GET',
      headers: {
        authorization: jwt,
      }
    }

    fetch(URL, config).then( res => {return res.json()})
    .then( data => {
      console.log(data);
      renderizarTareas(data);
    })
  };

  consultarTareas()


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();
    const nuevaTarea = inputTarea.value;
    inputTarea.value = '';
    const data = {
      description: nuevaTarea,
      completed: false,
    }
    const URL = 'https://ctd-todo-api.herokuapp.com/v1/tasks';
    const config = {
      method: 'POST',
      headers: {
        authorization: jwt,
        'Content-Type' : "application/json; charset=UTF-8",
      }, 
      body: JSON.stringify(data),
    }

    fetch(URL, config).then( res => { return res.json()})
    .then(data => {
      renderizarTarea(data);
    })
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */

  function renderizarCantidadCompletadas() {
    const listaTerminadas = document.querySelector('.tareas-terminadas');
    const cantFinalizadas = document.getElementById('cantidad-finalizadas');
    console.log(cantFinalizadas);
    cantFinalizadas.textContent = listaTerminadas.childElementCount;
  }

  function renderizarTarea(tarea) {
    const li = document.createElement('li');
    li.classList.add('tarea');
    if(tarea.completed) {
      //tarea completada
      li.innerHTML = `
      <div class="hecha">

        <i class="fa-regular fa-circle-check"></i>

        </div>

        <div class="descripcion">

          <p class="nombre">${tarea.description}</p>

          <div class="cambios-estados">

          <button class="change completa" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>

          <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>

        </div>

      </div>
      `
      contenedorFinalizadas.appendChild(li);
      const botonEliminar = li.querySelector('.borrar');
      botonBorrarTarea(botonEliminar, tarea)
    } else {
      //tarea pendiente
      const fecha = new Date(tarea.createdAt);
      li.innerHTML = `
      <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>

      <div class="descripcion">

        <p class="nombre">${tarea.description}</p>

        <p class="timestamp">${fecha.toLocaleDateString()}</p>

      </div>
      `

      contenedorPendientes.appendChild(li)
    }
    const boton = li.querySelector('.change');
    botonCambioEstado(boton, tarea);
    renderizarCantidadCompletadas();
  }

  function renderizarTareas(listado) {

    listado.forEach( tarea => {
      renderizarTarea(tarea);
    })
    
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
 

  function cambiarEstado(nodo, tarea) {
    const URL = `https://ctd-todo-api.herokuapp.com/v1/tasks/${nodo.id}`
    const data = {
        completed: !tarea.completed,
        description: tarea.description,
    }
    const config = {
      method: 'PUT',
      headers: {
        authorization: jwt,
        'Content-Type': "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    }
    fetch(URL,config).then( res => {return res.json()}).then(data => {
      const { id } = data;
      const nodo = document.getElementById(id).closest('li');
      nodo.remove();
      renderizarTarea(data)
    })
   
  }

  function botonCambioEstado(boton, tarea) {
    
    boton.addEventListener('click', () => cambiarEstado(boton, tarea))

  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function eliminarTarea(boton, tarea) {
    /* 
    Peticion delete, donde eliminamos la tarea de la API
    Eliminamos el nodo
    */
    const nodo = boton.closest('li');
    
    const { id } = tarea;

    const URL =  `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`
    const config = {
      method: 'DELETE',
      headers: {
        authorization: jwt,
        'Content-Type': "application/json; charset=UTF-8",
      }
    }

    fetch(URL, config).then( res => {
      if(res.status === 200) {
        nodo.remove();
        renderizarCantidadCompletadas();
      }
      return res.json()})
    .then( data => {
      console.log(data);
    })
  }

  function botonBorrarTarea(boton, tarea) {
   
    boton.addEventListener('click', () => eliminarTarea(boton, tarea))

  };

});