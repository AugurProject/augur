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
import { createBigNumber } from 'utils/create-big-number';
import { WALLET_STATUS_VALUES, TWO } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export const updateAssets = (
  callback: NodeStyleCallback,
): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  const { address, meta } = loginAccount;
  const nonSafeWallet = await meta.signer.getAddress();

  updateBalances(
    address,
    nonSafeWallet,
    dispatch,
    (err, balances) => {
      const { walletStatus } = AppStatus.get();
      // TODO: set min amount of DAI, for testing need a real values
      if (createBigNumber(balances.dai).gt(TWO) && (walletStatus !== WALLET_STATUS_VALUES.CREATED)) {
        AppStatus.actions.setWalletStatus(WALLET_STATUS_VALUES.FUNDED_NEED_CREATE);
      }
      if (callback) callback(balances);
    });
};

function updateBalances(
  address: string,
  nonSafeWallet: string,
  dispatch: ThunkDispatch<void, any, Action>,
  callback: NodeStyleCallback
) {
  const { universe: { id: universe }} = AppStatus.get();
  Promise.all([
    getRepBalance(universe, address),
    getDaiBalance(address),
    getEthBalance(address),
    getLegacyRepBalance(address),
    getLegacyRepBalance(nonSafeWallet),
    getEthBalance(nonSafeWallet),
  ]).then(amounts => {
    const attoRep = amounts[0].toString();
    const dai = amounts[1];
    const eth = amounts[2];
    const legacyAttoRep = amounts[3].toString();
    const legacyAttoRepNonSafe = amounts[4].toString();
    const rep = formatAttoRep(attoRep, { decimalsRounded: 14 }).roundedValue?.toNumber();
    const ethNonSafe = amounts[5];
    const legacyRep = formatAttoRep(legacyAttoRep).value;
    const legacyRepNonSafe = formatAttoRep(legacyAttoRepNonSafe).value;
    dispatch(addedDaiEvent(dai));
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
          ethNonSafe,
        },
      })
    );
    return callback(null, { rep, dai, eth });
  });
}
