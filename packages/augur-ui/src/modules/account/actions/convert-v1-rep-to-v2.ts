import { TXEventName } from '@augurproject/sdk-lite';
import {
  convertV1ToV2,
  convertV1ToV2_estimate,
  convertV1ToV2Approve,
} from 'modules/contracts/actions/contractCalls';
import { NodeStyleCallback } from 'modules/types';
import {
  V1_REP_MIGRATE_ESTIMATE,
  MIGRATE_FROM_LEG_REP_TOKEN,
} from 'modules/common/constants';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import logError from 'utils/log-error';

export const approveAndConvertV1ToV2 = async (
  useSigningWallet: boolean = false,
  callback: NodeStyleCallback = logError
) => {
  addUpdatePendingTransaction(MIGRATE_FROM_LEG_REP_TOKEN, TXEventName.Pending);
  await convertV1ToV2Approve(useSigningWallet).catch((err: Error) => {
    addUpdatePendingTransaction(
      MIGRATE_FROM_LEG_REP_TOKEN,
      TXEventName.Failure
    );
  });
  await convertV1ToV2(useSigningWallet).catch((err: Error) => {
    logError(new Error('convertV1ToV2'));
    addUpdatePendingTransaction(
      MIGRATE_FROM_LEG_REP_TOKEN,
      TXEventName.Failure
    );
  });
  updateAssets();
  callback(null);
};

export const convertV1ToV2Estimate = async (
  useSigningWallet: boolean = false
) => {
  try {
    return await convertV1ToV2_estimate(useSigningWallet);
  } catch (error) {
    console.error('error could estimate gas', error);
    return V1_REP_MIGRATE_ESTIMATE;
  }
};
