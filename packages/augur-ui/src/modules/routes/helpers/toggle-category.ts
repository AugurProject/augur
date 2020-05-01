import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

import { CATEGORY_PARAM_NAME } from 'modules/common/constants';

const toggleCategory = (category, location, history) => () => {
  let searchParams = parseQuery(location.search);

  if (
    searchParams[CATEGORY_PARAM_NAME] == null ||
    !searchParams[CATEGORY_PARAM_NAME].length ||
    (searchParams[CATEGORY_PARAM_NAME] &&
      searchParams[CATEGORY_PARAM_NAME] !== category && category)
  ) {
    searchParams[CATEGORY_PARAM_NAME] = category.split(',');
    searchParams = makeQuery(searchParams);

    return history.push({
      ...location,
      search: searchParams,
    });
  }
};

export default toggleCategory;
