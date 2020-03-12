import logError from 'utils/log-error';
import {
  convertV1ToV2Approve,
  convertV1ToV2,
  convertV1ToV2_estimate,
} from 'modules/contracts/actions/contractCalls';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { NodeStyleCallback } from 'modules/types';
import { V1_REP_MIGRATE_ESTIMATE, MIGRATE_FROM_LEG_REP_TOKEN } from 'modules/common/constants';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { TXEventName } from '@augurproject/sdk';

export default function(callback: NodeStyleCallback = logError) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    dispatch(addUpdatePendingTransaction(MIGRATE_FROM_LEG_REP_TOKEN, TXEventName.Pending));
    await convertV1ToV2Approve().catch((err: Error) => {
      dispatch(addUpdatePendingTransaction(MIGRATE_FROM_LEG_REP_TOKEN, TXEventName.Failure));
    });
    await convertV1ToV2().catch((err: Error) => {
      logError(new Error('convertV1ToV2'));
      dispatch(addUpdatePendingTransaction(MIGRATE_FROM_LEG_REP_TOKEN, TXEventName.Failure));
    });
    callback(null);
  };
}

export const convertV1ToV2Estimate = async () => {
  try {
    return await convertV1ToV2_estimate();
  }
  catch(error) {
    console.error('error could estimate gas', error);
    return V1_REP_MIGRATE_ESTIMATE;
  };
}
