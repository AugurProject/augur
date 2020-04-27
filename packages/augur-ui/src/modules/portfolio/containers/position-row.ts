import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import * as constants from 'modules/common/constants';
import Row from 'modules/common/row';
import { Properties } from 'modules/common/row-column';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { calcPercentageFromPrice } from 'utils/format-number';

const { COLUMN_TYPES, SHORT, BUY, SELL } = constants;

const mapStateToProps = (state: AppState) => ({
  marketInfos: state.marketInfos,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const {
    position,
    showPercent,
    extendedView,
    isFirst,
    showExpandedToggleOnMobile,
    updateSelectedOrderProperties,
  } = oP;
  let lastPrice = position.lastPrice;
  let purchasePrice = position.purchasePrice;

  const market = sP.marketInfos[position.marketId];
  const usePercent = position.outcomeId === constants.INVALID_OUTCOME_ID && market.marketType === constants.SCALAR;
  if (usePercent) {
    const lastPricePercent = calcPercentageFromPrice(
      String(lastPrice.value),
      market.minPrice,
      market.maxPrice
    );
    lastPrice = { ...lastPrice, percent: `${lastPricePercent}%` };

    const purchasePricePercent = calcPercentageFromPrice(
      String(purchasePrice.value),
      market.minPrice,
      market.maxPrice
    );
    purchasePrice = { ...purchasePrice, percent: `${purchasePricePercent}%` };
  }
  const columnProperties: Array<Properties> = [
    {
      key: 'orderName',
      columnType: COLUMN_TYPES.TEXT,
      text: position.outcomeName,
      keyId: position.totalCost,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: position.type,
    },
    {
      key: 'originalQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: position.quantity,
      keyId: 'position-quantity-' + position.id,
      action: () => {
        updateSelectedOrderProperties({
          orderQuantity: position.quantity.value,
          selectedNav: position.type === SHORT ? BUY : SELL,
          orderPrice: ''
        });
      },
    },
    {
      key: 'averagePrice',
      columnType: COLUMN_TYPES.VALUE,
      value: purchasePrice,
      usePercent: purchasePrice && !!purchasePrice.percent,
      useFull: market?.marketType === constants.SCALAR ? false : true,
      showFullPrecision: market?.marketType === constants.SCALAR? true : false,
      showDenomination: market?.marketType === constants.SCALAR ? true : false,
      keyId: 'position-price-' + position.id,
    },
    {
      hide: extendedView,
      key: 'totalCost',
      columnType: COLUMN_TYPES.VALUE,
      value: position.totalCost,
      useFull: true,
      keyId: 'position-totalCost-' + position.id,
    },
    {
      hide: extendedView,
      key: 'totalValue',
      columnType: COLUMN_TYPES.VALUE,
      value: position.totalValue,
      useFull: true,
      keyId: 'position-totalValue-' + position.id,
    },
    {
      hide: extendedView,
      key: 'lastPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: lastPrice,
      usePercent: lastPrice && !!lastPrice.percent,
      useFull: true,
      keyId: 'position-lastPrice-' + position.id,
    },
  ];
  if (!showPercent) {
    columnProperties.push({
      key: 'totalPercent',
      useFull: true,
      showBrackets: true,
      showPlusMinus: true,
      hide: extendedView,
      columnType: COLUMN_TYPES.MOVEMENT_LABEL,
      value: position.totalPercent,
    });
  } else {
    columnProperties.push({
      key: 'totalReturns',
      hide: extendedView,
      columnType: COLUMN_TYPES.VALUE,
      useFull: true,
      value: position.totalReturns,
    });
  }
  columnProperties.push({
    key: 'unrealizedNet',
    hide: !extendedView,
    columnType: COLUMN_TYPES.VALUE,
    useFull: true,
    value: position.unrealizedNet,
  });
  columnProperties.push({
    key: 'realizedNet',
    hide: !extendedView,
    columnType: COLUMN_TYPES.VALUE,
    useFull: true,
    value: position.realizedNet,
  });
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: position,
    columnProperties,
    styleOptions: {
      position: true,
      showExpandedToggleOnMobile,
      noToggle: extendedView,
      isFirst,
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
