import { extractIPFSUrl, IPFSHashVersion, SDKConfiguration, isDevNetworkId, mergeConfig } from '@augurproject/utils';
import { augurSdk } from "services/augursdk";
import { augurSdkLite } from "services/augursdklite";
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import logError from 'utils/log-error';
import { toChecksumAddress } from 'ethereumjs-util';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
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
  MODAL_NETWORK_MISMATCH,
  NETWORK_NAMES,
  SIGNIN_SIGN_WALLET,
  MODAL_REPORTING_ONLY,
  DISCLAIMER_SEEN,
  MODAL_NETWORK_DISCONNECTED
} from 'modules/common/constants';
import { listenForStartUpEvents } from 'modules/events/actions/listen-to-updates';
import { windowRef } from 'utils/window-ref';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { getLoggedInUserFromLocalStorage } from 'services/storage/localStorage';
import { getFingerprint } from 'utils/get-fingerprint';
import { getNetwork } from 'utils/get-network-name';
import { isEmpty } from 'utils/is-empty';
import { isGoogleBot } from 'utils/is-google-bot';
import { isMobileSafari, isSafari } from 'utils/is-safari';
import { AppStatus } from 'modules/app/store/app-status';
import { showIndexedDbSize } from 'utils/show-indexed-db-size';
import { tryToPersistStorage } from 'utils/storage-manager';
import { createBigNumber } from 'utils/create-big-number';
import detectEthereumProvider from '@metamask/detect-provider'
import { isPrivateNetwork } from 'modules/app/actions/is-private-network.ts';
import { isFirefox } from 'utils/is-firefox';
import getValueFromlocalStorage from 'utils/get-local-storage-value';


const NETWORK_ID_POLL_INTERVAL_DURATION = 10000;

interface AugurEnv {
  AUGUR_ENV?: string;
  AUGUR_HOSTED?: boolean;
  AUTO_LOGIN?: boolean;
  REPORTING_ONLY?: boolean;
  CONFIGURATION?: SDKConfiguration;
  CURRENT_BRANCH?: string;
  CURRENT_COMMITHASH?: string;
  ENABLE_MAINNET?: boolean;
  ETHEREUM_NETWORK?: string;
  IPFS_STABLE_LOADER_HASH?: string;
};

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
const isCorrectNetwork = async (config) => {
  const { setModal } = AppStatus.actions;
  const chainId = await windowRef.ethereum.request({ method: 'eth_chainId' });
  const web3NetworkId = String(createBigNumber(chainId));
  const privateNetwork = isPrivateNetwork(config.networkId);
  const isMisMatched  = privateNetwork ?
    !(isPrivateNetwork(web3NetworkId) || web3NetworkId === 'NaN') : // MM can return NaN for local networks
    config.networkId !== web3NetworkId;

  if (isMisMatched) {
    setModal({
      type: MODAL_NETWORK_MISMATCH,
      expectedNetwork: NETWORK_NAMES[Number(config.networkId)],
    });
  }
  return !isMisMatched;
}

async function createDefaultProvider(config: SDKConfiguration, canUseWeb3) {
  if (config.networkId && isDevNetworkId(config.networkId)) {
    // In DEV, use local ethereum node
    return new JsonRpcProvider(config.ethereum.http);
  } else if ((windowRef.web3 || windowRef.ethereum) && canUseWeb3 && config.ui.primaryProvider === 'wallet') {
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
  const { setModal, closeModal } = AppStatus.actions;
  const { modal, loginAccount } = AppStatus.get();
  const windowApp = windowRef as WindowApp;

  const loggedInUser = getLoggedInUserFromLocalStorage();
  const loggedInAccount = loggedInUser?.address || null;
  const loggedInAccountType = loggedInUser?.type || null;

  switch(loggedInAccountType) {
    case null:
      break;
    // @ts-ignore
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

  // Use the default gateway if currently using one.
  const ipfsEndpoint = extractIPFSUrl(window.location.href);
  if(ipfsEndpoint.version !== IPFSHashVersion.Invalid) {
    config = mergeConfig(config, {
      warpSync: {
        ipfsEndpoint
      }
    });
  }

  // Disable mesh for googleBot
  if (isGoogleBot()) {
    // @ts-ignore
    config = mergeConfig(config, {
      zeroX: { mesh: { enabled: false } },
      warpSync: {
        createCheckpoints: false
      }
    })
  }

  if (isMobileSafari()) {
    // @ts-ignore
    config = mergeConfig(config, {
      warpSync: {
        autoReport: false,
        createCheckpoints: false,
      },
    })
  }

  let useWeb3 = false;
  const we3Provider = await detectEthereumProvider();
  if (we3Provider) {
    try {
      const correctNetwork = await isCorrectNetwork(config);
      if (!correctNetwork) {
        return callback(null);
      }
      useWeb3 = correctNetwork;
    } catch(e) {
      console.error('Error with web3 provider, moving on');
    }
  }

  // Force jsonrpc for every user agent but Safari and FF.
  if (!isSafari() && !isMobileSafari() && !isFirefox()) {
    config.ui = {
      liteProvider: 'jsonrpc',
      ...(config.ui ? config.ui : {})
    };
  }

  // Optimize for the case where we can just use a JSON endpoint.
  // If things aren't configured for that we'll create the default
  // provider which may be slow.
  let provider = config.ui?.liteProvider === "jsonrpc" ?
    new JsonRpcProvider(config.ethereum.http) :
    await createDefaultProvider(config, useWeb3);

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
    provider = await createDefaultProvider(config, false);
  }

    let Augur = null;
    try {
      Augur = await augurSdk.makeClient(provider, config);
    } catch (e) {
      console.error(e);
      return callback(`SDK could not be created, see console for more information`, { config });
    }

  if (process.env.REPORTING_ONLY && !getValueFromlocalStorage(DISCLAIMER_SEEN)) {
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

    // If the network disconnected modal is being shown, but we are now
    // connected -- hide it.
    if (modal?.type === MODAL_NETWORK_DISCONNECTED) {
      closeModal();
    }

  if (isInitialConnection) {
    loadAccountIfStored();
    pollForNetwork();
  }

  // wire up start up events for sdk
  listenForStartUpEvents(Augur);

  try {
    await augurSdk.connect();
  } catch(e) {
    console.error(e);
    return callback(`Fatal Error while starting augur: `, e);
  }

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
    config.ui.fallbackProvider = 'jsonrpc';
    config.ui.primaryProvider = 'jsonrpc';
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

