import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { parallel } from 'async';
import { updateAccountBidsAsksData, updateAccountCancelsData } from 'modules/my-positions/actions/update-account-trades-data';
import logError from 'utils/log-error';

export const loadBidsAsksHistory = (options, callback = logError) => (dispatch, getState) => {
  const { branch, env, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  const query = { ...options, account: loginAccount.address, branch: branch.id };
  // TODO should these be combined into a single augur-node lookup?
  parallel([
    next => loadDataFromAugurNode(env.augurNodeURL, 'getCreateOrderHistory', query, (err, makeOrderHistory) => {
      if (err) return next(err);
      if (makeOrderHistory == null) return next(`no make order history data received from ${env.augurNodeURL}`);
      dispatch(updateAccountBidsAsksData(makeOrderHistory, options.market));
      next(null, makeOrderHistory);
    }),
    next => loadDataFromAugurNode(env.augurNodeURL, 'getCancelOrderHistory', query, (err, cancelOrderHistory) => {
      if (err) return next(err);
      if (cancelOrderHistory == null) return next(`no cancel order history data received from ${env.augurNodeURL}`);
      dispatch(updateAccountCancelsData(cancelOrderHistory, options.market));
      next(null, cancelOrderHistory);
    })
  ], callback);
};
