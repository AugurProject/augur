import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../appStore';
import { AppStatus } from 'modules/app/store/app-status';


export const initialize3boxAction = (
  address,
  box,
  profile,
  openComments
) => {
  AppStatus.actions.setInitialized3Box({
    address,
    box,
    profile,
    openComments,
  });
}

export const initialize3box = (
  address,
  box,
  profile,
  openComments = false
) => {
  initialize3boxAction(address, box, profile, openComments);
};
