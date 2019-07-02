import { augur } from "services/augurjs";
import logError from "utils/log-error";
import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const getForkMigrationTotals = (
  universeId: string,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { marketsData, universe } = getState();

  // TODO: get forking market, in order to get forking totals
      // TODO: get totals during fork migration
      // comment out to keep as reference

};
