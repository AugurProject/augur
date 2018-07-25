export const UPDATE_HAS_LOADED_SEARCH = 'UPDATE_HAS_LOADED_SEARCH'

export function updateHasLoadedCategory(hasLoadedSearch) {
  return ({ type: UPDATE_HAS_LOADED_SEARCH, hasLoadedSearch })
}
