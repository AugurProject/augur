import { UPDATE_VERSIONS } from "modules/app/actions/update-versions";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Versions, BaseAction } from "modules/types";

const DEFAULT_STATE: Versions = {
  augurui: null,
  augurjs: null,
  augurNode: null,
};

export default function(
  versions: Versions = DEFAULT_STATE,
  { type, data }: BaseAction,
) {
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
