import { updateLoginAccount } from 'modules/account/actions/login-account';
import logError from 'utils/log-error';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';

export const updateTopBarPL = (
  options: any = {},
  callback: NodeStyleCallback = logError
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);

  const Augur = augurSdk.get();
  // TODO: figure out issue with get profit and loss
  /*
  const data = await Augur.getProfitLoss({
    universe: universe.id,
    account: loginAccount.address,
    startTime: null,
    endTime: null,
    periodInterval: null,
  });

  updateLoginAccount({
    // @ts-ignore
    realizedPL: data[data.length - 1].realized,
    realizedPLPercent: data[data.length - 1].realizedPercent,
  });
  */
};
