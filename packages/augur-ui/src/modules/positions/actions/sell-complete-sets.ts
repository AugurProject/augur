import { createBigNumber } from 'utils/create-big-number';
import logError from 'utils/log-error';
import {
  updateTransactionStatus,
  clearTransactionStatus,
} from 'modules/transactions/actions/update-transactions-status';
import { AWAITING_SIGNATURE, PENDING } from 'modules/common/constants';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export function sellCompleteSets(
  marketId: string,
  numCompleteSets: any,
  callback: NodeStyleCallback = logError
) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { loginAccount, marketInfos } = getState();
    if (!loginAccount.address) return callback(null);
    // TODO: dealing with complete sets isn't needed anymore this can be removed
    /*
    const { numTicks, maxPrice, minPrice } = marketInfos[marketId];
    const numCompleteSetsOnChain = utils.convertDisplayAmountToOnChainAmount(
      createBigNumber(numCompleteSets.fullPrecision),
      createBigNumber(maxPrice).minus(minPrice),
      numTicks,
    );
    const pendingHash = `pending-${marketId}-${numCompleteSets.fullPrecision}`;
    const sellCompleteSetsParams = {
      tx: {},
      meta: loginAccount.meta,
      _market: marketId,
      _amount: numCompleteSetsOnChain,
      onSent: (res) => {
        dispatch(updateTransactionStatus(pendingHash, res.hash, PENDING));
        callback(null, res);
      },
      onSuccess: (res) => {
        dispatch(clearTransactionStatus(pendingHash));
        callback(null, res);
      },
      onFailed: (err) => {
        dispatch(clearTransactionStatus(pendingHash));
        callback(err);
      },
    };
    dispatch(updateTransactionStatus(pendingHash, null, AWAITING_SIGNATURE));

  };
  */
  };
}
