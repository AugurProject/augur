import { Action } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { getRepRate } from 'modules/contracts/actions/contractCalls';
import { formatDai } from 'utils/format-number';
import { AppStatusActions } from 'modules/app/store/app-status';

export const getRepToDaiRate = (): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const repToDaiRate = await getRepRate();
  if (repToDaiRate) {
    AppStatusActions.setRepToDaiRate(formatDai(repToDaiRate));
  }
};
