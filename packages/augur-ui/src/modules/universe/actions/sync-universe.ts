import logError from "utils/log-error";
import {
  getUniverseProperties,
  getForkingInfo,
} from "modules/universe/actions/load-universe-info";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "appStore";

const GET_UNIVERSE_INFO_EVERY_X_BLOCKS = 100;
// Synchronize front-end universe state with blockchain universe state.
const syncUniverse = (blockNumber: number, callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const { universe } = getState();
  if (!blockNumber || blockNumber % GET_UNIVERSE_INFO_EVERY_X_BLOCKS === 0) {
    dispatch(getUniverseProperties());
    dispatch(getForkingInfo(universe));
  }
  callback(null);
};

export default syncUniverse;
