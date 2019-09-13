import { RESET_STATE } from 'modules/app/actions/reset-state';
import { ReportingList } from 'modules/types';
import { UPDATE_REPORTING_LIST } from 'modules/reporting/actions/update-reporting-list';

const DEFAULT_STATE: ReportingList = {};

export default function(
  reportingList: Partial<ReportingList> = DEFAULT_STATE,
  { type, data }
): ReportingList {
  switch (type) {
    case UPDATE_REPORTING_LIST: {
      const { reportingState, marketIds } = data;
      return {
        ...reportingList,
        [reportingState]: marketIds,
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return reportingList;
  }
}
