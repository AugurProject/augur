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
import { addedDaiEvent } from 'services/analytics/helpers';
import { updateAppStatus, WALLET_STATUS } from 'modules/app/actions/update-app-status';
import { createBigNumber } from 'utils/create-big-number';
import { WALLET_STATUS_VALUES, FIVE, ETHER } from 'modules/common/constants';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';


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
    const attoRep = String(amounts[0]);
    const dai = String(amounts[1]);
    const eth = amounts[2];
    const legacyAttoRep = String(amounts[3]);
    const legacyAttoRepNonSafe = String(amounts[4]);
    const rep = String(createBigNumber(attoRep).dividedBy(ETHER));
    const ethNonSafe = amounts[5];
    const daiNonSafe = String(amounts[6]);
    const repNonSafe = String(createBigNumber(String(amounts[7])).dividedBy(ETHER));
    const legacyRep = String(createBigNumber(String(legacyAttoRep)).dividedBy(ETHER));
    const legacyRepNonSafe = String(createBigNumber(String(legacyAttoRepNonSafe)).dividedBy(ETHER));

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
          signerBalances: {
            eth: ethNonSafe,
            dai: daiNonSafe,
            rep: repNonSafe,
            legacyRep: legacyRepNonSafe,
          }
        },
      })
    );
    return callback(null, { rep, dai, eth });
  });
}
