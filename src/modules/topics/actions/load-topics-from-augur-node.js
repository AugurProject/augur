import { updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection';
import { clearTopics, updateTopics } from 'modules/topics/actions/update-topics';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadTopicsFromAugurNode = (branchID, callback = logError) => (dispatch, getState) => {
  const { env } = getState();
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      dispatch(clearTopics());
      const topicsData = JSON.parse(xhttp.responseText);
      if (topicsData == null) {
        dispatch(updateAugurNodeConnectionStatus(false));
        callback('loadTopicsFromAugurNode: no topics data returned');
      } else if (isObject(topicsData) && Object.keys(topicsData).length) {
        dispatch(updateTopics(topicsData));
        callback(null, topicsData);
      }
    }
  };
  xhttp.open('GET', `${env.augurNodeURL}/getTopicsInfo?&branchID=${branchID}&sort=most_popular`, true);
  xhttp.send();
};

export default loadTopicsFromAugurNode;
