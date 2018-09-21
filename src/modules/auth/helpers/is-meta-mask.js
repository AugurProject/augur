import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";

export default function() {
  if (!isGlobalWeb3()) return false;
  return true;
}
