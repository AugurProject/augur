import { augur } from 'services/augurjs';
import { clearTopics, updateTopics } from 'modules/topics/actions/update-topics';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadTopics = (callback = logError) => (dispatch, getState) => {
  const { branch } = getState();
  if (!branch.id) return callback(null);
  augur.markets.getTopics({ universe: branch.id }, (err, topics) => {
    if (err) return callback(err);
    if (topics == null) {
      callback(`no topics data received`);
    } else if (isObject(topics) && Object.keys(topics).length) {
      dispatch(clearTopics());
      dispatch(updateTopics(topics));
      callback(null, topics);
    }
  });
};

export default loadTopics;
