import { UPDATE_URL } from 'modules/link/actions/update-url';

export default function (url = '/', action) {
  switch (action.type) {
    case UPDATE_URL:
      return action.parsedURL.url;

    default:
      return url;
  }
}
