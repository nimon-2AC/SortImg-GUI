import * as React from 'react';
import * as ReactDOM from 'react-dom';

const file_paths: Set<string> = new Set();

const api = window.api;

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

const FilesSelectionButton = () => {
  const selectFiles = async () => {
    const files = await api.showOpenDialogSync({
      filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
      properties: ['openFile', 'multiSelections', 'showHiddenFiles'],
    }) ?? [];

    files.forEach(file => add_file(file));
  }

  return (
    <button type="button" onClick={selectFiles}>ファイルを選択</button>
  )
}

const DirectoriesSelectionButton = () => {
  const selectDirectories = async () => {
    const directories = await api.showOpenDialogSync({
      properties: ['openDirectory', 'multiSelections'],
    }) ?? [];

    const files = (await Promise.all(directories.map(async (directory: string): Promise<string[]> => {
      return await api.walk(directory, ['jpg', 'png']);
    }))).flat();

    files.forEach(file => add_file(file));
  }

  return (
    <button type="button" onClick={selectDirectories}>ディレクトリごと選択</button>
  )
}

const Entrance = () => {
  return (
    <div>
      <FilesSelectionButton />
      <DirectoriesSelectionButton />
      <button id="to-sort" type="button">
        <a href="pages/sort.html">選択を完了してソート</a>
      </button>
      <figure>
        <table>
          <thead>
            <tr>
              <td>選択した画像のパス</td>
              <td></td>
            </tr>
          </thead>
          <tbody id="selected-images">
          </tbody>
        </table>
      </figure>
    </div>
  )
}

const App = () => {
  return <Entrance />;
};

ReactDOM.render(<App />, document.getElementById('react-content'));
