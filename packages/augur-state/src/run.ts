import { Controller } from "./";
import { Augur } from "augur-api";
import { ethers } from "ethers";
import { EthersProvider } from "ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";

const TEST_RINKEBY_URL = "https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM";

export async function start() {
  const provider = new EthersProvider(TEST_RINKEBY_URL);
  const contractDependencies = new ContractDependenciesEthers(provider, provider.getSigner());
  const augur = await Augur.create<ethers.utils.BigNumber>(provider, contractDependencies);
  const controller = new Controller<ethers.utils.BigNumber>(augur);
  controller.run();
}

if (require.main === module) {
  start();
}
