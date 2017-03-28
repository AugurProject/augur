import React from 'react';

import getValue from 'utils/get-value';

const OrderBookChart = (p) => {
  const orderBookSeries = getValue(p, 'outcome.orderBookSeries');

  console.log('orderBookSeries -- ', orderBookSeries);

  return (
    <span>Chart</span>
  );
};

export default OrderBookChart;
