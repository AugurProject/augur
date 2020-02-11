import { windowRef } from 'utils/window-ref';
import { LOGGED_IN_USER_LOCAL_STORAGE_KEY } from 'modules/common/constants';

interface LoggedInUserStorage {
  address: string | null;
  type: string | null;
}

export const getLoggedInUserFromLocalStorage = (): LoggedInUserStorage => {
  const loggedInUser = {
    address: null,
    type: null,
  };

  const loggedInUserFromStorage = windowRef.localStorage.getItem(
    LOGGED_IN_USER_LOCAL_STORAGE_KEY
  );

  if (loggedInUser) {
    try {
      loggedInUser.address = JSON.parse(loggedInUserFromStorage).address;
      loggedInUser.type = JSON.parse(loggedInUserFromStorage).accountType;
      return loggedInUser;
    } catch (error) {
      // swallow
      return loggedInUser;
    }
  }
  return loggedInUser;
};
