import {
  ACCOUNTS,
  deployContracts,
  ContractAPI,
} from "../../libs";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Markets } from "@augurproject/sdk/build/state/getter/Markets";
import { SubscriptionEventNames } from "@augurproject/sdk/build//constants";
import { WebWorkerConnector } from "@augurproject/sdk/build/connector/ww-connector";

jest.mock("websocket-as-promised", () => {
  return {
    __esModule: true,
    default: () => ({
      open: () => true,
      sendRequest: () => ({
        someValue: "data",
      }),
    }),
  };
});


let connector: WebWorkerConnector;
let provider: EthersProvider;

describe("ws-connector", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    connector = new WebWorkerConnector();

    const contractData = await deployContracts(ACCOUNTS, compilerOutput);
    provider = contractData.provider;
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it("should use sendMessage to send transaction", async () => {
    await connector.connect({ provider });
    const getMarkets = connector.bindTo(Markets.getMarkets);
    await getMarkets({
      universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA",
    });
  });
});
