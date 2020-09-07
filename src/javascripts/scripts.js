/* eslint-disable no-console */
import 'babel-polyfill';
import html2canvas from 'html2canvas';
// import templates from '../data/templates';

const downloadElem = document.querySelector('#download');
const dateElem = document.querySelector('#date');
const iconSunElem = document.querySelector('#icon-sun');
const iconMoonElem = document.querySelector('#icon-moon');

function download(filename, data) {
  const element = document.createElement('a');

  element.setAttribute('href', data);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

async function generateImage() {
  const canvas = await html2canvas(document.querySelector('#thumbnail'));

  return canvas
    .toDataURL('image/png')
    .replace(/^data:image\/png/, 'data:application/octet-stream');
}

function fillControls() {
  const now = new Date();
  const todayDate = new Date();
  todayDate.setHours(todayDate.getHours() - 5);

  dateElem.value = todayDate.toISOString().substr(0, 10);

  if (now.getHours() < 19) {
    iconSunElem.checked = true;
  } else {
    iconMoonElem.checked = true;
  }
}

downloadElem.addEventListener('click', async () => {
  const imgData = await generateImage();
  const dateString = dateElem.value.replace('/', '-');
  download(`miniatura-${dateString}.png`, imgData);
});

fillControls();
