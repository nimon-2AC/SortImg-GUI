import { createContext } from 'react';
import { StateType, ActionType } from './reducer';

type ContextType = {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
};

const GlobalContext = createContext<ContextType>({} as ContextType);

export { GlobalContext };
