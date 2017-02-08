import { UPDATE_TOPICS, CLEAR_TOPICS, INCREASE_TOPIC_POPULARITY } from '../../topics/actions/update-topics';

export default function (topics = {}, action) {
  switch (action.type) {
    case UPDATE_TOPICS:
      return {
        ...topics,
        ...action.topics
      };
    case INCREASE_TOPIC_POPULARITY:
      return {
        ...topics,
        [action.topic]: !topics[action.topic] ? action.amount : topics[action.topic] + action.amount
      };
    case CLEAR_TOPICS:
      return {};
    default:
      return topics;
  }
}
