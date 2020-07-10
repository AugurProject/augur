import { getRepRate } from 'modules/contracts/actions/contractCalls';
import { formatDai } from 'utils/format-number';
import { AppStatus } from 'modules/app/store/app-status';

export const getRepToDaiRate = async () => {
  const repToDaiRate = await getRepRate();
  if (repToDaiRate) {
    AppStatus.actions.setRepToDaiRate(formatDai(repToDaiRate));
  }
};
