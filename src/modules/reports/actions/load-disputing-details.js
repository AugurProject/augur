import logError from "src/utils/log-error";
import {
  loadMarketsInfoIfNotLoaded,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";

export const loadDisputingDetails = (
  marketIds,
  callback = logError
) => dispatch => {
  dispatch(loadMarketsInfoIfNotLoaded(marketIds));
  dispatch(loadMarketsDisputeInfo(marketIds), () => {
    callback(null);
  });
};
