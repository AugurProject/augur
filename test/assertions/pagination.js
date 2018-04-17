

export default function (pagination) {
  assert.isDefined(pagination, `pagination isn't defined`)
  assert.isObject(pagination, `pagination isn't an object`)

  assert.isDefined(pagination.numPerPage, `pagination.numPerPage isn't defined`)
  assert.isNumber(pagination.numPerPage, `pagination.numPerPage isn't a Number`)

  assert.isDefined(pagination.numPages, `pagination.numPages isn't defined`)
  assert.isNumber(pagination.numPages, `pagination.numPages isn't a Number`)

  assert.isDefined(pagination.selectedPageNum, `pagination.selectedPageNum isn't defined`)
  assert.isNumber(pagination.selectedPageNum, `pagination.selectedPageNum isn't a Number`)

  assert.isDefined(pagination.nextPageNum, `pagination.nextPageNum isn't defined`)
  assert.isNumber(pagination.nextPageNum, `pagination.nextPageNum isn't a Number`)

  assert.isDefined(pagination.startItemNum, `pagination.startItemNum isn't defined`)
  assert.isNumber(pagination.startItemNum, `pagination.startItemNum isn't a Number`)

  assert.isDefined(pagination.endItemNum, `pagination.endItemNum isn't defined`)
  assert.isNumber(pagination.endItemNum, `pagination.endItemNum isn't a Number`)

  assert.isDefined(pagination.numUnpaginated, `pagination.numUnpaginated isn't defined`)
  assert.isNumber(pagination.numUnpaginated, `pagination.numUnpaginated isn't a Number`)

  assert.isDefined(pagination.nextItemNum, `pagination.nextItemNum isn't defined`)
  assert.isNumber(pagination.nextItemNum, `pagination.nextItemNum isn't a Number`)

  assert.isDefined(pagination.onUpdateSelectedPageNum, `pagination.onUpdateSelectedPageNum isn't defined`)
  assert.isFunction(pagination.onUpdateSelectedPageNum, `pagination.onUpdateSelectedPageNum isn't a Function`)

  assert.isDefined(pagination.previousPageLink, `pagination.previousPageLink isn't defined`)
  assert.isObject(pagination.previousPageLink, `pagination.previousPageLink isn't an object`)

  assert.isDefined(pagination.nextPageLink, `pagination.nextPageLink isn't defined`)
  assert.isObject(pagination.nextPageLink, `pagination.nextPageLink isn't an object`)
}
