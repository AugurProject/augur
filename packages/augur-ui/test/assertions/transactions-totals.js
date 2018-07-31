

export default function (transactionsTotals) {
  assert.isObject(transactionsTotals)

  assert.isString(transactionsTotals.title)
  assert.isString(transactionsTotals.shortTitle)

  assert.isNumber(transactionsTotals.numWorking)
  assert.isNumber(transactionsTotals.numPending)
  assert.isNumber(transactionsTotals.numComplete)
  assert.isNumber(transactionsTotals.numWorkingAndPending)
  assert.isNumber(transactionsTotals.numTotal)
}
