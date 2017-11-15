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
