import * as React from 'react';
import { useState, useEffect, createContext, useContext, useReducer } from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, useHistory } from 'react-router-dom';
import { StateType, ActionType, reducer } from './reducer';


type ContextType = {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
};

const initialState: StateType = {
  filePaths: new Set(),
};
const GlobalContext = createContext<ContextType>({} as ContextType);


const Entrance: React.VFC = () => {
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
    const history = useHistory();
    return (
        <button onClick={() => history.push("/sort")}>
          選択を完了してソート
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

let answers: number[] = [];
const ImageSort: React.VFC = () => {
  const { state, } = useContext(GlobalContext);
  const [leftPath, setLeftPath] = useState("")
  const [rightPath, setRightPath] = useState("")


  const paths = Array.from(state.filePaths);
  console.log(paths);

  const answer = (order: number) => {
    answers.push(order);
    askNext();
  }
  const undoAnswer = () => {
    answers.pop();
    askNext();
  }
  const askNext = () => {
    let ai = -1;
    let isSorted = true;
    paths.sort((a, b) => {
      ai++;
      console.log(answers, ai);
      if (ai < answers.length) {
        return answers[ai];
      }
      if (ai == answers.length) {
        console.log(answers, ai);
        setLeftPath(a);
        setRightPath(b);
      }
      isSorted = false;
      return -1; // ここは，まだユーザーが選択してないところだから適当
    });
    if (isSorted) {
      console.log("sorted!", paths);
      console.log(answers);
    }
  }

  useEffect(() => askNext(), [])

  return (
    <>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div style={{display: "flex", flexDirection: "column", flexBasis: "49%"}}>
            <img src={leftPath} alt={leftPath} />
            <button onClick={async () => answer(1)}>&gt;</button>
          </div>
          <div style={{display: "flex", flexDirection: "column", flexBasis: "49%"}}>
            <img src={rightPath} alt={rightPath} />
            <button onClick={async () => answer(-1)}>&lt;</button>
          </div>
        </div>
        <button onClick={async () => undoAnswer()}>一手戻る</button>
      </div>
    </>
  )
}

const SortPage = () => {
  const history = useHistory();

  return (
    <>
      <button onClick={() => {answers = []; history.goBack();}}>ソート対象画像の選択をやり直す</button>
      <ImageSort />
    </>
  );
}


const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
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
    </GlobalContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('react-content'));
