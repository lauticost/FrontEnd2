const LONGITUD_CONTRASENIA = 8;

/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {}

function normalizarTexto(texto) {
  return texto.trim().toLowerCase();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail({ email }) {
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return "El formato del email es incorrecto";
  }
}

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia({ password }) {
  if (password.length < LONGITUD_CONTRASENIA) {
    return "Su contraseña es menor a 8 caracteres";
  }
}

function compararContrasenias({ password, passwordConfirm }) {
  if (password !== passwordConfirm) {
    return "Las contraseñas no coinciden";
  }
}

function cargarToken() {
  return localStorage.getItem("jwt");
}

function guardarToken(jwt) {
  localStorage.setItem("jwt", jwt);
}

function validarLogin({ email, password }) {
  if ([email, password].includes("")) {
    return "Todos los campos son obligatorios";
  } else if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return "El formato del email es incorrecto";
  }

  return "";
}

function permitirRegistro(array) {
  let cant = 0;
  array.forEach((element) => {
    if (element !== undefined) {
      cant++;
    }
  });
  return cant === 0 ? true : false;
}

// function validarToken() {
//   const jwt = cargarToken();

//   if(jwt){
//       console.log(location.href);
//   } /*else {
//       location.replace('/index.html');
//   } */
// }