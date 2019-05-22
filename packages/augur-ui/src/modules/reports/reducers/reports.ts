import {
  MARKETS_REPORT
} from "modules/reports/actions/update-reports";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction } from "modules/types";
import { UserReports } from "modules/types";

const DEFAULT_STATE: UserReports = {};

export default function(reports: UserReports = DEFAULT_STATE, { type, data }: BaseAction) {
  switch (type) {
    case MARKETS_REPORT: {
      const { universeId, marketIds } = data;
      return {
        ...reports,
        markets: {
          [universeId]: marketIds,
        },
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return reports;
  }
}
