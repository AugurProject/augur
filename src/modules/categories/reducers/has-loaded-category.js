import { UPDATE_HAS_LOADED_CATEGORY } from 'modules/categories/actions/update-has-loaded-category'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (hasLoadedCategory = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_CATEGORY:
      return ({
        ...hasLoadedCategory,
        ...action.hasLoadedCategory,
      })
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return hasLoadedCategory
  }
}
