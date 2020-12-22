import { MarketReportingState } from '@augurproject/sdk-lite';
import {
  loadCurrentlyDisputingMarkets,
  loadDesignatedReportingMarkets,
  loadNextWindowDisputingMarkets,
  loadOpenReportingMarkets,
  loadUpcomingDesignatedReportingMarkets,
} from 'modules/markets/actions/load-markets';
import { Markets } from 'modules/markets/store/markets';
import { LoadReportingMarketsOptions } from 'modules/types';

export const UPDATE_REPORTING_LIST = 'UPDATE_REPORTING_LIST';

export function updateReportingList(
  reportingState: string,
  marketIds: string[],
  params: Partial<LoadReportingMarketsOptions>,
  isLoading: boolean
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

export const reloadReportingPage = (marketIds: string[]) => {
  const states = Object.keys(loadPerReportingState.reporting);
  states.map(reportingState => {
    if (!Markets.get().reportingListState[reportingState]) return;
    const params = Markets.get().reportingListState[reportingState].params;
    loadPerReportingState.reporting[reportingState](params);
  });
};

export const reloadDisputingPage = (marketIds: string[]) => {
  const states = Object.keys(loadPerReportingState.disputing);
  states.map(reportingState => {
    if (!Markets.get().reportingListState[reportingState]) return;
    const params = Markets.get().reportingListState[reportingState].params;
    loadPerReportingState.disputing[reportingState](params);
  });
};
