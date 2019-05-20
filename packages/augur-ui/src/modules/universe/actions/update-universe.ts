export const UPDATE_UNIVERSE = "UPDATE_UNIVERSE";

export const updateUniverse = (updatedUniverse: any) => ({
  type: UPDATE_UNIVERSE,
  data: { updatedUniverse }
});
