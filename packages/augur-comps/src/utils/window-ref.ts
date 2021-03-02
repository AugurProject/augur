import { WindowApp } from "./types";

export const windowRef: WindowApp = (window as WindowApp & typeof globalThis);
