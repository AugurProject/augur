

export default function (searchSort) {
  assert.isDefined(searchSort, `searchSort isn't defined`)
  assert.isObject(searchSort, `searchSort isn't an object`)
  assert.isDefined(searchSort.onChangeSort, `searchSort.onChangeSort isn't defined`)
  assert.isFunction(searchSort.onChangeSort, `searchSort.onChangeSort isn't a function`)
  assertionSelectedSort(searchSort.selectedSort)
  assertionSortOptions(searchSort.sortOptions)
}

function assertionSelectedSort(actual) {
  assert.isDefined(actual, `selectedSort isn't defined`)
  assert.isObject(actual, `selectedSort isn't an Object`)
  assert.isDefined(actual.prop, `selectedSort.prop isn't defined`)
  assert.isString(actual.prop, `selectedSort.prop isn't a string`)
  assert.isDefined(actual.isDesc, `selectedSort.isDesc isn't defined`)
  assert.isBoolean(actual.isDesc, `selectedSort.isDesc isn't a boolean`)
}

function assertionSortOptions(actual) {
  assert.isDefined(actual, `sortOptions isn't defined`)
  assert.isArray(actual, `sortOptions isn't an array`)

  assert.isDefined(actual[0], `sortOptions[0] doesn't exist`)
  assert.isObject(actual[0], `sortOptions[0] isn't an object`)
  assert.isDefined(actual[0].label, `sortOptions[0].label isn't defined`)
  assert.isString(actual[0].label, `sortOptions[0].label isn't a string`)
  assert.isDefined(actual[0].value, `sortOptions[0].value isn't defined`)
  assert.isString(actual[0].value, `sortOptions[0].value isn't a string`)
}

