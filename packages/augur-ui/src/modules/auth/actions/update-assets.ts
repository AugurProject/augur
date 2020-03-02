import { NodeStyleCallback } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import logError from 'utils/log-error';
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance,
  getLegacyRepBalance,
} from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { formatAttoRep } from 'utils/format-number';
import { addedDaiEvent } from 'services/analytics/helpers';

export const updateAssets = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe } = getState();
  const { address, meta } = loginAccount;
  const nonSafeWallet = meta.signer._address;

  return updateBalances(
    universe.id,
    address,
    nonSafeWallet,
    dispatch,
    callback
  );
};

function updateBalances(
  universe: string,
  address: string,
  nonSafeWallet: string,
  dispatch: ThunkDispatch<void, any, Action>,
  callback: NodeStyleCallback
) {
  Promise.all([
    getRepBalance(universe, address),
    getDaiBalance(address),
    getEthBalance(address),
    getLegacyRepBalance(address),
    getLegacyRepBalance(nonSafeWallet),
  ]).then(amounts => {
    const attoRep = amounts[0].toString();
    const legacyAttoRep = amounts[3].toString();
    const legacyAttoRepNonSafe = amounts[4].toString();
    const rep = formatAttoRep(attoRep).value;
    const legacyRep = formatAttoRep(legacyAttoRep).value;
    const legacyRepNonSafe = formatAttoRep(legacyAttoRepNonSafe).value;
    const dai = amounts[1];
    const eth = amounts[2];
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
        },
      })
    );
    return callback(null, { rep, dai, eth });
  });
}
