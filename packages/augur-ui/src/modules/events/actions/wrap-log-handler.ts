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
    const universeId: string = getState().universe.id;
    // console.log("event name", Array.isArray(log) ? log.length : log.eventName);
    const isInCurrentUniverse = true;
    // TODO: process universe when Events have universe propety, for now assume all events are good
    // const isInCurrentUniverse = Object.values(log).find(
    //   value => universeId === value
    // );
    if (Array.isArray(log) && isInCurrentUniverse) {
      log.forEach(log => {
        if (logHandler) dispatch(logHandler(log));
      });
    }
    // TODO: will need to filter out some redundent events like token transfers in some instances
    if (isInCurrentUniverse) return dispatch(logHandler(log));
  }
};
