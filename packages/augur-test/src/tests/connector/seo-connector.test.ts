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
let addresses: any;

describe("seo-connector", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    connector = new SEOConnector();

    const contractData = await deployContracts(ACCOUNTS, compilerOutput);
    provider = contractData.provider;
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it("Should route the message correctly and return a response", async (done) => {
    await connector.connect({ provider });

    connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
      const getMarkets = connector.bindTo(Markets.getMarkets);
      await getMarkets({
        universe: "0x02149d40d255fCeaC54A3ee3899807B0539bad60",
      });

      connector.off(SubscriptionEventNames.NewBlock);
      await connector.disconnect();
      done();
    });
  });
});
