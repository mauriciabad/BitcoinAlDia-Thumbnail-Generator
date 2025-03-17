import html2canvas from "html2canvas";
import "normalize.css";
import "./styles/main.scss";
import "./styles/thumbnail-frame.scss";

// Prevent transitions on page load
document.body.classList.add("preload");
window.addEventListener("load", () => {
  // Remove the class after a slight delay to make sure everything is ready
  setTimeout(() => {
    document.body.classList.remove("preload");
  }, 100);
});

const DEFAULT_BACKGROUND_IMAGE = "/src/images/defaultBackground.jpg";
const IMAGE_AREA_BORDER = 30;
const IMAGE_AREA_HEIGHT = 720 - IMAGE_AREA_BORDER * 2;
const IMAGE_AREA_WIDTH = 1280 - IMAGE_AREA_BORDER * 2;
const IMAGE_AREA_ASPECT_RATIO = IMAGE_AREA_WIDTH / IMAGE_AREA_HEIGHT;

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
const bgOffsetBasicYElem = document.querySelector("#bg-offset-basic-y");
const bgOffsetBasicXElem = document.querySelector("#bg-offset-basic-x");
const bgModeBasicElem = document.querySelector("#bg-mode-basic");
const bgModeAdvancedElem = document.querySelector("#bg-mode-advanced");
const bgOffsetYElem = document.querySelector("#bg-offset-y");
const bgOffsetXElem = document.querySelector("#bg-offset-x");
const bgZoomElem = document.querySelector("#bg-zoom");
const textSizeElem = document.querySelector("#text-size");
const iconSunElem = document.querySelector("#icon-sun");
const iconMoonElem = document.querySelector("#icon-moon");
const headerPositionTopElem = document.querySelector("#header-position-top");
const headerPositionBottomElem = document.querySelector(
  "#header-position-bottom"
);
const textPositionTopElem = document.querySelector("#text-position-top");
const textPositionBottomElem = document.querySelector("#text-position-bottom");
const textPositionCenterElem = document.querySelector("#text-position-center");
const thumbnailElem = document.querySelector(
  '.thumbnail[data-selected="true"]'
);
const bgOffsetBasicGroupElem = document.querySelector("#bg-offset-basic-group");
const bgOffsetAdvancedGroupElem = document.querySelector(
  "#bg-offset-advanced-group"
);
const colorAdvancedElem = document.querySelector("#color-advanced");

let backgroundImageSize = { width: 1000, height: 600 };
function getBackgroundImageSizeFromURL(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}
getBackgroundImageSizeFromURL(DEFAULT_BACKGROUND_IMAGE)
  .then((size) => {
    const aspectRatio = size.width / size.height;
    backgroundImageSize =
      aspectRatio > IMAGE_AREA_ASPECT_RATIO
        ? {
            width: IMAGE_AREA_HEIGHT * aspectRatio,
            height: IMAGE_AREA_HEIGHT,
          }
        : {
            width: IMAGE_AREA_WIDTH,
            height: IMAGE_AREA_WIDTH / aspectRatio,
          };
  })
  .catch((error) => {
    console.error("Error getting background image size", error);
  });

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
    thumbnailElem.querySelector(".thumbnail__icon").dataset.icon = "sun";
  } else {
    iconMoonElem.checked = true;
    thumbnailElem.querySelector(".thumbnail__icon").dataset.icon = "moon";
  }

  // Set initial values for controls
  textSizeElem.value = 100;

  // Basic mode controls - centered position
  bgOffsetBasicYElem.value = 50;
  bgOffsetBasicXElem.value = 50;

  // Advanced mode controls - centered position with default zoom
  bgOffsetYElem.value = 0.5;
  bgOffsetXElem.value = 0.5;
  bgZoomElem.value = 1;

  // Set the color for advanced mode
  colorAdvancedElem.value = colorElem.value;

  // Start in basic mode
  bgModeBasicElem.checked = true;
  bgOffsetBasicGroupElem.style.display = "contents";
  bgOffsetAdvancedGroupElem.style.display = "none";

  // Apply the initial settings
  updateBgOffset();

  // Setup default positions
  headerPositionTopElem.checked = true;
  textPositionBottomElem.checked = true;
  thumbnailElem.setAttribute("data-header-position", "top");
  thumbnailElem.setAttribute("data-text-position", "bottom");
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
  const file = event.target.files[0];
  const url = file ? await readFileURL(file) : DEFAULT_BACKGROUND_IMAGE;
  thumbnailElem.style.backgroundImage = `url(${url})`;

  try {
    backgroundImageSize = await getBackgroundImageSizeFromURL(url);
  } catch (error) {
    console.error("Error getting background image size", error);
    // Use default size if there's an error
    backgroundImageSize = { width: 1000, height: 600 };
  }

  // Reset to center position in the current mode
  if (bgModeAdvancedElem.checked) {
    bgOffsetYElem.value = 0.5;
    bgOffsetXElem.value = 0.5;
    bgZoomElem.value = 1;
  } else {
    bgOffsetBasicYElem.value = 50;
    bgOffsetBasicXElem.value = 50;
  }

  updateBgOffset();
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
    thumbnailElem.querySelector(".thumbnail__date").innerHTML = dateStringHTML;
  }
});

const updateBgOffset = () => {
  if (bgModeAdvancedElem.checked) {
    const offsetY = Number(bgOffsetYElem.value);
    const offsetX = 1 - Number(bgOffsetXElem.value);
    const zoom = Number(bgZoomElem.value);

    // For allowing the image to move outside the container,
    // we need to calculate position values that can move beyond the container edges
    // offsetX/Y = 0 means left/top edge of image is at right/bottom of container (fully outside, showing empty area)
    // offsetX/Y = 0.5 means image is centered
    // offsetX/Y = 1 means right/bottom edge of image is at left/top of container (fully outside other direction)

    // Calculate position in pixels rather than percentages
    // This provides more precise control and allows negative values (image outside container)
    const imageWidth = backgroundImageSize.width * zoom;
    const imageHeight = backgroundImageSize.height * zoom;

    // Calculate the range of possible positions
    // When offsetX/Y = 0, the image should be positioned with its left/top edge at the right/bottom of container
    // When offsetX/Y = 1, the image should be positioned with its right/bottom edge at the left/top of container

    // For X-axis: When offsetX = 0, posX should be IMAGE_AREA_WIDTH, when offsetX = 1, posX should be -imageWidth
    const posX = Math.round(
      IMAGE_AREA_WIDTH - offsetX * (IMAGE_AREA_WIDTH + imageWidth)
    );

    // For Y-axis: When offsetY = 0, posY should be IMAGE_AREA_HEIGHT, when offsetY = 1, posY should be -imageHeight
    const posY = Math.round(
      IMAGE_AREA_HEIGHT - offsetY * (IMAGE_AREA_HEIGHT + imageHeight)
    );

    thumbnailElem.style.setProperty("--bg-position-x", `${posX}px`);
    thumbnailElem.style.setProperty("--bg-position-y", `${posY}px`);
    thumbnailElem.style.setProperty("--bg-zoom", zoom);
    thumbnailElem.setAttribute("data-bg-mode", "advanced");

    bgOffsetBasicGroupElem.style.display = "none";
    bgOffsetAdvancedGroupElem.style.display = "contents";
  } else {
    const offsetY = Number(bgOffsetBasicYElem.value);
    const offsetX = Number(bgOffsetBasicXElem.value);
    thumbnailElem.style.setProperty("--bg-position-y", `${offsetY}%`);
    thumbnailElem.style.setProperty("--bg-position-x", `${offsetX}%`);
    thumbnailElem.style.setProperty("--bg-zoom", 1);
    thumbnailElem.removeAttribute("data-bg-mode");

    bgOffsetBasicGroupElem.style.display = "contents";
    bgOffsetAdvancedGroupElem.style.display = "none";
  }
};

// Update event listeners
bgOffsetBasicYElem.addEventListener("input", updateBgOffset);
bgOffsetBasicXElem.addEventListener("input", updateBgOffset);
bgModeBasicElem.addEventListener("change", updateBgOffset);
bgModeAdvancedElem.addEventListener("change", updateBgOffset);
bgOffsetYElem.addEventListener("input", updateBgOffset);
bgOffsetXElem.addEventListener("input", updateBgOffset);
bgZoomElem.addEventListener("input", updateBgOffset);
textSizeElem.addEventListener("input", (event) => {
  const size = event.target.value;
  thumbnailElem.style.setProperty("--text-size", `${size}px`);
});

colorElem.addEventListener("input", (event) => {
  const color = event.target.value;
  const isALightColor = contrast(color);

  thumbnailElem.style.setProperty("--color-border", color);
  thumbnailElem.style.setProperty(
    "--color-text",
    isALightColor ? "#000" : "#fff"
  );

  if (!bgModeAdvancedElem.checked) {
    colorAdvancedElem.value = color;
    thumbnailElem.style.setProperty("--color-bg", color);
  }
});

colorAdvancedElem.addEventListener("input", (event) => {
  const color = event.target.value;
  thumbnailElem.style.setProperty("--color-bg", color);
});

textElem.addEventListener("input", (event) => {
  thumbnailElem.querySelector(".thumbnail__text").innerHTML =
    event.target.value.replaceAll("\n", "<br>");
});

withColorElem.addEventListener("change", (event) => {
  thumbnailElem
    .querySelector(".thumbnail__icon")
    .classList.toggle("monochrome", !event.target.checked);
});

iconEnableElem.addEventListener("change", (event) => {
  const isEnabled = event.target.checked;

  document.querySelectorAll('input[name="icon"]').forEach((input) => {
    input.disabled = !isEnabled;
  });
  withColorElem.disabled = !isEnabled;
  thumbnailElem
    .querySelector(".thumbnail__icon")
    .classList.toggle("hidden", !isEnabled);
});

document.querySelectorAll('input[name="icon"]').forEach((input) => {
  input.addEventListener("change", (event) => {
    const selectedIcon = event.target.dataset.icon;
    thumbnailElem.querySelector(".thumbnail__icon").dataset.icon = selectedIcon;
  });
});

// Add event listeners for position controls
headerPositionTopElem.addEventListener("change", function () {
  if (this.checked) {
    thumbnailElem.setAttribute("data-header-position", "top");
  }
});

headerPositionBottomElem.addEventListener("change", function () {
  if (this.checked) {
    thumbnailElem.setAttribute("data-header-position", "bottom");
  }
});

textPositionTopElem.addEventListener("change", function () {
  if (this.checked) {
    thumbnailElem.setAttribute("data-text-position", "top");
  }
});

textPositionBottomElem.addEventListener("change", function () {
  if (this.checked) {
    thumbnailElem.setAttribute("data-text-position", "bottom");
  }
});

textPositionCenterElem.addEventListener("change", function () {
  if (this.checked) {
    thumbnailElem.setAttribute("data-text-position", "center");
  }
});

fillControls();
