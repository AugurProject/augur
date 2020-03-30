import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';

export const wrapLogHandler = (logHandler: Function) => (
  log: any
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log) {
    if (Array.isArray(log)) {
      console.log('events', log.map(l => l.name));
    } else {
      console.log('event', log.eventName);
    }
    const universeId: string = getState().universe.id;
    const isInCurrentUniverse = true;
    // TODO: need to filter based on current selected universe
    if (isInCurrentUniverse) return dispatch(logHandler(log));
  }
};
