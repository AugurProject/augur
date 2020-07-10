import { augurSdk } from 'services/augursdk';
import { getMaxMarketEndTime } from 'modules/contracts/actions/contractCalls';
import { AppStatus } from 'modules/app/store/app-status';

export const loadUniverseDetails = async (
  universe: string,
  account: string,
  callback?: Function
) => {
  const augur = augurSdk.get();
  const universeDetails = await augur.getUniverseChildren({
    universe,
    account,
  });
  const maxMarketEndTime = await getMaxMarketEndTime();
  AppStatus.actions.updateUniverse({ ...universeDetails, maxMarketEndTime });
  if (callback) callback();
};
