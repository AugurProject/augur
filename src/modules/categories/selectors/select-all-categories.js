import { createSelector } from "reselect";
import { selectCategoriesState } from "src/select-state";

import {
  compose,
  filter,
  flatten,
  groupBy,
  has,
  mapValues,
  pluck,
  uniq,
  forEach,
  keys
} from "lodash/fp";

const flattenTags = compose(
  uniq,
  flatten,
  pluck("tags")
);

const process = compose(
  mapValues(flattenTags),
  groupBy("category"),
  forEach(value => {
    value.category = value.category.toUpperCase();
    value.tags = keys(value.tags);
    return value;
  }),
  filter(has("category")),
  Object.values
);

export const selectAllCategories = createSelector(
  selectCategoriesState,
  process
);
