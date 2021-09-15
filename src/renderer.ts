import './index.css';

const api = window.api;

document.getElementById('upload-image-files')?.addEventListener('click', async () => {
  const files = await api.showOpenDialogSync({
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
    properties: ['openFile', 'multiSelections', 'showHiddenFiles'],
  }) ?? [];

  for (const file of files) {
    console.log('File(s) you dragged here: ', file);
    const img = document.createElement('img');
    img.src = file;
    document.getElementById('image-view').appendChild(img);
  }
})
