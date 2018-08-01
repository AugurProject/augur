export const UPDATE_HAS_LOADED_SEARCH = 'UPDATE_HAS_LOADED_SEARCH'

export function updateHasLoadedSearch(hasLoadedSearch) {
  return ({ type: UPDATE_HAS_LOADED_SEARCH, hasLoadedSearch })
}
