import { Addresses } from "@augurproject/artifacts";
import { Augur } from "../Augur"
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { Markets } from "./api/Markets";
import { SubscriptionEventNames } from "../constants";
import { WebsocketConnector } from "../connector/ws-connector";

const settings = require("@augurproject/sdk/src/state/settings.json");

console.log("Starting web worker");

(async function() {
  try {
    const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
    const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
    const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[4], new WebsocketConnector("ws://localhost:9001"));
    await augur.connect();

    augur.on(SubscriptionEventNames.CompleteSetsPurchased, (data: any): void => {
      console.log(data);
      augur.off(SubscriptionEventNames.CompleteSetsPurchased);
    });

    setTimeout(async () => {
      console.log("getMarkets");
      const getMarkets = augur.bindTo(Markets.getMarkets);
      console.log(await getMarkets({
        universe: "0x02149d40d255fceac54a3ee3899807b0539bad60",
      }));
    }, 1000);
    console.log("Done");
  } catch (e) {
    console.log(e);
  }
})();
