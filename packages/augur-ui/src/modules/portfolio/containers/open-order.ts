import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import getValue from "utils/get-value";

import * as constants from "modules/common-elements/constants";

import Row from "modules/common-elements/row";

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: Function) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const openOrder = oP.openOrder;

  const tokensEscrowed = getValue(openOrder, "tokensEscrowed");
  const sharesEscrowed = getValue(openOrder, "sharesEscrowed");
  const avgPrice = getValue(openOrder, "avgPrice");
  const unmatchedShares = getValue(openOrder, "unmatchedShares");
  const orderLabel =
    openOrder.description || openOrder.name || openOrder.outcomeName;

  const columnProperties = [
    {
      key: "orderName",
      columnType: COLUMN_TYPES.TEXT,
      text: orderLabel,
      keyId: openOrder.id
    },
    {
      key: "orderType",
      columnType: COLUMN_TYPES.POSITION_TYPE,
      type: openOrder.type
    },
    {
      key: "unmatchedShares",
      columnType: COLUMN_TYPES.VALUE,
      value: openOrder.unmatchedShares && unmatchedShares,
      keyId: "openOrder-unmatchedShares-" + openOrder.id
    },
    {
      key: "avgPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: openOrder.avgPrice && avgPrice,
      keyId: "openOrder-price-" + openOrder.id
    },
    {
      key: "tokensEscrowed",
      columnType: COLUMN_TYPES.VALUE,
      value: tokensEscrowed,
      keyId: "openOrder-tokensEscrowed-" + openOrder.id
    },
    {
      key: "sharesEscrowed",
      columnType: COLUMN_TYPES.VALUE,
      value: sharesEscrowed,
      keyId: "openOrder-sharesEscrowed-" + openOrder.id
    },
    {
      key: "cancel",
      columnType: COLUMN_TYPES.CANCEL_TEXT_BUTTON,
      disabled: openOrder.pending,
      text: "Cancel",
      pending: openOrder.pending || openOrder.pendingOrder,
      action: (e: Event) => {
        e.stopPropagation();
        openOrder.cancelOrder(openOrder);
      }
    }
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: openOrder,
    columnProperties,
    styleOptions: {
      noToggle: oP.extendedView,
      openOrder: true
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Row)
);
