import { augur } from '../../../services/augurjs';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { loadBidsAsksHistory } from '../../../modules/bids-asks/actions/load-bids-asks-history';
import { loadCreateMarketHistory } from '../../../modules/create-market/actions/load-create-market-history';
import { loadFundingHistory, loadTransferHistory } from '../../../modules/account/actions/load-funding-history';
import { loadReportingHistory } from '../../../modules/my-reports/actions/load-reporting-history';
import { syncBranch } from '../../../modules/branch/actions/sync-branch';
import { loadEventsWithSubmittedReport } from '../../../modules/my-reports/actions/load-events-with-submitted-report';
import { updateReports, clearReports } from '../../../modules/reports/actions/update-reports';
import { updateLoginAccount } from '../../../modules/auth/actions/update-login-account';
import { updateAssets } from '../../../modules/auth/actions/update-assets';
import { updateFavorites } from '../../../modules/markets/actions/update-favorites';
import updateUserLoginMessageVersionRead from '../../../modules/login-message/actions/update-user-login-message-version-read';
import { updateScalarMarketShareDenomination } from '../../../modules/market/actions/update-scalar-market-share-denomination';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';

export const loadLoginAccountDependents = cb => (dispatch, getState) => {
  augur.getRegisterBlockNumber(getState().loginAccount.address, (err, blockNumber) => {
    if (!err && blockNumber) {
      dispatch(updateLoginAccount({ registerBlockNumber: blockNumber }));
    }
    dispatch(updateAssets(cb));
    dispatch(loadAccountTrades());
    dispatch(loadBidsAsksHistory());
    dispatch(loadFundingHistory());
    dispatch(loadTransferHistory());
    dispatch(loadCreateMarketHistory());

    // clear and load reports for any markets that have been loaded
    // (partly to handle signing out of one account and into another)
    dispatch(clearReports());
    dispatch(loadReportingHistory());
    dispatch(loadEventsWithSubmittedReport());
    dispatch(syncBranch());
  });
};

export const loadAccountDataFromLocalStorage = address => (dispatch) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address));
    if (storedAccountData) {
      if (storedAccountData.favorites) {
        dispatch(updateFavorites(storedAccountData.favorites));
      }
      if (storedAccountData.scalarMarketsShareDenomination) {
        Object.keys(storedAccountData.scalarMarketsShareDenomination).forEach((marketID) => {
          dispatch(updateScalarMarketShareDenomination(marketID, storedAccountData.scalarMarketsShareDenomination[marketID]));
        });
      }
      if (storedAccountData.reports && Object.keys(storedAccountData.reports).length) {
        dispatch(updateReports(storedAccountData.reports));
      }
      if (storedAccountData.loginMessageVersionRead && !isNaN(parseInt(storedAccountData.loginMessageVersionRead, 10))) {
        dispatch(updateUserLoginMessageVersionRead(parseInt(storedAccountData.loginMessageVersionRead, 10)));
      }
    }
  }
};

// Use unlockedAddress address (if actually unlocked)
export const useUnlockedAccount = unlockedAddress => dispatch => (
  augur.rpc.unlocked(unlockedAddress, (isUnlocked) => {
    if (!isUnlocked || isUnlocked.error) {
      return console.warn('account is locked:', unlockedAddress, isUnlocked);
    }
    augur.accounts.logout(); // clear the client-side account
    console.info('using unlocked account:', unlockedAddress);
    dispatch(loadFullAccountData({ address: unlockedAddress }));
  })
);

export const savePersistentAccountToLocalStorage = (account) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem) {
    const persistentAccount = { ...account };
    if (Buffer.isBuffer(persistentAccount.privateKey)) {
      persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
    }
    if (Buffer.isBuffer(persistentAccount.derivedKey)) {
      persistentAccount.derivedKey = persistentAccount.derivedKey.toString('hex');
    }
    localStorageRef.setItem('account', JSON.stringify(persistentAccount));
  }
};

// decide if we need to display the login message
export const displayLoginMessageOrMarkets = account => (dispatch, getState) => {
  const { links } = require('../../../selectors');
  if (links && links.marketsLink) {
    const { loginMessage } = getState();
    if (isUserLoggedIn(account) && !isCurrentLoginMessageRead(loginMessage)) {
      links.loginMessageLink.onClick();
    } else {
      links.marketsLink.onClick();
    }
  }
};

export const loadFullAccountData = (account, cb) => (dispatch) => {
  if (account && account.address) {
    dispatch(loadAccountDataFromLocalStorage(account.address));
    dispatch(loadLoginAccountDependents(cb));
  } else if (cb) {
    cb({ message: 'account address required' });
  }
};

// If there is an available logged-in/unlocked account, set as the user's sending address.
export const loadLoginAccount = autoLogin => (dispatch, getState) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;

  // 1. Client-side account
  const { account } = augur.accounts;
  if (account.address && account.privateKey) {
    console.log('using client-side account:', account.address);
    dispatch(loadFullAccountData(account));

  // 2. Persistent (localStorage) account
  } else if (localStorageRef && localStorageRef.getItem && localStorageRef.getItem('account')) {
    const persistentAccount = JSON.parse(localStorageRef.getItem('account'));
    const accountObject = augur.accounts.setAccountObject(persistentAccount);
    dispatch(loadFullAccountData(accountObject));

  // 3. If autoLogin=true, use an unlocked local Ethereum node (if present)
  } else if (autoLogin) {
    dispatch(useUnlockedAccount(augur.from));
  }
};
