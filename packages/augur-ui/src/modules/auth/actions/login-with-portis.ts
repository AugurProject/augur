import { updateSdk } from "modules/auth/actions/update-sdk";
import { toChecksumAddress } from "ethereumjs-util";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { Web3Provider } from "ethers/providers";
import Portis, { INetwork } from "@portis/web3";
import Web3 from "web3";
import { updateIsLoggedAndLoadAccountData } from "modules/auth/actions/update-is-logged-and-load-account-data";
import { ACCOUNT_TYPES } from "modules/common/constants";
import { augurSdk } from "services/augursdk";
import { AppState } from "store";

// TODO find home for all wallet API keys
const PORTIS_API_KEY = "b67817cf-8dd0-4116-a0cf-657820ddc019";

const getPortisNetwork = (networkId): false | string | INetwork  => {
  const myPrivateEthereumNode = {
    nodeUrl: "http://localhost:8545",
    chainId: "104",
  };
  if (networkId === "1") {
    return "mainnet";
  } else if (networkId === "42") {
    return "kovan";
  } else if (networkId === "104") {
    return myPrivateEthereumNode;
  } else {
    return false;
  }
};

export const loginWithPortis = (callback: NodeStyleCallback) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {

  const networkId = getState().connection.augurNodeNetworkId;
  const protisNetwork = getPortisNetwork(networkId);

  if (protisNetwork) {
    const portis = new Portis(PORTIS_API_KEY, protisNetwork);
    const web3 = new Web3(portis.provider);
    const provider = new Web3Provider(portis.provider);
    const isWeb3 = true;

    await web3.eth.getAccounts(async (error, accounts) => {
      if (error) {
        callback(error, null);
      } else {
        const account = accounts[0];

        const accountObject = {
          address: account,
          displayAddress: toChecksumAddress(account),
          meta: {
            address: account,
            signer: provider.getSigner(),
            accountType: "portis",
            isWeb3,
          },
        };

        await dispatch(updateSdk(accountObject, provider));

        dispatch(updateIsLoggedAndLoadAccountData(
          account,
          ACCOUNT_TYPES.UNLOCKED_ETHEREUM_NODE,
        ));

        callback(null, account);
      }
    });
  } else {
    callback("Network currently not supported with Portis", null);
  }
};
