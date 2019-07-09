import memoize from 'memoizee';
import { SELL } from 'modules/common/constants';

export default function(
  orderId,
  marketId,
  outcome,
  orderTypeLabel,
  userOpenOrders,
) {
  return getUserOpenOrder(orderId, marketId, outcome, orderTypeLabel, userOpenOrders);
}

const getUserOpenOrder = memoize(
  (orderId, marketId, outcome, orderTypeLabel, orders) => {
    let order = null;
    const type = orderTypeLabel === SELL ? 1 : 0;
    if (
      orders &&
      orders[marketId] &&
      orders[marketId][outcome] &&
      orders[marketId][outcome][type] &&
      orders[marketId][outcome][type][orderId]
    ) {
      order = orders[marketId][outcome][type][orderId];
    }
    if (order == null) return null;
    return order;
  },
  { max: 1 }
);
