import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { clearTopics, updateTopics } from 'modules/topics/actions/update-topics';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadTopics = (callback = logError) => (dispatch, getState) => {
  const { branch, env } = getState();
  if (!branch.id) return callback(null);
  loadDataFromAugurNode(env.augurNodeURL, 'getTopicsInfo', { branch: branch.id, sort: 'most_popular' }, (err, topics) => {
    if (err) return callback(err);
    if (topics == null) {
      callback(`no topics data received from ${env.augurNodeURL}`);
    } else if (isObject(topics) && Object.keys(topics).length) {
      dispatch(clearTopics());
      dispatch(updateTopics(topics));
      callback(null, topics);
    }
  });
};

export default loadTopics;
