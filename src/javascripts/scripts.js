/* eslint-disable no-console */
import 'babel-polyfill';
import html2canvas from 'html2canvas';
// import templates from '../data/templates';

const downloadElem = document.querySelector('#download');
const dateElem = document.querySelector('#date');
const imageElem = document.querySelector('#image');
const iconSunElem = document.querySelector('#icon-sun');
const iconMoonElem = document.querySelector('#icon-moon');
const thumbnailElem = document.querySelector('.thumbnail[data-selected="true"]');

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
  const canvas = await html2canvas(thumbnailElem);

  return canvas
    .toDataURL('image/png')
    .replace(/^data:image\/png/, 'data:application/octet-stream');
}

function fillControls() {
  const now = new Date();
  const todayDate = new Date();
  todayDate.setHours(todayDate.getHours() - 5);

  dateElem.value = todayDate.toISOString().substr(0, 10);
  dateElem.dispatchEvent(new Event('input'));

  if (now.getHours() < 19) {
    iconSunElem.checked = true;
  } else {
    iconMoonElem.checked = true;
  }
}

downloadElem.addEventListener('click', async (event) => {
  event.preventDefault();
  const imgData = await generateImage();
  const dateString = dateElem.value.replace(/\d{2}(\d{2})-(\d{2})-(\d{2})/, '$1-$2-$3');
  const iconString = document.querySelector('input[name="icon"]:checked').dataset.icon;
  const iconTranslated = iconString === 'sun' ? 'dia' : 'noche';
  download(`miniatura-${dateString}-${iconTranslated}.png`, imgData);
});

imageElem.addEventListener('change', (event) => {
  thumbnailElem.querySelector('.image').src = URL.createObjectURL(event.target.files[0]);
});

dateElem.addEventListener('input', (event) => {
  if (event.target.value) {
    const dateString = event.target.value.replace(/\d{2}(\d{2})-(\d{2})-(\d{2})/, '$3/$2/$1');
    const dateStringHTML = dateString.replace(/([0/])(?=\d)/g, '<span class="translucent">$1</span>');
    thumbnailElem.querySelector('.date').innerHTML = dateStringHTML;
  }
});

document.querySelectorAll('input[name="icon"]').forEach((input) => {
  input.addEventListener('change', (event) => {
    const selectedIcon = event.target.dataset.icon;
    thumbnailElem.querySelector('.icon').dataset.icon = selectedIcon;
  });
});

fillControls();
