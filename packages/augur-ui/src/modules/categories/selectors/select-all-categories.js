import { createSelector } from "reselect";
import { selectMarketsDataState } from "src/select-state";

import {
  compose,
  filter,
  flatten,
  groupBy,
  has,
  mapValues,
  pluck,
  uniq,
  forEach
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
    return value;
  }),
  filter(has("category")),
  Object.values
);

export const selectAllCategories = createSelector(
  selectMarketsDataState,
  process
);
