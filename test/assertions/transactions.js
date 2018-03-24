

export default function (transactions) {
  assert.isDefined(transactions, `transactions isn't defined`)
  assert.isArray(transactions, `transactions isn't an array`)

  transactions.forEach(transaction => assertTransaction(transactions[0]))
}

function assertTransaction(transaction) {
  assert.isString(transaction.id)
  assert.isString(transaction.type)
  assert.isString(transaction.status)
  if (transaction.data) {
    assert.isObject(transaction)
  }
}
