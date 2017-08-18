import async from 'async';
import { loadOneOutcomeBidsOrAsks } from 'modules/bids-asks/actions/load-one-outcome-bids-or-asks';
import logError from 'utils/log-error';

const BID = 1;
const ASK = 2;

export const loadOneOutcomeBidsAsks = (marketID, outcome, callback = logError) => (dispatch) => {
  if (marketID == null || outcome == null) {
    return callback(`must specify market ID and outcome: ${marketID} ${outcome}`);
  }
  async.eachSeries([BID, ASK], (orderType, nextOrderType) => {
    dispatch(loadOneOutcomeBidsOrAsks(marketID, outcome, orderType, nextOrderType));
  }, (err) => {
    console.log('bid and ask complete for this outcome', outcome, err);
    callback(err);
  });
};
