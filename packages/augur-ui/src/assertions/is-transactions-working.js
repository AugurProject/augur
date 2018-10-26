export default function(isTransactionsWorking) {
  expect(isTransactionsWorking).toBeDefined();
  expect(typeof isTransactionsWorking).toEqual("boolean");
}
