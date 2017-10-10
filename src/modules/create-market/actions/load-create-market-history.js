import { augur } from 'services/augurjs';
import logError from 'utils/log-error';

export function loadCreateMarketHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState();
    if (!loginAccount.address) return callback(null);
    augur.markets.getMarketsCreatedByUser({ ...options, creator: loginAccount.address, universe: branch.id }, (err, marketsCreatedByUser) => {
      // note: marketsCreatedByUser is an array of market IDs
      if (err) return callback(err);
      if (marketsCreatedByUser == null) return callback(null);
      // TODO save markets created by user to state
      callback(null, marketsCreatedByUser);
    });
  };
}
