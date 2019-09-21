import logError from "utils/log-error";
import { sumAndformatGasCostToEther } from "utils/format-number";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import {
  CLAIM_STAKE_FEES,
  PENDING,
  SUCCESS,
  UNIVERSE_ID
} from "modules/common/constants";
import {
  addPendingData,
  removePendingData
} from "modules/pending-queue/actions/pending-queue-management";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { redeemUserStakes, redeemUserStakesEstimateGas } from "modules/contracts/actions/contractCalls";

export const CLAIM_FEES_GAS_COST = 3000000;
export const CLAIM_WINDOW_GAS_COST = 210000;
export const CROWDSOURCER_BATCH_SIZE = 4;
export const DISPUTE_WINDOW_BATCH_SIZE = 10;

export function redeemStake(
  options: any,
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { universe } = getState();
    const universeId = universe.id || UNIVERSE_ID;
    const gasPrice = getGasPrice(getState());

    const {
      reportingParticipants,
      disputeWindows,
      estimateGas
    } = options;

    batchContractIds(disputeWindows, reportingParticipants).map(batch =>
      runPayload(batch.disputeWindows, batch.reportingParticipants, callback, estimateGas)
    );
  };

  interface Batch {
    disputeWindows: string[],
    reportingParticipants: string[]
  }

  function batchContractIds(
    disputeWindows: string[],
    reportingParticipants: string[]
  ) {
    let batches: Batch[];
    const disputeWindowBatchSize = Math.ceil(
      disputeWindows.length / DISPUTE_WINDOW_BATCH_SIZE
    );
    const crowdsourcerBatchSize = Math.ceil(
      reportingParticipants.length / CROWDSOURCER_BATCH_SIZE
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
        reportingParticipants: []
      });
    }

    for (let i = 0; i < crowdsourcerBatchSize; i++) {
      batches.push({
        disputeWindows: [],
        reportingParticipants: reportingParticipants.slice(
          i * CROWDSOURCER_BATCH_SIZE,
          i * CROWDSOURCER_BATCH_SIZE + CROWDSOURCER_BATCH_SIZE
        )
      });
    }

    return batches;
  }

  async function runPayload(disputeWindows: string[], reportingParticipants: string[], callback: Function, estimateGas: boolean) {

    if(estimateGas) {
      const gas = await redeemUserStakesEstimateGas(reportingParticipants, disputeWindows);
      if (callback) callback(null, gas);
    }
    redeemUserStakes(reportingParticipants, disputeWindows);
  }
}
