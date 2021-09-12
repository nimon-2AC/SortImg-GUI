import './index.css';

import { ContextBridgeApi } from "./preload/preload";

/**
 * contextBridge.exposeInMainWorldで設定したapiオブジェクトは
 * グローバル変数windowに追加されます。
 * keyはcontextBridge.exposeInMainWorldの第一引数です。
 * このサンプルでは第一引数を"api"としています。
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const api: ContextBridgeApi = window.api;

const callback = (arg: string) => {
  console.log(arg); // => メインプロセスからレンダラープロセスへのメッセージです。
}
api.onSendToRenderer(callback);

const send = async () => {
  const result = await api.sendToMainProcess();
  console.log("result: ", result); // => result : メインプロセスからの返答です。
};
send();
