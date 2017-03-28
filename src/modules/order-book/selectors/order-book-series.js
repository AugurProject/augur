import BigNumber from 'bignumber.js';

export function orderBookSeries(orderBook) {
  console.log('###orderBookSeries -- ', orderBook);

  const orderBookSeries = Object.keys(orderBook).reduce((p, type) => {
    if (p[type] == null) p[type] = [];

    let totalQuantity = new BigNumber(0);

    orderBook[type].forEach((order) => {
      const matchedPriceIndex = p[type].findIndex(existing => existing[0] === order.price.value);

      totalQuantity = totalQuantity.plus(order.shares.value);

      if (matchedPriceIndex > -1) {
        p[type][matchedPriceIndex][1] = totalQuantity.toNumber();
      } else {
        p[type].push([order.price.value, totalQuantity.toNumber()]);
      }
    });

    p[type].sort((a, b) => a[0] - b[0]);

    return p;
  }, {});

  console.log('###orderBookSeries RESULT -- ', orderBookSeries);
}
