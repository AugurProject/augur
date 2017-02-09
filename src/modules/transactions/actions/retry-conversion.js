import { augur } from '../../../services/augurjs';
import { updateMarketsData, updateEventMarketsMap } from '../../markets/actions/update-markets-data';
import { convertLogsToTransactions } from '../../transactions/actions/convert-logs-to-transactions';

export function loadMarketThenRetryConversion(marketID, label, log, callback) {
  return (dispatch, getState) => {
    // if (callback) callback();
    console.debug('loadMarketThenRetryConversion', marketID, label, log);
    augur.getMarketInfo(marketID, (marketInfo) => {
      if (!marketInfo || marketInfo.error) {
        if (marketInfo && marketInfo.error) console.error('augur.getMarketInfo:', marketInfo);
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
    // if (callback) callback();
    console.debug('lookupEventMarketsThenRetryConversion', eventID, label, log);
    augur.getMarkets(eventID, (markets) => {
      if (!markets || markets.error) {
        if (markets && markets.error) console.error('augur.getMarkets:', markets);
        return callback(`[${label}] couldn't load market IDs for event ${eventID}: ${JSON.stringify(log)}`);
      }
      if (markets && markets.length) {
        dispatch(updateEventMarketsMap(eventID, markets));
        dispatch(loadMarketThenRetryConversion(markets[0], label, log, callback));
      }
    });
  };
}
