import {
  PENDING,
  SUCCESS,
  FAILED,
  INTERRUPTED
} from "modules/transactions/constants/statuses";
import * as transactions from "modules/transactions/selectors/transactions";

import { selectTransactionsTotalsCreator } from "src/modules/transactions/selectors/transactions-totals";

describe(`modules/transactions/selectors/transactions-totals.js`, () => {
  let selectTransactionsSpy;
  let selectTransactionsTotals;
  let actual;

  beforeEach(() => {
    selectTransactionsSpy = jest.spyOn(transactions, "selectTransactions");

    // Bind values inside createSelector now.
    selectTransactionsTotals = selectTransactionsTotalsCreator();
  });

  afterEach(() => {
    selectTransactionsSpy.mockRestore();
  });

  test("returned the transaction totals for a blank state", () => {
    selectTransactionsSpy.mockImplementation(() => []);

    actual = selectTransactionsTotals();
    expect(actual).toEqual({
      numWorking: 0,
      numPending: 0,
      numComplete: 0,
      numWorkingAndPending: 0,
      numTotal: 0,
      title: "0 Transactions",
      transactions: undefined,
      shortTitle: "0 Total"
    });
  });

  test("properly returned total info on transactions", () => {
    selectTransactionsSpy.mockImplementation(() => [
      {
        id: "fake",
        status: PENDING
      },
      {
        id: "example",
        status: SUCCESS
      },
      {
        id: "test",
        status: FAILED
      },
      {
        id: "mock",
        status: INTERRUPTED
      }
    ]);
    const actual = selectTransactionsTotals();
    expect(actual).toEqual({
      numWorking: 0,
      numPending: 1,
      numComplete: 3,
      numWorkingAndPending: 1,
      numTotal: 4,
      title: "Transaction Working",
      transactions: undefined,
      shortTitle: "1 Working"
    });
  });
});
