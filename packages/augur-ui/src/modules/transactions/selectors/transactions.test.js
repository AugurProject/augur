import { selectTransactions } from "src/modules/transactions/selectors/transactions";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import {
  SUCCESS,
  FAILED,
  PENDING,
  SUBMITTED,
  INTERRUPTED
} from "modules/transactions/constants/statuses";

import { formatShares, formatEther, formatRep } from "utils/format-number";
import { formatDate } from "utils/format-date";

describe(`modules/transactions/selectors/transactions.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store;

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("returned the expected array", () => {
    const state = {
      transactionsData: {
        "0xTRANS0": {
          data: {
            id: "0xMARKETID",
            outcomeName: "test outcome"
          },
          status: INTERRUPTED,
          id: "0xTRANS0",
          description: "test description",
          timestamp: formatDate(new Date(2017, 1, 3)),
          numShares: formatShares(10),
          gas: "1",
          etherWithoutGas: "2",
          sharesChange: "4",
          repChange: "5"
        },
        "0xTRANS1": {
          data: {
            id: "0xMARKETID",
            outcomeName: "test outcome"
          },
          status: SUBMITTED,
          id: "0xTRANS1",
          description: "test description",
          timestamp: formatDate(new Date(2017, 1, 5)),
          tradeGroupId: "0xTRADEGROUP0",
          numShares: formatShares(10),
          gas: "1",
          etherWithoutGas: "2",
          sharesChange: "4",
          repChange: "5"
        },
        "0xTRANS2": {
          data: {
            id: "0xMARKETID",
            outcomeName: "test outcome"
          },
          status: PENDING,
          id: "0xTRANS2",
          description: "test description",
          timestamp: formatDate(new Date(2017, 1, 9)),
          numShares: formatShares(10),
          gas: "1",
          etherWithoutGas: "2",
          sharesChange: "4",
          repChange: "5"
        },
        "0xTRANS3": {
          data: {
            id: "0xMARKETID",
            description: "test description",
            outcomeName: "test outcome"
          },
          status: SUCCESS,
          id: "0xTRANS3",
          timestamp: formatDate(new Date(2017, 1, 4)),
          tradeGroupId: "0xTRADEGROUP1",
          numShares: formatShares(10),
          gas: "1",
          etherWithoutGas: "2",
          sharesChange: "4",
          repChange: "5"
        },
        "0xTRANS4": {
          data: {
            id: "0xMARKETID",
            outcomeName: "test outcome"
          },
          status: FAILED,
          description: "test description",
          id: "0xTRANS4",
          timestamp: formatDate(new Date(2017, 1, 7)),
          tradeGroupId: "0xTRADEGROUP1",
          numShares: formatShares(10),
          gas: "1",
          etherWithoutGas: "2",
          sharesChange: "4",
          repChange: "5"
        },
        "0xTRANS5": {
          data: {
            id: "0xMARKETID",
            outcomeName: "test outcome"
          },
          status: SUBMITTED,
          description: "test description",
          id: "0xTRANS5",
          timestamp: formatDate(new Date(2017, 1, 6)),
          tradeGroupId: "0xTRADEGROUP1",
          numShares: formatShares(10),
          gas: "1",
          etherWithoutGas: "2",
          sharesChange: "4",
          repChange: "5"
        }
      }
    };

    const expected = [
      {
        data: {
          id: "0xMARKETID",
          outcomeName: "test outcome"
        },
        status: PENDING,
        id: "0xTRANS2",
        description: "test description",
        timestamp: formatDate(new Date(2017, 1, 9)),
        numShares: formatShares(10),
        gas: formatEther(1),
        etherWithoutGas: "2",
        sharesChange: "4",
        repChange: "5",
        ethTokens: formatEther(2),
        shares: formatShares(4),
        rep: formatRep(5)
      },
      {
        data: {
          id: "0xMARKETID",
          outcomeName: "test outcome"
        },
        status: SUBMITTED,
        id: "0xTRANS1",
        description: "test description",
        timestamp: formatDate(new Date(2017, 1, 5)),
        tradeGroupId: "0xTRADEGROUP0",
        numShares: formatShares(10),
        gas: formatEther(1),
        etherWithoutGas: "2",
        sharesChange: "4",
        repChange: "5",
        ethTokens: formatEther(2),
        shares: formatShares(4),
        rep: formatRep(5)
      },
      {
        status: "failed",
        message: "Sell 30 shares of test outcome",
        description: "test description",
        timestamp: formatDate(new Date(2017, 1, 4)),
        transactions: [
          {
            data: {
              id: "0xMARKETID",
              outcomeName: "test outcome"
            },
            status: FAILED,
            id: "0xTRANS4",
            description: "test description",
            timestamp: formatDate(new Date(2017, 1, 7)),
            tradeGroupId: "0xTRADEGROUP1",
            numShares: formatShares(10),
            gas: formatEther(1),
            etherWithoutGas: "2",
            sharesChange: "4",
            repChange: "5",
            ethTokens: formatEther(2),
            shares: formatShares(4),
            rep: formatRep(5)
          },
          {
            data: {
              id: "0xMARKETID",
              outcomeName: "test outcome"
            },
            status: SUBMITTED,
            id: "0xTRANS5",
            description: "test description",
            timestamp: formatDate(new Date(2017, 1, 6)),
            tradeGroupId: "0xTRADEGROUP1",
            numShares: formatShares(10),
            gas: formatEther(1),
            etherWithoutGas: "2",
            sharesChange: "4",
            repChange: "5",
            ethTokens: formatEther(2),
            shares: formatShares(4),
            rep: formatRep(5)
          },
          {
            data: {
              id: "0xMARKETID",
              outcomeName: "test outcome",
              description: "test description"
            },
            status: SUCCESS,
            id: "0xTRANS3",
            timestamp: formatDate(new Date(2017, 1, 4)),
            tradeGroupId: "0xTRADEGROUP1",
            numShares: formatShares(10),
            gas: formatEther(1),
            etherWithoutGas: "2",
            sharesChange: "4",
            repChange: "5",
            ethTokens: formatEther(2),
            shares: formatShares(4),
            rep: formatRep(5)
          }
        ]
      },
      {
        data: {
          id: "0xMARKETID",
          outcomeName: "test outcome"
        },
        status: INTERRUPTED,
        id: "0xTRANS0",
        description: "test description",
        timestamp: formatDate(new Date(2017, 1, 3)),
        numShares: formatShares(10),
        gas: formatEther(1),
        etherWithoutGas: "2",
        sharesChange: "4",
        repChange: "5",
        ethTokens: formatEther(2),
        shares: formatShares(4),
        rep: formatRep(5)
      }
    ];

    store = mockStore(state);
    const actual = selectTransactions(store.getState());

    expect(actual).toEqual(expected);
  });
});
