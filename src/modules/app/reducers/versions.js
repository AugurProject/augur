import { UPDATE_VERSIONS } from "modules/app/actions/update-versions";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {
  augurui: null,
  augurjs: null,
  augurNode: null
};

export default function(versions = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_VERSIONS: {
      return data;
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return versions;
  }
}
