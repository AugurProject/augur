

export default function (isTransactionsWorking) {
  assert.isDefined(isTransactionsWorking, `isTransactionsWorking isn't defined`)
  assert.isBoolean(isTransactionsWorking, `isTransactionsWorking isn't a boolean`)
}
