import Augur from "@augurproject/augur.js";
import logError from "utils/log-error";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider, Web3Provider } from "ethers/providers";
import { LoginAccount, NodeStyleCallback, Connection, EnvObject } from "modules/types";
import { windowRef } from "utils/window-ref";

// Access a User’s MetaMask/Dapper Account
async function initInjectedWeb3() {
  if (typeof window.ethereum === "undefined") {
    // Handle case where user hasn't installed MetaMask/Dapper.
    return false;
  }
  try {
    // If a user is logged in to MetaMask/Dapper and has previously approved the dapp,
    // `ethereum.enable` will return the result of `eth_accounts`.
    const accounts = await window.ethereum.enable();
    return accounts;
  } catch (error) {
    // Handle error. If the user rejects the request for access, then
    // `ethereum.enable` will throw an error.
    return false;
  }
}

export const connect = async (env: EnvObject, loginAccount: LoginAccount, callback: NodeStyleCallback = logError) => {
  const connectOptions = {
    augurNode: env["augur-node"],
    ethereumNode: env["ethereum-node"],
    useWeb3Transport: env.useWeb3Transport,
  };

  let provider = new JsonRpcProvider(env["ethereum-node"].http);;
  let isWeb3 = false;
  let account = "";

  const bootstrap = async (provider, account, isWeb3) => {
    await augurSdk.makeApi(provider, account, provider.getSigner(), isWeb3);

    augur.connect(
      connectOptions,
      (err: any, connectionInfo: Connection) => {
        if (err) return callback(err);
        console.log("connected:", connectionInfo);
        callback(null, connectionInfo);
      },
    );
  };

  const injectedAccount = await initInjectedWeb3();
  const loggedInAccount = windowRef.localStorage.getItem("loggedInAccount");

  // Use injected provider if returning User has a unlocked injected account that matches the current logged in account
  if (injectedAccount && (loggedInAccount === injectedAccount[0])) {
    provider = new Web3Provider(windowRef.web3.currentProvider);
    account = windowRef.web3.currentProvider.selectedAddress,
    isWeb3 = true;
  }

  await bootstrap(provider, account, isWeb3);
};

export const augur = new Augur();
export const { constants } = augur;
