import { augur } from "services/augurjs";
import { updateUniverse } from "modules/universe/actions/update-universe";
import logError from "utils/log-error";

export const updatePlatformTimeframeData = (
  options: any = {},
  callback: any = logError
) => (dispatch: Function, getState: Function) => {
  const { universe } = getState();
  if (universe.id == null) return callback(null);

  augur.augurNode.submitRequest(
    "getPlatformActivityStats",
    {
      universe: universe.id,
      startTime: options.startTime || null,
      endTime: null
    },
    (err, result) => {
      if (err) return callback(err);

      dispatch(
        updateUniverse({
          result
        })
      );
    }
  );
};
