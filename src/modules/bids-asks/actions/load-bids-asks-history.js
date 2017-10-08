// import { augur } from 'services/augurjs';
// import { parallel } from 'async';
// import { updateAccountBidsAsksData, updateAccountCancelsData } from 'modules/my-positions/actions/update-account-trades-data';
import logError from 'utils/log-error';

export const loadBidsAsksHistory = (options, callback = logError) => (dispatch, getState) => {
  // const { branch, loginAccount } = getState();
  // if (!loginAccount.address) return callback(null);
  // const query = { ...options, account: loginAccount.address, universe: branch.id };
  // TODO replace with augur.trading.orderBook.getOrderBook(query, ...)?
  // parallel([
  //   next => loadDataFromAugurNode(env.augurNodeUrl, 'getCreateOrderHistory', query, (err, makeOrderHistory) => {
  //     if (err) return next(err);
  //     if (makeOrderHistory == null) return next(`no make order history data received`);
  //     dispatch(updateAccountBidsAsksData(makeOrderHistory, options.market));
  //     next(null, makeOrderHistory);
  //   }),
  //   next => loadDataFromAugurNode(env.augurNodeUrl, 'getCancelOrderHistory', query, (err, cancelOrderHistory) => {
  //     if (err) return next(err);
  //     if (cancelOrderHistory == null) return next(`no cancel order history data received`);
  //     dispatch(updateAccountCancelsData(cancelOrderHistory, options.market));
  //     next(null, cancelOrderHistory);
  //   })
  // ], callback);
};
