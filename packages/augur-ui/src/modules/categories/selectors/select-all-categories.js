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

<<<<<<< HEAD
const selectAllCategoriesSelector = () =>
  createSelector(selectMarketsDataState, process);

export const selectAllCategories = selectAllCategoriesSelector();
=======
export const selectAllCategories = createSelector(
  selectCategoriesState,
  process
);
>>>>>>> 8d5e9bad026ab4c888953d898a80e161928a1298
