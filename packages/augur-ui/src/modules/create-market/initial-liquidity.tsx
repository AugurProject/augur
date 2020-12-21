import React from 'react';
import Row from 'modules/common/row';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { COLUMN_TYPES, DEFAULT_PARA_TOKEN, WETH } from 'modules/common/constants';
import { formatMarketShares, formatDai, formatEther } from 'utils/format-number';

export const InitialLiquidity = ({ order, selectedOutcome }) => {
  const {
    paraTokenName,
    newMarket: { marketType },
    actions: { removeOrderFromNewMarket },
  } = useAppStatusStore();
  const { id, outcomeName, type, quantity, price, orderEstimate } = order;
  const { TEXT, POSITION_TYPE, VALUE, CANCEL_TEXT_BUTTON } = COLUMN_TYPES;
  const columnProperties = [
    {
      key: `orderName-${outcomeName}`,
      columnType: TEXT,
      text: outcomeName,
      keyId: id + outcomeName,
    },
    {
      key: 'orderType',
      columnType: POSITION_TYPE,
      type,
    },
    {
      key: 'quantity',
      columnType: VALUE,
      value: formatMarketShares(marketType, quantity),
      keyId: `order-quantity-${id}`,
    },
    {
      key: 'price',
      columnType: VALUE,
      value: paraTokenName !== WETH ? formatDai(price) : formatEther(price),
      keyId: `order-price-${id}`,
    },
    {
      key: 'orderEstimate',
      columnType: VALUE,
      value: paraTokenName !== WETH ? formatDai(orderEstimate) : formatEther(orderEstimate),
      keyId: `order-orderEstimate-${id}`,
    },
    {
      key: 'cancel',
      columnType: CANCEL_TEXT_BUTTON,
      text: 'Cancel',
      action: (e: Event) => {
        removeOrderFromNewMarket({
          outcome: selectedOutcome,
          index: id,
          orderId: id,
        });
      },
    },
  ];
  return (
    <Row
      columnProperties={columnProperties}
      rowProperties={order}
      styleOptions={{
        noToggle: true,
        initialLiquidity: true,
      }}
    />
  );
};

export default InitialLiquidity;
