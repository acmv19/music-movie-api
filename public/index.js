// index.js

let activeDiv = null;

export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;

export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null; // Variable to store user authentication token
// Function to set the authentication token
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
    showNavigation(); // Mostrar opciones de navegación después del inicio de sesión
  } else {
    localStorage.removeItem("token");
    showLoginRegister(); // Mostrar formulario de inicio de sesión si no hay token
  }
};

export let message = null; // Variable to store message element

import { showMusic, handleMusic } from "./music.js";
import { showMovie, handleMovie } from "./movie.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleAddEditM } from "./addEditMovie.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleMusic();
  handleMovie();
  handleRegister();
  handleAddEdit();
  handleAddEditM();
  setToken(token); // Llama a setToken para configurar la vista inicial basada en el token
  // <<<<----------Agregar manejadores de eventos para los botones de búsqueda
  document
    .getElementById("music-search")
    .addEventListener("keyup", SearchMusic); // keyup:detectar la acción de soltar una tecla y se utiliza comúnmente para realizar acciones inmediatas basadas en texto ingresado por user
  document
    .getElementById("movie-search")
    .addEventListener("keyup", searchMovie);
  //<<<<<<<----------------------------------
});
//<<<<<----------buscadores----------->>>>>>>
//MUSIC
function SearchMusic() {
  const table = document.getElementById("music-table");
  const searchTerm = document
    .getElementById("music-search")
    .value.toLowerCase();

  for (let i = 1; i < table.rows.length; i++) {
    // filas
    let row = table.rows[i];
    let found = false;
    const cells = row.getElementsByTagName("td");

    for (let j = 0; j < cells.length; j++) {
      //celdas
      const cellContent = cells[j].innerHTML.toLowerCase();
      if (cellContent.indexOf(searchTerm) > -1) {
        found = true;
        break;
      }
    }

    row.style.display = found ? "" : "none"; // mostrar
  }
}
//MOVIE
function searchMovie() {
  const table = document.getElementById("movie-table");
  const searchTerm = document
    .getElementById("movie-search")
    .value.toLowerCase();

  for (let i = 1; i < table.rows.length; i++) {
    // filas
    let row = table.rows[i];
    let found = false;
    const cells = row.getElementsByTagName("td");

    for (let j = 0; j < cells.length; j++) {
      //celdas
      const cellContent = cells[j].innerHTML.toLowerCase();
      if (cellContent.indexOf(searchTerm) > -1) {
        // probar conrenido = al que se busca
        found = true; // found coincidencia
        break; // No es necesario seguir buscando en esta fila
      }
    }

    row.style.display = found ? "" : "none"; // mostrar
  }
}

//<<<<<<<<<----------------
function showNavigation() {
  const navigationDiv = document.getElementById("navigation");
  navigationDiv.style.display = "block";

  const musicLink = document.getElementById("music-link");
  const movieLink = document.getElementById("movie-link");

  musicLink.addEventListener("click", () => {
    showMusicTable();
  });

  movieLink.addEventListener("click", () => {
    showMovieTable();
  });

  // Mostrar la tabla de música por defecto al inicio de sesión
  showMusicTable();
}

function showMusicTable() {
  const musicDiv = document.getElementById("music");
  const movieDiv = document.getElementById("movie");

  musicDiv.style.display = "block"; //mostrar
  movieDiv.style.display = "none"; //ocultar

  showMusic(); // Llamar a la función para mostrar la tabla de música
}

function showMovieTable() {
  const musicDiv = document.getElementById("music");
  const movieDiv = document.getElementById("movie");

  musicDiv.style.display = "none";
  movieDiv.style.display = "block";

  showMovie(); // Llamar a la función para mostrar la tabla de películas
}
