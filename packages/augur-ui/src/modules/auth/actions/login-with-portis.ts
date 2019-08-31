import { updateSdk } from "modules/auth/actions/update-sdk";
import { toChecksumAddress } from "ethereumjs-util";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { Web3Provider } from "ethers/providers";
import Portis, { INetwork } from "@portis/web3";
import Web3 from "web3";
import { ACCOUNT_TYPES, PORTIS_API_KEY } from "modules/common/constants";
import { getNetworkId } from "modules/contracts/actions/contractCalls";

const getPortisNetwork = (networkId): false | string | INetwork  => {
  const myPrivateEthereumNode = {
    nodeUrl: "http://localhost:8545",
    chainId: networkId,
  };
  if (networkId === "1") {
    return "mainnet";
  } else if (networkId === "42") {
    return "kovan";
  } else {
    return myPrivateEthereumNode;
  }};

export const loginWithPortis = (callback: NodeStyleCallback) => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {

  const networkId = getNetworkId();
  const protisNetwork = getPortisNetwork(networkId);

  if (protisNetwork) {
    const portis = new Portis(PORTIS_API_KEY, protisNetwork);
    const web3 = new Web3(portis.provider);
    const provider = new Web3Provider(portis.provider);
    const isWeb3 = true;

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const accountObject = {
        address: account,
        mixedCaseAddress: toChecksumAddress(account),
        meta: {
          address: account,
          signer: provider.getSigner(),
          accountType: ACCOUNT_TYPES.PORTIS,
          isWeb3,
        },
      };

      dispatch(updateSdk(accountObject, undefined));
      callback(null, account);

    }
    catch (error) {
      callback(error, null);
    }
  } else {
    callback("Network currently not supported with Portis", null);
  }
};
