import { clearOrderBook, updateIsFirstOrderBookChunkLoaded } from 'modules/bids-asks/actions/update-order-book'

const clearOrderBookOnFirstChunk = (marketID, outcome, orderTypeLabel) => (dispatch, getState) => {
  const { isFirstOrderBookChunkLoaded } = getState()
  if (!((isFirstOrderBookChunkLoaded[marketID] || {})[outcome] || {})[orderTypeLabel]) {
    console.log('first chunk, clearing order book of', marketID)
    dispatch(updateIsFirstOrderBookChunkLoaded(marketID, outcome, orderTypeLabel, true))
    dispatch(clearOrderBook(marketID, outcome, orderTypeLabel))
  }
}

export default clearOrderBookOnFirstChunk
