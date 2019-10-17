import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Web3Provider } from 'ethers/providers';
import Portis, { INetwork } from '@portis/web3';
import Web3 from 'web3';
import {
  ACCOUNT_TYPES,
  PORTIS_API_KEY,
  NETWORK_IDS,
} from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { windowRef } from 'utils/window-ref';

const getPortisNetwork = (networkId): false | string | INetwork => {
  const myPrivateEthereumNode = {
    nodeUrl: 'http://localhost:8545',
    chainId: networkId,
  };
  if (networkId === NETWORK_IDS.Mainnet) {
    return 'mainnet';
  } else if (networkId === NETWORK_IDS.Kovan) {
    return 'kovan';
  } else {
    return myPrivateEthereumNode;
  }
};

export const loginWithPortis = (
  forceRegisterPage = false,
  showConnectingModal
) => async (dispatch: ThunkDispatch<void, any, Action>) => {
  const networkId = getNetworkId();
  const portisNetwork = getPortisNetwork(networkId);

  if (portisNetwork) {
    const portis = new Portis(PORTIS_API_KEY, portisNetwork, {
      scope: ['email'],
      registerPageByDefault: forceRegisterPage,
    });
    const web3 = new Web3(portis.provider);
    const provider = new Web3Provider(portis.provider);

    windowRef.portis = portis;

    const initPortis = async (portis, accounts, email = null) => {
      const account = accounts[0];

      showConnectingModal();

      const accountObject = {
        address: account,
        mixedCaseAddress: toChecksumAddress(account),
        meta: {
          address: account,
          email,
          profileImage: null,
          signer: provider.getSigner(),
          openWallet: () => portis.showPortis(),
          accountType: ACCOUNT_TYPES.PORTIS,
          isWeb3: true,
        },
      };

      dispatch(updateSdk(accountObject, undefined));
    };

    try {
      const accounts = await web3.eth.getAccounts();

      portis.onLogin(async (_, email) => {
        if (email) {
          await initPortis(portis, accounts, email);
        }
      });

      await initPortis(portis, accounts);
    } catch (error) {
      document.querySelector('.por_portis-container').remove();
      throw error;
    }
  } else {
    throw Error('Network currently not supported with Portis');
  }
};
