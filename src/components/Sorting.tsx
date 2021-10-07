import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../context';

type OrderType = (-1 | 0 | 1);
type OrdersType = OrderType[];

let orders: OrdersType = [];

const ChoiceOrder: React.VFC = () => {
  const { state, } = useContext(GlobalContext);
  const [leftPath, setLeftPath] = useState("")
  const [rightPath, setRightPath] = useState("")
  let isSorted = false;

  const paths = Array.from(state.filePaths);

  const selectOrder = (order: OrderType) => {
    if(!isSorted) {
      orders.push(order);
      document.getElementById("undoButton").removeAttribute("disabled");
      askNext();
    }
  }
  const undoOrder = () => {
    if(orders.length > 0) {
      orders.pop();
      document.getElementById("leftButton").removeAttribute("disabled");
      document.getElementById("rightButton").removeAttribute("disabled");
      if(orders.length == 0) {
        document.getElementById("undoButton").setAttribute("disabled", "");
      }
      askNext();
    }
  }
  const askNext = () => {
    let oi = -1;
    isSorted = true;
    paths.sort((a, b) => {
      oi++;
      if (oi < orders.length) {
        return orders[oi];
      }
      if (oi == orders.length) {
        setLeftPath(a);
        setRightPath(b);
      }
      isSorted = false;
      return -1; // ここは，まだユーザーが選択してないところだから適当
    });
    if (isSorted) {
      document.getElementById("leftButton").setAttribute("disabled", "");
      document.getElementById("rightButton").setAttribute("disabled", "");
    }
  }

  useEffect(() => askNext(), [])
  useEffect(() => {
    document.getElementById("undoButton").setAttribute("disabled", "");
  }, []);

  return (
    <>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div style={{display: "flex", flexDirection: "column", flexBasis: "49%"}}>
            <img src={leftPath} alt={leftPath} />
            <button id="leftButton" onClick={() => selectOrder(1)}>&gt;</button>
          </div>
          <div style={{display: "flex", flexDirection: "column", flexBasis: "49%"}}>
            <img src={rightPath} alt={rightPath} />
            <button id="rightButton" onClick={() => selectOrder(-1)}>&lt;</button>
          </div>
        </div>
        <button id="undoButton" onClick={() => undoOrder()}>一手戻る</button>
      </div>
    </>
  )
}

const Sorting: React.VFC = () => {
  const history = useHistory();

  return (
    <>
      <button onClick={() => {orders = []; history.goBack();}}>
        ソート対象画像の選択をやり直す
      </button>
      <ChoiceOrder />
    </>
  );
}

export { Sorting };