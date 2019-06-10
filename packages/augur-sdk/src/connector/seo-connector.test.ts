import { SEOConnector } from "./seo-connector";
import { Markets } from "../state/getter/Markets";
import { SubscriptionEventNames } from "../constants";

describe("seo-connector", () => {
  it("Should route the message correctly and return a response", async (done) => {
    const connector = new SEOConnector();
    await connector.connect();
    connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
      console.log("Event handler called");
      console.log(args);

      const getMarkets = connector.bindTo(Markets.getMarkets);
      await getMarkets({
        universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
      });

      connector.disconnect();
      done();
    });
  });
});
