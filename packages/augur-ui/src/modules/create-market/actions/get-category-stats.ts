import { AppState } from 'appStore';
import { ThunkAction } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import { POPULAR_CATEGORIES } from 'modules/common/constants';
import { AppStatusState, AppStatusActions } from 'modules/app/store/app-status';

export const getCategoryStats = (): ThunkAction<void, AppState, void, any> => async (
  dispatch,
  getState
) => {
  const augur = augurSdk.get();
  const { universe } = getState();

  if (!(universe && universe.id)) return;
  if (!AppStatusState.get().isConnected) return;

  const categoryStats = await augur.getCategoryStats({
    categories: POPULAR_CATEGORIES,
    universe: universe.id,
  });
  AppStatusActions.actions.setCategoryStats(categoryStats);
};
