import { createSelector } from "reselect";
import { selectCategoriesState } from "src/select-state";

import {
  compose,
  filter,
  flatten,
  groupBy,
  has,
  mapValues,
  map,
  uniq,
  keys,
  toUpper
} from "lodash/fp";

const flattenTags = compose(
  uniq,
  flatten,
  map("tags")
);

const process = compose(
  mapValues(flattenTags),
  groupBy("category"),
  map(value => ({
    category: toUpper(value.category),
    tags: keys(value.tags)
  })),
  filter(has("category")),
  Object.values
);

export const selectAllCategories = createSelector(
  selectCategoriesState,
  process
);
