import { UPDATE_CATEGORIES, CLEAR_CATEGORIES, UPDATE_CATEGORY_POPULARITY } from 'modules/categories/actions/update-categories'

export default function (categories = {}, action) {
  switch (action.type) {
    case UPDATE_CATEGORIES:
      return {
        ...categories,
        ...action.categories
      }
    case UPDATE_CATEGORY_POPULARITY:
      return {
        ...categories,
        [action.category]: !categories[action.category] ? action.amount : categories[action.category] + action.amount
      }
    case CLEAR_CATEGORIES:
      return {}
    default:
      return categories
  }
}
