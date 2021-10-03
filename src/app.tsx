import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, Link, useHistory } from 'react-router-dom';

const api = window.api;

const filePaths: Set<string> = new Set();

const Entrance = () => {
  const [selectedFileRows, setSelectedFileRows] = useState([]);

  const toTableRow = (filePath: string): JSX.Element => {
    return (
      <tr className="selected-image" key={filePath} id={filePath}>
        <td>{filePath}</td>
        <td><button onClick={() => {
          document.getElementById(filePath).remove();
          filePaths.delete(filePath);
        }}>✕</button></td>
      </tr>
    )
  }

  const toTableRows = (filePaths: Set<string>): JSX.Element[] => {
    return Array.from(filePaths).map(filePath => toTableRow(filePath));
  }

  useEffect(() => setSelectedFileRows(toTableRows(filePaths)), []);

  const updateFilePaths = (files: string[]): void => {
    files.forEach(file => {
      if (filePaths.has(file)) return;
      filePaths.add(file);
      setSelectedFileRows(selectedFileRows => [
        ...selectedFileRows,
        toTableRow(file),
      ]);
    });
  }

  const FilesSelectionButton = () => {
    const selectFiles = async () => {
      const files = await api.showOpenDialogSync({
        filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
        properties: ['openFile', 'multiSelections', 'showHiddenFiles'],
      }) ?? [];

      updateFilePaths(files);
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

      updateFilePaths(files);
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
            {selectedFileRows}
          </thead>
          <tbody id="selected-images">
          </tbody>
        </table>
      </figure>
    </>
  )
}

const ImageSort = () => {
  const paths = Array.from(filePaths);

  console.log(paths);

  return (
    <>
    </>
  )
}

const SortPage = () => {
  const history = useHistory();

  return (
    <>
      <button onClick={() => history.goBack()}>選択をやり直す</button>
      <ImageSort />
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
