import {
  UPDATE_REPORTS,
  UPDATE_REPORT,
  MARKETS_REPORT
} from "modules/reports/actions/update-reports";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(reports = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_REPORTS: {
      const { reportsData } = data;
      const updatedReports = { ...reports };
      if (!data || !reportsData) return updatedReports;
      const universeIds = Object.keys(reportsData);
      const numUniverseIds = universeIds.length;
      for (let i = 0; i < numUniverseIds; ++i) {
        updatedReports[universeIds[i]] = {
          ...reports[universeIds[i]],
          ...reportsData[universeIds[i]]
        };
        updatedReports.markets = [];
      }
      return updatedReports;
    }
    case UPDATE_REPORT: {
      const { universeId, marketId, report } = data;
      const universeReports = reports[universeId] || {};
      return {
        ...reports,
        [universeId]: {
          ...universeReports,
          [marketId]: {
            ...(universeReports[marketId] || {
              marketId
            }),
            ...report
          }
        }
      };
    }
    case MARKETS_REPORT: {
      const { universeId, marketIds } = data;
      return {
        ...reports,
        markets: {
          [universeId]: marketIds
        }
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return reports;
  }
}
