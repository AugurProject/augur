import { updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection';
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadMarketsFromAugurNode = (branchID, callback = logError) => (dispatch, getState) => {
  const { env } = getState();
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      const marketsData = JSON.parse(xhttp.responseText);
      if (marketsData == null) {
        dispatch(updateHasLoadedMarkets(false));
        dispatch(updateAugurNodeConnectionStatus(false));
        callback('loadMarketsFromAugurNode: no markets data returned');
      } else if (isObject(marketsData) && Object.keys(marketsData).length) {
        dispatch(updateMarketsData(marketsData));
        callback(null, marketsData);
      }
    }
  };
  xhttp.open('GET', `${env.augurNodeURL}/getMarketsInfo?&branchID=${branchID}&active=true&sort=most_volume`, true);
  xhttp.send();
};

export default loadMarketsFromAugurNode;
