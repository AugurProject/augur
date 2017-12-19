import { UPDATE_HAS_LOADED_CATEGORY } from 'modules/categories/actions/update-has-loaded-category'

export default function (hasLoadedCategory = {}, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_CATEGORY:
      return ({
        ...hasLoadedCategory,
        ...action.hasLoadedCategory
      })
    default:
      return hasLoadedCategory
  }
}
