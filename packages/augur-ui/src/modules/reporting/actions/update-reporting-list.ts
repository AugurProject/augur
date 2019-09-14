export const UPDATE_REPORTING_LIST = 'UPDATE_REPORTING_LIST';

export function updateReportingList(
  reportingState: string,
  marketIds: string[]
) {
  return {
    type: UPDATE_REPORTING_LIST,
    data: { marketIds, reportingState },
  };
}
