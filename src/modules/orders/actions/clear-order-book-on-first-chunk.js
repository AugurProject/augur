import {
  clearOrderBook,
  updateIsFirstOrderBookChunkLoaded
} from "modules/orders/actions/update-order-book";

const clearOrderBookOnFirstChunk = (marketId, outcome, orderTypeLabel) => (
  dispatch,
  getState
) => {
  const { isFirstOrderBookChunkLoaded } = getState();
  if (
    !((isFirstOrderBookChunkLoaded[marketId] || {})[outcome] || {})[
      orderTypeLabel
    ]
  ) {
    console.log("first chunk, clearing order book of", marketId);
    dispatch(
      updateIsFirstOrderBookChunkLoaded({
        marketId,
        outcome,
        orderTypeLabel,
        isLoaded: true
      })
    );
    dispatch(clearOrderBook(marketId, outcome, orderTypeLabel));
  }
};

export default clearOrderBookOnFirstChunk;
