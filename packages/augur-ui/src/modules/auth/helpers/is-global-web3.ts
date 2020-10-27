import { WindowApp } from 'modules/types';

export default function() {
  if (typeof window === "undefined") return false;
  if (!window) return false;
  if (!(window as WindowApp & typeof globalThis).ethereum) {
    if ((window as WindowApp & typeof globalThis).web3 && (window as WindowApp & typeof globalThis).web3.currentProvider) return true;
    return false;
  }
  return true;
}
