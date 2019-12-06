import { updateSdk } from 'modules/auth/actions/update-sdk';
import { toChecksumAddress } from 'ethereumjs-util';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { PersonalSigningWeb3Provider } from 'utils/personal-signing-web3-provider';
import { INetwork } from '@portis/web3';
import Web3 from 'web3';
import {
  ACCOUNT_TYPES,
  PORTIS_API_KEY,
  NETWORK_IDS,
  MODA_WALLET_ERROR,
} from 'modules/common/constants';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { windowRef } from 'utils/window-ref';
import { updateModal } from 'modules/modal/actions/update-modal';

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

export const loginWithPortis = (forceRegisterPage = false) => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const networkId = getNetworkId();
  const portisNetwork = getPortisNetwork(networkId);

  if (portisNetwork) {
    try {
      // Only inject Portis if we are using Portis
      const Portis = require('@portis/web3');
      const portis = new Portis(PORTIS_API_KEY, portisNetwork, {
        scope: ['email'],
        registerPageByDefault: forceRegisterPage,
      });

      const web3 = new Web3(portis.provider);
      const provider = new PersonalSigningWeb3Provider(portis.provider);

      windowRef.portis = portis;

      const initPortis = (portis, account, email = null) => {
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

      portis.onLogin((account, email) => {
          initPortis(portis, account, email);
      });

      portis.onError(error => {
        document.querySelector('.por_portis-container').remove();
        dispatch(
          updateModal({
            type: MODA_WALLET_ERROR,
            error: error.toString(),
          })
        );
      });

      await web3.eth.getAccounts();
    } catch (error) {
      document.querySelector('.por_portis-container').remove();
      throw error;
    }
  } else {
    throw Error('Network currently not supported with Portis');
  }
};
