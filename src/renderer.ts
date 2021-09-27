import './style/index.css';
import './style/lib/classless.css';
import './style/lib/themes.css';

const api = window.api;

const file_paths: Set<string> = new Set();

const add_file = (file_path: string): void => {
  if (file_paths.has(file_path)) return;
  console.log('File(s) you dragged here: ', file_path);

  const tr = document.createElement('tr');
  tr.className = "selected-image"

  const path = document.createElement('td');
  path.innerText = file_path;
  tr.appendChild(path);

  const cancel = document.createElement('td');
  const cancelButton = document.createElement('button');
  cancelButton.innerText = "✕";
  cancelButton.addEventListener('click', () => {
    tr.remove();
    file_paths.delete(file_path);
  })
  cancel.appendChild(cancelButton)
  tr.appendChild(cancel);

  document.getElementById('selected-images').appendChild(tr);
  file_paths.add(file_path);
}

document.getElementById('upload-image-files')?.addEventListener('click', async () => {
  const files = await api.showOpenDialogSync({
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
    properties: ['openFile', 'multiSelections', 'showHiddenFiles'],
  }) ?? [];

  files.forEach(file => add_file(file));
})

document.getElementById('upload-image-files-in-directories')?.addEventListener('click', async () => {
  const directories = await api.showOpenDialogSync({
    properties: ['openDirectory', 'multiSelections'],
  }) ?? [];

  const files = (await Promise.all(directories.map(async (directory: string): Promise<string[]> => {
    return await api.walk(directory, ['jpg', 'png']);
  }))).flat();

  files.forEach(file => add_file(file));
})
