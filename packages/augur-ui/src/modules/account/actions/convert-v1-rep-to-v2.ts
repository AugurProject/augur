import logError from 'utils/log-error';
import {
  convertV1ToV2Approve,
  convertV1ToV2,
} from 'modules/contracts/actions/contractCalls';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { NodeStyleCallback } from 'modules/types';

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
