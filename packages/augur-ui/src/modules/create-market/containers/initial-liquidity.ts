import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import getValue from "utils/get-value";
import { AppState } from "store";
import * as constants from "modules/common/constants";

import Row from "modules/common/row";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import {
  removeOrderFromNewMarket,
} from "modules/markets/actions/update-new-market";

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  removeOrderFromNewMarket: data => dispatch(removeOrderFromNewMarket(data)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const order = oP.order;

  const columnProperties = [
    {
      key: "orderName",
      columnType: COLUMN_TYPES.TEXT,
      text: order.outcomeName,
      keyId: initialLiquidity.id,
    },
    {
      key: "unmatchedShares",
      columnType: COLUMN_TYPES.VALUE,
      value: openOrder.unmatchedShares && unmatchedShares,
      keyId: "openOrder-unmatchedShares-" + openOrder.id,
    },
    {
      key: "quantity",
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: order.quantity,
    },
    {
      key: "cancel",
      columnType: COLUMN_TYPES.CANCEL_TEXT_BUTTON,
      text: "Cancel",
      action: (e: Event) => {
        dP.removeOrderFromNewMarket({
          outcome: oP.selectedOutcome,
          index,
          orderId: order.index
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
      opennOrder: true,
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Row),
);
