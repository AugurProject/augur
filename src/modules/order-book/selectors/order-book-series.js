export function orderBookSeries(orderBook) {
  console.log('###orderBookSeries -- ', orderBook);
  // const orderBookSeries = Object.keys(orderBook).reduce((p, outcome) => {
  //   if (p[outcome] == null) p[outcome] = {};
  //
  //   Object.keys(orderBook[outcome]).forEach((type) => {
  //     if (p[outcome][type] == null) p[outcome][type] = [];
  //
  //     let totalQuantity = new BigNumber(0);
  //
  //     orderBook[outcome][type].forEach((order) => {
  //       const matchedPriceIndex = p[outcome][type].findIndex(existing => existing[0] === order.price.toNumber());
  //
  //       totalQuantity = totalQuantity.plus(order.quantity);
  //
  //       if (matchedPriceIndex > -1) {
  //         p[outcome][type][matchedPriceIndex][1] = totalQuantity.toNumber();
  //       } else {
  //         p[outcome][type].push([order.price.toNumber(), totalQuantity.toNumber()]);
  //       }
  //     });
  //
  //     p[outcome][type].sort((a, b) => a[0] - b[0]);
  //   });
  //
  //   return p;
  // }, {});
  //
  // this.props.updateNewMarket({ orderBookSeries });
}
