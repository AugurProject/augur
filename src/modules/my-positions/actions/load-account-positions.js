import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data';
import logError from 'utils/log-error';

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { branch, env, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  const query = { ...options, account: loginAccount.address, branch: branch.id };
  loadDataFromAugurNode(env.augurNodeURL, 'getShareBalances', query, (err, shareBalances) => {
    if (err) return callback(err);
    if (shareBalances == null) return callback(`no account positions data received from ${env.augurNodeURL}`);
    dispatch(updateAccountPositionsData(shareBalances, options.market));
    callback(null, shareBalances);
  });
};
