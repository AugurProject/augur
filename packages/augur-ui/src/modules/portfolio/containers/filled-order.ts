import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "store";
import getValue from "utils/get-value";
import { formatEther, formatShares } from "utils/format-number";
import * as constants from "modules/common/constants";

import Row from "modules/common/row";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const filledOrder = oP.filledOrder;

  const orderQuantity = formatShares(getValue(filledOrder, "amount"));
  const orderPrice = formatEther(getValue(filledOrder, "price"));
  const orderType = getValue(filledOrder, "type");

  const originalQuantity = formatShares(
    getValue(filledOrder, "originalQuantity"),
  );

  const columnProperties = [
    {
      key: "orderName",
      columnType: COLUMN_TYPES.TEXT,
      text: filledOrder.outcome,
      keyId: `${originalQuantity}-${orderQuantity}-${orderPrice}`,
    },
    {
      key: "orderType",
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: orderType,
      pastTense: true,
    },
    {
      key: "originalQuantity",
      columnType: COLUMN_TYPES.VALUE,
      value: originalQuantity,
      keyId: "filledOrder-originalQuantity-" + filledOrder.id,
    },
    {
      key: "orderQuantity",
      columnType: COLUMN_TYPES.VALUE,
      value: orderQuantity,
      keyId: "filledOrder-orderQuantity-" + filledOrder.id,
    },
    {
      key: "orderPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: orderPrice,
      keyId: "filledOrder-orderPrice-" + filledOrder.id,
    },
    {
      key: "formattedLocalShortDate",
      columnType: COLUMN_TYPES.PLAIN,
      value: filledOrder.timestamp.formattedLocalShortDate,
    },
    {
      key: "length",
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
    mergeProps,
  )(Row),
);
