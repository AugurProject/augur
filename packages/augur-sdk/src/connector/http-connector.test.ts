import { HTTPConnector } from "./http-connector";
import { Markets } from "../state/getter/Markets";

jest.mock("cross-fetch", () => {
  return {
    __esModule: true,
    default: () => ({
      json: () => ({
        someValue: "yo",
      }),
    }),
  };
});

describe('http-connector', () => {
  it('should use fetch to send transaction', async () => {
    const connector = new HTTPConnector("http://localhost:9003");
    const getMarkets = connector.bindTo(Markets.getMarkets);
    await getMarkets({
      universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
    });
  });
});
