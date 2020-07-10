import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';

export const loadDisputeWindow = async () => {
  const { universe } = AppStatus.get();
  const Augur = augurSdk.get();
  const disputeWindow = await Augur.getDisputeWindow({
    augur: Augur.contracts.augur.address,
    universe: universe.id,
  });

  AppStatus.actions.updateUniverse({ disputeWindow });
};
