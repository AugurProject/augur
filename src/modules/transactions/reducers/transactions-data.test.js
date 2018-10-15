import testState from "test/testState";
import reducer from "modules/transactions/reducers/transactions-data";

describe(`modules/transactions/reducers/transactions-data.js`, () => {
  const state = Object.assign({}, testState);

  const actions = [
    {
      type: "UPDATE_TRANSACTIONS_DATA",
      data: {
        updatedTransactionsData: {
          test: {
            example: "example"
          },
          example: {
            test: "test"
          }
        }
      }
    },
    {
      type: "DELETE_TRANSACTION",
      data: { transactionId: "transaction2" }
    },
    {
      type: "CLEAR_LOGIN_ACCOUNT"
    }
  ];

  const actualArray = [
    {
      ...state.transactionsData,
      test: {
        example: "example",
        id: "test"
      },
      example: {
        test: "test",
        id: "example"
      }
    },
    {
      transaction1: {
        data: "data1",
        id: "transaction1"
      }
    },
    {}
  ];

  const transactionsDataArray = [
    state.transactionsData,
    {
      transaction1: {
        data: "data1",
        id: "transaction1"
      },
      transaction2: {
        data: "data2",
        id: "transaction2"
      }
    }
  ];

  const messages = [
    "updated transactions data in state",
    "deleted transaction",
    "cleared transactions on clear login account"
  ];

  describe.each([
    [messages[0], actions[0], transactionsDataArray[0], actualArray[0]],
    [messages[1], actions[1], transactionsDataArray[1], actualArray[1]],
    [messages[2], actions[2], transactionsDataArray[1], actualArray[2]]
  ])(
    "updated transactions data in state",
    (msg, action, transactionsData, actual) => {
      test(msg, () => {
        state.transactionsData = transactionsData;
        expect(reducer(state.transactionsData, action)).toEqual(actual);
      });
    }
  );
});
