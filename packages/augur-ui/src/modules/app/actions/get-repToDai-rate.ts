import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { getRepRate } from 'modules/contracts/actions/contractCalls';
import {
  updateAppStatus,
  REP_TO_DAI_RATE,
} from 'modules/app/actions/update-app-status';
import { formatDai } from 'utils/format-number';

export const getRepToDaiRate = (): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const repToDaiRate = await getRepRate();
  if (repToDaiRate) {
    dispatch(updateAppStatus(REP_TO_DAI_RATE, formatDai(repToDaiRate)));
  }
};
