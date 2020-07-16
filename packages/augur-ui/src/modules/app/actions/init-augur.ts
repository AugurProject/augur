import type { SDKConfiguration } from '@augurproject/artifacts';
import { augurSdk } from "services/augursdk";
import { augurSdkLite } from "services/augursdklite";
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import logError from 'utils/log-error';
import { isDevNetworkId, mergeConfig } from '@augurproject/utils';
import { toChecksumAddress } from 'ethereumjs-util';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import {
  getWeb3Provider,
  loginWithInjectedWeb3,
} from 'modules/auth/actions/login-with-injected-web3';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import { logout } from 'modules/auth/actions/logout';
import {
  ACCOUNT_TYPES,
  MODAL_ERROR,
  MODAL_LOADING,
  MODAL_NETWORK_DISABLED,
  MODAL_NETWORK_DISCONNECTED,
  MODAL_NETWORK_MISMATCH,
  NETWORK_NAMES,
  SIGNIN_SIGN_WALLET,
  MODAL_REPORTING_ONLY,
  NETWORK_IDS,
} from 'modules/common/constants';
import { listenForStartUpEvents } from 'modules/events/actions/listen-to-updates';
import { windowRef } from 'utils/window-ref';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { getLoggedInUserFromLocalStorage } from 'services/storage/localStorage';
import { getFingerprint } from 'utils/get-fingerprint';
import { getNetwork } from 'utils/get-network-name';
import { isEmpty } from 'utils/is-empty';
import { isGoogleBot } from 'utils/is-google-bot';
import { isMobileSafari } from 'utils/is-safari';
import { AppStatus } from 'modules/app/store/app-status';
import { showIndexedDbSize } from 'utils/show-indexed-db-size';
import { tryToPersistStorage } from 'utils/storage-manager';
import { createBigNumber } from 'utils/create-big-number';
import detectEthereumProvider from '@metamask/detect-provider'


const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

async function loadAccountIfStored() {
  const loggedInUser = getLoggedInUserFromLocalStorage();
  const loggedInAccount = (loggedInUser && loggedInUser.address) || null;
  const loggedInAccountType = (loggedInUser && loggedInUser.type) || null;
  const { setModal, closeModal } = AppStatus.actions;
  const errorModal = () => {
    logout();
    setModal({
      type: MODAL_ERROR,
      error: 'Please try logging in with your wallet provider again.',
    });
  };
  try {
    if (loggedInAccount) {
      if (isGlobalWeb3() && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
        if (!windowRef.ethereum.selectedAddress) {
          // show metamask signer
          setModal({
            type: MODAL_LOADING,
            message: SIGNIN_SIGN_WALLET,
            showMetaMaskHelper: true,
            callback: () => closeModal(),
          });
        }
        await loginWithInjectedWeb3();
      }
      if (loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
        await loginWithFortmatic();
      }

      if (loggedInAccountType === ACCOUNT_TYPES.TORUS) {
        await loginWithTorus();
      }
    }
  } catch (error) {
    errorModal();
  }
}

const isNetworkMismatch = async config => {
  const provider = await detectEthereumProvider();
  if (!provider) return false;
  let chainId = windowRef.ethereum.chainId;
  if (!chainId) {
    await provider.enable();
    chainId = windowRef.ethereum.chainId;
  }

  const web3NetworkId = String(createBigNumber(chainId));
  return config.networkId !== web3NetworkId;
}

async function createDefaultProvider(config: SDKConfiguration) {
  if (config.networkId && isDevNetworkId(config.networkId)) {
    // In DEV, use local ethereum node
    return new JsonRpcProvider(config.ethereum.http);
  } else if (windowRef.web3) {
    // Use the provider on window if it exists, otherwise use torus provider
    return getWeb3Provider(windowRef);
  } else if (config.ui?.fallbackProvider === "jsonrpc" && config.ethereum.http) {
    return new JsonRpcProvider(config.ethereum.http);
  } else {
    // Use torus provider

    // Use import instead of import for wallet SDK packages
    // to conditionally load web3 into the DOM.
    //
    // Note: This also creates a split point in webpack
    const { default: Torus } = await import( /*webpackChunkName: 'torus'*/ '@toruslabs/torus-embed');
    const torus = new Torus({});

    const host = getNetwork(config.networkId);
    await torus.init({
      network: { host },
      showTorusButton: false,
    });

    // Tor.us cleanup
    const torusWidget = document.querySelector('#torusWidget');
    if (torusWidget) {
      torusWidget.remove();
    }
    return new Web3Provider(torus.provider);
  }
}

function pollForNetwork() {
  setInterval(() => {
    const { modal } = AppStatus.get();
    const { setModal, closeModal } = AppStatus.actions;
    if (!process.env.ENABLE_MAINNET) {
      const isMainnet = checkIfMainnet();
      if (isMainnet && isEmpty(modal)) {
        setModal({
          type: MODAL_NETWORK_DISABLED,
        });
      } else if (!isMainnet && modal.type === MODAL_NETWORK_DISABLED) {
        closeModal();
      }
    }
  }, NETWORK_ID_POLL_INTERVAL_DURATION);
}

export const connectAugur = async (
  config: SDKConfiguration,
  isInitialConnection = false,
  callback: NodeStyleCallback = logError
) => {
  const { loginAccount } = AppStatus.get();
  const windowApp = windowRef as WindowApp;

  const loggedInUser = getLoggedInUserFromLocalStorage();
  const loggedInAccount = loggedInUser?.address || null;
  const loggedInAccountType = loggedInUser?.type || null;

  switch(loggedInAccountType) {
    case null:
      break;
    case ACCOUNT_TYPES.WEB3WALLET:
      // If the account type is web3 we need a global web3 object
      if(!isGlobalWeb3()) break;
    default:
      const address = toChecksumAddress(loggedInAccount);
      const accountObject = {
        address,
        mixedCaseAddress: address,
        meta: {
          address,
          signer: null,
          email: null,
          profileImage: null,
          openWallet: null,
          accountType: loggedInAccountType,
          isWeb3: true,
          preloaded: true,
        },
      };
      AppStatus.actions.setRestoredAccount(true);
      AppStatus.actions.updateLoginAccount(accountObject);
      break;
    }

  // Disable mesh/gsn for googleBot
  if (isGoogleBot()) {
    config = mergeConfig(config, {
      zeroX: { mesh: { enabled: false } },
      gsn: { enabled: false },
      warpSync: {
        createCheckpoints: false
      }
    })
  }

  if ((windowRef.ethereum || windowRef.web3) && await isNetworkMismatch(config)) {
    if (callback) callback(null);
    return dispatch(
      updateModal({
        type: MODAL_NETWORK_MISMATCH,
        expectedNetwork: NETWORK_NAMES[Number(config.networkId)],
      })
    );
  }

  if (isMobileSafari()) {
    config = mergeConfig(config, {
      warpSync: {
        autoReport: false,
        createCheckpoints: false,
      },
    })
  }

  // Optimize for the case where we can just use a JSON endpoint.
  // If things aren't configured for that we'll create the default
  // provider which may be slow.
  let provider = config.ui?.liteProvider === "jsonrpc" ?
    new JsonRpcProvider(config.ethereum.http) :
    await createDefaultProvider(config);

  await augurSdkLite.makeLiteClient(
    provider,
    config.addresses,
    config.networkId
  );
  AppStatus.actions.setCanHotload(true); // Hotload now!
  // End init here for Googlebot
  // TODO: Market list do something with hotload
  if(isGoogleBot()) {
    callback(null);
    return;
  }

  // Since liteProvider and fallbackProvider can be the same
  // we can re-use it if we already have made the same one. If not
  // we need to make the default provider from the config.
  if (config.ui?.fallbackProvider !== config.ui?.liteProvider) {
    provider = await createDefaultProvider(config);
  }

    let Augur = null;
    try {
      Augur = await augurSdk.makeClient(provider, config);
    } catch (e) {
      console.error(e);
      return callback(`SDK could not be created, see console for more information`, { config });
    }


  if (config?.ui?.reportingOnly) {
    const { setModal } = AppStatus.actions;
    setModal({
      type: MODAL_REPORTING_ONLY
    });
  }

  let universeId = config.addresses?.Universe || Augur.contracts.universe.address;
  if (
    windowApp.localStorage &&
    windowApp.localStorage.getItem &&
    loginAccount.address
  ) {
    const loginAddress =
      (windowApp.localStorage.getItem &&
        windowApp.localStorage.getItem(loginAccount.address)) ||
      '';
    const storedUniverseId = JSON.parse(loginAddress).selectedUniverse[
      getNetworkId().toString()
    ];
    universeId = !storedUniverseId ? universeId : storedUniverseId;
  }
  AppStatus.actions.updateUniverse({ id: universeId });

  if (isInitialConnection) {
    loadAccountIfStored();
    pollForNetwork();
  }

  // wire up start up events for sdk
  listenForStartUpEvents(Augur);

  await augurSdk.connect();

  // IPFS pin the UI hash.
  augurSdk.client.pinHashByGatewayUrl(windowApp.location.href);
  callback(null);
};

interface initAugurParams {
  ethereumNodeHttp: string | null;
  ethereumNodeWs: string | null;
  sdkEndpoint: string | null;
}

export const initAugur = async (
  {
    ethereumNodeHttp,
    ethereumNodeWs /* unused */,
    sdkEndpoint,
  }: initAugurParams,
  callback: NodeStyleCallback = logError
) => {
  const config: SDKConfiguration = process.env.CONFIGURATION;

  if (ethereumNodeHttp) {
    config.ethereum.http = ethereumNodeHttp;
  }

  if (sdkEndpoint) {
    config.sdk.ws = sdkEndpoint;
  }
  // cache fingerprint
  getFingerprint();
  AppStatus.actions.setEnv(config);
  tryToPersistStorage();
  connectAugur(config, true, callback);

  windowRef.showIndexedDbSize = showIndexedDbSize;
};

