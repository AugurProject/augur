import { updateOrderBook } from "modules/orders/actions/update-order-book";
import clearOrderBookOnFirstChunk from "modules/orders/actions/clear-order-book-on-first-chunk";

const insertOrderBookChunkToOrderBook = (
  marketId,
  outcome,
  orderTypeLabel,
  orderBookChunk
) => dispatch => {
  dispatch(clearOrderBookOnFirstChunk(marketId, outcome, orderTypeLabel));
  dispatch(updateOrderBook(marketId, outcome, orderTypeLabel, orderBookChunk));
};

export default insertOrderBookChunkToOrderBook;
