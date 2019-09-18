import { LoadReportingMarketsOptions } from 'modules/types';
import { AppState } from 'store';
import { MarketReportingState } from '@augurproject/sdk';
import {
  loadCurrentlyDisputingMarkets,
  loadOpenReportingMarkets,
  loadUpcomingDesignatedReportingMarkets,
  loadDesignatedReportingMarkets,
} from 'modules/markets/actions/load-markets';

export const UPDATE_REPORTING_LIST = 'UPDATE_REPORTING_LIST';

export function updateReportingList(
  reportingState: string,
  marketIds: string[],
  params: Partial<LoadReportingMarketsOptions>
) {
  return {
    type: UPDATE_REPORTING_LIST,
    data: { params, marketIds, reportingState },
  };
}

const loadPerReportingState = {
  [MarketReportingState.CrowdsourcingDispute]: loadCurrentlyDisputingMarkets,
  [MarketReportingState.OpenReporting]: loadOpenReportingMarkets,
  [MarketReportingState.PreReporting]: loadUpcomingDesignatedReportingMarkets,
  [MarketReportingState.DesignatedReporting]: loadDesignatedReportingMarkets,
};

export const reloadReportingPage = () => (dispatch, getState) => {
  if (!getState) return;
  Object.keys(getState().reportingListState).map(reportingState => {
    if (!getState().reportingListState[reportingState]) return;
    const params = getState().reportingListState[reportingState].params;
    dispatch(loadPerReportingState[reportingState](params));
  });
};
