import { RESET_STATE } from 'modules/app/actions/reset-state';
import { ReportingListState } from 'modules/types';
import { UPDATE_REPORTING_LIST } from 'modules/reporting/actions/update-reporting-list';

const DEFAULT_STATE: ReportingListState = {};

export default function(
  reportingList: Partial<ReportingListState> = DEFAULT_STATE,
  { type, data }
): ReportingListState {
  switch (type) {
    case UPDATE_REPORTING_LIST: {
      const { reportingState, marketIds, params, isLoading } = data;
      return {
        ...reportingList,
        [reportingState]: {
          marketIds,
          params,
          isLoading,
        }
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return reportingList;
  }
}
