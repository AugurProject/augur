import { windowRef } from 'utils/window-ref';

export default function() {
  if (typeof windowRef === "undefined") return false;
  if (!windowRef) return false;
  if (!windowRef.ethereum) {
    if (windowRef.web3 && windowRef.web3.currentProvider) return true;
    return false;
  }
  return true;
}
