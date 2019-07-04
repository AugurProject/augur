import { defaultLogHandler } from 'modules/events/actions/default-log-handler';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';

export const wrapLogHandler = (logHandler: any = defaultLogHandler) => (
  log: any
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log) {
    // console.info(`${new Date().toISOString()} LOG ${log.removed ? 'REMOVED' : 'ADDED'} ${log.eventName} ${JSON.stringify(log)}`)
    const universeId: string = getState().universe.id;
    const isInCurrentUniverse = true;
    // TODO: process universe when Events have universe propety, for now assume all events are good
    // const isInCurrentUniverse = Object.values(log).find(
    //   value => universeId === value
    // );
    if (Array.isArray(log) && isInCurrentUniverse) {
      log.forEach(log => {
        return dispatch(logHandler(log));
      });
    }
    // TODO: will need to filter out some redundent events like token transfers in some instances
    if (isInCurrentUniverse) return dispatch(logHandler(log));
  }
};
