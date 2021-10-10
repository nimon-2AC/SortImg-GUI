import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../context';

type OrderType = (-1 | 0 | 1);
type OrdersType = OrderType[];

let orders: OrdersType = [];

const ChoiceOrder: React.VFC = () => {
  const api = window.api;

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
      document.getElementById("saveSortedImagesButton").setAttribute("disabled", "");
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
      document.getElementById("saveSortedImagesButton").removeAttribute("disabled");
    }
  }
  const saveSortedImages = async (paths: string[]) => {
    const directory = (await api.showOpenDialogSync({
      properties: ["openDirectory", "createDirectory"],
      buttonLabel: "このディレクトリに画像を保存",
    }) ?? [undefined])[0];
    if(directory === void 0) {// undefined かどうか判定
      return;
    }

    document.getElementById("saving").innerText = "画像保存中";
    api.saveFiles(paths, directory)
      .then(() => {
        document.getElementById("saving").innerText = "画像成功";
      })
      .catch(() => {
        document.getElementById("saving").innerText = "画像失敗";
      });
  }

  useEffect(() => askNext(), [])
  useEffect(() => {
    document.getElementById("undoButton").setAttribute("disabled", "");
    document.getElementById("saveSortedImagesButton").setAttribute("disabled", "");
  }, []);

  return (
    <>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end", flexDirection: "column", flexBasis: "49%"}}>
            <div style={{display: "flex", marginTop: "auto", marginBottom: "auto"}}>
              <img src={leftPath} alt={leftPath? leftPath : "左の画像"} width="16" height="9" style={{width: "auto", height: "auto", maxWidth: "100%", maxHeight: "calc(100vh - 240px)", alignSelf: "stretch"}} />
            </div>
            <button id="leftButton" style={{alignSelf: "flex-end", width: "100%", marginRight: "0"}} onClick={() => selectOrder(-1)}>&gt;</button>
          </div>
          <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end", flexDirection: "column", flexBasis: "49%"}}>
            <div style={{display: "flex", marginTop: "auto", marginBottom: "auto"}}>
              <img src={rightPath} alt={rightPath? leftPath : "右の画像"} width="16" height="9" style={{width: "auto", height: "auto", maxWidth: "100%", maxHeight: "calc(100vh - 240px)", alignSelf: "stretch"}} />
            </div>
            <button id="rightButton" style={{alignSelf: "flex-end", width: "100%", marginRight: "0"}} onClick={() => selectOrder(1)}>&lt;</button>
          </div>
        </div>
        <button id="undoButton" onClick={() => undoOrder()}>一手戻る</button>
        <button id="saveSortedImagesButton" onClick={() => saveSortedImages(paths)}>ソートされた画像を保存</button>
        <div id="saving"></div>
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
