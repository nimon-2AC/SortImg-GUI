import { contextBridge, ipcRenderer, OpenDialogOptions } from "electron";
import { SelectFileChannel } from "./IpcChannel";

/**
 * APIクラス
 */
export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public showOpenDialogSync = async (openDialogOptions?: OpenDialogOptions): Promise<string[]> => {
    return await ipcRenderer.invoke(SelectFileChannel.TO_MAIN, openDialogOptions);
  };
}

/**
 * contextBridgeにAPIを登録する。
 */
contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
