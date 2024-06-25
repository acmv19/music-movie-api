//,<<------------->>
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.querySelector("footer"); //Select element del pie pg used querySelector
const copyright = document.createElement("p"); // create  element parrafo
copyright.innerHTML = "&copy anamaria maldonado " + `${thisYear}`; // show up text
footer.appendChild(copyright);
//<--------------->>
