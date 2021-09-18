import { contextBridge, ipcRenderer, OpenDialogOptions } from "electron";
import { SelectFileChannel, WalkChannel } from "./IpcChannel";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public showOpenDialogSync = async (openDialogOptions?: OpenDialogOptions): Promise<string[]> => {
    return await ipcRenderer.invoke(SelectFileChannel.TO_MAIN, openDialogOptions);
  };

  public walk = async (directory: string, extensions?: string[]): Promise<string[]> => {
    return await ipcRenderer.invoke(WalkChannel.TO_MAIN, directory, extensions);
  }
}

/**
 * contextBridgeにAPIを登録する。
 */
contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
