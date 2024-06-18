import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js"; //showDelete
import { showDelete } from "./deleteMusic.js";

let musicDiv = null;
let musicTable = null;
let musicTableHeader = null;

export const handleMusic = () => {
  musicDiv = document.getElementById("music");
  const logoff = document.getElementById("logoff");
  const addMusic = document.getElementById("add-music");
  musicTable = document.getElementById("music-table");
  musicTableHeader = document.getElementById("music-table-header");

  // Agrega el listener de eventos para manejar los clics en los botones
  musicDiv.addEventListener("click", (e) => {
    console.log("Botón clicleado:", e.target);
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addMusic) {
        showAddEdit(null);
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        showDelete(e.target.dataset.id); // Llama a la función showDelete con el id de la música
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        musicTable.replaceChildren([musicTableHeader]);

        showLoginRegister();
      }
    }
  });
};

export const showMusic = async () => {
  try {
    enableInput(false);
    console.log("tokennnnnnnnnnnnnnn", token);
    const response = await fetch("/api/v1/music", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("DATAAAA", data);
    let children = [musicTableHeader];

    if (response.status === 200) {
      console.log("entro a estatus 200");
      if (data.count === 0) {
        console.log(" no tiene nada");
        musicTable.replaceChildren(...children); // Limpia la tabla si no hay datos// clear this for safety
        // Manejar el caso en el que data.music no está definido o no es un array
        message.textContent = "No data found.";
      } else {
        for (let i = 0; i < data.musics.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton"  data-id=${data.musics[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.musics[i]._id}>delete</button></td>`;
          let rowHTML = `
              <td>${data.musics[i].singer}</td>
              <td>${data.musics[i].song}</td>
              <td>${data.musics[i].Genre}</td>
              <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        console.log("---AQUIIII----", children);
        musicTable.replaceChildren(...children); // Actualiza la tabla con los datos nuevos
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(musicDiv);
};

handleMusic();
