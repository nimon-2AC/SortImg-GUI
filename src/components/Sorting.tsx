import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../context';

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

const Sorting: React.VFC = () => {
  const history = useHistory();

  return (
    <>
      <button onClick={() => {answers = []; history.goBack();}}>ソート対象画像の選択をやり直す</button>
      <ImageSort />
    </>
  );
}

export { Sorting };
