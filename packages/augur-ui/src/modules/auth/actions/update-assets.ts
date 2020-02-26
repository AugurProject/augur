import { NodeStyleCallback } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import logError from 'utils/log-error';
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

export const updateAssets = (
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
    dispatch,
    callback
  );
};

function updateBalances(
  universe: string,
  address: string,
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
    dispatch(addedDaiEvent(dai));
    dispatch(updateLoginAccount({ balances: { attoRep, rep, dai, eth, legacyAttoRep, legacyRep } }));
    return callback(null, { rep, dai, eth });
  });
}
