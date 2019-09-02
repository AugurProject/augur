import { updateSdk } from "modules/auth/actions/update-sdk";
import { toChecksumAddress } from "ethereumjs-util";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { Web3Provider } from "ethers/providers";
import Fortmatic from 'fortmatic';
import Web3 from "web3";
import { ACCOUNT_TYPES, FORTMATIC_API_KEY, FORTMATIC_API_TEST_KEY } from "modules/common/constants";
import { getNetworkId } from "modules/contracts/actions/contractCalls";

const getFormaticNetwork = (networkId: string): false | string   => {
  if (networkId === "1") {
    return "mainnet";
  } else if (networkId === "4") {
    return "ropsten";
  } else if (networkId === "4") {
    return "rinkeby";
  } else if (networkId === "42") {
    return "kovan";
  } else if (networkId === "104") {
    // TODO: Formatic currently doesn't support local nodes
    // TODO: Update this when they do
    return false;
  } else {
    return false;
  }
};

export const loginWithFortmatic = (callback: NodeStyleCallback) => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {

  const networkId: string = getNetworkId();
  const supportedNetwork: string | false = getFormaticNetwork(networkId);

  if (supportedNetwork) {
    try {
      const fm = new Fortmatic(networkId === "1" ? FORTMATIC_API_KEY : FORTMATIC_API_TEST_KEY, supportedNetwork);
      const web3 = new Web3(fm.getProvider());
      const provider = new Web3Provider(fm.getProvider());
      const isWeb3 = true;

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const accountObject = {
        address: account,
        mixedCaseAddress: toChecksumAddress(account),
        meta: {
          address: account,
          signer: provider.getSigner(),
          accountType: ACCOUNT_TYPES.FORTMATIC,
          isWeb3: true,
        },
      };

      await dispatch(updateSdk(accountObject, undefined));

      callback(null, account);
    }
    catch (error) {
      callback(error, null);
    }
  } else {
    callback(`Network ${networkId} not supported.`, null);
  }
};
