import { augur } from 'services/augurjs';
import logError from 'utils/log-error';
import { createBigNumber } from 'utils/create-big-number';
import { updateReportingWindowStats } from 'modules/reports/actions/update-reporting-window-stats';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';

export const loadReportingWindowBounds = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  // TODO: get dispute fee window values when middleware getter is ready
  dispatch(
    updateReportingWindowStats({
      startTime: "0",
      endTime: "0",
      stake: "0",
      participantContributions: "0",
      participationTokens: 0,
      feeWindowRepStaked: 0,
      feeWindowEthFees: 0,
      participantContributionsCrowdsourcer: 0,
      participantContributionsInitialReport: 0,
    })
  );
};

