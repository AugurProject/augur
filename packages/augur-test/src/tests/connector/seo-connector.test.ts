import {
  ACCOUNTS,
  deployContracts,
  ContractAPI,
} from "../../libs";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Markets } from "@augurproject/sdk/build/state/getter/Markets";
import { SEOConnector } from "@augurproject/sdk/build/connector/seo-connector";
import { SubscriptionEventNames } from "@augurproject/sdk/build//constants";

let connector: SEOConnector;
let provider: EthersProvider;
let john: ContractAPI;
let addresses: any;

describe("seo-connector", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    connector = new SEOConnector();

    const contractData = await deployContracts(ACCOUNTS, compilerOutput);
    provider = contractData.provider;
    addresses = contractData.addresses;

    john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
    await john.approveCentralAuthority();
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it("Should route the message correctly and return a response", async (done) => {
    console.log(john.augur.contracts.universe);
    console.log(john.augur);

    await connector.connect({ provider });

    console.log(john.augur.contracts.universe);
    console.log(john.augur);

    connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
      const getMarkets = connector.bindTo(Markets.getMarkets);
      // await getMarkets({
      //   universe: john.augur.contracts.universe;
      // });

      connector.off(SubscriptionEventNames.NewBlock);
      await connector.disconnect();
      done();
    });
  });
});
