import { UPDATE_URL } from 'modules/link/actions/update-url';

import getValue from 'utils/get-value';

export default function (topic = null, action) {
  switch (action.type) {
    case UPDATE_URL: {
      console.log('TOPIC -- UPDATE_URL -- ', action);
      const paramTopic = getValue(action, 'parsedURL.searchParams.topic');
      if (paramTopic) {
        console.log('paramTopic -- ', paramTopic);
        return paramTopic;
      }
      return topic;
    }
    default:
      return topic;
  }
}
