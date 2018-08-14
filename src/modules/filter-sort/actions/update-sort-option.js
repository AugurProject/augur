export const UPDATE_SORT_OPTION = 'UPDATE_SORT_OPTION'

export function updateSortOption(sortOption) {
  return {
    type: UPDATE_SORT_OPTION,
    data: sortOption,
  }
}
