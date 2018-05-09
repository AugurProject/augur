import { createSelector } from 'reselect'
import { selectMarketsDataState } from 'src/select-state'

import { compose, filter, flatten, groupBy, has, mapValues, pluck, uniq } from 'lodash/fp'

const flattenTags = compose(
  uniq,
  flatten,
  pluck('tags'),
)

const process = compose(
  mapValues(flattenTags),
  groupBy('category'),
  filter(has('category')),
  Object.values,
)

export const selectAllCategories = createSelector(
  selectMarketsDataState,
  process,
)
