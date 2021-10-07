import * as React from 'react';
import { useReducer } from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { StateType, reducer } from './reducer';
import { GlobalContext } from './context';
import { ImageSelection } from './components/ImageSelection';
import { Sorting } from './components/Sorting';


const App = () => {
  const initialState: StateType = {
    filePaths: new Set(),
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      <HashRouter>
        <>
          <Switch>
            <Route exact path='/'>
              <ImageSelection />
            </Route>
            <Route path='/sort'>
              <Sorting />
            </Route>
          </Switch>
        </>
      </HashRouter>
    </GlobalContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('react-content'));
