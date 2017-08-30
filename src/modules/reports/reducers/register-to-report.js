import { REGISTER_TO_REPORT } from 'modules/reports/actions/register-to-report'

export default function (registeredToReport = {}, action) {
  switch (action.type) {
    case REGISTER_TO_REPORT:
      return {
        ...registeredToReport,
        [action.reportingWindow]: true
      }
    default:
      return registeredToReport
  }
}
