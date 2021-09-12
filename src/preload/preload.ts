import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { IpcChannel } from "./IpcChannel";

/**
 * APIクラス
 */
export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  /**
   * サンプル : レンダラープロセスからメインプロセスへのメッセージ送信
   */
  public sendToMainProcess = async (): Promise<{ message: string }> => {
    const result = await ipcRenderer
      .invoke(IpcChannel.TO_MAIN, {
        message: "レンダラープロセスからメインプロセスへのメッセージです",
      });
    return result;
  };

  /**
   * サンプル : メインプロセスからレンダラープロセスへのメッセージを受信した時の処理
   * @param rendererListener IpcRendererEvent受信時に実行されるコールバック関数
   */
  public onSendToRenderer = (
    rendererListener: (message: string) => void
  ): void => {
    ipcRenderer.on(
      IpcChannel.TO_RENDERER,
      (_event: IpcRendererEvent, arg: string) => {
        rendererListener(arg);
      }
    );
  };
}

/**
 * contextBridgeにAPIを登録する。
 */
contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
