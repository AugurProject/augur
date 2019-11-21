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
import { track, ADDED_DAI } from 'services/analytics/helpers';
import { createBigNumber } from 'utils/create-big-number';

export const updateAssets = (
  possibleDaiIncrease = false,
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe } = getState();
  const { address } = loginAccount;
  return updateBalances(
    universe.id,
    address,
    possibleDaiIncrease,
    loginAccount.balances.dai,
    dispatch,
    callback
  );
};

function updateBalances(
  universe: string,
  address: string,
  possibleDaiIncrease: boolean,
  previousDaiBalance: Number,
  dispatch: ThunkDispatch<void, any, Action>,
  callback: NodeStyleCallback
) {
  Promise.all([
    getRepBalance(universe, address),
    getDaiBalance(address),
    getEthBalance(address),
    getLegacyRepBalance(address),
  ]).then(amounts => {
    const attoRep = amounts[0].toString();
    const legacyAttoRep = amounts[3].toString();
    const rep = formatAttoRep(attoRep).value;
    const legacyRep = formatAttoRep(legacyAttoRep).value;
    const dai = amounts[1];
    const eth = amounts[2];
    if (
      possibleDaiIncrease &&
      createBigNumber(dai).gt(createBigNumber(previousDaiBalance))
    ) {
      track(ADDED_DAI, {});
    }
    dispatch(updateLoginAccount({ balances: { attoRep, rep, dai, eth, legacyAttoRep, legacyRep } }));
    return callback(null, { rep, dai, eth });
  });
}
