import logError from "utils/log-error";
import {
  loadMarketsInfoIfNotLoaded,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const loadDisputingDetails = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(
    loadMarketsInfoIfNotLoaded(marketIds, () => {
      dispatch(
        loadMarketsDisputeInfo(marketIds, () => {
          callback(null);
        })
      );
    })
  );
};
