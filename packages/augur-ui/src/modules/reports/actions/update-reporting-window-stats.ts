import { ReportingWindowStats, BaseAction } from "modules/types";

export const UPDATE_REPORTING_WINDOW_STATS = "UPDATE_REPORTING_WINDOW_STATS";

export function updateReportingWindowStats(
  windowStats: ReportingWindowStats,
): BaseAction {
  return {
    type: UPDATE_REPORTING_WINDOW_STATS,
    data: { windowStats },
  };
}
