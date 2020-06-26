import type { SDKConfiguration } from '@augurproject/artifacts';
import { isDevNetworkId, mergeConfig } from "@augurproject/utils";
import { augurSdk } from "services/augursdk";
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import isGlobalWeb3 from 'modules/auth/helpers/is-global-web3';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import logError from 'utils/log-error';
import { JsonRpcProvider, Web3Provider } from 'ethers/providers';
import { isEmpty } from 'utils/is-empty';
import {
  MODAL_NETWORK_DISCONNECTED,
  MODAL_NETWORK_DISABLED,
  ACCOUNT_TYPES,
  MODAL_LOADING,
  MODAL_ERROR,
  SIGNIN_SIGN_WALLET,
  MODAL_NETWORK_MISMATCH,
  NETWORK_NAMES,
} from 'modules/common/constants';
import { windowRef } from 'utils/window-ref';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { listenForStartUpEvents } from 'modules/events/actions/listen-to-updates';
import { loginWithInjectedWeb3, getWeb3Provider } from 'modules/auth/actions/login-with-injected-web3';
import { loginWithFortmatic } from 'modules/auth/actions/login-with-fortmatic';
import { loginWithTorus } from 'modules/auth/actions/login-with-torus';
import { toChecksumAddress } from 'ethereumjs-util';
import { logout } from 'modules/auth/actions/logout';
import { getLoggedInUserFromLocalStorage } from 'services/storage/localStorage';
import { getFingerprint } from 'utils/get-fingerprint';
import { tryToPersistStorage } from 'utils/storage-manager';
import { getNetwork } from 'utils/get-network-name';
import { showIndexedDbSize } from 'utils/show-indexed-db-size';
import { isGoogleBot } from 'utils/is-google-bot';
import { isMobileSafari } from 'utils/is-safari';
import { AppStatus } from 'modules/app/store/app-status';

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
  const { modal, loginAccount } = AppStatus.get();
  const windowApp = windowRef as WindowApp;
  const loggedInUser = getLoggedInUserFromLocalStorage();
  const loggedInAccount = loggedInUser?.address || null;
  const loggedInAccountType = loggedInUser?.type || null;

  // Preload Account
  const preloadAccount = (accountType) => {
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
        accountType,
        isWeb3: true,
        preloaded: true,
      },
    };
    AppStatus.actions.setRestoredAccount(true);
    AppStatus.actions.updateLoginAccount(accountObject);
  };

  if (isGlobalWeb3() && loggedInAccountType === ACCOUNT_TYPES.WEB3WALLET) {
    preloadAccount(ACCOUNT_TYPES.WEB3WALLET);
  }

  if (loggedInAccountType === ACCOUNT_TYPES.FORTMATIC) {
    preloadAccount(ACCOUNT_TYPES.FORTMATIC);
  }

  if (loggedInAccountType === ACCOUNT_TYPES.TORUS) {
    preloadAccount(ACCOUNT_TYPES.TORUS);
  }

  let provider = null;
  const networkId = config.networkId;

  if (networkId && !isDevNetworkId(networkId)) {
    // Unless DEV, use the provider on window if it exists, otherwise use torus provider
    if (windowRef.web3) {
      // Use window provider
      provider = getWeb3Provider(windowRef);
    } else {
      // Use torus provider

      // Use import instead of import for wallet SDK packages
      // to conditionally load web3 into the DOM.
      //
      // Note: This also creates a split point in webpack
      const { default: Torus } = await import(
        /* webpackChunkName: "torus" */ '@toruslabs/torus-embed'
      );
      const torus = new Torus({});

      const host = getNetwork(networkId);
      await torus.init({
        network: { host },
        showTorusButton: false,
      });

      // Tor.us cleanup
      const torusWidget = document.querySelector('#torusWidget');
      if (torusWidget) {
        torusWidget.remove();
      }
      provider = new Web3Provider(torus.provider);
    }
  } else {
    // In DEV, use local ethereum node
    provider = new JsonRpcProvider(config.ethereum.http);
  }

  // Disable mesh/gsn for googleBot
  if (isGoogleBot()) {
    config = mergeConfig(config, {
      zeroX: { mesh: { enabled: false } },
      gsn: { enabled: false },
      useWarpSync: false,
    })
  }

  if (isMobileSafari()) {
    config = mergeConfig(config, {
      warpSync: {
        autoReport: false,
        enabled: false,
      },
    })
  }

  let Augur = null;
  try {
    Augur = await augurSdk.makeClient(provider, config);
  } catch (e) {
    console.error(e);
    if (provider._network && config.networkId !== provider._network.chainId) {
      const { setModal } = AppStatus.actions;
      return setModal({
        type: MODAL_NETWORK_MISMATCH,
        expectedNetwork: NETWORK_NAMES[Number(config.networkId)],
      });
    } else {
      return callback('SDK could not be created', { config });
    }
    provider = new Web3Provider(torus.provider);
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
    AppStatus.actions.closeModal();
  }

  // wire up start up events for sdk
  listenForStartUpEvents(Augur);
  AppStatus.actions.setCanHotload(true);

  await augurSdk.connect();

  callback(null);
};

interface initAugurParams {
  ethereumNodeHttp: string | null;
  ethereumNodeWs: string | null;
  sdkEndpoint: string | null;
  useWeb3Transport: boolean;
}

export const initAugur = async (
  {
    ethereumNodeHttp,
    ethereumNodeWs /* unused */,
    sdkEndpoint,
    useWeb3Transport,
  }: initAugurParams,
  callback: NodeStyleCallback = logError
) => {
  const config: SDKConfiguration = process.env.CONFIGURATION;

  config.ethereum.useWeb3Transport = useWeb3Transport;

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

