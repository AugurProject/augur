import { Markets } from "@augurproject/sdk/build/state/getter/Markets";
import { SubscriptionEventNames } from "@augurproject/sdk/build//constants";
import { WebsocketConnector } from "@augurproject/sdk/build/connector/ws-connector";

jest.mock("websocket-as-promised", () => {
  return {
    __esModule: true,
    default: () => ({
      open: () => true,
      close: () => true,
      onError: {
        addListener: () => { },
      },
      onMessage: {
        addListener: () => { },
      },
      onClose: {
        addListener: () => { },
      },
      sendRequest: (message: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          if (message.method === "subscribe") {
            resolve({
              result: {
                subscription: "12345",
              },
            });
          } else if (message.method === "unsubscribe") {
            resolve(true);
          } else {
            resolve(["0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407"]);
          }
        });
      },
    }),
  };
});

test("WebsocketConnector :: Should route correctly and handle events", async (done) => {
  const connector = new WebsocketConnector("http://localhost:9001");
  await connector.connect("");

  await connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
    expect(args).toEqual([{
      highestAvailableBlockNumber: 88,
      lastSyncedBlockNumber: 88,
      blocksBehindCurrent: 0,
      percentBehindCurrent: "0.0000",
    }]);

    const getMarkets = connector.bindTo(Markets.getMarkets);
    const markets = await getMarkets({
      universe: "123456",
    });
    expect(markets).toEqual(["0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407"]);

    await connector.off(SubscriptionEventNames.NewBlock);
    expect(connector.subscriptions).toEqual({});
    connector.disconnect();
    done();
  });

  // this should invoke the callback ... if not done won't be called
  setTimeout(() => {
    connector.messageReceived({
      eventName: SubscriptionEventNames.NewBlock,
      result: [{
        highestAvailableBlockNumber: 88,
        lastSyncedBlockNumber: 88,
        blocksBehindCurrent: 0,
        percentBehindCurrent: "0.0000",
      }],
    });
  }, 0);
});
