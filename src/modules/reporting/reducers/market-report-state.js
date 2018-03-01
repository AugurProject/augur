import { RESET_STATE } from 'modules/app/actions/reset-state'
import { UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS } from 'src/modules/reporting/actions/update-upcoming-designated-reporting'
import { UPDATE_DESIGNATED_REPORTING_MARKETS } from 'src/modules/reporting/actions/update-designated-reporting'
import { UPDATE_OPEN_REPORTING_MARKETS } from 'src/modules/reporting/actions/update-open-reporting'

const DEFAULT_STATE = {
  designated: [],
  open: [],
  upcoming: [],
}

export default function (marketReportState = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_DESIGNATED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        designated: action.data,
      }

    case UPDATE_OPEN_REPORTING_MARKETS:
      return {
        ...marketReportState,
        open: action.data,
      }

    case UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        upcoming: action.data,
      }

    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return marketReportState
  }
}
