/* eslint-disable no-console */
import 'babel-polyfill';
import html2canvas from 'html2canvas';
// import templates from '../data/templates';

function download(filename, data) {
  const element = document.createElement('a');

  element.setAttribute('href', data);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

html2canvas(document.querySelector('#thumbnail')).then((canvas) => {
  const imageData = canvas.toDataURL('image/png');

  const imgData = imageData.replace(/^data:image\/png/, 'data:application/octet-stream');

  download(`filename-${1}.png`, imgData);
});
