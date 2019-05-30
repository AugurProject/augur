//import { WebWorkerConnector } from "../connector/ww-connector";
import { WebsocketConnector } from "../connector/ws-connector";
import { Markets } from "./api/Markets";
import { SubscriptionEventNames } from "../constants";

console.log("Starting web worker");

(async function() {
  try {
    const connector = new WebsocketConnector("ws://localhost:9001");
    console.log("connecting");
    await connector.connect();
    console.log("connected");

    connector.on(SubscriptionEventNames.CompleteSetsPurchased, (data: any): void => {
      console.log("Callback for subscribe");
      console.log(data);
      console.log("done");
      connector.off(SubscriptionEventNames.CompleteSetsPurchased);
    });

    // setTimeout(async () => {
    //   console.log("Querying");
    //   const getMarkets = connector.bindTo(Markets.getMarkets);
    //   console.log(await getMarkets({
    //     universe: "0x02149d40d255fceac54a3ee3899807b0539bad60",
    //   }));
    // }, 10000);
    // console.log("Done");
  } catch (e) {
    console.log(e);
  }
})();
