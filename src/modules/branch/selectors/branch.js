import { createSelector } from 'reselect';
import { selectBranchState } from 'src/select-state';

export const selectBranchReportPeriod = createSelector(
  selectBranchState,
  branch => branch.reportPeriod
);
