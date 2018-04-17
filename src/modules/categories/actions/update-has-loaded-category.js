export const UPDATE_HAS_LOADED_CATEGORY = 'UPDATE_HAS_LOADED_CATEGORY'

export function updateHasLoadedCategory(hasLoadedCategory) {
  return ({ type: UPDATE_HAS_LOADED_CATEGORY, hasLoadedCategory })
}
