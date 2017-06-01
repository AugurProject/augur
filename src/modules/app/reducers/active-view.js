import { UPDATE_URL } from 'modules/link/actions/update-url';
import { DEFAULT_VIEW } from 'modules/app/constants/views';

export default function (activeView = DEFAULT_VIEW, action) {
  switch (action.type) {
    case UPDATE_URL:
      return action.parsedURL.searchParams.page || DEFAULT_VIEW;
    default:
      return activeView;
  }
}
