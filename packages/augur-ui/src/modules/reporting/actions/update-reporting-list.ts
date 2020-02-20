import { LoadReportingMarketsOptions } from 'modules/types';
import { AppState } from 'appStore';
import { MarketReportingState } from '@augurproject/sdk';
import {
  loadCurrentlyDisputingMarkets,
  loadOpenReportingMarkets,
  loadUpcomingDesignatedReportingMarkets,
  loadDesignatedReportingMarkets,
  loadNextWindowDisputingMarkets,
} from 'modules/markets/actions/load-markets';

export const UPDATE_REPORTING_LIST = 'UPDATE_REPORTING_LIST';

export function updateReportingList(
  reportingState: string,
  marketIds: string[],
  params: Partial<LoadReportingMarketsOptions>,
  isLoading: boolean,
) {
  return {
    type: UPDATE_REPORTING_LIST,
    data: { params, marketIds, reportingState, isLoading },
  };
}

const loadPerReportingState = {
  disputing: {
    [MarketReportingState.AwaitingNextWindow]: loadNextWindowDisputingMarkets,
    [MarketReportingState.CrowdsourcingDispute]: loadCurrentlyDisputingMarkets,
  },
  reporting: {
    [MarketReportingState.OpenReporting]: loadOpenReportingMarkets,
    [MarketReportingState.PreReporting]: loadUpcomingDesignatedReportingMarkets,
    [MarketReportingState.DesignatedReporting]: loadDesignatedReportingMarkets,
  },
};

export const reloadReportingPage = () => (dispatch, getState) => {
  if (!getState) return;
  const states = Object.keys(loadPerReportingState.reporting);
  states.map(reportingState => {
    if (!getState().reportingListState[reportingState]) return;
    const params = getState().reportingListState[reportingState].params;
    dispatch(loadPerReportingState.reporting[reportingState](params));
  });
};

export const reloadDisputingPage = () => (dispatch, getState) => {
  if (!getState) return;
  const states = Object.keys(loadPerReportingState.disputing);
  states.map(reportingState => {
    if (!getState().reportingListState[reportingState]) return;
    const params = getState().reportingListState[reportingState].params;
    dispatch(loadPerReportingState.disputing[reportingState](params));
  });
};
