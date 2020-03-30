import logError from 'utils/log-error';
import { AppState } from 'appStore';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const collectMarketCreatorFees = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  // TODO: get market creators fees, using crazy stubb here so we rem to fix this
  callback(null, '999999999999');
  /*
  .api.Market.marketCreatorFeesAttoCash(
    { tx: { to: marketId } },
    (err: any, creatorFees: any) => {
      if (err) return callback(err);
      // TODO: convert to display value
      callback(null, creatorFees);
    }
    );
    */
};
