export default function(searchSort) {
  expect(searchSort).toBeDefined();
  expect(typeof searchSort).toBe("object");
  expect(searchSort.onChangeSort).toBeDefined();
  expect(typeof searchSort.onChangeSort).toBe("function");
  assertionSelectedSort(searchSort.selectedSort);
  assertionSortOptions(searchSort.sortOptions);
}

function assertionSelectedSort(actual) {
  expect(actual).toBeDefined();
  expect(typeof actual).toBe("object");
  expect(actual.prop).toBeDefined();
  expect(typeof actual.prop).toBe("string");
  expect(actual.isDesc).toBeDefined();
  expect(typeof actual.isDesc).toBe("boolean");
}

function assertionSortOptions(actual) {
  expect(actual).toBeDefined();
  expect(Array.isArray(actual)).toBe(true);

  expect(actual[0]).toBeDefined();
  expect(typeof actual[0]).toBe("object");
  expect(actual[0].label).toBeDefined();
  expect(typeof actual[0].label).toBe("string");
  expect(actual[0].value).toBeDefined();
  expect(typeof actual[0].value).toBe("string");
}
