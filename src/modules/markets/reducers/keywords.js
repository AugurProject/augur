import { UPDATE_KEYWORDS } from 'modules/markets/actions/update-keywords';
import { UPDATE_URL } from 'modules/link/actions/update-url';
import { SEARCH_PARAM_NAME } from 'modules/app/constants/param-names';

export default function (keywords = '', action) {
  let params;
  switch (action.type) {
    case UPDATE_KEYWORDS:
      return action.keywords;
    case UPDATE_URL:
      params = action.parsedURL.searchParams;
      if (params[SEARCH_PARAM_NAME] != null && params[SEARCH_PARAM_NAME] !== '') {
        return params[SEARCH_PARAM_NAME];
      }
      return '';
    default:
      return keywords;
  }
}
