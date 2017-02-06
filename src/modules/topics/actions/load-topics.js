import { augur } from '../../../services/augurjs';
import { clearTopics, updateTopics } from '../../topics/actions/update-topics';

export const loadTopics = (branchID, cb) => (dispatch) => {
  const callback = cb || (e => console.log('loadTopics:', e));
  let firstChunkLoaded;
  augur.getTagsInfoChunked(branchID, 0, null, null, (tagsInfoChunk) => {
    console.log('tags info chunk:', tagsInfoChunk);
    if (!firstChunkLoaded) {
      firstChunkLoaded = true;
      console.log('first chunk, clearing tags...');
      dispatch(clearTopics());
    }
    dispatch(updateTopics(tagsInfoChunk));
  }, callback);
};
