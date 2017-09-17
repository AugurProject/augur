import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets';
import { clearMarketsData, updateMarketsData } from 'modules/markets/actions/update-markets-data';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadMarkets = (callback = logError) => (dispatch, getState) => {
  const { branch, env } = getState();
  loadDataFromAugurNode(env.augurNodeURL, 'getMarketsInfo', { branch: branch.id, active: true, sort: 'most_volume' }, (err, marketsData) => {
    if (err) return callback(err);
    if (marketsData == null || !isObject(marketsData)) {
      dispatch(updateHasLoadedMarkets(false));
      return callback(`no markets data received from ${env.augurNodeURL}`);
    }
    if (!Object.keys(marketsData).length) return callback(null);
    dispatch(clearMarketsData());
    dispatch(updateMarketsData(marketsData));
    dispatch(updateHasLoadedMarkets(true));
    callback(null, marketsData);
  });
};

export default loadMarkets;
