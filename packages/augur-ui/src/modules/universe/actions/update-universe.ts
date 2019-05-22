import { Universe, BaseAction } from "src/modules/types";

export const UPDATE_UNIVERSE = "UPDATE_UNIVERSE";

export const updateUniverse = (updatedUniverse: Universe): BaseAction => ({
  type: UPDATE_UNIVERSE,
  data: { updatedUniverse },
});
