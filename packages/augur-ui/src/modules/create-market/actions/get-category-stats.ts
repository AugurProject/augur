import { AppState } from 'store';
import { ThunkAction } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { POPULAR_CATEGORIES } from 'modules/common/constants';

export const getCategoryStats = (
  universe: string,
  cb: Function = () => {}
): ThunkAction<void, AppState, void, any> => async (
  dispatch,
  getState
) => {
console.log('universe', universe);
  const augur = augurSdk.get();
  let categoryStats = await augur.getCategoryStats({categories: POPULAR_CATEGORIES, universe});
  cb(null, categoryStats);
};
