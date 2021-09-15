import { ContextBridgeApi } from "../preload/preload";


declare global {
  interface Window {
    api: ContextBridgeApi;
  }
}
