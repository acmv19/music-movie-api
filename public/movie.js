import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEditMovie } from "./addEditMovie.js";
import { showDeleteMovie } from "./deleteMovie.js"; //showDelete

let movieDiv = null;
let movieTable = null;
let movieTableHeader = null;

export const handleMovie = () => {
  movieDiv = document.getElementById("movie");
  const logoff = document.getElementById("logoff");
  const addMovie = document.getElementById("add-movie");
  movieTable = document.getElementById("movie-table");
  movieTableHeader = document.getElementById("movie-table-header");

  // Agrega el listener de eventos para manejar los clics en los botones
  movieDiv.addEventListener("click", (e) => {
    console.log("Botón clicleado:", e.target);
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addMovie) {
        showAddEditMovie(null);
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEditMovie(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        showDeleteMovie(e.target.dataset.id); // Llama a la función showDelete con el id de la movie
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        movieTable.replaceChildren([movieTableHeader]);

        showLoginRegister();
      }
    }
  });
};

export const showMovie = async () => {
  try {
    enableInput(false); // Deshabilitar la entrada de usuario durante la carga
    console.log("tokennnnnnnnnnnnnnn", token);
    const response = await fetch("/api/v1/movie", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("DATAAAA", data);
    let children = [movieTableHeader];

    if (response.status === 200) {
      console.log("entro a estatus 200");
      if (data.count === 0) {
        console.log(" no tiene nada");
        movieTable.replaceChildren(...children); // Limpia la tabla si no hay datos// clear this for safety
        // Manejar el caso en el que data.movie no está definido o no es un array
        message.textContent = "No  data found.";
      } else {
        for (let i = 0; i < data.movies.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton"  data-id=${data.musics[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.musics[i]._id}>delete</button></td>`;
          let rowHTML = `
                <td>${data.movies[i].singer}</td>
                <td>${data.movies[i].song}</td>
                <td>${data.movies[i].Genre}</td>
                <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        console.log("---AQUIIII----", children);
        movieTable.replaceChildren(...children); // Actualiza la tabla con los datos nuevos
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(movieDiv);
};

handleMovie();
