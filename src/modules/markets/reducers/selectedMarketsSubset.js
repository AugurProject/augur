import { UPDATE_URL } from 'modules/link/actions/update-url';

import getValue from 'utils/get-value';

export default function (selectedMarketsSubset = null, action) {
  switch (action.type) {
    case UPDATE_URL: {
      const paramSubset = getValue(action, 'parsedURL.searchParams.subset');
      if (paramSubset) {
        return paramSubset;
      }
      return null;
    }
    default:
      return selectedMarketsSubset;
  }
}
