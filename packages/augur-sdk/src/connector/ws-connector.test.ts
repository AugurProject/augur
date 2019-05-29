import { WebsocketConnector } from "./ws-connector";
import { Markets } from "../state/api/Markets";

jest.mock("websocket-as-promised", () => {
  return {
    __esModule: true,
    default: () => ({
      open: () => true,
      sendRequest: () => ({
        someValue: "data",
      }),
    }),
  };
});

describe("ws-connector", () => {
  it("should use sendMessage to send transaction", async () => {
    const connector = new WebsocketConnector("http://localhost:9001");
    connector.connect();
    const getMarkets = connector.bindTo(Markets.getMarkets);
    await getMarkets({
      universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
    });
  });
});
