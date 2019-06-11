import { Markets } from "@augurproject/sdk/build/state/getter/Markets";
import { SubscriptionEventNames } from "@augurproject/sdk/build//constants";
import { WebsocketConnector } from "@augurproject/sdk/build/connector/ws-connector";

jest.mock("websocket-as-promised", () => {
  return {
    __esModule: true,
    default: () => ({
      open: () => true,
      sendRequest: () => {
        return ["0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407"];
      },
    }),
  };
});

describe("ws-connector", () => {
  it("should use sendMessage to send transaction", async () => {
    const connector = new WebsocketConnector("http://localhost:9001");
    connector.connect();
    const getMarkets = connector.bindTo(Markets.getMarkets);
    const markets = await getMarkets({
      universe: "0xa223fFddee6e9eB50513Be1B3C5aE9159c7B3407",
    });
  });
});
