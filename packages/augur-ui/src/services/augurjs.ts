import Augur from "@augurproject/augur.js";
import logError from "utils/log-error";
import { augurSdk } from "services/augursdk";
import { JsonRpcProvider, Web3Provider } from "ethers/providers";
import { LoginAccount, NodeStyleCallback, WindowApp, Connection } from "modules/types";

export const connect = async (env: any, loginAccount: LoginAccount, callback: NodeStyleCallback = logError) => {
  const connectOptions = {
    augurNode: env["augur-node"],
    ethereumNode: env["ethereum-node"],
    useWeb3Transport: env.useWeb3Transport,
  };

  let provider;
  let isWeb3 = false;
  const win: WindowApp = window as WindowApp;
  if (win.web3 && win.web3.currentProvider) {
    provider = new Web3Provider(win.web3.currentProvider);
    isWeb3 = true;
  } else {
    provider = new JsonRpcProvider(env["ethereum-node"].http);
  }

  await augurSdk.makeApi(provider, loginAccount.address, provider.getSigner(), isWeb3);

  augur.connect(
    connectOptions,
    (err: any, connectionInfo: Connection) => {
      if (err) return callback(err);
      console.log("connected:", connectionInfo);
      callback(null, connectionInfo);
    },
  );
};

export const augur = new Augur();
export const { constants } = augur;
