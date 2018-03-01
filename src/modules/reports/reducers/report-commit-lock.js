import { UPDATE_REPORT_COMMIT_LOCK } from 'modules/reports/actions/commit-report'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (reportCommitLock = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_REPORT_COMMIT_LOCK:
      return {
        ...reportCommitLock,
        [action.eventId]: action.isLocked,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return reportCommitLock
  }
}
