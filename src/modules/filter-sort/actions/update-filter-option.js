export const UPDATE_FILTER_OPTION = "UPDATE_FILTER_OPTION";

export function updateFilterOption(filterOption) {
  return {
    type: UPDATE_FILTER_OPTION,
    data: filterOption
  };
}
