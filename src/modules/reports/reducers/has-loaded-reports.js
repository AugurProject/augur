import { UPDATE_HAS_LOADED_REPORTS } from 'modules/reports/actions/update-has-loaded-reports';

export default function (hasLoadedReports = false, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_REPORTS:
      return action.hasLoadedReports;
    default:
      return hasLoadedReports;
  }
}
