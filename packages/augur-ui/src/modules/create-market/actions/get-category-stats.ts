import { augurSdk } from 'services/augursdk';
import { POPULAR_CATEGORIES } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export const getCategoryStats = async () => {
  const augur = augurSdk.get();
  const { universe, isConnected } = AppStatus.get();

  if (!(universe?.id)) return;
  if (!isConnected) return;

  const categoryStats = await augur.getCategoryStats({
    categories: POPULAR_CATEGORIES,
    universe: universe.id,
  });
  AppStatus.actions.setCategoryStats(categoryStats);
};
