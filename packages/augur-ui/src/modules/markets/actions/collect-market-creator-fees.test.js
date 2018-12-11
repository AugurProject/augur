import speedomatic from "speedomatic";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { augur } from "services/augurjs";

describe("modules/markets/actions/market-creator-fees-management.js", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  jest.mock("utils/log-error");

  describe("collectMarketCreatorFees", () => {
    const {
      collectMarketCreatorFees
    } = require("modules/markets/actions/market-creator-fees-management");

    const MailboxAddresses = ["0xmailbox01", "0xmailbox02"];
    const MarketIds = ["0xmyMarket01", "0xmyMarket02"];

    augur.api = jest.fn(() => {});
    augur.api.Market = jest.fn(() => {});
    augur.api.Market.getMarketCreatorMailbox = jest.fn(() => {});
    augur.api.Market.getMarketCreatorMailbox.mockImplementation(
      (params, cb) => {
        if (params.tx.to === MarketIds[0]) {
          cb(null, MailboxAddresses[0]);
        } else {
          cb(null, MailboxAddresses[1]);
        }
      }
    );
    augur.api.Cash = jest.fn(() => {});
    augur.api.Cash.balanceOf = jest.fn(() => {});
    augur.api.Cash.balanceOf.mockImplementation((params, cb) => {
      if (params._owner === MailboxAddresses[0]) {
        cb(null, speedomatic.fix(20, "string"));
      } else {
        cb(null, 0);
      }
    });
    augur.rpc.eth = jest.fn(() => {});
    augur.rpc.eth.getBalance = jest.fn(() => {});
    augur.rpc.eth.getBalance.mockImplementation((params, cb) => {
      if (params[0] === MailboxAddresses[0]) {
        cb(null, speedomatic.fix(10.5, "string"));
      } else {
        cb(null, 0);
      }
    });
    augur.api.Mailbox = jest.fn(() => {});
    augur.api.Mailbox.withdrawEther = jest.fn(() => {});
    augur.api.Mailbox.withdrawEther.mockImplementation(params => {
      params.onSuccess({ hash: "hashValue" });
    });

    test(`Shouldn't fire a withdrawEther or updateMarketsData if we have 0 ETH to collect from a market.`, () => {
      const state = {
        loginAccount: {
          address: "ADDRESS"
        }
      };
      const store = mockStore(state);
      store.dispatch(
        collectMarketCreatorFees(
          false,
          MarketIds[1],
          (err, amountOfEthToBeCollected) => {
            expect(err).toBeNull();
            expect(amountOfEthToBeCollected).toEqual("0");
          }
        )
      );

      const actual = store.getActions();

      const expected = [];

      expect(actual).toEqual(expected);
    });

    test(`Should fire a withdrawEther and updateMarketsData if we have ETH to collect from a market.`, () => {
      const state = {
        loginAccount: {
          address: "ADDRESS"
        },
        blockchain: {
          currentAugurTimestamp: 1521665
        }
      };
      const store = mockStore(state);
      store.dispatch(
        collectMarketCreatorFees(
          false,
          MarketIds[0],
          (err, amountOfEthToBeCollected) => {
            expect(err).toBeNull();
            expect(amountOfEthToBeCollected).toBe("30.5");
          }
        )
      );

      const actual = store.getActions();

      const expected = [
        {
          type: "UPDATE_MARKET_LOADING",
          data: {
            marketLoadingState: {
              "0xmyMarket01": "MARKET_INFO_LOADING"
            }
          }
        },
        {
          type: "REMOVE_MARKET_LOADING",
          data: {
            marketLoadingState: "0xmyMarket01"
          }
        },
        {
          type: "UPDATE_MARKETS_DATA",
          data: {
            marketsData: {
              "0xmyMarket01": {
                id: "0xmyMarket01",
                unclaimedCreatorFees: "30.5"
              }
            }
          }
        },
        {
          type: "UPDATE_NOTIFICATION",
          data: {
            id: "hashValue",
            notification: {
              id: "hashValue",
              status: "Confirmed",
              timestamp: 1521665
            }
          }
        }
      ];
      expect(actual).toEqual(expected);
    });
  });
});
