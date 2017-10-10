import { augur } from 'services/augurjs';
import logError from 'utils/log-error';

export const loadBidsAsksHistory = (options, callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState();
  augur.trading.getOpenOrders({ ...options, account: loginAccount.address, universe: branch.id }, (err, openOrders) => {
    if (err) return callback(err);
    if (openOrders == null) return callback(null);
    // TODO update user's open orders
    callback(null, openOrders);
  });
};
