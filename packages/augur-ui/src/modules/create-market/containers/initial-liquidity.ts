import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import getValue from 'utils/get-value';
import { AppState } from 'appStore';
import * as constants from 'modules/common/constants';
import { formatShares, formatEther } from 'utils/format-number';
import Row from 'modules/common/row';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { removeOrderFromNewMarket } from 'modules/markets/actions/update-new-market';

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: AppState) => ({
  newMarket: state.newMarket,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const order = oP.order;

  const columnProperties = [
    {
      key: 'orderName-' + order.outcomeName,
      columnType: COLUMN_TYPES.TEXT,
      text: order.outcomeName,
      keyId: order.id + order.outcomeName,
    },
    {
      key: 'orderType',
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: order.type,
    },
    {
      key: 'quantity',
      columnType: COLUMN_TYPES.VALUE,
      value: formatShares(order.quantity),
      keyId: 'order-quantity-' + order.id,
    },
    {
      key: 'price',
      columnType: COLUMN_TYPES.VALUE,
      value: formatEther(order.price),
      keyId: 'order-price-' + order.id,
    },
    {
      key: 'orderEstimate',
      columnType: COLUMN_TYPES.VALUE,
      value: formatEther(order.orderEstimate),
      keyId: 'order-orderEstimate-' + order.id,
    },
    {
      key: 'cancel',
      columnType: COLUMN_TYPES.CANCEL_TEXT_BUTTON,
      text: 'Cancel',
      action: (e: Event) => {
        dP.removeOrderFromNewMarket({
          outcome: oP.selectedOutcome,
          index: order.id,
          orderId: order.id,
        });
      },
    },
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: order,
    columnProperties,
    styleOptions: {
      noToggle: true,
      initialLiquidity: true,
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Row);
