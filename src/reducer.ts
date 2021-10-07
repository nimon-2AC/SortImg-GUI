type StateType = {
  filePaths: Set<string>;
};

type ActionType =
  | { type: "addFilePath", filePath: string }
  | { type: "deleteFilePath", filePath: string }

const reducer = (state: StateType, action: ActionType): StateType => {
  const f = new Set(state.filePaths);
  switch (action.type) {
    case 'addFilePath':
      return { ...state, filePaths: f.add(action.filePath) };
    case 'deleteFilePath':
      f.delete(action.filePath);
      return { ...state, filePaths: f };
  }
};

export { StateType, ActionType, reducer };
