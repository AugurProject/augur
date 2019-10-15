import { Universe, BaseAction } from 'modules/types';

export const UPDATE_UNIVERSE = 'UPDATE_UNIVERSE';

export const updateUniverse = (
  updatedUniverse: Partial<Universe>
): BaseAction => ({
  type: UPDATE_UNIVERSE,
  data: { updatedUniverse },
});
