import {
  CATEGORY_PARAM_NAME,
  FILTER_SEARCH_PARAM,
  TAGS_PARAM_NAME
} from "modules/common-elements/constants";
import parseQuery from "src/modules/routes/helpers/parse-query";
import parseStringToArray from "src/modules/routes/helpers/parse-string-to-array";
import { QUERY_VALUE_DELIMITER } from "src/modules/routes/constants/query-value-delimiter";

export const getSelectedTagsAndCategoriesFromLocation = location => {
  // This is black magic.
  const {
    [CATEGORY_PARAM_NAME]: selectedCategoryName,
    [FILTER_SEARCH_PARAM]: keywords = undefined,
    [TAGS_PARAM_NAME]: tagsString,
    ...balanceOfSearchParams
  } = parseQuery(location.search);

  const selectedTagNames = parseStringToArray(
    decodeURIComponent(tagsString || ""),
    QUERY_VALUE_DELIMITER
  );
  return {
    selectedCategoryName,
    keywords,
    selectedTagNames,
    balanceOfSearchParams
  };
};
