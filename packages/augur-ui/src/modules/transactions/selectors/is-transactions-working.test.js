import { selectIsWorking } from "modules/transactions/selectors/is-transactions-working";
import {
  PENDING,
  SUCCESS,
  INTERRUPTED
} from "modules/transactions/constants/statuses";
import * as mockStore from "test/mockStore";
import isTransactionsWorkingAssertions from "assertions/is-transactions-working";

describe(`modules/transactions/selectors/is-transaction-working.js`, () => {
  const { state } = mockStore.default;

  const transactionDataArray = [
    state.transactionsData,
    {
      testtransaction12345: {
        id: "testtransaction12345",
        status: SUCCESS
      }
    },
    {
      testtransaction12345: {
        id: "testtransaction12345",
        status: PENDING
      }
    },
    {
      testtransaction12345: {
        id: "testtransaction12345",
        status: INTERRUPTED
      }
    }
  ];

  let actual;

  test.each([
    [transactionDataArray[0], false],
    [transactionDataArray[1], false],
    [transactionDataArray[2], false],
    [transactionDataArray[3], false]
  ])("%o is %b", (tx, expected) => {
    actual = selectIsWorking({ tx });
    expect(selectIsWorking(actual)).toBe(expected);
  });

  test("assertions/is-transactions-working", () => {
    const transactionsData = Object.assign(state.transactionsData, {
      id: "testtransaction12345",
      status: "test"
    });
    actual = selectIsWorking({ transactionsData });
    isTransactionsWorkingAssertions(actual);
    expect(actual).toBe(true);
  });
});
