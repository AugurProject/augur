import { defaultLogHandler } from "modules/events/actions/default-log-handler";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const wrapLogHandler = (logHandler: Function = defaultLogHandler) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => (err: any, log: any) => {
  if (err) return console.error((log || {}).eventName, err, log);
  if (log) {
    // console.info(`${new Date().toISOString()} LOG ${log.removed ? 'REMOVED' : 'ADDED'} ${log.eventName} ${JSON.stringify(log)}`)
    const universeId: string = getState().universe.id;
    const isInCurrentUniverse = Object.values(log).find(
      value => universeId === value
    );
    if (Array.isArray(log)) {
      if (isInCurrentUniverse) dispatch(logHandler(log));
      log.forEach(log => {
        if (
          Object.values(log).find(value => universeId === value) ||
          (log.contractName === "Cash" && log.eventName === "Approval")
        )
          dispatch(logHandler(log));
      });
    } else {
      const isInCurrentUniverse = Object.values(log).find(
        value => universeId === value
      );
      if (
        isInCurrentUniverse ||
        (log.contractName === "Cash" && log.eventName === "Approval")
      )
        dispatch(logHandler(log));
    }
  }
};
