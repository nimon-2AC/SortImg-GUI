import { contextBridge, ipcRenderer, OpenDialogSyncOptions } from "electron";
import { SelectFileChannel, WalkChannel, SaveFileChannel } from "./IpcChannel";

export class ContextBridgeApi {
  public static readonly API_KEY = "api";

  public showOpenDialogSync = async (openDialogOptions?: OpenDialogSyncOptions): Promise<string[]> => {
    return await ipcRenderer.invoke(SelectFileChannel.TO_MAIN, openDialogOptions);
  };

  public walk = async (directory: string, extensions?: string[]): Promise<string[]> => {
    return await ipcRenderer.invoke(WalkChannel.TO_MAIN, directory, extensions);
  }

  public saveFiles = async (files: string[], toDirectoryPath: string): Promise<void[]> => {
    return await ipcRenderer.invoke(SaveFileChannel.TO_MAIN, files, toDirectoryPath);
  }
}

/**
 * contextBridgeにAPIを登録する。
 */
contextBridge.exposeInMainWorld(
  ContextBridgeApi.API_KEY,
  new ContextBridgeApi()
);
