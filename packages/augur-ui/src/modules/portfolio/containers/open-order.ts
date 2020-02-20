import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import getValue from 'utils/get-value';
import { AppState } from 'appStore';
import * as constants from 'modules/common/constants';

import Row from 'modules/common/row';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { TXEventName } from '@augurproject/sdk/src/constants';
import { removeCanceledOrder } from 'modules/orders/actions/update-order-status';
import { OPEN } from 'modules/common/constants';

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: AppState) => ({
  currentTimestamp: state.blockchain.currentAugurTimestamp,
  orderCancellation: state.orderCancellation,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  removeCanceledOrder: id => dispatch(removeCanceledOrder(id)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const openOrder = oP.openOrder;
  const tokensEscrowed = getValue(openOrder, 'tokensEscrowed');
  const sharesEscrowed = getValue(openOrder, 'sharesEscrowed');
  const avgPrice = getValue(openOrder, 'avgPrice');
  const unmatchedShares = getValue(openOrder, 'unmatchedShares');
  const isCanceling =
    sP.orderCancellation && sP.orderCancellation[openOrder.id];

  const orderLabel =
    openOrder.description || openOrder.name || openOrder.outcomeName;
  const columnProperties = [
    {
      key: 'orderName',
      columnType: COLUMN_TYPES.TEXT,
      text: orderLabel,
      keyId: openOrder.id,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: openOrder.type,
      showCountdown: true,
      expiry: openOrder.expiry,
      currentTimestamp: sP.currentTimestamp,
    },
    {
      key: 'unmatchedShares',
      columnType: COLUMN_TYPES.VALUE,
      value: openOrder.unmatchedShares && unmatchedShares,
      keyId: 'openOrder-unmatchedShares-' + openOrder.id,
    },
    {
      key: 'avgPrice',
      columnType: COLUMN_TYPES.VALUE,
      value: openOrder.avgPrice && avgPrice,
      useFull: true,
      keyId: 'openOrder-price-' + openOrder.id,
    },
    {
      key: 'tokensEscrowed',
      columnType: COLUMN_TYPES.VALUE,
      value: tokensEscrowed,
      useFull: true,
      showEmptyDash: true,
      keyId: 'openOrder-tokensEscrowed-' + openOrder.id,
    },
    {
      key: 'sharesEscrowed',
      columnType: COLUMN_TYPES.VALUE,
      value: sharesEscrowed,
      showEmptyDash: true,
      keyId: 'openOrder-sharesEscrowed-' + openOrder.id,
    },
    {
      key: 'cancel',
      columnType: COLUMN_TYPES.CANCEL_TEXT_BUTTON,
      disabled: isCanceling,
      text: null,
      showCountdown: true,
      expiry: openOrder.expiry,
      currentTimestamp: sP.currentTimestamp,
      pending: isCanceling || (openOrder.status && openOrder.status !== OPEN),
      status: isCanceling ? TXEventName.Pending : openOrder.status,
      action: async (e: Event) => {
        e.stopPropagation();
        try {
          await openOrder.cancelOrder(openOrder);
        } catch (error) {
          dP.removeCanceledOrder(openOrder.id);
        }
      },
    },
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: openOrder,
    columnProperties,
    styleOptions: {
      noToggle: oP.extendedViewNotOnMobile,
      openOrder: true,
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
