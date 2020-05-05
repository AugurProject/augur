import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../appStore';

export const INITIALIZE_3BOX = 'INITIALIZE_3BOX';

export interface Initialize3boxAction {
  type: string;
  data: object;
}

export const initialize3boxAction = (
  address,
  box,
  profile,
  openComments
): Initialize3boxAction =>
  openComments
    ? {
        type: INITIALIZE_3BOX,
        data: {
          address,
          box,
          profile,
          openComments,
        },
      }
    : {
        type: INITIALIZE_3BOX,
        data: {
          address,
          box,
          profile,
        },
      };

export const initialize3box = (
  address,
  box,
  profile,
  openComments = false
): ThunkAction<void, AppState, void, Initialize3boxAction> => dispatch => {
  dispatch(initialize3boxAction(address, box, profile, openComments));
};
