import { augurSdk } from 'services/augursdk';
import { keyMarketInfoCollectionByMarketId } from 'utils/convert-marketInfo-marketData';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from '../store/markets';

export const loadCreateMarketHistory = async () => {
  const {
    loginAccount: { address: creator },
    universe: { id: universe },
  } = AppStatus.get();
  if (!creator) return;
  const Augur = augurSdk.get();

  if (universe) {
    const marketList = await Augur.getMarkets({
      creator,
      universe,
    });
    const marketInfos = keyMarketInfoCollectionByMarketId(marketList.markets);
    Markets.actions.updateMarketsData(marketInfos);
  }
};
