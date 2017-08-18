import async from 'async';
import { loadOneOutcomeBidsAsks } from 'modules/bids-asks/actions/load-one-outcome-bids-asks';
import { updateIsFirstOrderBookChunkLoaded } from 'modules/bids-asks/actions/update-market-order-book';
import logError from 'utils/log-error';

export const loadBidsAsks = (marketID, callback = logError) => (dispatch, getState) => {
  const market = getState().marketsData[marketID];
  dispatch(updateIsFirstOrderBookChunkLoaded(marketID, false));
  const outcomes = Array.from(new Array(market.numOutcomes), (_, i) => i + 1);
  async.forEachOfSeries(outcomes, (outcome, nextOutcome) => {
    dispatch(loadOneOutcomeBidsAsks(marketID, outcome, nextOutcome));
  }, (err) => {
    console.log('got all outcomes for market', marketID, err);
    callback(err);
  });
};
