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

export let token = null;

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

export let message = null;

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
});

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

  musicDiv.style.display = "block";
  movieDiv.style.display = "none";

  showMusic(); // Llamar a la función para mostrar la tabla de música
}

function showMovieTable() {
  const musicDiv = document.getElementById("music");
  const movieDiv = document.getElementById("movie");

  musicDiv.style.display = "none";
  movieDiv.style.display = "block";

  showMovie(); // Llamar a la función para mostrar la tabla de películas
}
