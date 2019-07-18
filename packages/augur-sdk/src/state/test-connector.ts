// An example how to use Augur to retrieve data
//
//
import { Addresses } from "@augurproject/artifacts";
import { Augur } from "../Augur";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { JsonRpcProvider } from "ethers/providers";
import { MarketCreated, NewBlock } from "../events";
import { Markets } from "./getter/Markets";
import { SubscriptionEventName } from "../constants";
import { SEOConnector } from "../connector/seo-connector";
import { WebWorkerConnector } from "../connector/ww-connector";
import { DB } from "./db/DB";

const settings = require("@augurproject/sdk/src/state/settings.json");

console.log("Starting web worker");

(async function() {
  try {
    console.log("starting this thing");
    const connector = new WebWorkerConnector();
    const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 10, 0, 40);
    const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);
    const augur = await Augur.create(ethersProvider, contractDependencies, Addresses[4], connector);
    await augur.connect("");
    console.log("connected");

    // testing code
    const db: DB = (await (await (Augur.connector as WebWorkerConnector).api).db);
    // const allDocs = await db.syncableDatabases[db.getDatabaseName("TimestampSet")].db.allDocs({
    //   include_docs: true,
    // });
    // console.log("allDocs", allDocs);


    const selector = {
      selector: {
        universe: "0x8062dA104239cf70C76B77c61eA988bf6382736a",
        marketCreator: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb",
        $and: [
          { timestamp: { $lte: "0x5d759600" } },
          { timestamp: { $gte: "0x0" } },
        ],
      },
    };

    const marketsCreated = await db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.find(selector);

    // need a new selector on user syncable db TokensTransferred
    const numberOfTrades = await db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.find(selector);

    // ProfitLossChanged event
    // Sum of unique entries (defined by market + outcome) with non-zero netPosition
    const positions = await db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.find(selector);

    // DisputeCrowdsourcerRedeemed where the payoutNumerators match the MarketFinalized winningPayoutNumerators
    const successfulDisputes = await db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.find(selector);

    // MarketTransferred log to or from are self
    const marketsTraded = await db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.find(selector);

    // DisputeCrowdsourcerRedeemed and InitialReporterRedeemed
    const redeemedPositions = await db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.find(selector);

    console.log("marketsCreated", marketsCreated);
    console.log("numberOfTrades", numberOfTrades);
    console.log("positions", positions);
    console.log("successfulDisputes", successfulDisputes);
    console.log("marketsTraded", marketsTraded);
    console.log("redeemedPositions", redeemedPositions);

    // console.log("querying", db.getDatabaseName("MarketCreated"));
    // db.syncableDatabases[db.getDatabaseName("MarketCreated")].db.query((doc, emit) => {
    //   emit((doc as any).universe, 1);
    // }, {
    //     include_docs: true,
    //     key: "0x8062dA104239cf70C76B77c61eA988bf6382736a",
    //   })
    //   .then((result) => {
    //     console.log("RESULT", result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // console.log("done querying");

    // connector.on(
    //   SubscriptionEventName.MarketCreated,
    //   (...args: MarketCreated[]): void => {
    //     console.log(args);
    //     augur.off(SubscriptionEventName.CompleteSetsPurchased);
    //   });

    // connector.on(
    //   SubscriptionEventName.NewBlock,
    //   (...args: NewBlock[]): void => {
    //     console.log(args);
    //   });

    // const markets = await augur.getMarkets({
    //   universe: "0x8062dA104239cf70C76B77c61eA988bf6382736a",
    // });
  } catch (e) {
    console.log(e);
  }
})();
