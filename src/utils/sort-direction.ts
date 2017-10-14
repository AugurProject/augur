export function sortDirection(isSortDescending: boolean|null|undefined, defaultSortDirection: string): string {
  let sortDirection;
  if (isSortDescending == null) {
    sortDirection = defaultSortDirection;
  } else if (isSortDescending === true) {
    sortDirection = "desc";
  } else {
    sortDirection = "asc";
  }
  return sortDirection;
}
