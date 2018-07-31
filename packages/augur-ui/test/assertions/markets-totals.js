

export default function (marketsTotals) {
  assert.isDefined(marketsTotals, `marketsTotals isn't defined`)
  assert.isObject(marketsTotals, `marketsTotals isn't an object`)

  checkDefinedAndNumber(marketsTotals.numAll, `numAll`)
  checkDefinedAndNumber(marketsTotals.numFavorites, `numFavorites`)
  checkDefinedAndNumber(marketsTotals.numFiltered, `numFiltered`)
  checkDefinedAndNumber(marketsTotals.numPendingReports, `numPendingReports`)
  checkDefinedAndNumber(marketsTotals.numUnpaginated, `numUnpaginated`)
}


function checkDefinedAndNumber(obj, name) {
  assert.isDefined(obj, `marketsTotals.${name} isn't defined`)
  assert.isNumber(obj, `marketsTotals.${name} isn't a number`)
}
