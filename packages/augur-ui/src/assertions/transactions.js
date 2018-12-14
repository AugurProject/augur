export default function(transactions) {
  expect(transactions).toBeDefined();
  expect(Array.isArray(transactions)).toBe(true);

  transactions.forEach(() => assertTransaction(transactions[0]));
}

function assertTransaction(transaction) {
  expect(typeof transaction.id).toBe("string");
  expect(typeof transaction.type).toBe("string");
  expect(typeof transaction.status).toBe("string");
  if (transaction.data) {
    expect(typeof transaction).toBe("object");
  }
}
