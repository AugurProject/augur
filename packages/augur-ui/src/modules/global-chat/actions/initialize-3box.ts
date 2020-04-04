import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../appStore';

export const INITIALIZE_3BOX = 'INITIALIZE_3BOX';

export interface Initialize3boxAction {
  type: string;
  data: object;
}

export const initialize3boxAction = (address, box, profile): Initialize3boxAction => ({
  type: INITIALIZE_3BOX,
  data: {
    address,
    box,
    profile,
  },
});

export const initialize3box = (
  address,
  box,
  profile,
): ThunkAction<void, AppState, void, Initialize3boxAction> => dispatch => {
  dispatch(initialize3boxAction(address, box, profile));
};
