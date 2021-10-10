import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../context';

const ImageSelection: React.VFC = () => {
  const api = window.api;
  const { state, dispatch } = useContext(GlobalContext);
  const [selectedFileRows, setSelectedFileRows] = useState([]);

  const toTableRow = (filePath: string): JSX.Element => {
    return (
      <tr className="selected-image" key={filePath} id={filePath}>
        <td>{filePath}</td>
        <td><button onClick={() => {
          document.getElementById(filePath).remove();
          dispatch({ type: "deleteFilePath", filePath: filePath });
        }}>✕</button></td>
      </tr>
    )
  }

  const toTableRows = (filePaths: Set<string>): JSX.Element[] => {
    return Array.from(filePaths).map(filePath => toTableRow(filePath));
  }

  useEffect(() => setSelectedFileRows(toTableRows(state.filePaths)), []);

  const updateFilePaths = (files: string[]): void => {
    files.forEach(file => {
      if (state.filePaths.has(file)) return;
      dispatch({ type: "addFilePath", filePath: file });
      setSelectedFileRows(selectedFileRows => [
        ...selectedFileRows,
        toTableRow(file),
      ]);
    });
  }

  const FilesSelectionButton: React.VFC<{style: React.CSSProperties}> = ({ style }) => {
    const selectFiles = async () => {
      const files = await api.showOpenDialogSync({
        filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
        properties: ['openFile', 'multiSelections', 'showHiddenFiles'],
      }) ?? [];

      updateFilePaths(files);
    }

    return (
      <button type="button" onClick={selectFiles} style={style}>ファイルを選択</button>
    )
  }

  const DirectoriesSelectionButton: React.VFC<{style: React.CSSProperties}> = ({ style }) => {
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
      <button type="button" onClick={selectDirectories} style={style}>ディレクトリごと選択</button>
    )
  }

  const ToSortButton = () => {
    const history = useHistory();
    return (
        <button onClick={() => history.push("/sort")}>
          選択を完了してソート
        </button>
    )
  }

  return (
    <>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <FilesSelectionButton style={{flexBasis: "49%"}}/>
          <DirectoriesSelectionButton style={{flexBasis: "49%"}}/>
        </div>
        <ToSortButton />
      </div>
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

export { ImageSelection };
