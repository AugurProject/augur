import { NodeStyleCallback } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance,
  getLegacyRepBalance,
} from 'modules/contracts/actions/contractCalls';
import { AppState } from 'appStore';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { formatAttoRep } from 'utils/format-number';
import { addedDaiEvent } from 'services/analytics/helpers';
import { updateAppStatus, WALLET_STATUS } from 'modules/app/actions/update-app-status';
import { createBigNumber } from 'utils/create-big-number';
import { WALLET_STATUS_VALUES, FIVE } from 'modules/common/constants';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';
import { updateAuthStatus, SIGNER_HAS_DAI, VAULT_HAS_DAI } from 'modules/auth/actions/auth-status';


export const updateAssets = (
  callback?: NodeStyleCallback,
): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe, appStatus } = getState();
  const { address, meta } = loginAccount;
  const nonSafeWallet = await meta.signer?.getAddress();

  updateBalances(
    universe.id,
    address,
    nonSafeWallet,
    loginAccount.balances.signerBalances?.eth,
    dispatch,
    getState,
    (err, balances) => {
      let status = appStatus[WALLET_STATUS];
      if (createBigNumber(balances.dai).gt(FIVE) && (status !== WALLET_STATUS_VALUES.CREATED)) {
        dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.FUNDED_NEED_CREATE));
      }
      if (callback) callback(balances);
    });
};

function updateBalances(
  universe: string,
  address: string,
  nonSafeWallet: string,
  ethNonSafeBalance: string,
  dispatch: ThunkDispatch<void, any, Action>,
  getState:  () => AppState,
  callback: NodeStyleCallback,
) {
  Promise.all([
    getRepBalance(universe, address),
    getDaiBalance(address),
    getEthBalance(address),
    getLegacyRepBalance(address),
    getLegacyRepBalance(nonSafeWallet),
    getEthBalance(nonSafeWallet),
    getDaiBalance(nonSafeWallet),
    getRepBalance(universe, nonSafeWallet),
  ]).then(async (amounts) => {
    const attoRep = amounts[0].toString();
    const dai = amounts[1];
    const eth = amounts[2];
    const legacyAttoRep = amounts[3].toString();
    const legacyAttoRepNonSafe = amounts[4].toString();
    const rep = formatAttoRep(attoRep, { decimalsRounded: 14 }).roundedValue?.toNumber();
    const ethNonSafe = amounts[5];
    const daiNonSafe = amounts[6];
    const repNonSafe = formatAttoRep(amounts[7].toString()).value;
    const legacyRep = formatAttoRep(legacyAttoRep).value;
    const legacyRepNonSafe = formatAttoRep(legacyAttoRepNonSafe).value;

    const { loginAccount } = getState();
    const updatedDaiAmount = createBigNumber(dai);
    const currentDaiAmount = createBigNumber(await getDaiBalance(loginAccount.address));

    if (createBigNumber(daiNonSafe).gt(0)) {
      dispatch(updateAuthStatus(SIGNER_HAS_DAI, true));
    }

    if (updatedDaiAmount.gt(0) && currentDaiAmount.gt(0)) {
      dispatch(updateAuthStatus(VAULT_HAS_DAI, true));
    }

    dispatch(addedDaiEvent(dai));
    dispatch(addEthIncreaseAlert(dai, ethNonSafeBalance, ethNonSafe));
    dispatch(
      updateLoginAccount({
        balances: {
          attoRep,
          rep,
          dai,
          eth,
          legacyAttoRep,
          legacyRep,
          legacyRepNonSafe,
          signerBalances: {
            eth: ethNonSafe,
            dai: daiNonSafe,
            rep: repNonSafe,
          }
        },
      })
    );
    return callback(null, { rep, dai, eth });
  });
}
