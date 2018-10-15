export default function(transactionsTotals) {
  expect(typeof transactionsTotals).toEqual("object");

  expect(typeof transactionsTotals.title).toEqual("string");
  expect(typeof transactionsTotals.shortTitle).toEqual("string");

  expect(typeof transactionsTotals.numWorking).toEqual("number");
  expect(typeof transactionsTotals.numPending).toEqual("number");
  expect(typeof transactionsTotals.numComplete).toEqual("number");
  expect(typeof transactionsTotals.numWorkingAndPending).toEqual("number");
  expect(typeof transactionsTotals.numTotal).toEqual("number");
}
