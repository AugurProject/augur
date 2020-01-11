// An example how to use Augur to retrieve data
//
//
import { NetworkId } from "@augurproject/artifacts";
import { SingleThreadConnector } from "../connector";
import { SubscriptionEventName } from "../constants";
import { MarketCreated, NewBlock } from "../events";
import { SDKConfiguration, startServer } from "./create-api";


const settings = require("@augurproject/sdk/src/state/settings.json");

console.log("Starting web worker");

(async function() {
  try {
    const config: SDKConfiguration = {
      networkId: NetworkId.Kovan,
      ethereum: {
        http: settings.ethNodeURLs[4]
      },
      gnosis: {
        http: "http://localhost:8000"
      },
      syncing: {
      }
    };

    const api = await startServer(config);

    const connector = new SingleThreadConnector();
    await connector.connect(config);

    const augur = api.augur;
    augur.connector = connector;

    connector.on(
      SubscriptionEventName.MarketCreated,
      (...args: MarketCreated[]): void => {
        console.log(args);
        augur.off(SubscriptionEventName.CompleteSetsPurchased);
      });

    connector.on(
      SubscriptionEventName.NewBlock,
      (...args: NewBlock[]): void => {
        console.log(args);
      });

    const markets = await augur.getMarkets({
      universe: "0x02149d40d255fceac54a3ee3899807b0539bad60",
    });

    console.log(markets);
    console.log("Done");
  } catch (e) {
    console.log(e);
  }
})();
