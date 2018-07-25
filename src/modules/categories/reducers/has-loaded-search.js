import { UPDATE_HAS_LOADED_SEARCH } from 'modules/categories/actions/update-has-loaded-category'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (hasLoadedSearch = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_SEARCH:
      return ({
        ...hasLoadedSearch,
        [action.hasLoadedSearch.name]: { ...action.hasLoadedSearch },
      })
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return hasLoadedSearch
  }
}
