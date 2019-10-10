import { AppState } from 'store';
import { ThunkAction } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { POPULAR_CATEGORIES } from 'modules/common/constants';

export const getCategoryStats = (
  cb: Function = () => {}
): ThunkAction<void, AppState, void, any> => async (
  dispatch,
  getState
) => {
  const augur = augurSdk.get();
  const { universe } = getState();
  const categoryStats = await augur.getCategoryStats({categories: POPULAR_CATEGORIES, universe: universe.id});
  cb(null, categoryStats);
};
