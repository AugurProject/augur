import logError from "utils/log-error";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider, Web3Provider } from "ethers/providers";
import { EnvObject, NodeStyleCallback } from "modules/types";
import { windowRef } from "utils/window-ref";
import getInjectedWeb3Accounts from "utils/get-injected-web3-accounts";

export const connect = async (env: EnvObject, callback: NodeStyleCallback = logError) => {
  const injectedAccount = await getInjectedWeb3Accounts();
  const loggedInAccount = windowRef.localStorage.getItem("loggedInAccount");

  // Use injected provider if returning User has a unlocked injected account that matches the current logged in account
  if (injectedAccount && (loggedInAccount === injectedAccount[0])) {
    const provider = new Web3Provider(windowRef.web3.currentProvider);
    const account = windowRef.web3.currentProvider.selectedAddress;

    await augurSdk.makeApi(provider, account, provider.getSigner(), env, true);
  } else {
    await augurSdk.makeApi(new JsonRpcProvider(env["ethereum-node"].http), undefined, undefined, env, false);
  }

  callback(null);
};
