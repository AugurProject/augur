import { createSelector } from 'reselect'
import { selectCategoriesState } from 'src/select-state'

export const selectCategories = createSelector(
  selectCategoriesState,
  (categories) => {
    const selectedCategories = []
    Object.keys(categories || {})
      .forEach((category) => {
        // if the name of the category is falsey don't include it.
        if (categories[category] && !!categories[category].category) {
          selectedCategories.push({
            popularity: categories[category].popularity,
            category: categories[category].category,
          })
        }
      })
    return selectedCategories.sort(popularityDifference)
  },
)

const popularityDifference = (category1, category2) => category2.popularity - category1.popularity
