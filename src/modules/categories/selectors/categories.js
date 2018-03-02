import { createSelector } from 'reselect'
import store from 'src/store'
import { selectCategoriesState } from 'src/select-state'

export default function () {
  return selectCategories(store.getState())
}

export const selectCategories = createSelector(
  selectCategoriesState,
  categories => Object.keys(categories || {})
    .map(category => ({ popularity: categories[category].popularity, category: categories[category].category }))
    .sort(popularityDifference),
)

const popularityDifference = (category1, category2) => category2.popularity - category1.popularity
