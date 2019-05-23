import { WebsocketConnector } from "./ws-connector";
import { Markets } from "../state/api/Markets"

(async function() {
  try {
    const connector = new WebsocketConnector("http://localhost:9003");
    const getMarkets = connector.bindTo(Markets.getMarkets);
    console.log(await getMarkets({
      universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
    }));
  } catch (e) {
    console.log(e);
  }
})();
