

export default function (fS) {
  assert.isDefined(fS, `'filterSort' is not defined`)
  assert.isObject(fS, `'filterSort' is not an object`)

  const sFS = fS.selectedFilterSort

  assert.isDefined(sFS, `'filterSort.selectedFilterSort is not defined`)
  assert.isObject(sFS, `'filterSort.selectFilterSort is not an object`)

  assert.isDefined(sFS.type, `'filterSort.selectedFilterSort.type' is not defined`)
  assert.isString(sFS.type, `'filterSort.selectedFilterSort.type' is not a string`)

  assert.isDefined(sFS.sort, `'filterSort.selectedFilterSort.sort' is not defined`)
  assert.isString(sFS.sort, `'filterSort.selectedFilterSort.sort' is not a string`)

  assert.isDefined(sFS.isDesc, `'filterSort.selectedFilterSort.isDesc' is not defined`)
  assert.isBoolean(sFS.isDesc, `'filterSort.selectedFilterSort.isDesc' is not a boolean`)

  assert.isDefined(fS.types, `'filterSort.types' is not defined`)
  assert.isArray(fS.types, `'filterSort.types' is not an array`)

  fS.types.forEach((type, i) => {
    assert.isDefined(type.label, `'filterSort.types[${i}].label' is not defined`)
    assert.isString(type.label, `'filterSort.types[${i}].label' is not a string`)

    assert.isDefined(type.value, `'filterSort.types[${i}].value' is not defined`)
    assert.isString(type.value, `'filterSort.types[${i}].value' is not a string`)
  })

  fS.sorts.forEach((type, i) => {
    assert.isDefined(type.label, `'filterSort.sorts[${i}].label' is not defined`)
    assert.isString(type.label, `'filterSort.sorts[${i}].label' is not a string`)

    assert.isDefined(type.value, `'filterSort.sorts[${i}].value' is not defined`)
    assert.isString(type.value, `'filterSort.sorts[${i}].value' is not a string`)
  })

  assert.isDefined(fS.order, `'filterSort.order' is not defined`)
  assert.isObject(fS.order, `'filterSort.order' is not an object`)

  assert.isDefined(fS.order.isDesc, `'filterSort.order.isDesc' is not defined`)
  assert.isBoolean(fS.order.isDesc, `'filterSort.order.isDesc' is not a boolean`)
}
