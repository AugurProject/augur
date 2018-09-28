import { UPDATE_GAS_INFO } from "modules/app/actions/update-gas-info";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(gasInfo = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_GAS_INFO:
      return {
        ...gasInfo,
        ...data.gasInfo
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return gasInfo;
  }
}
