import logError from "src/utils/log-error";
import {
  loadMarketsInfoIfNotLoaded,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";

export const loadDisputingDetails = (
  marketIds: Array<string>,
  callback: Function = logError
) => (dispatch: Function) => {
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
