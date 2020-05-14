import { MarketReportingState } from '@augurproject/sdk';
import {
  loadCurrentlyDisputingMarkets,
  loadOpenReportingMarkets,
  loadUpcomingDesignatedReportingMarkets,
  loadDesignatedReportingMarkets,
  loadNextWindowDisputingMarkets,
} from 'modules/markets/actions/load-markets';
import { Markets } from 'modules/markets/store/markets-hooks';

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

export const reloadReportingPage = (marketIds: string[]) => (dispatch, getState) => {
  if (!getState) return;
  const states = Object.keys(loadPerReportingState.reporting);
  states.map(reportingState => {
    if (!Markets.get().reportingListState[reportingState]) return;
    const params = Markets.get().reportingListState[reportingState].params;
    dispatch(loadPerReportingState.reporting[reportingState](params));
  });
};

export const reloadDisputingPage = (marketIds: string[]) => (dispatch, getState) => {
  if (!getState) return;
  const states = Object.keys(loadPerReportingState.disputing);
  states.map(reportingState => {
    if (!Markets.get().reportingListState[reportingState]) return;
    const params = Markets.get().reportingListState[reportingState].params;
    dispatch(loadPerReportingState.disputing[reportingState](params));
  });
};
