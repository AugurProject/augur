import { UPDATE_UNIVERSE } from "modules/universe/actions/update-universe";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(universe = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_UNIVERSE: {
      const { updatedUniverse } = data;
      return {
        ...universe,
        ...updatedUniverse
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return universe;
  }
}
