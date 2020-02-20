import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'appStore';
import { formatDai, formatShares } from 'utils/format-number';
import {
  COLUMN_TYPES,
  SCALAR,
  BINARY_CATEGORICAL_FORMAT_OPTIONS,
} from 'modules/common/constants';

import Row from 'modules/common/row';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const filledOrder = oP.filledOrder;
  const opts =
    filledOrder.marketType === SCALAR
      ? {}
      : { ...BINARY_CATEGORICAL_FORMAT_OPTIONS };
  const orderQuantity = formatShares(filledOrder.amount, opts);
  const orderPrice = formatDai(filledOrder.price);
  const orderType = filledOrder.type;

  const originalQuantity = formatShares(filledOrder.originalQuantity, opts);

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
