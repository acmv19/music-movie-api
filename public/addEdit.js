import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showMusic } from "./music.js";

let addEditDiv = null;
let singer = null;
let song = null;
let genre = null;
let addingMusic = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-music");
  singer = document.getElementById("singer");
  song = document.getElementById("song");
  genre = document.getElementById("genre");
  addingMusic = document.getElementById("adding-music");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingMusic) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/music";

        if (addingMusic.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/music/${addEditDiv.dataset.id}`;
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
              singer: singer.value,
              song: song.value,
              genre: genre.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The music entry was updated.";
            } else {
              //if (response.status === 201) {
              // 201 indicates a successful create
              message.textContent = "The music entry was created.";
            }
            singer.value = "";
            song.value = "";
            genre.value = "pop";

            showMusic();
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
        showMusic();
      }
    }
  });
};

export const showAddEdit = async (musicId) => {
  if (!musicId) {
    singer.value = "";
    song.value = "";
    genre.value = "pop";
    addingMusic.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/music/${musicId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        singer.value = data.music.singer;
        song.value = data.music.song;
        genre.value = data.music.genre;
        addingMusic.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = musicId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The music entry was not found";
        showMusic();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showMusic();
    }

    enableInput(true);
  }
};
