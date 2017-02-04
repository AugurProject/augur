import { augur } from '../../../services/augurjs';
import { UPDATE_TOPICS, CLEAR_TOPICS } from '../../topics/actions/update-topics';

export default function (topics = [], action) {
  switch (action.type) {
    case UPDATE_TOPICS: {
      return topics.concat(action.topics).sort(augur.sortTagsInfo);
    }
    case CLEAR_TOPICS:
      return [];
    default:
      return topics;
  }
}
