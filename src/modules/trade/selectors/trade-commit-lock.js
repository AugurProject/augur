import store from 'src/store'

export default function () {
  return store.getState().tradeCommitLock
}
