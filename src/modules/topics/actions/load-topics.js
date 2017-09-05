import { augur } from 'services/augurjs';
import { clearTopics, updateTopics } from 'modules/topics/actions/update-topics';
import loadTopicsFromAugurNode from 'modules/topics/actions/load-topics-from-augur-node';
import logError from 'utils/log-error';

export const loadTopics = (branchID, callback = logError) => (dispatch, getState) => {
  const { connection } = getState();
  if (connection.isConnectedToAugurNode) {
    dispatch(loadTopicsFromAugurNode(branchID, callback));
  }
  let firstChunkLoaded;
  augur.topics.getTopicsInfoChunked(branchID, 0, null, null, (topicsInfoChunk) => {
    console.log('topics info chunk:', topicsInfoChunk);
    if (!firstChunkLoaded) {
      firstChunkLoaded = true;
      console.log('first chunk, clearing topics...');
      dispatch(clearTopics());
    }
    dispatch(updateTopics(topicsInfoChunk));
  }, callback);
};
