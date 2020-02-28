import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';

export const wrapLogHandler = (logHandler: Function) => (
  log: any
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log) {
    const universeId: string = getState().universe.id;
    const isInCurrentUniverse = true;
    // TODO: need to filter based on current selected universe
    if (isInCurrentUniverse) return dispatch(logHandler(log));
  }
};
