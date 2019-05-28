import { ReactDOM } from "react";

export function FindReact(dom: HTMLElement) {
  const key: string | undefined = Object.keys(dom).find((key: string) =>
    key.startsWith("__reactInternalInstance$"),
  );
  let internalInstance: HTMLElement | null = null;
  if (key !== undefined) {
    internalInstance = dom[key];
  }
  if (!internalInstance) return null;

  if (internalInstance.return) {
    // react 16+
    return internalInstance.return.stateNode;
  } // react <16
  return internalInstance._currentElement._owner._instance;
}
