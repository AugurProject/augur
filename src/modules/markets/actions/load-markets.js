import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets';
import { clearMarketsData, updateMarketsData } from 'modules/markets/actions/update-markets-data';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadMarkets = (callback = logError) => (dispatch, getState) => {
  const { branch, env } = getState();
  loadDataFromAugurNode(env.augurNodeURL, 'getMarketsInfo', { branch: branch.id, active: true, sort: 'most_volume' }, (err, marketsData) => {
    if (err) return callback(err);
    if (marketsData == null) {
      dispatch(updateHasLoadedMarkets(false));
      callback(`no markets data received from ${env.augurNodeURL}`);
    } else if (isObject(marketsData) && Object.keys(marketsData).length) {
      dispatch(clearMarketsData());
      dispatch(updateMarketsData(marketsData));
      callback(null, marketsData);
    }
  });
};

export default loadMarkets;
