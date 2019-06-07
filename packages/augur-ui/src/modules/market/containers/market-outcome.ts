import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "store";
import getValue from "utils/get-value";
import { formatEther, formatShares } from "utils/format-number";
import * as constants from "modules/common/constants";
import { CATEGORICAL } from "modules/common/constants";

import Row from "modules/common/row";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const { COLUMN_TYPES } = constants;

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const outcome = oP.outcome;

  const outcomeName = getValue(outcome, "name");

  const topBidShares = getValue(outcome, "topBid.shares");
  const topAskShares = getValue(outcome, "topAsk.shares");

  const topBidPrice = getValue(outcome, "topBid.price");
  const topAskPrice = getValue(outcome, "topAsk.price");

  const lastPrice = getValue(outcome, "lastPrice");
  const lastPricePercent = getValue(outcome, "lastPricePercent.full");

  const columnProperties = [
    {
      key: "outcomeName",
      columnType: COLUMN_TYPES.TEXT,
      text: outcomeName,
      keyId: outcomeName,
      showExtraNumber: !oP.scalarDenomination,
      value: lastPricePercent,
    },
    {
      key: "topBidShares",
      columnType: COLUMN_TYPES.VALUE,
      value: topBidShares,
      showEmptyDash: true
    },
    {
      key: "topBidPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: topBidPrice,
      showEmptyDash: true
    },
    {
      key: "topAskPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: topAskPrice,
      showEmptyDash: true
    },
    {
      key: "topAskShares",
      columnType: COLUMN_TYPES.VALUE,
      value: topAskShares,
      showEmptyDash: true
    },
    {
      key: "lastPrice",
      columnType: COLUMN_TYPES.VALUE,
      value: lastPrice,
      addIndicator: true,
      outcome: outcome,
      location: "tradingPage",
    }
  ];
  return {
    ...oP,
    ...sP,
    ...dP,
    rowProperties: outcome,
    columnProperties,
    rowOnClick: (e: Event) => {oP.updateSelectedOutcome(outcome.id)},
    styleOptions: {
      outcome: true,
      isSingle: true,
      noToggle: true,
      colorId: oP.marketType === CATEGORICAL && outcome.id,
      active: oP.marketType === CATEGORICAL && oP.selectedOutcome === outcome.id
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
