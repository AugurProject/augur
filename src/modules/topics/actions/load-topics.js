import { augur } from '../../../services/augurjs';
import { clearTopics, updateTopics } from '../../topics/actions/update-topics';

export const loadTopics = (branchID, cb) => (dispatch) => {
  const callback = cb || (e => e && console.error('loadTopics:', e));
  let firstChunkLoaded;
  augur.getTopicsInfoChunked(branchID, 0, null, null, (topicsInfoChunk) => {
    console.log('topics info chunk:', topicsInfoChunk);
    if (!firstChunkLoaded) {
      firstChunkLoaded = true;
      console.log('first chunk, clearing topics...');
      dispatch(clearTopics());
    }
    dispatch(updateTopics(topicsInfoChunk));
  }, callback);
};
