import { BigNumber } from 'utils/wrapped-big-number'
import selectMyReports from 'modules/my-reports/selectors/my-reports'
import { ZERO } from 'modules/trade/constants/numbers'

export default function () {
  const reports = selectMyReports()

  const numReports = reports.length
  const netRep = reports.reduce((prevNet, report) => (
    report.repEarned && report.repEarned.value ?
      prevNet.plus(new BigNumber(report.repEarned.value, 10)) :
      prevNet
  ), ZERO).toNumber()

  return {
    numReports,
    netRep,
  }
}
