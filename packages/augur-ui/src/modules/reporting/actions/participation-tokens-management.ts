
import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import {
  buyParticipationTokens,
  buyParticipationTokensEstimateGas,
} from 'modules/contracts/actions/contractCalls';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { BUYPARTICIPATIONTOKENS } from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk-lite';
import { AppStatus } from 'modules/app/store/app-status';

export const purchaseParticipationTokens = async (
  amount: string,
  estimateGas = false,
  callback: NodeStyleCallback = logError
) => {
  const { universe: { id: universeId }} = AppStatus.get();
  if (!universeId) return callback('no universe provided');
  if (estimateGas) {
    const gas = await buyParticipationTokensEstimateGas(
      universeId,
      amount
    );
    return callback(null, gas);
  }
  buyParticipationTokens(universeId, amount).catch(() => {
    addUpdatePendingTransaction(BUYPARTICIPATIONTOKENS, TXEventName.Failure)
  });
  callback(null);
};
