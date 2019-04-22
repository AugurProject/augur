export const shapeGetOrders = (orders, marketId, orderState) => {
  const processedOrders = [];
  if (Object.keys(orders).length === 0) return processedOrders;
  Object.keys(orders[marketId]).forEach(outcome => {
    Object.keys(orders[marketId][outcome]).forEach(orderTypeLabel => {
      const orderBook = orders[marketId][outcome][orderTypeLabel];
      const filteredOrders = orderState
        ? Object.keys(orderBook).reduce((p, key) => {
            if (orderBook[key].orderState === orderState) {
              p[key] = orderBook[key];
            }
            return p;
          }, {})
        : orderBook;
      processedOrders.push({
        marketId,
        outcome,
        orderTypeLabel,
        orderBook: filteredOrders
      });
    });
  });
  return processedOrders;
};
