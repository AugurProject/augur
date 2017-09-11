import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection';
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadMarketsFromAugurNode = (branchID, callback = logError) => (dispatch, getState) => {
  const { env } = getState();
  loadDataFromAugurNode(env.augurNodeURL, 'getMarketsInfo', { branchID, active: true, sort: 'most_volume' }, (err, marketsData) => {
    if (err) return callback(err);
    if (marketsData == null) {
      dispatch(updateAugurNodeConnectionStatus(false));
      dispatch(updateHasLoadedMarkets(false));
      callback('loadMarketsFromAugurNode: no markets data returned');
    } else if (isObject(marketsData) && Object.keys(marketsData).length) {
      dispatch(updateMarketsData(marketsData));
      callback(null, marketsData);
    }
  });
};

export default loadMarketsFromAugurNode;
