import logError from "utils/log-error";
import {
  getUniverseProperties,
  getForkingInfo
} from "modules/universe/actions/load-universe-info";

const GET_UNIVERSE_INFO_EVERY_X_BLOCKS = 100;
// Synchronize front-end universe state with blockchain universe state.
const syncUniverse = (blockNumber, callback = logError) => (
  dispatch,
  getState
) => {
  const { universe } = getState();
  if (!blockNumber || blockNumber % GET_UNIVERSE_INFO_EVERY_X_BLOCKS === 0) {
    dispatch(getUniverseProperties(universe));
    dispatch(getForkingInfo(universe));
  }
  callback(null);
};

export default syncUniverse;
