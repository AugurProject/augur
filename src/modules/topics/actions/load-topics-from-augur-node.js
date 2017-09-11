import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection';
import { clearTopics, updateTopics } from 'modules/topics/actions/update-topics';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadTopicsFromAugurNode = (branchID, callback = logError) => (dispatch, getState) => {
  const { env } = getState();
  loadDataFromAugurNode(env.augurNodeURL, 'getTopicsInfo', { branchID, sort: 'most_popular' }, (err, topicsData) => {
    if (err) return callback(err);
    dispatch(clearTopics());
    if (topicsData == null) {
      dispatch(updateAugurNodeConnectionStatus(false));
      callback('loadTopicsFromAugurNode: no topics data returned');
    } else if (isObject(topicsData) && Object.keys(topicsData).length) {
      dispatch(updateTopics(topicsData));
      callback(null, topicsData);
    }
  });
};

export default loadTopicsFromAugurNode;
