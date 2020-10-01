import { TXEventName } from '@augurproject/sdk-lite';
import {
  MIGRATE_FROM_LEG_REP_TOKEN,
  APPROVE_FROM_LEG_REP_TOKEN,
  V1_REP_MIGRATE_ESTIMATE,
} from 'modules/common/constants';
import {
  convertV1ToV2,
  convertV1ToV2_estimate,
  convertV1ToV2Approve,
} from 'modules/contracts/actions/contractCalls';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { NodeStyleCallback } from 'modules/types';
import logError from 'utils/log-error';

export const approveRepV2 = async (callback: NodeStyleCallback = logError) => {
  addUpdatePendingTransaction(
    APPROVE_FROM_LEG_REP_TOKEN,
    TXEventName.Pending
  );

  await convertV1ToV2Approve().catch((err: Error) => {
    logError(new Error('convertV1ToV2'));
    addUpdatePendingTransaction(
      APPROVE_FROM_LEG_REP_TOKEN,
      TXEventName.Failure
    );
  });
  callback(null);
}

export const convertRepV2 = async (callback: NodeStyleCallback = logError) => {
  addUpdatePendingTransaction(
    MIGRATE_FROM_LEG_REP_TOKEN,
    TXEventName.Pending
  );

  await convertV1ToV2().catch((err: Error) => {
    logError(new Error('convertV1ToV2'));
    addUpdatePendingTransaction(
      MIGRATE_FROM_LEG_REP_TOKEN,
      TXEventName.Failure
    );
  });
  callback(null);
}

export const convertV1ToV2Estimate = async () => {
  try {
    return await convertV1ToV2_estimate();
  } catch (error) {
    console.error('error could estimate gas', error);
    return V1_REP_MIGRATE_ESTIMATE;
  }
};

