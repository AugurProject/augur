import { augur } from 'services/augurjs';

import { updateHasLoadedTopic } from 'modules/topics/actions/update-has-loaded-topic';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';

export function loadMarketsByTopic(topic) {
  console.log('loadMarketsByTopic -- ', topic);

  const { branch } = require('src/selectors');

  return (dispatch) => {
    dispatch(updateHasLoadedTopic({ [topic]: true }));

    augur.findMarketsWithTopic(topic, branch.id, (err, marketIDs) => {
      if (err) {
        console.error('ERROR findMarketsWithTopic()', err);
        dispatch(updateHasLoadedTopic({ [topic]: false }));
        return;
      }
      if (!marketIDs) {
        console.warn('WARN findMarketsWithTopic()', `no market id's returned`);
        dispatch(updateHasLoadedTopic({ [topic]: false }));
        return;
      }
      if (marketIDs.length) {
        dispatch(loadMarketsInfo(marketIDs));
      }
    });
  };
}
