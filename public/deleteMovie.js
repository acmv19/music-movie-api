import { enableInput, message, token } from "./index.js";
import { showMovie } from "./movie.js";

export const showDeleteMovie = async (movieId) => {
  enableInput(false);
  try {
    const response = await fetch(`/api/v1/movie/${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      message.textContent = "movie was deleted";
      showMovie();
    } else {
      message.textContent = "movie  not found";
      showMovie();
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred.";
    showMovie();
  }
  enableInput(true);
};
