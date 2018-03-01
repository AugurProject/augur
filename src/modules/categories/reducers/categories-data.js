import { UPDATE_CATEGORIES, CLEAR_CATEGORIES, UPDATE_CATEGORY_POPULARITY } from 'modules/categories/actions/update-categories'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (categories = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_CATEGORIES:
      return {
        ...categories,
        ...action.categories,
      }
    case UPDATE_CATEGORY_POPULARITY:
      return {
        ...categories,
        [action.category]: !categories[action.category] ? action.amount : categories[action.category] + action.amount,
      }
    case RESET_STATE:
    case CLEAR_CATEGORIES:
      return DEFAULT_STATE
    default:
      return categories
  }
}
