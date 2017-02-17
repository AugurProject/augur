import { UPDATE_URL } from 'modules/link/actions/update-url';

import getValue from 'utils/get-value';

export default function (topic = null, action) {
  switch (action.type) {
    case UPDATE_URL: {
      const paramTopic = getValue(action, 'parsedURL.searchParams.topic');
      if (paramTopic) {
        return paramTopic;
      }
      return null;
    }
    default:
      return topic;
  }
}
