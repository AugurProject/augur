import { UPDATE_UNIVERSE } from "modules/universe/actions/update-universe";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { Universe, BaseAction } from "modules/types";

const DEFAULT_STATE: Universe = {};

export default function(
  universe: Universe = DEFAULT_STATE,
  { type, data }: BaseAction,
) {
  switch (type) {
    case UPDATE_UNIVERSE: {
      const { updatedUniverse } = data;
      return {
        ...universe,
        ...updatedUniverse,
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return universe;
  }
}
