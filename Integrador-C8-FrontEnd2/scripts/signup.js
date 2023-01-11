const jwt = cargarToken();

if(jwt){
    location.replace('/mis-tareas.html');
}

window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.querySelector("form");
  const inputNombre = document.getElementById("inputNombre");
  const inputApellido = document.getElementById("inputApellido");
  const inputEmail = document.getElementById("inputEmail");
  const inputPassword = document.getElementById("inputPassword");
  const inputPasswordRepetida = document.getElementById(
    "inputPasswordRepetida"
  );
  const containerError = document.querySelector(".containerError");
  let mensajeArray = [];

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    containerError.innerHTML = ``;

    const datosRegistro = {
      firstName: normalizarTexto(inputNombre.value),
      lastName: normalizarTexto(inputApellido.value),
      email: normalizarEmail(inputEmail.value),
      password: inputPassword.value,
      passwordConfirm: inputPasswordRepetida.value,
    };

    mensajeArray.push(
      validarEmail(datosRegistro),
      compararContrasenias(datosRegistro),
      validarContrasenia(datosRegistro)
    );

    if (permitirRegistro(mensajeArray)) {
      realizarRegister(datosRegistro);
    } else {
      mensajeArray.forEach((element) => {
        if (element !== undefined) {
          containerError.innerHTML += `<li class="rafa2">${element}</li>`;
        }
      });
    }
    mensajeArray = [];
  });

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */

  function realizarRegister(datosRegistro) {
    const URL = "https://ctd-todo-api.herokuapp.com/v1/users";
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(datosRegistro),
    };

    fetch(URL, config)
      .then(function (res) {
        return res.json();
      })
      .then((data) => {
        const { jwt } = data;
        guardarToken(jwt)
        if (jwt) {
          location.replace("/mis-tareas.html");
        } else {
          containerError.innerHTML += `<li class="rafa2">${data}</li>`;
        }
      })
      .catch(function (e) {
        alert("Error! intente mas tarde");
      });
  }
});
