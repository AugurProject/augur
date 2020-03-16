import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import { formatDai, formatShares, calcPercentageFromPrice } from 'utils/format-number';
import {
  COLUMN_TYPES,
  SCALAR,
  BINARY_CATEGORICAL_FORMAT_OPTIONS,
  INVALID_OUTCOME_NAME,
} from 'modules/common/constants';

import Row from 'modules/common/row';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => ({
  marketInfos: state.marketInfos
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const filledOrder = oP.filledOrder;
  const opts =
    filledOrder.marketType === SCALAR
      ? {}
      : { ...BINARY_CATEGORICAL_FORMAT_OPTIONS };
  const orderQuantity = formatShares(filledOrder.amount, opts);
  let orderPrice = formatDai(filledOrder.price, { roundDown: true});
  const orderType = filledOrder.type;

  const originalQuantity = formatShares(filledOrder.originalQuantity, opts);
  const usePercent = filledOrder.outcome === INVALID_OUTCOME_NAME && filledOrder.marketType === SCALAR;
  if (usePercent) {
    const market = sP.marketInfos[filledOrder.marketId];
    const orderPricePercent = calcPercentageFromPrice(
      String(orderPrice.value),
      market.minPrice,
      market.maxPrice
    );
    orderPrice = { ...orderPrice, percent: `${orderPricePercent}%` };
  }
  const columnProperties = [
    {
      key: 'orderName',
      columnType: COLUMN_TYPES.TEXT,
      text: filledOrder.outcome,
      keyId: `${originalQuantity}-${orderQuantity}-${orderPrice}`,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: orderType,
      pastTense: true,
    },
    {
      key: 'originalQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: originalQuantity,
      keyId: 'filledOrder-originalQuantity-' + filledOrder.id,
    },
    {
      key: 'orderQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: orderQuantity,
      keyId: 'filledOrder-orderQuantity-' + filledOrder.id,
    },
    {
      key: 'orderPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: orderPrice,
      usePercent: !!orderPrice.percent,
      useFull: true,
      keyId: 'filledOrder-orderPrice-' + filledOrder.id,
    },
    {
      key: 'formattedLocalShortDate',
      columnType: COLUMN_TYPES.PLAIN,
      value: filledOrder.timestamp.formattedLocalShortDate,
    },
    {
      key: 'length',
      columnType: COLUMN_TYPES.PLAIN,
      value: filledOrder.trades.length,
    },
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: filledOrder,
    columnProperties,
    styleOptions: {
      filledOrder: true,
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Row)
);
