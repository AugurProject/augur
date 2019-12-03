import logError from 'utils/log-error';
import {
  convertV1ToV2Approve,
  convertV1ToV2,
  convertV1ToV2_estimate,
} from 'modules/contracts/actions/contractCalls';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { NodeStyleCallback } from 'modules/types';
import { V1_REP_MIGRATE_ESTIMATE } from 'modules/common/constants';

export default function(callback: NodeStyleCallback = logError) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    await convertV1ToV2Approve();
    await convertV1ToV2().catch((err: Error) => {
      console.log('error could not migrate v1 REP', err);
      logError(new Error('convertV1ToV2'));
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
