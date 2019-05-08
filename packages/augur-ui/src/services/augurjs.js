import Augur from "@augurproject/augur.js";
import logError from "utils/log-error";
import { api } from "services/augurapi";
import { JsonRpcProvider, Web3Provider } from "ethers/providers";

export const connect = async (env, callback = logError) => {
  const connectOptions = {
    augurNode: env["augur-node"],
    ethereumNode: env["ethereum-node"],
    useWeb3Transport: env.useWeb3Transport
  };
  if (env.debug) augur.rpc.setDebugOptions(env.debug);


  let provider;
  if(window.web3 && window.web3.currentProvider) {
    provider = new Web3Provider(window.web3.currentProvider)
  } else {
    provider = new JsonRpcProvider(env["ethereum-node"].http);
  }

  await api.makeApi(provider);
  augur.connect(
    connectOptions,
    (err, connectionInfo) => {
      if (err) return callback(err);
      console.log("connected:", connectionInfo);
      callback(null, connectionInfo);
    }
  );
};

export const augur = new Augur();
export const { constants } = augur;
