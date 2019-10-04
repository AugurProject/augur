import logError from "utils/log-error";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider, Web3Provider } from "ethers/providers";
import { EnvObject, NodeStyleCallback } from "modules/types";
import { windowRef } from "utils/window-ref";
import getInjectedWeb3Accounts from "utils/get-injected-web3-accounts";

export const connect = async (env: EnvObject, callback: NodeStyleCallback = logError) => {
  const signer = undefined;
  const signerNetworkId = undefined;
  const account = undefined;
  await augurSdk.makeApi(new JsonRpcProvider(env["ethereum-node"].http), account, signer, env, signerNetworkId, false);
  callback(null);
};
