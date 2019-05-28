import { WebsocketConnector } from "./ws-connector";
import { Markets } from "../state/api/Markets"

(async function() {
  try {
    const connector = new WebsocketConnector("ws://localhost:9001");
    console.log("connecting");
    await connector.connect();
    console.log("connected");

    const getMarkets = connector.bindTo(Markets.getMarkets);
    console.log(await getMarkets({
      universe: "0x02149d40d255fceac54a3ee3899807b0539bad60",
    }));
    console.log("Done");
  } catch (e) {
    console.log(e);
  }
})();
