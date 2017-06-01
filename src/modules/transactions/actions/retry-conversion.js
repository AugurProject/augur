import { augur } from 'services/augurjs';
import { updateMarketsData, updateEventMarketsMap } from 'modules/markets/actions/update-markets-data';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';

export function loadMarketThenRetryConversion(marketID, label, log, callback) {
  return (dispatch, getState) => {
    augur.markets.getMarketInfo({ marketID }, (marketInfo) => {
      if (!marketInfo || marketInfo.error) {
        if (marketInfo && marketInfo.error) console.error('augur.markets.getMarketInfo:', marketInfo);
        return callback(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(log)}`);
      }
      dispatch(updateMarketsData({ [marketID]: marketInfo }));
      dispatch(convertLogsToTransactions(label, [log], true));
      if (callback) callback();
    });
  };
}

export function lookupEventMarketsThenRetryConversion(eventID, label, log, callback) {
  return (dispatch, getState) => {
    augur.api.Events.getMarkets({ event: eventID }, (markets) => {
      if (!markets || markets.error) {
        if (markets && markets.error) console.error('augur.api.Events.getMarkets:', markets);
        return callback(`[${label}] couldn't load market IDs for event ${eventID}: ${JSON.stringify(log)}`);
      }
      if (markets && markets.length) {
        dispatch(updateEventMarketsMap(eventID, markets));
        dispatch(loadMarketThenRetryConversion(markets[0], label, log, callback));
      }
    });
  };
}
