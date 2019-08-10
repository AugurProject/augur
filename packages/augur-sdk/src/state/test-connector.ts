// An example how to use Augur to retrieve data
//
//
import { Addresses } from "@augurproject/artifacts";
import { Augur } from "../Augur";
import { ContractDependenciesGnosis } from "contract-dependencies-gnosis";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { MarketCreated, NewBlock } from "../events";
import { SubscriptionEventName } from "../constants";
import { SEOConnector } from "../connector/seo-connector";
import { GnosisRelayAPI } from "@augurproject/gnosis-relay-api";


const settings = require("@augurproject/sdk/src/state/settings.json");

console.log("Starting web worker");

(async function() {
  try {
    const connector = new SEOConnector();
    const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
    const gnosisRelay = new GnosisRelayAPI("http://localhost:8000");
    const contractDependencies = new ContractDependenciesGnosis(ethersProvider, gnosisRelay, undefined, undefined, undefined, undefined, settings.testAccounts[0]);
    const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[4], connector);
    await augur.connect("");

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
