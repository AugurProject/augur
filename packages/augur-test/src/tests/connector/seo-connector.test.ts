import {
  ACCOUNTS,
  deployContracts,
  ContractAPI,
} from "../../libs";
import { BigNumber } from "bignumber.js";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Markets } from "@augurproject/sdk/build/state/getter/Markets";
import { SEOConnector } from "@augurproject/sdk/build/connector/seo-connector";
import { SubscriptionEventNames } from "@augurproject/sdk/build//constants";

let connector: SEOConnector;
let provider: EthersProvider;
let john: ContractAPI;
let addresses: any;

beforeAll(async () => {
  connector = new SEOConnector();

  const contractData = await deployContracts(ACCOUNTS, compilerOutput);
  provider = contractData.provider;
  addresses = contractData.addresses;

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  await john.approveCentralAuthority();
}, 120000);

test("Should route the message correctly and return a response", async (done) => {
  const market1 = await john.createReasonableYesNoMarket(john.augur.contracts.universe);
  await john.placeBasicYesNoTrade(0, market1, 1, new BigNumber(1), new BigNumber(0.4), new BigNumber(0));

  await connector.connect({ provider, augur: john.augur });

  connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
    const getMarkets = connector.bindTo(Markets.getMarkets);
    await getMarkets({
      universe: john.augur.contracts.universe.address,
    });

    connector.off(SubscriptionEventNames.NewBlock);
    await connector.disconnect();
    done();
  });
}, 15000);
