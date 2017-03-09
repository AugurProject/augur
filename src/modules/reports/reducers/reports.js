import { UPDATE_REPORTS, UPDATE_REPORT, CLEAR_REPORTS } from '../../reports/actions/update-reports';
import { CLEAR_OLD_REPORTS } from '../../reports/actions/clear-old-reports';

export default function (reports = {}, action) {
  switch (action.type) {
    case UPDATE_REPORTS: {
      let branchID;
      const updatedReports = Object.assign({}, reports);
      const branchIDs = Object.keys(action.reports);
      const numBranchIDs = branchIDs.length;
      for (let i = 0; i < numBranchIDs; ++i) {
        branchID = branchIDs[i];
        updatedReports[branchID] = Object.assign({}, reports[branchID], action.reports[branchID]);
      }
      return updatedReports;
    }
    case UPDATE_REPORT: {
      const branchReports = reports[action.branchID] || {};
      return {
        ...reports,
        [action.branchID]: {
          ...branchReports,
          [action.eventID]: {
            ...(branchReports[action.eventID] || { eventID: action.eventID }),
            ...action.report
          }
        }
      };
    }
    case CLEAR_OLD_REPORTS: {
      const branchReports = reports[action.branchID] || {};
      return {
        ...reports,
        [action.branchID]: Object.keys(branchReports).reduce((p, eventID) => {
          if (branchReports[eventID].period >= action.reportPeriod) {
            p[eventID] = branchReports[eventID];
          }
          return p;
        }, {})
      };
    }
    case CLEAR_REPORTS:
      return {};
    default:
      return reports;
  }
}
