import { Controller } from "./Controller";
import { Augur } from 'augur-api';
import { ethers } from 'ethers';
import { EthersProvider } from 'ethers-provider';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';

const TEST_RINKEBY_URL = "https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM";
const TEST_ACCOUNT = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";

export async function start() {
  const provider = new EthersProvider(TEST_RINKEBY_URL);
  const contractDependencies = new ContractDependenciesEthers(provider, undefined, TEST_ACCOUNT);
  const augur = await Augur.create(provider, contractDependencies);
  const controller = new Controller<ethers.utils.BigNumber>(augur);
  controller.run();
}

if (require.main === module) {
  start();
}
