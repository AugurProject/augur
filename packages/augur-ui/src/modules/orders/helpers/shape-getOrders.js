export const shapeGetOrders = (orders, marketId, orderState) => {
  const marketOrders = {};
  if (Object.keys(orders).length === 0) return { marketId, orderBook: {} };
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

      marketOrders[outcome] = {
        ...marketOrders[outcome],
        [orderTypeLabel]: filteredOrders
      };
    });
  });
  return { marketId, orderBook: marketOrders };
};
