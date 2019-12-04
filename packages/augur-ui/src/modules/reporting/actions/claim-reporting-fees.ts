import logError from 'utils/log-error';
import { NodeStyleCallback, ClaimReportingOptions } from 'modules/types';
import {
  redeemUserStakes,
  redeemUserStakesEstimateGas,
  forkAndRedeem,
} from 'modules/contracts/actions/contractCalls';

export const CROWDSOURCER_BATCH_SIZE = 4;
export const CROWDSOURCER_DISAVOWED_BATCH_SIZE = 1;
export const DISPUTE_WINDOW_BATCH_SIZE = 10;

export function redeemStake(
  options: ClaimReportingOptions,
  callback: NodeStyleCallback = logError
) {
  const {
    reportingParticipants,
    disputeWindows,
    estimateGas,
    disavowed,
    isForkingMarket,
  } = options;

  batchContractIds(disputeWindows, reportingParticipants, disavowed, isForkingMarket).map(
    batch =>
      runPayload(
        batch.disputeWindows,
        batch.reportingParticipants,
        callback,
        estimateGas,
        isForkingMarket
      )
  );
}

export function redeemStakeBatches(options: ClaimReportingOptions) {
  const { reportingParticipants, disputeWindows, disavowed, isForkingMarket } = options;
  const batches = batchContractIds(
    disputeWindows,
    reportingParticipants,
    disavowed,
    isForkingMarket,
  );
  return batches.length;
}

interface Batch {
  disputeWindows: string[];
  reportingParticipants: string[];
}

function batchContractIds(
  disputeWindows: string[],
  reportingParticipants: string[],
  disavowed: boolean = false,
  isForkingMarket: boolean = false,
) {
  const batchSize = (disavowed || isForkingMarket)
    ? CROWDSOURCER_DISAVOWED_BATCH_SIZE
    : CROWDSOURCER_BATCH_SIZE;
  const batches = [] as Batch[];
  const disputeWindowBatchSize = Math.ceil(
    disputeWindows.length / DISPUTE_WINDOW_BATCH_SIZE
  );
  const crowdsourcerBatchSize = Math.ceil(
    reportingParticipants.length / batchSize
  );

  // max case, assuming DISPUTE_WINDOW_BATCH_SIZE number of fee windows and CROWDSOURCER_BATCH_SIZE number of crowdsourcers can run in one tx.
  if (disputeWindowBatchSize < 2 && crowdsourcerBatchSize < 2)
    return [{ disputeWindows, reportingParticipants }];

  // dispute windows
  for (let i = 0; i < disputeWindowBatchSize; i++) {
    batches.push({
      disputeWindows: disputeWindows.slice(
        i * DISPUTE_WINDOW_BATCH_SIZE,
        i * DISPUTE_WINDOW_BATCH_SIZE + DISPUTE_WINDOW_BATCH_SIZE
      ),
      reportingParticipants: [],
    });
  }

  for (let i = 0; i < crowdsourcerBatchSize; i++) {
    batches.push({
      disputeWindows: [],
      reportingParticipants: reportingParticipants.slice(
        i * batchSize,
        i * batchSize + batchSize
      ),
    });
  }

  return batches;
}

async function runPayload(
  disputeWindows: string[],
  reportingParticipants: string[],
  callback: Function,
  estimateGas: boolean,
  isForkingMarket: boolean
) {
  if (estimateGas) {
    const gas = await redeemUserStakesEstimateGas(
      reportingParticipants,
      disputeWindows
    );
    if (callback) callback(null, gas);
  }
  isForkingMarket
    ? forkAndRedeem(reportingParticipants[0]) // should be batches of one
    : redeemUserStakes(reportingParticipants, disputeWindows);
}
