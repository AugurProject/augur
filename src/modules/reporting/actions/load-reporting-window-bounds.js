import { augur } from 'services/augurjs'

export const loadReportingWindowBounds = () => (dispatch, getState) => {
  const { universe } = getState()

  augur.api.Universe.getCurrentReportingWindow({ universe: universe.id }, (currReportingWindow) => {
    console.log('reakd -- ', currReportingWindow)
  })

  // TODO get startDate
  // TODO get endDate
  // TODO get stake (waiting on endpoint)
}

// > augur.api.Universe.getCurrentReportingWindow(console.log)
// null '0x54d134699764375417e4b5dda1e2ac62f62e9725'
// > augur.api.ReportingWindow.getStartTime({ tx: { to: "0x54d134699764375417e4b5dda1e2ac62f62e9725" } }, console.log)
// null '1508544000'
