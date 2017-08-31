import { UPDATE_REPORT_COMMIT_LOCK } from 'modules/reports/actions/commit-report'

export default function (reportCommitLock = {}, action) {
  switch (action.type) {
    case UPDATE_REPORT_COMMIT_LOCK:
      return {
        ...reportCommitLock,
        [action.eventID]: action.isLocked
      }
    default:
      return reportCommitLock
  }
}
