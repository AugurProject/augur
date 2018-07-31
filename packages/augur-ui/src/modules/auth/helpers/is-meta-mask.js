import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3'

export default function () {
  if (!isGlobalWeb3()) return false
  if (!window.web3.currentProvider.isMetaMask) return false
  return true
}
