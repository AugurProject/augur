import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { formatDaiPrice, calcPercentageFromPrice, formatMarketShares } from 'utils/format-number';
import {
  COLUMN_TYPES,
  SCALAR,
  INVALID_OUTCOME_COMPARE,
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
  const orderQuantity = formatMarketShares(filledOrder.marketType, filledOrder.amount);
  let orderPrice = formatDaiPrice(filledOrder.price, { roundDown: true});
  const orderType = filledOrder.type;

  const originalQuantity = formatMarketShares(filledOrder.marketType, filledOrder.originalQuantity);
  const usePercent = filledOrder.outcome === INVALID_OUTCOME_COMPARE && filledOrder.marketType === SCALAR;
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
      useFull: filledOrder.marketType === SCALAR ? false : true,
      showFullPrecision: filledOrder.marketType === SCALAR ? true : false,
      showDenomination: filledOrder.marketType === SCALAR ? true : false,
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
