import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';

interface ProfitLoss {
  universe: string;
  startTime: number;
  endTime: number;
}

export const getProfitLoss = async ({
  universe,
  startTime,
  endTime,
}: ProfitLoss) => {
  const {
    loginAccount: { address: account },
  } = AppStatus.get();
  if (!account) return [];
  const Augur = augurSdk.get();
  return Augur.getProfitLoss({
    universe,
    account,
    endTime,
    startTime,
  });
};

export default getProfitLoss;
