import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, Link, useHistory } from 'react-router-dom';

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

const ToSortButton = () => {
  return (
      <button>
        <Link to="/sort">選択を完了してソート</Link>
      </button>
  )
}

const Entrance = () => {
  return (
    <>
      <FilesSelectionButton />
      <DirectoriesSelectionButton />
      <ToSortButton />
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
    </>
  )
}

const SortPage = () => {
  const history = useHistory();

  return (
    <>
      <h1>hoge</h1>
      <button onClick={() => history.goBack()}>選択をやり直す</button>
    </>
  );
}

const App = () => {
  return (
    <HashRouter>
      <>
        <Switch>
          <Route exact path='/'>
            <Entrance />
          </Route>
          <Route path='/sort'>
            <SortPage />
          </Route>
        </Switch>
      </>
    </HashRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('react-content'));
