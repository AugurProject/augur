import { ACCOUNTS, deployContracts } from "../../libs";
import { Contracts } from "@augurproject/api/src/api/Contracts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { ethers } from "ethers";
import { ContractAddresses, Contracts as compilerOutput } from "@augurproject/artifacts";
import { createCannedMarketsAndOrders } from "../../flash/create-canned-markets-and-orders";
import { EthersProvider } from "@augurproject/ethersjs-provider";

let addresses: ContractAddresses;
let dependencies: ContractDependenciesEthers;
let contracts: Contracts<ethers.utils.BigNumber>;
let provider: EthersProvider;
beforeAll(async () => {
  const result = await deployContracts(ACCOUNTS, compilerOutput);
  addresses = result.addresses;
  dependencies = result.dependencies;
  provider = result.provider;
  contracts = new Contracts(addresses, dependencies);
}, 300 * 1000);

test("robert", async () => {
  await createCannedMarketsAndOrders(ACCOUNTS, provider, addresses);

  expect(1).toEqual(1);
}, 20 * 60 * 1000);
