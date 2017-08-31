import store from 'src/store'

export default function () {
  const { selectedMarketID, tradesInProgress } = store.getState()
  return tradesInProgress[selectedMarketID]
}
