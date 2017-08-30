// import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
// import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
// import { CREATE_MARKET } from 'modules/transactions/constants/types';
import logError from 'utils/log-error'

export function loadCreateMarketHistory(options, callback = logError) {
  return (dispatch, getState) => {
    // const { branch, loginAccount } = getState();
    // if (!loginAccount.address) return callback(null);
    // const query = { ...options, account: loginAccount.address, branch: branch.id };
    // TODO replace with augur.markets.getMarketsCreatedByUser?
    // loadDataFromAugurNode(env.augurNodeUrl, 'getCreateMarketHistory', query, (err, createMarketHistory) => {
    //   if (err) return callback(err);
    //   if (createMarketHistory == null) {
    //     return callback(`no create market history data received`);
    //   }
    //   if (Array.isArray(createMarketHistory) && createMarketHistory.length) {
    //     dispatch(convertLogsToTransactions(CREATE_MARKET, createMarketHistory));
    //   }
    //   callback(null, createMarketHistory);
    // });
  }
}
