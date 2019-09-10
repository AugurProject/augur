import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import * as constants from 'modules/common/constants';
import Row from 'modules/common/row';
import { Properties } from 'modules/common/row-column';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const { COLUMN_TYPES, SHORT, BUY, SELL } = constants;

const mapStateToProps = (state: AppState) => ({});

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
          selectedNav: position.type === SHORT ? SELL : BUY,
        });
      },
    },
    {
      key: 'orderQuantity',
      columnType: COLUMN_TYPES.VALUE,
      value: position.purchasePrice,
      keyId: 'position-price-' + position.id,
    },
    {
      hide: extendedView,
      key: 'totalCost',
      columnType: COLUMN_TYPES.VALUE,
      value: position.totalCost,
      keyId: 'position-totalCost-' + position.id,
    },
    {
      hide: extendedView,
      key: 'totalValue',
      columnType: COLUMN_TYPES.VALUE,
      value: position.totalValue,
      keyId: 'position-totalValue-' + position.id,
    },
    {
      hide: extendedView,
      key: 'lastPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: position.lastPrice,
      keyId: 'position-lastPrice-' + position.id,
    },
  ];
  if (!showPercent) {
    columnProperties.push({
      key: 'totalPercent',
      showPercent: true,
      showBrackets: true,
      showPlusMinus: true,
      showColors: true,
      size: 'medium',
      hide: extendedView,
      columnType: COLUMN_TYPES.MOVEMENT_LABEL,
      value: position.totalPercent.roundedFormatted,
    });
  } else {
    columnProperties.push({
      key: 'totalReturns',
      hide: extendedView,
      columnType: COLUMN_TYPES.PLAIN,
      value: position.totalReturns.formatted,
    });
  }
  columnProperties.push({
    key: 'unrealizedNet',
    hide: !extendedView,
    columnType: COLUMN_TYPES.PLAIN,
    value: position.unrealizedNet.formatted,
  });
  columnProperties.push({
    key: 'realizedNet',
    hide: !extendedView,
    columnType: COLUMN_TYPES.PLAIN,
    value: position.realizedNet.formatted,
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
