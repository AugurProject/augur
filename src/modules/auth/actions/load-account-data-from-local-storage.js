import { updateFavorites } from '../../../modules/markets/actions/update-favorites';
import updateUserLoginMessageVersionRead from '../../../modules/login-message/actions/update-user-login-message-version-read';
import { updateScalarMarketShareDenomination } from '../../../modules/market/actions/update-scalar-market-share-denomination';
import { updateReports } from '../../../modules/reports/actions/update-reports';

export const loadAccountDataFromLocalStorage = () => (dispatch, getState) => {
  const { loginAccount } = getState();
  if (loginAccount && loginAccount.address) {
    const address = loginAccount.address;
    const localStorageRef = typeof window !== 'undefined' && window.localStorage;
    if (localStorageRef && localStorageRef.getItem && address) {
      const storedAccountData = JSON.parse(localStorageRef.getItem(address));
      if (storedAccountData) {
        if (storedAccountData.favorites) {
          dispatch(updateFavorites(storedAccountData.favorites));
        }
        if (storedAccountData.scalarMarketsShareDenomination) {
          Object.keys(storedAccountData.scalarMarketsShareDenomination).forEach((marketID) => {
            dispatch(updateScalarMarketShareDenomination(marketID, storedAccountData.scalarMarketsShareDenomination[marketID]));
          });
        }
        if (storedAccountData.reports && Object.keys(storedAccountData.reports).length) {
          dispatch(updateReports(storedAccountData.reports));
        }
        if (storedAccountData.loginMessageVersionRead && !isNaN(parseInt(storedAccountData.loginMessageVersionRead, 10))) {
          dispatch(updateUserLoginMessageVersionRead(parseInt(storedAccountData.loginMessageVersionRead, 10)));
        }
      }
    }
  }
};
