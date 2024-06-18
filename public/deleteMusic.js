import { enableInput, message, token } from "./index.js";
import { showMusic } from "./music.js";

export const showDelete = async (musicId) => {
  enableInput(false);
  try {
    const response = await fetch(`/api/v1/music/${musicId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      message.textContent = "music was deleted";
      showMusic();
    } else {
      message.textContent = "music  not found";
      showMusic();
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred.";
    showMusic();
  }
  enableInput(true);
};
