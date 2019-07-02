import logError from "utils/log-error";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider, Web3Provider } from "ethers/providers";
import { NodeStyleCallback, Connection, EnvObject } from "modules/types";
import { windowRef } from "utils/window-ref";
import getInjectedWeb3Accounts from "utils/get-injected-web3-accounts";

export const connect = async (env: EnvObject, callback: NodeStyleCallback = logError) => {

  let provider = new JsonRpcProvider(env["ethereum-node"].http);
  let isWeb3 = false;
  let account = "";

  const bootstrap = async (provider, account, isWeb3) => {
    await augurSdk.makeApi(provider, account, provider.getSigner(), isWeb3);
  };

  const injectedAccount = await getInjectedWeb3Accounts();
  const loggedInAccount = windowRef.localStorage.getItem("loggedInAccount");

  // Use injected provider if returning User has a unlocked injected account that matches the current logged in account
  if (injectedAccount && (loggedInAccount === injectedAccount[0])) {
    provider = new Web3Provider(windowRef.web3.currentProvider);
    account = windowRef.web3.currentProvider.selectedAddress,
    isWeb3 = true;
  }

  await bootstrap(provider, account, isWeb3);
};
