import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showMovie } from "./movie.js";

let addEditDiv = null;
let director = null;
let title = null;
let genre = null;
let addingMovie = null;

export const handleAddEditM = () => {
  addEditDiv = document.getElementById("edit-movie");
  director = document.getElementById("director");
  title = document.getElementById("title");
  genre = document.getElementById("genre");
  addingMovie = document.getElementById("adding-movie");
  const editCancel = document.getElementById("edit-cancel1");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingMovie) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/movie";

        if (addingMovie.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/movie/${addEditDiv.dataset.id}`;
        }
        console.log("URL de la solicitud", url);
        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              director: director.value,
              title: title.value,
              genre: genre.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The movie eentry was updated.";
            } else {
              //if (response.status === 201) {
              // 201 indicates a successful create
              message.textContent = "The movie entry was created.";
            }
            director.value = "";
            title.value = "";
            genre.value = "drama";

            showMovie();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showMovie();
      }
    }
  });
};

export const showAddEditMovie = async (movieId) => {
  if (!movieId) {
    director.value = "";
    title.value = "";
    genre.value = "drama";
    addingMovie.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/movie/${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        director.value = data.movie.director;
        title.value = data.movie.title;
        genre.value = data.movie.genre;
        addingMovie.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = movieId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The movie entry was not found";
        showMovie();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showMovie();
    }

    enableInput(true);
  }
};
