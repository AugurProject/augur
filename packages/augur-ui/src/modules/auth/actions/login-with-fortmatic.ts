import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Web3Provider } from 'ethers/providers';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import { ACCOUNT_TYPES, FORTMATIC_API_KEY, FORTMATIC_API_TEST_KEY, NETWORK_IDS } from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { windowRef } from 'utils/window-ref';

const getFormaticNetwork = (networkId: string): false | string   => {
  if (networkId === NETWORK_IDS.Mainnet) {
    return 'mainnet';
  } else if (networkId === NETWORK_IDS.Kovan) {
    return 'kovan';
  } else {
    return false;
  }
};

export const loginWithFortmatic = () => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {

  const networkId: string = getNetworkId();
  const supportedNetworks = getFormaticNetwork(networkId);

  if (supportedNetworks) {
    try {
      const fm = new Fortmatic(networkId === NETWORK_IDS.Mainnet ? FORTMATIC_API_KEY : FORTMATIC_API_TEST_KEY, supportedNetworks);
      const web3 = new Web3(fm.getProvider());
      const provider = new Web3Provider(fm.getProvider());

      windowRef.fm = fm;

      const accounts = await web3.currentProvider.enable();
      const account = accounts[0];
      const accountObject = {
        address: account,
        mixedCaseAddress: toChecksumAddress(account),
        meta: {
          address: account,
          signer: provider.getSigner(),
          openWallet: () => fm.user.settings(),
          accountType: ACCOUNT_TYPES.FORTMATIC,
          email: null,
          profileImage: null,
          isWeb3: true,
        },
      };

      await dispatch(updateSdk(accountObject, undefined));
    }
    catch (error) {
      throw error;
    }
  } else {
    throw Error(`Network ${networkId} not supported.`)
  }
};
