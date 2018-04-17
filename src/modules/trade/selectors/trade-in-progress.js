import store from 'src/store'

export default function () {
  const { selectedMarketId, tradesInProgress } = store.getState()
  return tradesInProgress[selectedMarketId]
}
