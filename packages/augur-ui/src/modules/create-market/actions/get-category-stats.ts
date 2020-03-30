import { AppState } from 'appStore';
import { ThunkAction } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { POPULAR_CATEGORIES } from 'modules/common/constants';
import { updateCategoryStats } from 'modules/app/actions/update-stats';

export const getCategoryStats = (): ThunkAction<void, AppState, void, any> => async (
  dispatch,
  getState
) => {
  const augur = augurSdk.get();
  const { universe, connection } = getState();

  if (!(universe && universe.id)) return;
  if (!connection.isConnected) return;

  const categoryStats = await augur.getCategoryStats({
    categories: POPULAR_CATEGORIES,
    universe: universe.id,
  });
  dispatch(updateCategoryStats(categoryStats));
};
