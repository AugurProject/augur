export const RESET_STATE = 'RESET_STATE';
export const SWITCH_UNIVERSE = 'SWITCH_UNIVERSE';

export interface SwitchUniverseAction {
  type: typeof SWITCH_UNIVERSE;
  data: null;
}

export interface ResetStateAction {
  type: typeof RESET_STATE;
  data: null;
}

export const resetState = (): ResetStateAction => ({
  type: RESET_STATE,
  data: null,
});

export const switchUniverseState = (): SwitchUniverseAction => ({
  type: SWITCH_UNIVERSE,
  data: null,
});

