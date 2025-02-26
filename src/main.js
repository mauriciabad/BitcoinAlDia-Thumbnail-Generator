import html2canvas from "html2canvas";
import "normalize.css";
import "./styles/main.scss";
import "./styles/thumbnail-frame.scss";

const currentUrl = window.location.hostname;
if (
  currentUrl !== "miniatura-bitcoinaldia.mauri.app" &&
  currentUrl !== "localhost"
) {
  const message = document.createElement("div");
  message.style.position = "fixed";
  message.style.top = "0";
  message.style.left = "0";
  message.style.width = "100%";
  message.style.height = "100%";
  message.style.backgroundColor = "black";
  message.style.color = "white";
  message.style.display = "flex";
  message.style.flexDirection = "column";
  message.style.justifyContent = "center";
  message.style.alignItems = "center";
  message.style.gap = "2rem";
  message.style.zIndex = "1000";
  message.style.fontSize = "2rem";
  message.style.whiteSpace = "pre-wrap";
  message.style.textAlign = "center";
  message.style.lineHeight = "2";
  message.style.fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
  // message.innerText = 'The URL has changed.\nThe old one will stop working on Feb 28.';
  message.innerText =
    "La URL ha cambiado.\nLa antigua dejará de funcionar el 28 de febrero.\nPor favor, actualiza tu marcador a:";

  const url = document.createElement("a");
  url.href = "https://miniatura-bitcoinaldia.mauri.app";
  url.innerText = "https://miniatura-bitcoinaldia.mauri.app";
  url.style.color = "white";
  url.style.textDecoration = "underline";
  url.style.cursor = "pointer";
  url.style.color = "cyan";

  message.appendChild(url);

  document.body.appendChild(message);
}

const downloadElem = document.querySelector("#download");
const dateElem = document.querySelector("#date");
const imageElem = document.querySelector("#image");
const textElem = document.querySelector("#text");
const colorElem = document.querySelector("#color");
const withColorElem = document.querySelector("#icon-with-color");
const iconEnableElem = document.querySelector("#icon-enable");
const iconControlsElem = document.querySelector("#icon-controls");
const bgOffsetElem = document.querySelector("#bg-offset");
const textSizeElem = document.querySelector("#text-size");
const iconSunElem = document.querySelector("#icon-sun");
const iconMoonElem = document.querySelector("#icon-moon");
const thumbnailElem = document.querySelector(
  '.thumbnail[data-selected="true"]'
);

function download(filename, data) {
  const element = document.createElement("a");

  element.setAttribute("href", data);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

async function generateImage() {
  const canvas = await html2canvas(thumbnailElem, {
    allowTaint: true,
    useCORS: true,
    scale:
      1 /
      Math.max(
        Math.min(Math.floor(((window.innerWidth - 384) / 1280) * 10) / 10, 1),
        0.1
      ),
  });

  return canvas
    .toDataURL("image/png")
    .replace(/^data:image\/png/, "data:application/octet-stream");
}

function fillControls() {
  const now = new Date();
  const todayDate = new Date();
  todayDate.setHours(todayDate.getHours() - 5);

  dateElem.value = todayDate.toISOString().substr(0, 10);
  dateElem.dispatchEvent(new Event("input"));

  if (now.getHours() < 19) {
    iconSunElem.checked = true;
    thumbnailElem.querySelector(".icon").dataset.icon = "sun";
  } else {
    iconMoonElem.checked = true;
    thumbnailElem.querySelector(".icon").dataset.icon = "moon";
  }

  textSizeElem.value = 100;
  bgOffsetElem.value = 50;
}

function readFileURL(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
}

function contrast(value) {
  const hexCode = value.charAt(0) === "#" ? value.substr(1, 6) : value;

  const red = parseInt(hexCode.substr(0, 2), 16);
  const green = parseInt(hexCode.substr(2, 2), 16);
  const blue = parseInt(hexCode.substr(4, 2), 16);
  // Gets the average value of the colors
  return red * 0.299 + green * 0.587 + blue * 0.114 > 186;
}

downloadElem.addEventListener("click", async (event) => {
  event.preventDefault();
  const imgData = await generateImage();
  const dateString = dateElem.value.replace(
    /\d{2}(\d{2})-(\d{2})-(\d{2})/,
    "$1-$2-$3"
  );
  const iconString = document.querySelector('input[name="icon"]:checked')
    .dataset.icon;
  download(`miniatura-${dateString}-${iconString}.png`, imgData);
});

imageElem.addEventListener("change", async (event) => {
  const url = await readFileURL(event.target.files[0]);
  thumbnailElem.style.backgroundImage = `url(${url})`;
});

dateElem.addEventListener("input", (event) => {
  if (event.target.value) {
    const dateString = event.target.value.replace(
      /\d{2}(\d{2})-(\d{2})-(\d{2})/,
      "$3/$2/$1"
    );
    const dateStringHTML = dateString.replace(
      /([0/])(?=\d)/g,
      '<span class="translucent">$1</span>'
    );
    thumbnailElem.querySelector(".date").innerHTML = dateStringHTML;
  }
});

bgOffsetElem.addEventListener("input", (event) => {
  const offset = event.target.value;
  thumbnailElem.style.setProperty("--bg-position-y", `${100 - offset}%`);
});

textSizeElem.addEventListener("input", (event) => {
  const size = event.target.value;
  thumbnailElem.style.setProperty("--text-size", `${size}px`);
});

colorElem.addEventListener("input", (event) => {
  const color = event.target.value;
  const isALightColor = contrast(color);

  thumbnailElem.style.setProperty("--color-bg", color);
  thumbnailElem.style.setProperty(
    "--color-text",
    isALightColor ? "#000" : "#fff"
  );
});

textElem.addEventListener("input", (event) => {
  thumbnailElem.querySelector(".text").innerHTML =
    event.target.value.replaceAll("\n", "<br>");
});

withColorElem.addEventListener("change", (event) => {
  thumbnailElem
    .querySelector(".icon")
    .classList.toggle("monochrome", !event.target.checked);
});

iconEnableElem.addEventListener("change", (event) => {
  const isEnabled = event.target.checked;
  console.log(isEnabled);

  iconControlsElem
    .querySelectorAll("input:not(#icon-enable)")
    .forEach((input) => {
      // eslint-disable-next-line no-param-reassign
      input.disabled = !isEnabled;
    });

  thumbnailElem.querySelector(".icon").classList.toggle("hidden", !isEnabled);
});

document.querySelectorAll('input[name="icon"]').forEach((input) => {
  input.addEventListener("change", (event) => {
    const selectedIcon = event.target.dataset.icon;
    thumbnailElem.querySelector(".icon").dataset.icon = selectedIcon;
  });
});

fillControls();
